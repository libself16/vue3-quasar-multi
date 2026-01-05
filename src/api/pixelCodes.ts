import { requestApi } from "src/common/utils/request"
import type * as Response from "./response.type"

export const getPixelCodes = () => {
  return requestApi<null, Response.GetPixelCodes>("/platform/v1/player/pixel-codes", null, {
    name: "getPixelCodes",
    method: "get"
  })
}
