interface UqDataAdapter<dataType> {
  getTimestamp(data: dataType): number
  getUniqueId(data: dataType): string
  getGroupIndex(data: dataType, groupWindowSize: number): number
}
export default UqDataAdapter
