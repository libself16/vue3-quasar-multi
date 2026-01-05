import { requestApi } from "src/common/utils/request"
import type * as Request from "./request.type"
import type * as Response from "./response.type"

// 1. 首頁 2. 產品大廳 3. 遊戲大廳
export const getBannerList = (params: Request.ReqBannerList) => {
  return requestApi<Request.ReqBannerList, Response.BannerList>("/v1/player/banners/list", params, {
    name: "getBannerList",
    method: "get"
  })
}
