import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

//#region 投注限制
export const getPreferencesExclusion = () => {
  return requestApi<null, Response.GetPreferencesExclusion>("/v1/player/center/preferences/exclusion", null, {
    name: "getPreferencesExclusion",
    method: "get"
  })
}

export const putPreferencesExclusion = (params: Request.PutPreferencesExclusion) => {
  return requestApi<Request.PutPreferencesExclusion, null>("/v1/player/center/preferences/exclusion", params, {
    name: "putPreferencesExclusion",
    method: "put"
  })
}
//#endregion

//#region 投注限額
export const getBetLimitListStatus = (payload: Request.GetBetLimitListStatus) => {
  return requestApi<Request.GetBetLimitListStatus, Response.GetBetLimitList>(
    "/v1/player/center/member_self_bet_restriction",
    payload,
    {
      name: "getBetLimitListStatus",
      method: "get"
    }
  )
}

export const getBetLimitList = (payload: Request.GetBetLimitList) => {
  return requestApi<Request.GetBetLimitList, Response.BaseList<Response.GetBetLimitList>>(
    "/v1/player/center/member_self_bet_restriction/list",
    payload,
    {
      name: "getBetLimitList",
      method: "get"
    }
  )
}

export const getBetLimitItem = (payload: Request.GetBetLimitItem) => {
  return requestApi<Request.GetBetLimitItem, Response.GetBetLimitItem>(
    `/v1/player/center/member_self_bet_restriction/${payload.id}`,
    payload,
    {
      name: "getBetLimitItem",
      method: "get"
    }
  )
}

export const postBetLimitItem = (params: Request.PostBetLimitItem) => {
  return requestApi<Request.PostBetLimitItem, null>("/v1/player/center/member_self_bet_restriction", params, {
    name: "postBetLimitItem",
    method: "post"
  })
}

export const putBetLimitItem = (params: Request.PutBetLimitItem) => {
  return requestApi<Request.PutBetLimitItem, null>("/v1/player/center/member_self_bet_restriction", params, {
    name: "putBetLimitItem",
    method: "put"
  })
}

// export const putPreferencesExclusion = (params: Request.PutPreferencesExclusion) => {
//   return requestApi<Request.PutPreferencesExclusion, null>("/v1/player/center/preferences/exclusion", params, {
//     name: "putPreferencesExclusion",
//     method: "put"
//   })
// }
//#endregion
