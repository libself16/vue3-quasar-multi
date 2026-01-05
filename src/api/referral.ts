import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getReferralInfo = () => {
  return requestApi<null, Response.ReferralInfo>("/v1/player/commission/me/referral/info", null, {
    name: "getReferralInfo",
    method: "get"
  })
}

export const getReferralSummary = (currency_id?: string) => {
  return requestApi<{ currency_id?: string }, Response.ReferralSummary>(
    "/v1/player/commission/summary",
    { currency_id },
    {
      name: "getReferralSummary",
      method: "get"
    }
  )
}

export const getReferralSetting = (params: Request.GetReferralSetting) => {
  return requestApi<Request.GetReferralSetting, Response.ReferralSetting>("/v1/player/commission/settings", params, {
    name: "getReferralSetting",
    method: "get"
  })
}

export const getReferralSettingDetail = (member_id: number) => {
  return requestApi<null, Response.ReferralSettingDetail>(`/v1/player/commission/settings/${member_id}`, null, {
    name: "getReferralSettingDetail",
    method: "get"
  })
}

export const putReferralSetting = (params: Request.UpdateReferralSetting) => {
  return requestApi<Request.UpdateReferralSetting, null>(`/v1/player/commission/settings/${params.member_id}`, params, {
    name: "putReferralSetting",
    method: "put"
  })
}

export const getReferralStatementList = (params: Request.GetReferralStatementList) => {
  return requestApi<Request.GetReferralStatementList, Response.ReferralStatementList>(
    "/v1/player/commission/statements",
    params,
    {
      name: "getReferralStatementList",
      method: "get"
    }
  )
}

export const getReferralStatementDetail = (statement_id: number, params?: Request.GetReferralStatementDetail) => {
  return requestApi<Request.GetReferralStatementDetail, Response.ReferralStatementDetail>(
    `/v1/player/commission/statements/${statement_id}/details`,
    params ?? {},
    {
      name: "getReferralStatementDetail",
      method: "get"
    }
  )
}

export const getReferralStatementDetailTotal = (statement_id: number) => {
  return requestApi<null, Response.ReferralStatementDetailTotal>(
    `/v1/player/commission/statements/${statement_id}/details/total`,
    null,
    {
      name: "getReferralStatementDetailTotal",
      method: "get"
    }
  )
}

export const getReferralSignupOverview = () => {
  return requestApi<null, Response.ReferralSignupOverview>(`/v1/player/referral_signup/overview`, null, {
    name: "getReferralSignupOverview",
    method: "get"
  })
}
