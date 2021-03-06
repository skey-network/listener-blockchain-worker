import * as Crypto from '@waves/ts-lib-crypto'
import { SubscribeEvent } from '../proto/waves/events/grpc/SubscribeEvent'
import GrpcUtils from './grpc_utils'
import { TransactionResponse } from '../proto/waves/node/grpc/TransactionResponse'
import InvokeParser from './invoke_parser'
import BCFunc from '../blockchain/bcfunc'
import { SpanWrapper, Tracing } from '../tracing'
import ActionParams from '../action_params'
import { ProducerPushFnType } from '../redis/producer'
import Uniqueness from '../uniqueness/uniqueness'

const PROTO_PATH = 'src/waves/'

type GrpcWatcherOptions = {
  /** mode */
  mode: 'grpc-sub' | 'grpc-polling'
  /** watched dapp */
  dApp: string
  /** definitions of functions to be watched with args positions */
  functionDefs: BCFunc[]
  /** Invokers to be ignored */
  silent?: string[]

  /** Autogenerated from dapp addr */
  dAppB58?: Uint8Array
  /** Autogenerated from dapp addr */
  pkHash?: Buffer
  /** Autogenerated - function names from functionDefs */
  functions?: string[]
  addrs: {
    grpc: string
    grpc_events: string
  }
}

class GrpcWatcher {
  options: GrpcWatcherOptions
  iotFunc: ProducerPushFnType
  fallback: () => void
  grpcUtils: GrpcUtils
  subErrors = 0

  constructor(
    options: GrpcWatcherOptions,
    iotFunc: ProducerPushFnType,
    fallback: () => void
  ) {
    Crypto.base58Encode
    this.options = options
    this.iotFunc = iotFunc
    this.fallback = fallback
    this.prepareOptions()

    this.grpcUtils = new GrpcUtils(
      PROTO_PATH,
      this.options.addrs.grpc_events,
      this.options.addrs.grpc
    )
    this.setupSubRetryOnError()
  }

  prepareOptions() {
    this.options.dAppB58 = Crypto.base58Decode(this.options.dApp)
    this.options.pkHash = Buffer.from(this.options.dAppB58.slice(2, 22))
    this.options.functions = this.options.functionDefs.map((x) => x.name)
  }

  async setupSubRetryOnError() {
    console.log('setup')

    if (this.subErrors > 3) {
      console.log(`Too many errors for ${this.options.addrs.grpc}, changing mode`)
      this.fallback() // run http mode
      return
    }

    try {
      switch (this.options.mode) {
        case 'grpc-sub':
          await this.setupGrpcSub()
          console.log('subscription created')
          break

        case 'grpc-polling':
          await this.setupPolling()
          console.log('polling created')
          break

        default:
          break
      }
    } catch (ex) {
      console.log(new Date().toISOString())
      console.log(ex)
      // notify somewhere about connection error
      setTimeout(() => {
        this.subErrors++
        this.setupSubRetryOnError()
      }, 1000)
    }
  }

  async setupGrpcSub() {
    const actualHeight = (await this.grpcUtils.getActualHeight()) as number
    const subscription = this.grpcUtils.subscribeToBlocksRange(
      (update) => {
        this.processEventDetailed(update)
      },
      (error) => {
        this.subErrors += 1000
        this.setupSubRetryOnError()
      },
      actualHeight
    )
  }

  async setupPolling() {
    this.grpcUtils.pollBlocksRange(
      async (txids) => {
        await this.grpcUtils.runOnTransactions(txids, (x: TransactionResponse) => {
          this.processTransaction(x)
        })
      },
      (error) => {
        this.subErrors += 1
        this.setupSubRetryOnError()
      },
      2
    )
  }

  async processEventDetailed(event: SubscribeEvent) {
    const txids = event.update?.append?.transaction_ids!
    await this.grpcUtils.runOnTransactions(txids, (x: TransactionResponse) => {
      this.processTransaction(x)
    })
  }

  processTransaction(tx: TransactionResponse) {
    const txobj = tx.transaction?.transaction!
    const timestamp = Number(tx.transaction?.transaction?.timestamp)
    const tracingSpan = Tracing.instance.createSpanFromTx(
      tx.id as Uint8Array,
      'listener-grpc'
    )

    // is invoke script
    if (txobj.data != 'invoke_script') return
    // is observed dapp
    const pkHash = txobj.invoke_script?.d_app?.public_key_hash!
    if (Buffer.from(pkHash).compare(this.options.pkHash!) != 0) return
    // is successfull
    if (tx.application_status != 'SUCCEEDED') return
    // parse call
    const call = txobj.invoke_script?.function_call as Uint8Array
    const parsedCall = new InvokeParser(call)
    // console.log(parsedCall)
    const invoker = Crypto.address(tx.transaction?.transaction?.sender_public_key!, 'R')

    // filter by functions
    if (this.options.functions!.indexOf(parsedCall.fName) == -1) return

    // filter by silent invokers
    if (this.options.silent && this.options.silent!.indexOf(invoker) != -1) return true

    this.processAction(parsedCall, tx.id as Uint8Array, timestamp, tracingSpan)
  }

  async processAction(
    call: InvokeParser,
    txId: Uint8Array,
    timestamp: number,
    span?: SpanWrapper
  ) {
    const func = this.options.functionDefs.find((x) => x.name == call.fName)
    const key = call.args[func!.keyArgument] as string
    const action = call.args[func!.actionArgument] as string
    const validTo = call.args[func!.validToArgument] as number | undefined // pass it to iot?

    span?.event('device from key')
    const device = await this.getDeviceFromAsset(key) // get from key
    span?.event('type form device')

    let deviceModel = device ? await this.getdeviceModel(device) : undefined // get from device

    const params: ActionParams = {
      tx: Crypto.base58Encode(txId),
      action,
      device,
      deviceModel: deviceModel,
      func: func?.name,
      key,
      timestamp
    }

    if (validTo && validTo < Date.now()) {
      if (process.env.DEBUG)
        console.log('Action expired', {
          func,
          key,
          action,
          device,
          deviceModel,
          validTo
        })
      span?.endWithError('Action expired')
    } else if (!device || !action) {
      if (process.env.DEBUG)
        console.log('Not enough data to process action', {
          func,
          key,
          action,
          device,
          deviceModel,
          validTo
        })
      span?.endWithError(
        `Not enough data
        ${!device ? ' missing device' : ''}
        ${!action ? ' missing action' : ''}
        `
      )
    } else {
      this.iotFunc(params, span)
    }
  }

  async getDeviceFromAsset(key: string | Uint8Array) {
    let asset = undefined
    try {
      asset = await this.grpcUtils.getAsset(key)
    } catch (ex) {
      console.log(`Cant get asset info ${key}`)
      console.log(ex)
    }
    return asset?.description?.split('_')[0]
  }
  async getdeviceModel(device: string | Uint8Array) {
    try {
      const resp = await this.grpcUtils.getDataByKey(device, 'details')
      const json = JSON.parse(resp?.entry?.string_value!)
      return json.deviceModel
    } catch (ex) {
      if (process.env.DEBUG) {
        //console.log(ex)
      }
    }
  }
}
export default GrpcWatcher
