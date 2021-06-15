import { timeStamp } from 'console'
import UqDataAdapter from './uq_data_adapter'
/**
 *  checks if tx is unique in given time range
 *  groups txes by date of creation to minimize checks count
 *  automaticaly rejects txes outside time window
 *  removes outdated groups
 */
class Uniqueness<dataType> {
  groupWindowSize = 1000 // 1s
  actionMaxValidTime = 120 * 1000 // 2min
  maxSetLength: number = 2
  limitMode: 'timestamp' | 'size' = 'timestamp'
  adapter: UqDataAdapter<dataType>

  groups: { timeIndex: number; txes: string[] }[] = []

  constructor(
    adapter: UqDataAdapter<dataType>,
    config?: {
      groupWindowSize?: number
      actionMaxValidTime?: number
      limitSetInsteadTime?: boolean
      maxSetLength?: number
      limitMode?: 'timestamp' | 'size'
    }
  ) {
    this.groupWindowSize = config?.groupWindowSize ?? this.groupWindowSize
    this.actionMaxValidTime = config?.actionMaxValidTime ?? this.actionMaxValidTime
    this.maxSetLength = config?.maxSetLength ?? this.maxSetLength
    this.limitMode = config?.limitMode ?? this.limitMode
    this.adapter = adapter
  }

  checkItemUniqueness(data: dataType) {
    if (this.limitMode == 'timestamp' && !this.isItemInRange(data)) {
      // console.log('not in range')
      return false
    }
    let group = this.findGroup(data)
    if (!this.isItemUniqueInGroup(group, data)) {
      // console.log('found in group')
      return false
    }

    group ??=
      this.cleanOldGroups() ??
      this.createGroup(this.adapter.getGroupIndex(data, this.groupWindowSize))
    group!.txes.push(this.adapter.getUniqueId(data))
    return true
  }

  protected isItemInRange(data: dataType) {
    if (this.adapter.getTimestamp(data) < Date.now() - this.actionMaxValidTime) {
      return false
    }
    return true
  }

  protected isItemUniqueInGroup(
    group: { timeIndex: number; txes: string[] } | undefined,
    data: dataType
  ) {
    // returns true if there is no group or no element in group
    return (group?.txes?.indexOf(this.adapter.getUniqueId(data)) ?? -1) == -1
  }

  protected findOrCreateGroupFor(data: dataType) {
    const index = this.adapter.getGroupIndex(data, this.groupWindowSize)

    return this.groups.find((x) => x.timeIndex == index) ?? this.createGroup(index)
  }

  protected createGroup(timeIndex: number) {
    const group = { timeIndex, txes: [] }
    this.groups.push(group)
    return group
  }

  protected cleanOldGroups() {
    switch (this.limitMode) {
      case 'timestamp':
        let minTimeIndex = Math.floor(
          (Date.now() - this.actionMaxValidTime!) / this.groupWindowSize
        )
        while (this.groups[0] && this.groups[0].timeIndex < minTimeIndex)
          this.groups.shift()
        console.log(this.groups.map((x) => x.txes.length))
        break
      case 'size':
        while (this.groups.length > this.maxSetLength!) this.groups.shift()
        break
      default:
        break
    }
    console.log(this.groups.map((x) => x.txes.length))
    return null
  }

  protected findGroup(data: dataType) {
    return this.groups.find(
      (x) => x.timeIndex == this.adapter.getGroupIndex(data, this.groupWindowSize)
    )
  }
}

export default Uniqueness
