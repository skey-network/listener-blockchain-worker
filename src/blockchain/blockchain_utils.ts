import fetch from 'node-fetch'

class BlockchainUtils {
  fetch: Function = this.fetchParseWithRetry
  nodeUrl: string
  constructor(nodeUrl: string) {
    this.nodeUrl = nodeUrl
  }

  async deviceAddrFromTokenID(tokenId: string) {
    let token: any = await this.tokenInfo(tokenId)
    // if (DEBUG)
    // console.log(JSON.stringify(token))
    // console.log(token.name)
    return token['description'].split('_')[0]
  }

  //////// wws utx
  async getBlockTransactions(no: number) {
    const resp = await this.fetch(`${this.nodeUrl}/blocks/at/${no}`)
    // const json = await resp.json()
    return resp.transactions
  }

  async getBlocksCount() {
    return (await this.fetch(`${this.nodeUrl}/blocks/height`, (json: any) => {
      return parseInt(json.height)
    })) as number
    // const json = await resp.json()
  }

  async tokenInfo(tokenId: string) {
    return await this.fetch(`${this.nodeUrl}/assets/details/${tokenId}`)
  }

  async getValueFromData(address: string, key: string) {
    return await this.fetch(
      `${this.nodeUrl}/addresses/data/${address}/${key}`,
      (json: any) => {
        return json.value
      }
    )
  }

  // validResp(json:any,schema:any){

  // }

  async fetchParseWithRetry(url: string, parse?: Function, retry = 4) {
    while (true) {
      try {
        const resp = await fetch(url)
        // if (resp.status != 200) throw `wrong status ${resp.status} ${url}`
        const json = await resp.json()
        if (parse) return parse(json)
        return json
      } catch (ex) {
        if (!retry--) {
          throw 'too many failed retries'
        }
        console.log(ex)
        console.log('request or parse failed, retrying')
        await BlockchainUtils.sleep(2000)
      }
    }
  }

  static sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
}

export default BlockchainUtils
