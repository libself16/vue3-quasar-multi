import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

// 當期總計
export const getReferralRebateSummary = (params: Request.getReferralRebateSummary) => {
  return requestApi<Request.getReferralRebateSummary, Response.ReferralRebateSummary>(
    "/v1/player/referral_rebate/events/current/summary",
    params,
    {
      name: "getReferralRebateSummary",
      method: "get"
    }
  )
}

// 當期反佣結算明細
export const getReferralRebateStatement = (params: Request.getReferralRebateStatements) => {
  return requestApi<Request.getReferralRebateStatements, Response.ReferralRebateStatementsList>(
    "/v1/player/referral_rebate/events/current/statement",
    params,
    {
      name: "getReferralRebateStatement",
      method: "get"
    }
  )
}

// 反佣明細
export const getReferralRebateEvents = (params: Request.getReferralRebateEvents) => {
  return requestApi<Request.getReferralRebateEvents, Response.ReferralRebateEventsList>(
    "/v1/player/referral_rebate/events",
    params,
    {
      name: "getReferralRebateEvents",
      method: "get"
    }
  )
}

// 反佣結算明細
export const getReferralRebateEventsStatements = (params: Request.getReferralRebateEventsStatements) => {
  return requestApi<Request.getReferralRebateEventsStatements, Response.ReferralRebateStatementsList>(
    `/v1/player/referral_rebate/events/${params.event_id}/statement`,
    params,
    {
      name: "getReferralRebateEventsStatements",
      method: "get"
    }
  )
}
