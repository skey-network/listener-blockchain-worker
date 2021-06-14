import { RedisConnection, RedisConnectionOptions } from './redis_connection'
import { RedisClient } from 'redis'
import { REPL_MODE_SLOPPY } from 'repl'

class NodeSyncUtils {
  redis: RedisClient

  constructor(options?: RedisConnectionOptions) {
    this.redis = RedisConnection.CreateClient(options ?? {})
  }

  sendActivity(node: string) {
    this.redis.hset('listener_sync', node, Date.now().toString())
  }

  getActivity(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redis.hgetall('listener_sync', (error, reply) => {
        if (error) resolve({})
        else resolve(reply || {})
      })
    })
  }
}

export default NodeSyncUtils
