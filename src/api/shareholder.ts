import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

// 取得我的報表
export const getMyReport = (params: Request.MyReport) => {
  return requestApi<Request.MyReport, Response.MyReport>("/v1/player/shareholders/performance", params, {
    name: "getMyReport",
    method: "get"
  })
}

// 取得我的報表結算
export const getMyReportSummary = (params: Request.MyReport) => {
  return requestApi<Request.MyReport, Response.MyReportSummary>("/v1/player/shareholders/performance/summary", params, {
    name: "getMyReport",
    method: "get"
  })
}

// 取得我的報表 - 明細
export const getMyReportDetail = (entry_id: number, params: Request.MyReportDetail) => {
  return requestApi<Request.MyReportDetail, Response.MyReportDetail>(
    `/v1/player/shareholders/entries/${entry_id}/statement`,
    params,
    {
      name: "getMyReportDetail",
      method: "get"
    }
  )
}

// 取得昨日報表
export const getYesterdayReport = (params: Request.YesterdayReport) => {
  return requestApi<Request.YesterdayReport, Response.YesterdayReport>(
    "/v1/player/shareholders/game/finance/statistics",
    params,
    {
      name: "getYesterdayReport",
      method: "get"
    }
  )
}

// 取得時間區間團隊概覽
export const getTimeRangeTeamOverView = (params: Request.TimeRangeTeamOverView) => {
  return requestApi<Request.TimeRangeTeamOverView, Response.TimeRangeTeamOverview>(
    "/v1/player/shareholders/team/overview/period",
    params,
    {
      name: "getTimeRangeTeamOverView",
      method: "get"
    }
  )
}

// 取得團隊概覽
export const getTeamOverView = (params: Request.TeamOverView) => {
  return requestApi<Request.TeamOverView, Response.TeamOverView>("/v1/player/shareholders/team/overview", params, {
    name: "getTeamOverView",
    method: "get"
  })
}

// 取得團隊概覽
export const getShareholderInfo = () => {
  return requestApi<null, Response.ShareholderInfoList>("/v1/player/shareholders/i18n", null, {
    name: "getShareholderInfo",
    method: "get"
  })
}

// 取得最新一期
export const getLatest = (params: Request.ShareholderLatest) => {
  return requestApi<Request.ShareholderLatest, Response.Latest>("/v1/player/shareholders/latest", params, {
    name: "getShareholderLatest",
    method: "get"
  })
}
