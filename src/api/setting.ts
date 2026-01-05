import { requestApi } from "src/common/utils/request"
import * as Response from "./response.type"

export const getSetting = () => {
  return requestApi<null, Response.ISetting>("/v1/player/settings", null, {
    name: "getSetting",
    method: "get"
  })
}

export const getSettingWithAgentCode = (code: string) => {
  return requestApi<null, Response.ISetting>(`/v1/player/settings/${code}`, null, {
    name: "getSettingWithAgentCode",
    method: "get"
  })
}
