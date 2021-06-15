import TxHeightPair from '../grpc/tx_height_pair'
import UqDataAdapter from './uq_data_adapter'

class TxHeightPairAdapter implements UqDataAdapter<TxHeightPair> {
  getTimestamp(data: TxHeightPair): number {
    return data.height
  }
  getUniqueId(data: TxHeightPair): string {
    return data.tx
  }
  getGroupIndex(data: any, groupWindowSize: number): number {
    return data.height
  }
}

export default TxHeightPairAdapter
