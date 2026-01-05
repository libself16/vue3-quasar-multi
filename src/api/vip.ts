import { requestApi } from "src/common/utils/request"
import type * as Response from "./response.type"

export const getVipList = () => {
  return requestApi<null, Response.MemberLevelist>("/v1/player/levels", null, {
    name: "getVipList",
    method: "get"
  })
}

export const getUserStatistics = (currency_id: number) => {
  return requestApi<null, Response.UserStatistics>(`/v1/player/center/statistics/${currency_id}`, null, {
    name: "getUserStatistics",
    method: "get"
  })
}

export const getMultiUserStatistics = () => {
  return requestApi<null, Response.BaseList<Response.UserMultiStatistics>>("/v1/player/center/statistics", null, {
    name: "getMultiUserStatistics",
    method: "get"
  })
}
