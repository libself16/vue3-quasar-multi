import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getReferralWheelStatus = () => {
  return requestApi<null, boolean>(`/v1/player/referral_wheel/status`, null, {
    name: "getReferralWheelStatus",
    method: "get"
  })
}

export const getReferralWheelCurrent = () => {
  return requestApi<null, Response.GetReferralWheelCurrent>(`/v1/player/referral_wheel/current`, null, {
    name: "getReferralWheelCurrent",
    method: "get"
  })
}

export const getReferralWheelMemberInfo = (params: Request.GetReferralWheelMemberInfo) => {
  return requestApi<Request.GetReferralWheelMemberInfo, Response.GetReferralWheelMemberInfo>(
    `/v1/player/referral_wheel/member/info`,
    params,
    {
      name: "getReferralWheelMemberInfo",
      method: "get"
    }
  )
}

export const getReferralWheelPrize = () => {
  return requestApi<null, Response.ReferralWheelPrizeList>(`/v1/player/referral_wheel/prize`, null, {
    name: "getReferralWheelPrize",
    method: "get"
  })
}

export const postReferralWheelSpin = (params: Request.PostReferralWheelSpin) => {
  return requestApi<Request.PostReferralWheelSpin, Response.PostReferralWheelSpin>(
    "/v1/player/referral_wheel/spin",
    params,
    {
      name: "postReferralWheelSpin",
      method: "post"
    }
  )
}

export const getReferralWheelWinners = () => {
  return requestApi<null, Response.GetReferralWheelWinners>(`/v1/player/referral_wheel/winners`, null, {
    name: "getReferralWheelWinners",
    method: "get"
  })
}

export const getReferralWheelMemberPrizes = (params: Request.GetReferralWheelMemberPrizes) => {
  return requestApi<Request.GetReferralWheelMemberPrizes, Response.GetReferralWheelMemberPrizes>(
    `/v1/player/referral_wheel/member/prizes`,
    params,
    {
      name: "getReferralWheelMemberPrizes",
      method: "get"
    }
  )
}
