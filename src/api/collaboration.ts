import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getCollaborationVisibility = () => {
  return requestApi<null, number>("/v1/player/agent_collab/visibility", null, {
    name: "getCollaborationVisibility",
    method: "get"
  })
}

export const getCollaborationStatistics = (params: Request.GetCollaborationStatistics) => {
  return requestApi<Request.GetCollaborationStatistics, Response.CollaborationStatistics>(
    "/v1/player/agent_collab/statistics",
    params,
    {
      name: "getCollaborationStatistics",
      method: "get"
    }
  )
}

export const getInvitations = (params: Request.GetInvitationList) => {
  return requestApi<Request.GetInvitationList, Response.InvitationList>("/v1/player/agent_collab/invitations", params, {
    name: "getInvitations",
    method: "get"
  })
}

export const getRebates = (params: Request.GetRebates) => {
  return requestApi<Request.GetRebates, Response.RebateList>("/v1/player/agent_collab/rebates", params, {
    name: "getRebates",
    method: "get"
  })
}
