import BCFunc from './bcfunc'
import BlockchainUtils from './blockchain_utils'
import Filters from './filters'
import LogOnChange from '../log_on_change'
import { SpanWrapper, Tracing } from '../tracing'
import { ProducerPushFnType } from '../queue/producer'

type WatcherOptions = {
  nodeUrl: string
  dapp: string
  watchedFunctions: BCFunc[]
  silent?: string[]
  safety: number
  checkInterval: number
  blocksToReparse: number
}

class BlockchainWatcher {
  options: WatcherOptions
  utils: BlockchainUtils
  iotFunction: ProducerPushFnType
  onError: () => void
  filters: Filters

  /// latest bc state
  block: number | undefined
  parsedTxesInLastBlocks: { block: number; tx: string }[] = []

  constructor(
    options: WatcherOptions,
    iotFunction: ProducerPushFnType,
    onError: () => void
  ) {
    this.onError = onError
    this.options = options
    this.utils = new BlockchainUtils(this.options.nodeUrl)
    this.iotFunction = iotFunction
    this.filters = new Filters(
      this.options.dapp,
      this.options.watchedFunctions,
      this.options.silent
    )
  }

  async start() {
    try {
      this.block = (await this.utils.getBlocksCount()) - 1 - this.options.safety
      while (1) {
        const latestBlock = (await this.utils.getBlocksCount()) - this.options.safety
        if (latestBlock > this.block || this.options.safety == 0) {
          // if block changed or every check when from liquid too
          await this.parseBlocksRange(
            this.block - this.options.blocksToReparse,
            latestBlock
          )
          this.block = latestBlock
        }
        await BlockchainUtils.sleep(this.options.checkInterval)
      }
    } catch (ex) {
      if (process.env.DEBUG) {
        console.log(ex)
      }
      this.onError()
    }
  }

  async parseBlocksRange(first: number, last: number) {
    // LogOnChange.watchChange('old txes', this.parsedTxesInLastBlocks)
    if (this.block != last) {
      // block changed, delete old txes
      this.parsedTxesInLastBlocks = this.parsedTxesInLastBlocks.filter(
        (x) => x.block >= first
      )
    }
    for (let no = first; no <= last; no++) {
      await this.parseBlock(no)
    }
  }

  async parseBlock(blockNo: number) {
    if (blockNo < 1) return
    const transactions = await this.utils.getBlockTransactions(blockNo)
    const filteredTransactions = this.filterTransactions(transactions, blockNo)
    for (const tx of filteredTransactions) {
      await this.parseTransaction(tx)
    }
  }

  filterTransactions(transactions: any, blockNo: number) {
    if (transactions.lenght == 0) return []
    transactions = this.filters.filterAll(transactions)

    //filter by last parsed txes
    transactions = transactions.filter(
      (x: any) => this.parsedTxesInLastBlocks.findIndex((y) => y.tx == x.id) == -1
    ) // only new in block

    this.parsedTxesInLastBlocks.push(
      ...transactions.map((x: any) => {
        return { tx: x.id, block: blockNo }
      })
    ) // save as old

    return transactions
  }

  async parseTransaction(transaction: any) {
    const span = Tracing.instance.createSpanFromTx(transaction.id, 'listener-http')
    const timestamp = transaction.timestamp
    const fn = this.options.watchedFunctions.find(
      (x) => x.name == transaction.call.function
    )!
    const key = transaction.call.args[fn.keyArgument].value
    const action = transaction.call.args[fn.actionArgument].value
    const validTo = transaction.call.args[fn.validToArgument]?.value
    span?.event('get device')
    const device = await this.utils.deviceAddrFromTokenID(key)
    if (validTo && validTo < Date.now()) {
      return span?.endWithError('Action expired')
    }
    span?.event('get device type')
    const deviceModel = await this.getDeviceModel(device)

    // no need to await...
    this.iotFunction(
      {
        tx: transaction.id,
        device,
        action,
        key,
        func: fn.name,
        deviceModel,
        timestamp
      },
      span
    )
  }

  async getDeviceModel(device: string) {
    try {
      const details = await this.utils.getValueFromData(device, 'details')
      const json = JSON.parse(details)
      return json.deviceModel
    } catch (ex) {
      if (process.env.DEBUG) {
        console.log(ex)
      }
    }
  }
}

export default BlockchainWatcher
