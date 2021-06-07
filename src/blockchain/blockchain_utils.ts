import fetch from 'node-fetch'

class BlockchainUtils {
  static fetch: Function = BlockchainUtils.fetchParseWithRetry

  static async deviceAddrFromTokenID(tokenId: string) {
    let token: any = await this.tokenInfo(tokenId)
    // if (DEBUG)
    // console.log(JSON.stringify(token))
    // console.log(token.name)
    return token['description'].split('_')[0]
  }

  //////// wws utx
  static async getBlockTransactions(no: number) {
    const resp = await this.fetch(`${process.env.NODE_URL}/blocks/at/${no}`)
    // const json = await resp.json()
    return resp.transactions
  }

  static async getBlocksCount() {
    return (await this.fetch(`${process.env.NODE_URL}/blocks/height`, (json: any) => {
      return parseInt(json.height)
    })) as number
    // const json = await resp.json()
  }

  static async tokenInfo(tokenId: string) {
    return await this.fetch(`${process.env.NODE_URL}/assets/details/${tokenId}`)
  }

  static async getValueFromData(address: string, key: string) {
    return await this.fetch(
      `${process.env.NODE_URL}/addresses/data/${address}/${key}`,
      (json: any) => {
        return json.value
      }
    )
  }

  // validResp(json:any,schema:any){

  // }

  static async fetchParseWithRetry(url: string, parse?: Function) {
    while (true) {
      try {
        const resp = await fetch(url)
        // if (resp.status != 200) throw `wrong status ${resp.status} ${url}`
        const json = await resp.json()
        if (parse) return parse(json)
        return json
      } catch (ex) {
        console.log(ex)
        console.log('request or parse failed, retrying')
        await this.sleep(2000)
      }
    }
  }

  static sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
}

export default BlockchainUtils
