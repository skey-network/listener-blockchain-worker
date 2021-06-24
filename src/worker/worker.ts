/**
 * load list of nodes
 * load used nodes from redis
 * chose one with lowest amount of workers
 * if node is misbehaving ban it locally for some time and select new one? or use some 'reputation' in redis?
 */

import { sample } from 'lodash'
import ActionParams from '../action_params'
import BCFunc from '../blockchain/bcfunc'
import BlockchainWatcher from '../blockchain/blockchain_watcher'
import GrpcWatcher from '../grpc/grpc_watcher'
import { Producer } from '../redis/producer'
import { SpanWrapper } from '../tracing'
import NodeSync from './node_sync'

const nodes = require('../../nodes.json')

type Modes = 'http' | 'grpc-polling' | 'grpc-sub'

type WorkerOptions = {
  functionDefs: BCFunc[]
  dapp: string
  silentInvokers: string[]
  mode: Modes
  http: {
    safetyLevel: number
    checkInterval: number
    blocksToReparse: number
  }
}

class Worker {
  options: WorkerOptions
  producer: Producer
  lastNode?: string
  nodeSync: NodeSync = new NodeSync(nodes, 1000)

  constructor(options: WorkerOptions) {
    this.options = options
    this.producer = new Producer({
      exitAfterRedisProblemSec: 120
    })
    this.runWorker()
  }

  // run it fresh - without args, or from onError
  async runWorker(mode?: Modes, selectedNode?: string) {
    selectedNode ??= (await this.nodeSync.findLeastActive()).node //this.selectNode()
    this.lastNode = selectedNode
    mode ??= this.options.mode ?? 'grpc-sub'

    console.log(selectedNode)

    this.nodeSync.startReporter(selectedNode!)

    switch (mode) {
      case 'grpc-polling':
      case 'grpc-sub':
        this.runInGrpcMode(
          {
            grpc: selectedNode + ':' + process.env.NODE_GRPC_PORT,
            grpc_events: selectedNode + ':' + process.env.NODE_GRPC_EVENTS_PORT
          },
          (data, span) => this.producer.pushToQueue(data, span),
          () => {
            this.onError(mode!)
          },
          mode
        )
        break
      case 'http':
        const httpMode = process.env.NODE_HTTP_MODE ?? 'https'
        this.runInHttpMode(
          `${httpMode}://${selectedNode}`,
          (data, span) => this.producer.pushToQueue(data, span),
          () => this.onError(mode!)
        )
        break

      default:
        break
    }
  }

  selectNode() {
    //TODO use info from redis (queue "nodes", each node has timestamp which is updated on interval when in use by node)
    return sample(nodes)
  }

  /**
   *
   * @param mode - mode which failed
   */
  onError(mode: Modes) {
    this.nodeSync.stopReporter()
    switch (mode) {
      case 'grpc-sub':
        this.runWorker('grpc-polling', this.lastNode)
        break

      case 'grpc-polling':
        if (process.env.ENABLE_HTTP_FALLBACK == 'true') {
          this.runWorker('http', this.lastNode)
        } else {
          this.runWorker()
        }

        break

      default:
        this.runWorker() // randomize
        break
    }
  }

  runInGrpcMode(
    addrs: { grpc: string; grpc_events: string },
    dataCallback: (params: ActionParams, span?: SpanWrapper) => void,
    fallback: () => void,
    mode: Modes
  ) {
    console.log(`Listener starting in ${mode} mode`)
    return new GrpcWatcher(
      {
        addrs,
        dApp: this.options.dapp,
        functionDefs: this.options.functionDefs,
        silent: this.options.silentInvokers,
        mode: mode as 'grpc-sub' | 'grpc-polling'
      },
      (params: ActionParams, span?: SpanWrapper) => {
        dataCallback(params, span)
      },
      fallback
    )
  }

  runInHttpMode(
    nodeUrl: string,
    dataCallback: (params: ActionParams, span?: SpanWrapper) => void,
    error: () => void
  ) {
    console.log(
      `Listener starting in http mode, safety level: ${this.options.http.safetyLevel}, interval: ${this.options.http.checkInterval}`
    )
    const watcher = new BlockchainWatcher(
      {
        nodeUrl,
        dapp: this.options.dapp,
        watchedFunctions: this.options.functionDefs,
        silent: this.options.silentInvokers,
        blocksToReparse: this.options.http.blocksToReparse,
        checkInterval: this.options.http.checkInterval,
        safety: this.options.http.safetyLevel
      },
      (params: ActionParams, span?: SpanWrapper) => {
        dataCallback(params, span)
      },
      error
    )
    watcher.start()
    return watcher
  }
}

export default Worker
