import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const mailList = (params: Request.MailList) => {
  return requestApi<Request.MailList, Response.BaseList<Response.MailList>>("/v1/player/center/mail", params, {
    name: "getMailList",
    method: "get",
    needToken: true
  })
}

export const mailDetail = (id: number) => {
  return requestApi<null, Response.MailDetail>(`/v1/player/center/mail/${id}`, null, {
    name: "getMailDetail",
    method: "get",
    needToken: true
  })
}
