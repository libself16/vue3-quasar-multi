import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const giftsList = () => {
  return requestApi<null, Response.GiftList>("/v1/player/gifts/list", null, {
    name: "getGiftsList",
    method: "get",
    needToken: true
  })
}

export const claimGift = (data: Request.ClaimGiftData) => {
  return requestApi<Request.ClaimGiftData, object>("/v1/player/gifts/deposit", data, {
    name: "claimGift",
    method: "post",
    needToken: true
  })
}
