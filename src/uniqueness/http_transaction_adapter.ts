import UqDataAdapter from './uq_data_adapter'

class HttpTransactionAdapter implements UqDataAdapter<any> {
  // <any> as there is no type defined for tx from http yet
  getTimestamp(data: any): number {
    return data.timestamp
  }
  getUniqueId(data: any): string {
    return data.id
  }
}

export default HttpTransactionAdapter
