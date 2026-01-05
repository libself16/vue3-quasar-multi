import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getChatroomMemberSearch = (params: Request.GetMemberSearch) => {
  return requestApi<Request.GetMemberSearch, Response.GetMemberSearch>(
    "/platform/v1/player/chatroom/member/search",
    params,
    {
      name: "getChatroomMemberSearch",
      method: "get"
    }
  )
}

export const getChatroomRecent = (params: Request.GetChatroomCecent) => {
  return requestApi<Request.GetChatroomCecent, Response.GetChatroomCecent>(
    "/platform/v1/player/chatroom/recent",
    params,
    {
      name: "getChatroomCecent",
      method: "get"
    }
  )
}

export const getChatroomRelation = () => {
  return requestApi<null, Response.GetChatroomRelation>("/platform/v1/player/chatroom/relation", null, {
    name: "getChatroomRelation",
    method: "get"
  })
}

export const getChatroomInfo = (params: Request.GetChatroomInfo) => {
  return requestApi<Request.GetChatroomInfo, Response.GetChatroomInfo>("/platform/v1/player/chatroom/info", params, {
    name: "getChatroomInfo",
    method: "get"
  })
}

export const getChatroomMessage = (params: Request.GetChatroomMessage) => {
  return requestApi<Request.GetChatroomMessage, Response.GetChatroomMessage>(
    "/platform/v1/player/chatroom/message",
    params,
    {
      name: "getChatroomMessage",
      method: "get"
    }
  )
}

export const deleteChatroomRelation = (params: Request.DeleteChatroomRelation) => {
  return requestApi<Request.DeleteChatroomRelation, null>(`/platform/v1/player/chatroom/relation`, params, {
    name: "deleteChatroomRelation",
    method: "delete"
  })
}

export const putChatroomMemberNickname = (params: Request.PutChatroomMemberNickname) => {
  return requestApi<Request.PutChatroomMemberNickname, null>(`/platform/v1/player/chatroom/member/nickname`, params, {
    name: "putChatroomMemberNickname",
    method: "put"
  })
}

export const postChatroomMessage = (params: Request.PostChatroomMessage) => {
  return requestApi<Request.PostChatroomMessage, Response.PostChatroomMessage>(
    "/platform/v1/player/chatroom/message",
    params,
    {
      name: "postChatroomMessage",
      method: "post"
    }
  )
}

export const postChatroomImage = (params: Request.PostChatroomImage) => {
  const formData = new FormData()
  formData.append("target_id", params.target_id.toString())
  params.images.forEach((file) => formData.append("images", file))
  return requestApi<FormData, Response.PostChatroomMessage[]>("/platform/v1/player/chatroom/message/image", formData, {
    name: "postChatroomImage",
    method: "post",
    useFormData: true
  })
}
