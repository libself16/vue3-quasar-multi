import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getDomainList = (params: Request.GetDomainList) => {
  return requestApi<Request.GetDomainList, Response.DomainList>("/v1/player/agent_collab/domains", params, {
    name: "getDomainList",
    method: "get"
  })
}

export const addDomain = (params: Request.AddDomain) => {
  return requestApi<Request.AddDomain, null>("/v1/player/agent_collab/domains", params, {
    name: "addDomain",
    method: "post"
  })
}
