import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const moneyHistoryList = (params: Request.MoneyHistoryList) => {
  return requestApi<Request.MoneyHistoryList, Response.BaseList<Response.MoneyHistoryList>>(
    "/v1/player/center/money/history",
    params,
    {
      name: "getMoneyHistoryList",
      method: "get"
    }
  )
}

export const moneyHistoryTotal = (params: Request.MoneyHistoryTotal) => {
  return requestApi<Request.MoneyHistoryTotal, Response.MoneyHistoryTotal>(
    "/v1/player/center/money/history/total",
    params,
    {
      name: "getMoneyHistoryTotal",
      method: "get"
    }
  )
}

export const moneyPendingList = (params: Request.MoneyPending) => {
  return requestApi<Request.MoneyPending, Response.BaseList<Response.MoneyPendingList>>(
    "/v1/player/center/money/pending",
    params,
    {
      name: "getPendingHistoryList",
      method: "get"
    }
  )
}

export const moneyPendingCancel = (row: Request.MoneyPendingCancel) => {
  const params: Request.MoneyPendingCancel = {
    order_type: row.order_type,
    trans_code: row.trans_code
  }

  return requestApi<Request.MoneyPendingCancel, null>(`/v1/player/center/money/pending/cancel`, params, {
    name: "moneyPendingCancel",
    method: "post"
  })
}
