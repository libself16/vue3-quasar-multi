import { requestApi, requestApiFullResponse } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"

export const getCmsList = (params: Request.GetCmsList) => {
  return requestApi<Request.GetCmsList, Response.CmsList>("/v1/player/cms/detail/list", params, {
    name: "getCmsList",
    method: "get"
  })
}

export const getCmsListFull = (params: Request.GetCmsList): Promise<ApiResponse<Response.CmsList>> => {
  return requestApiFullResponse<Request.GetCmsList, Response.CmsList>("/v1/player/cms/detail/list", params, {
    name: "getCmsList",
    method: "get"
  })
}

export const getCmsDetail = (id: number) => {
  return requestApi<null, Response.CmsItem>(`/v1/player/cms/detail/${id}`, null, {
    name: "getCmsDetail",
    method: "get"
  })
}


export const getCmsDetailFull = (id: number): Promise<ApiResponse<Response.CmsItem>> => {
  return requestApiFullResponse<null, Response.CmsItem>(`/v1/player/cms/detail/${id}`, null, {
    name: "getCmsDetail",
    method: "get"
  })
}

export const getFloatIcon = (type: string) => {
  return requestApi<null, Response.CmsFlotIcon>(`/platform/v1/player/cms/features/floating-icon/${type}`, null, {
    name: "getFloatIcon",
    method: "get"
  })
}
