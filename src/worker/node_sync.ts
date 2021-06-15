/**
 *
 * Helps workers select right nodes by keeping actual usage in redis queue
 *
 * - get list of node usage
 * - put usage 'notification' as long as node is used
 *
 */

import NodeSyncUtils from '../redis/node_sync_utils'

class NodeSync {
  updateInterval: number
  reporter?: NodeJS.Timeout
  mainNodes: string[]
  detectedNodes: string[] = [] // implement fetching list from nodes? or list from redis?
  nodesyncUtils: NodeSyncUtils

  constructor(nodes: string[], updateInterval: number) {
    this.updateInterval = updateInterval
    this.mainNodes = nodes
    this.nodesyncUtils = new NodeSyncUtils()
  }

  // get list from
  async findLeastActive() {
    await this.delay(Math.random() * Number(process.env.MAX_START_DELAY ?? 5000)) // random delay for better balance
    let inUse = await this.nodesyncUtils.getActivity()
    let mainUsage = this.mainNodes.map((x) => {
      return { node: x, lastActive: parseInt(inUse[x] || '0') }
    })
    mainUsage.sort((a, b) => a.lastActive - b.lastActive)
    // console.log(mainUsage)
    return mainUsage[0]
    //this.mainNodes.map(x=>)
  }

  startReporter(node: string) {
    this.reportActivity(node)
    this.reporter = setInterval(() => {
      this.reportActivity(node)
    }, 5000)
  }

  stopReporter() {
    if (this.reporter) clearInterval(this.reporter!)
    this.reporter = undefined
  }

  protected reportActivity(node: string) {
    this.nodesyncUtils.sendActivity(node)
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default NodeSync
