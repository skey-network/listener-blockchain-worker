import { Metadata, ServiceError } from '@grpc/grpc-js'
import { BlocksApiClient } from '../proto/waves/node/grpc/BlocksApi'
import { TransactionsApiClient } from '../proto/waves/node/grpc/TransactionsApi'
import { BlockchainUpdatesApiClient } from '../proto/waves/events/grpc/BlockchainUpdatesApi'
import { StateUpdate } from '../proto/waves/events/StateUpdate'
import * as Crypto from '@waves/ts-lib-crypto'
import fs from 'fs'
import { TransactionResponse } from '../proto/waves/node/grpc/TransactionResponse'
import { AccountsApiClient } from '../proto/waves/node/grpc/AccountsApi'
import { AssetsApiClient } from '../proto/waves/node/grpc/AssetsApi'
import { AssetInfoResponse } from '../proto/waves/node/grpc/AssetInfoResponse'
import { DataEntryResponse } from '../proto/waves/node/grpc/DataEntryResponse'
import { SubscribeEvent } from '../proto/waves/events/grpc/SubscribeEvent'
import { BlockWithHeight } from '../proto/waves/node/grpc/BlockWithHeight'
import { SignedTransaction } from '../proto/waves/SignedTransaction'
import BlockchainUtils from '../blockchain/blockchain_utils'
import { Transaction } from '../proto/waves/Transaction'
import { GetBlockUpdateResponse } from '../proto/waves/events/grpc/GetBlockUpdateResponse'
import Uniqueness from '../uniqueness/uniqueness'
import TxHeightPair from './tx_height_pair'
import TxHeightPairAdapter from '../uniqueness/tx_height_adapter'
import HttpTransactionAdapter from '../uniqueness/http_transaction_adapter'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

class GrpcUtils {
  protoDescriptor: any
  updatesAddr: string
  grpcAddr: string
  instances: any = {}
  waitForReady: Metadata = new grpc.Metadata({ waitForReady: true })
  subscription: {
    connection?: any
    lastDataAt?: number
    interval?: NodeJS.Timeout
    problem: boolean
    problemTriggerDiff: number
    fallbackTriggerDiff: number
    problemCooldownDiff: number
  } = {
    problem: false,
    problemTriggerDiff: 24000, // report problem somewhere
    fallbackTriggerDiff: 30000, // fallback to http mode
    problemCooldownDiff: 16000 // report problem is over
  }

  constructor(protoPath: string, updatesAddr: string, grpcAddr: string) {
    console.log({ grpcAddr, updatesAddr })
    this.protoDescriptor = this.createDescriptor(this.protoList(protoPath))
    this.grpcAddr = grpcAddr
    this.updatesAddr = updatesAddr
  }

  createDescriptor(filesList: string[]) {
    const packageDefinition = protoLoader.loadSync(filesList, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })

    const defs = grpc.loadPackageDefinition(packageDefinition)
    return defs
  }

  blockchainUpdatesApi() {
    return this.getOrCreateInstance<BlockchainUpdatesApiClient>(
      'BlockchainUpdatesApi',
      this.protoDescriptor.waves.events.grpc.BlockchainUpdatesApi,
      this.updatesAddr
    )
  }

  blocksApi() {
    return this.getOrCreateInstance<BlocksApiClient>(
      'BlocksApi',
      this.protoDescriptor.waves.node.grpc.BlocksApi
    )
  }

  transactionsApi() {
    return this.getOrCreateInstance<TransactionsApiClient>(
      'TransactionsApi',
      this.protoDescriptor.waves.node.grpc.TransactionsApi
    )
  }

  accountsApi() {
    return this.getOrCreateInstance<AccountsApiClient>(
      'AccountsApi',
      this.protoDescriptor.waves.node.grpc.AccountsApi
    )
  }

  assetsApi() {
    return this.getOrCreateInstance<AssetsApiClient>(
      'AssetsApi',
      this.protoDescriptor.waves.node.grpc.AssetsApi
    )
  }

  protected getOrCreateInstance<instanceType>(
    propName: string,
    constructor: any,
    server?: string
  ) {
    const inst = this.instances[propName]
    if (inst) return inst as instanceType
    return (this.instances[propName] = new constructor(
      server || this.grpcAddr,
      grpc.credentials.createInsecure()
    )) as instanceType
  }

  getActualHeight() {
    return new Promise((resolve, reject) => {
      this.blocksApi().GetCurrentHeight({}, new Metadata(undefined), (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result?.value!)
        }
      })
    })
  }

  getDataByKey(address: string | Uint8Array, key: string) {
    return new Promise<DataEntryResponse | undefined>((resolve, reject) => {
      const getter = this.accountsApi().GetDataEntries({
        address: this.asBytes(address),
        key: key
      })
      getter.on('error', () => {
        reject()
      })
      getter.on('close', () => {
        resolve(undefined)
      })
      getter.on('data', (data) => {
        getter.destroy()
        resolve(data)
      })
    })
  }

  getAsset(assetId: string | Uint8Array) {
    return new Promise<AssetInfoResponse>((resolve, reject) => {
      this.assetsApi().GetInfo(
        {
          asset_id: this.asBytes(assetId)
        },
        (error?: ServiceError, result?: AssetInfoResponse) => {
          if (error) {
            console.log(error, 'ASSET:', assetId)
            reject(error)
          } else {
            resolve(result!)
          }
        }
      )
    })
  }

  runOnTransactions(
    txids: (string | Buffer | Uint8Array)[] | undefined,
    fn: (data: TransactionResponse) => void
  ) {
    if (!txids || txids.length == 0) return
    const x = this.transactionsApi().GetTransactions({
      transaction_ids: txids
    })
    if (process.env.DEBUG) console.log(`update ${txids.length}`)
    x.addListener('data', (chunk: TransactionResponse) => fn(chunk))
    x.addListener('error', (error) => console.log(error))
  }

  asBytes(content: string | Uint8Array) {
    return content instanceof Uint8Array
      ? content
      : Crypto.base58Decode(content as string)
  }

  /** Subscribes to changes in blocks from start to end (end may be not specified)
   * @returns subscription
   *
   */
  subscribeToBlocksRange(
    /** callback fired on update */
    callback: (update: SubscribeEvent) => void,
    /** error callback, used to make new subscription */
    error: (reason: any) => void,
    start: number,
    end?: number
  ) {
    const sub = this.blockchainUpdatesApi().Subscribe(
      { from_height: start, to_height: end },
      {}
    )
    this.subscription.interval = setInterval(() => this.watchSubscriptionState(), 5000)

    sub.addListener('data', (data: SubscribeEvent) => {
      callback(data)
      this.subscription.lastDataAt = Date.now()
    })
    sub.addListener('error', (e) => {
      sub.destroy()
    })
    sub.addListener('close', () => {
      console.log(`subscription closed ${this.updatesAddr}`)
      error('closed')
    })
    sub.addListener('pause', () => {
      console.log('pause')
    })
    this.subscription.connection = sub
    return sub
  }

  /** polls blocks over grpc in case subscription fails, should be faster than http anyway */
  async pollBlocksRange(
    txesCallback: (txids: (string | Buffer | Uint8Array)[]) => void,
    errorCallback: (message: string) => void,
    reparseBlocks: number
  ) {
    // try{ TODO catch and call error callback
    const uq = new Uniqueness<TxHeightPair>(new TxHeightPairAdapter(), {
      limitMode: 'size'
    })
    while (true) {
      let currentHeight = (await this.getActualHeight()) as number
      const pollStart = Math.max(currentHeight - reparseBlocks, 1)
      const pollEnd = currentHeight
      for (let height = pollStart; height <= pollEnd; height++) {
        let transactionIds = (await this.getBlockTransactions(height)) as Uint8Array[]
        console.log({ before: transactionIds.length })
        transactionIds = transactionIds.filter((x) => {
          return uq.checkItemUniqueness({
            tx: x.toString(),
            height
          })
        })
        console.log({ after: transactionIds.length })

        if (transactionIds) txesCallback(transactionIds as any)
      }
      await BlockchainUtils.sleep(2000)
    }
    // }catch(){}
  }

  async getBlockTransactions(height: number) {
    return new Promise((resolve, reject) => {
      const block = this.blockchainUpdatesApi().GetBlockUpdate(
        { height: height },
        new Metadata(),
        {},
        (error?: ServiceError, result?: GetBlockUpdateResponse) => {
          if (error) reject(error)
          else resolve(result?.update?.append?.transaction_ids)
        }
      )
    })
  }

  watchSubscriptionState() {
    const diff = Date.now() - this.subscription.lastDataAt!
    if (this.subscription.problem) {
      if (diff < this.subscription.problemCooldownDiff) {
        // if subscription works again
        console.log(`subscription working again ${this.updatesAddr}`)
        this.subscription.problem = false
      } else if (diff > this.subscription.fallbackTriggerDiff) {
        // subscription not recovered in given time, http fallback
        console.log(`subscription failed ${this.updatesAddr}`)
        this.subscription.lastDataAt = undefined
        this.subscription.problem = false
        clearInterval(this.subscription.interval!)
        this.subscription.connection.destroy()
      }
    } else if (diff > this.subscription.problemTriggerDiff) {
      // subscription was working but stopped
      console.log(`subscription problem  ${this.updatesAddr} ...`)
      this.subscription.problem = true
    }
  }

  protected protoList(path: string) {
    return this.protoListFrom(path)
      .filter((x) => x != undefined)
      .map((x) => x as string)
  }

  protected protoListFrom(path: string) {
    return fs.readdirSync(path).map((x) => {
      if (x.indexOf('.proto') == -1) return
      return path + x
    })
  }
}
export default GrpcUtils
