const F_NAME_SIZE_START = 3
const F_NAME_START = 7
// const SIZE_PER_TYPE = {0: 8, 1:-1, 2: -1, 6: 0, 7: 0, 11:-1} as any
const STR_TYPE = 2
const LONG_TYPE = 0

class InvokeParser {
  fName: string
  args: (string | number)[] = []
  invoke: Uint8Array

  constructor(invoke: Uint8Array) {
    this.invoke = invoke
    const fNameSize = this.bytesToInt32(invoke.slice(F_NAME_SIZE_START, F_NAME_START))
    this.fName = invoke.slice(F_NAME_START, F_NAME_START + fNameSize).toString()
    this.parseArgs(F_NAME_START + fNameSize)
  }

  parseArgs(offset: number) {
    const argsAmountBytes = this.invoke.slice(offset, (offset += 4))
    const argsCount = this.bytesToInt32(argsAmountBytes)

    try {
      for (let index = 0; index < argsCount; index++) {
        offset = this.parseArg(offset)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // parse only string + long for now
  parseArg(offset: number) {
    const argType = this.invoke[offset++]
    switch (argType) {
      case STR_TYPE: {
        const size = this.bytesToInt32(this.invoke.slice(offset, (offset += 4)))
        const value = this.invoke.slice(offset, (offset += size)).toString()
        this.args.push(value)
        break
      }
      case LONG_TYPE: {
        const size = 8
        const value = this.bytesToInt64(this.invoke.slice(offset, (offset += size)))
        this.args.push(value)
        break
      }
      default:
        throw 'Unsupported argument type'
    }
    return offset
  }

  bytesToInt32(b: Uint8Array) {
    let int = 0
    for (let index = 0; index < 4; index++) {
      int = (int << 8) + b[index]
    }
    return int
  }

  bytesToInt64(b: Uint8Array) {
    let int: bigint = BigInt(0)
    for (let index = 0; index < 8; index++) {
      int = (int << BigInt(8)) + BigInt(b[index])
    }
    return Number(int)
  }
}

export default InvokeParser
