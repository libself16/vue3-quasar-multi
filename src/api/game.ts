import { requestApi } from "src/common/utils/request"
import type * as Request from "./request.type"
import type * as Response from "./response.type"

export const getGameTypeList = () => {
  return requestApi<null, Response.GameTypeList>("/v1/player/game/game_type/list", null, {
    name: "getGameTypeList",
    method: "get"
  })
}
export const getProductList = (params: Request.ProductList) => {
  return requestApi<Request.ProductList, Response.ProductList>("/platform/v1/player/product", params, {
    name: "getProductList",
    method: "get"
  })
}
export const getAllProductList = () => {
  return requestApi<null, Response.ProductList>("/v1/player/game/agent_product/list", null, {
    name: "getAllProductList",
    method: "get"
  })
}
export const getGameList = (params: Request.GameList) => {
  return requestApi<Request.GameList, Response.GameList>("/platform/v1/player/product/game", params, {
    name: "getGameList",
    method: "get"
  })
}
export const getAllGameList = () => {
  return requestApi<null, Response.AllGameList>("/v1/player/game/all", null, {
    name: "getAllGameList",
    method: "get"
  })
}
export const launchGame = (params: Request.LaunchGame) => {
  return requestApi<Request.LaunchGame, Response.LaunchGame>("/v1/player/game/launch_game", params, {
    name: "launchGame",
    method: "post"
  })
}

// 未登入時，允許拿特規的幣別，讓 Saba 專區能正常 call launchGuestGame API
export const getProductAvailableCurrency = (params: Request.ProductAvailableCurrency) => {
  return requestApi<Request.ProductAvailableCurrency, Response.ProductAvailableCurrency>(
    "/v1/player/game/product_available_currency",
    params,
    {
      name: "getProductAvailableCurrency",
      method: "get"
    }
  )
}

// 未登入時也能查看遊戲(Saba 專區特規)
export const launchGuestGame = (params: Request.LaunchGame) => {
  return requestApi<Request.LaunchGame, Response.LaunchGame>("/v1/player/game/guest/launch_game", params, {
    name: "launchGuestGame",
    method: "post"
  })
}

export const getFavoriteGameList = () => {
  return requestApi<null, Response.FavoriteList>("/v1/player/game/favorite/list", null, {
    name: "getFavoriteGameList",
    method: "get"
  })
}

export const favoriteGame = (params: Request.FavoriteGame) => {
  return requestApi<Request.FavoriteGame, null>("/v1/player/game/favorite", params, {
    name: "favoriteGame",
    method: "post"
  })
}

export const deleteFavoriteGame = (params: Request.FavoriteGame) => {
  return requestApi<{ game_id: number }, null>(`/v1/player/game/favorite/${params.game_id}`, params, {
    name: "deleteFavoriteGame",
    method: "delete"
  })
}
