import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"

export type GameTypeState = {
  list: Response.GameTypeList
  map: Response.GameTypeMap
  using: GAME_TYPE.Enums
}

export const useGameTypeStore = defineStore("gameTypeStore", {
  state: () => {
    return {
      gameTypeState: {
        list: [],
        map: {},
        using: GAME_TYPE.Enums.SLOT
      } as GameTypeState
    }
  },
  actions: {
    setGameTypeList(list: Response.GameTypeList) {
      this.gameTypeState.list = list
    },
    setGameTypeMap(map: Response.GameTypeMap) {
      this.gameTypeState.map = map
    },
    setGameTypeUsing(gameTypeId: GAME_TYPE.Enums) {
      this.gameTypeState.using = gameTypeId
    }
  },
  getters: {
    storedGameTypeState: (state) => state.gameTypeState
  },
  persist: false
})
