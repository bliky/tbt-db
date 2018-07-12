import ApiClient from 'vue-gateway-sdk'

let Config = {
  // 文件网关 action
  gatewayAddr: 'https://scmgw.to8to.com',
  // php网关
  oldGatewayAddr: 'https://apigw.to8to.com/old',
  //oa网关
  oaGatewayAddr:'https://oapp.to8to.com',
  // java网关
  newGatewayAddr: 'https://apigw.to8to.com/cgi',
}

// PHP版协议
let apiClient = new ApiClient(Config.oldGatewayAddr)
// JAVA版协议
apiClient.setNewGateway(Config.newGatewayAddr)
apiClient.Global.setAppName('dbd-app')

export default apiClient
