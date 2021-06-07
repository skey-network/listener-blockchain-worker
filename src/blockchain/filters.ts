import { textChangeRangeIsUnchanged } from 'typescript'
import BCFunc from '../blockchain/bcfunc'

class Filters {
  dapp: string
  functions: BCFunc[]
  functionNames: string[]
  silent?: string[]
  constructor(dapp: string, functions: BCFunc[], silent?: string[]) {
    this.functions = functions
    if (process.env.DEBUG) console.log(functions)
    this.functionNames = functions.map((x) => x.name)
    this.dapp = dapp
    this.silent = silent
  }
  filterAll(txes: any) {
    txes = this.filterByDapp(txes)
    txes = this.filterByStatus(txes)
    txes = this.filterBySilent(txes)
    txes = this.filterByFunctions(txes)
    return txes
  }

  filterByDapp(tx: any) {
    return tx.filter((x: any) => x.dApp == this.dapp)
  }
  filterBySilent(tx: any) {
    if (!this.silent) return tx
    return tx.filter((x: any) => this.silent!.indexOf(x.sender) == -1)
  }
  filterByFunctions(tx: any) {
    return tx.filter((x: any) => this.functionNames.indexOf(x.call.function) != -1)
  }
  filterByStatus(tx: any) {
    return tx.filter((x: any) => x.applicationStatus == 'succeeded')
  }
}
export default Filters
