type BCFunc = {
  /** Name of dApp function */
  name: string
  /** Number of argument containing key id */
  keyArgument: number
  /** Number of argument containing action name */
  actionArgument: number
  /** Number of argument containing timestamp with action expiration */
  validToArgument: number
}

export default BCFunc
