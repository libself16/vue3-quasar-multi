import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { reactive } from "vue"
import { GAME_TAG_TYPE } from "src/common/utils/constants"

type GameState = {
  list: Response.GameList
  allProviderGameList: Response.GameList
  allGameList: Response.AllGameList
  favoriteList: Response.FavoriteList
  favoriteMap: Response.FavoriteMap
  gamesMap: {
    [key in GAME_TAG_TYPE.Enums]: Response.GameList
  }
}

export const useGameStore = defineStore("gameStore", () => {
  const gameState = reactive<GameState>({
    list: [],
    allProviderGameList: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      POKER: [],
      POPULAR: [],
      SLOT: []
    },
    favoriteList: [],
    favoriteMap: {},
    gamesMap: {
      [GAME_TAG_TYPE.Enums.All]: [],
      [GAME_TAG_TYPE.Enums.New]: [],
      [GAME_TAG_TYPE.Enums.Hot]: [],
      [GAME_TAG_TYPE.Enums.Favorites]: []
    }
  })

  function initAllGameList() {
    gameState.allGameList.FISHING = []
    gameState.allGameList.LIVE_CASINO = []
    gameState.allGameList.POKER = []
    gameState.allGameList.POPULAR = []
    gameState.allGameList.SLOT = []
  }

  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO
    gameState.allGameList.POKER = data.POKER
    gameState.allGameList.POPULAR = data.POPULAR
    gameState.allGameList.SLOT = data.SLOT
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data
    gameState.favoriteMap = {}
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true
    })
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0
    gameState.favoriteMap = {}
  }

  return { gameState, initAllGameList, updateAllGameList, updateFavoriteList, removeFavoriteList }
})
