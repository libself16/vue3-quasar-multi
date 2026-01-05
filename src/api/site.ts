import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getSite = () => {
  return requestApi<null, Response.ISite>("/v1/player/user/site", null, {
    name: "getSite",
    method: "get"
  })
}

export const getLogoList = () => {
  return requestApi<null, Response.LogoList>("/v1/player/logos/list", null, {
    name: "getLogoList",
    method: "get"
  })
}

export const trafficView = (params: Request.ITrafficData) => {
  return requestApi<Request.ITrafficData, null>("/v1/player/traffic/view", params, {
    name: "trafficView",
    method: "post"
  })
}

// 取得代理入口開關設定
export const proxyDisplay = () => {
  return requestApi<null, Response.ProxyDisplayConfig>("/v1/player/displays/group/proxy", null, {
    name: "proxyDisplay",
    method: "get"
  })
}
