import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { reactive } from "vue"

type LogoState = {
  list: Response.LogoList
  map: {
    [key: number]: Response.LogoItem
  }
}

export const useLogoStore = defineStore("logoStore", () => {
  const logoState = reactive<LogoState>({
    list: [],
    map: {}
  })

  function setStoreLogoList(list: Response.LogoList) {
    list.forEach((e) => {
      logoState.list.push(e)
      logoState.map[e.logo_type] = e
    })
  }

  return { logoState, setStoreLogoList }
})
