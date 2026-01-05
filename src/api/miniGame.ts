import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

// 未登入開啟mini game
export const getMiniGameAuthKey = () => {
  return requestApi<null, Response.GetMiniGameAuthKey>("/platform/v1/player/gs1/mini-game/auth-key", null, {
    name: "getMiniGameAuthKey",
    method: "get"
  })
}

// 已登入開啟mini game
export const postLaunchMiniGame = (params: Request.PostLaunchMiniGame) => {
  return requestApi<Request.PostLaunchMiniGame, Response.PostLaunchMiniGame>(
    "/platform/v1/player/gs1/mini-game/launch",
    params,
    {
      name: "postLaunchMiniGame",
      method: "post"
    }
  )
}
