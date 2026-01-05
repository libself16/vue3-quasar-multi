import { requestApi } from "src/common/utils/request"
import type * as Response from "./response.type"

export const getPromotionList = () => {
  return requestApi<null, Response.PromotionList>("/v1/player/promotions/list", null, {
    name: "getPromotionList",
    method: "get"
  })
}

export const getPromotionRegister = () => {
  return requestApi<null, Response.PromotionRegisterList>("/v1/player/promotions/register", null, {
    name: "getPromotionRegister",
    method: "get"
  })
}
