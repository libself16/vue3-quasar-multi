import { requestApi } from "src/common/utils/request"
import * as Response from "./response.type"

export const getAnnouncementList = () => {
  return requestApi<null, Response.AnnouncementList>("/v1/player/announcement/list", null, {
    name: "getAnnouncementList",
    method: "get"
  })
}
