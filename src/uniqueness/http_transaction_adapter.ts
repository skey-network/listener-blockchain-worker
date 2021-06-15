import UqDataAdapter from './uq_data_adapter'

class HttpTransactionAdapter implements UqDataAdapter<any> {
  getGroupIndex(data: any, groupWindowSize: number): number {
    return Math.floor(data.timestamp / (groupWindowSize ?? 1000)) // 1s default window size
  }
  getTimestamp(data: any): number {
    return data.timestamp
  }
  getUniqueId(data: any): string {
    return data.id
  }
}

export default HttpTransactionAdapter
