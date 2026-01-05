import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type BannerState = {
  list: Response.BannerList
}

export const useBannerStore = defineStore("bannerStore", () => {
  const bannerState = reactive<BannerState>({
    list: []
  })

  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list
  }

  return { bannerState, setStoreBannerList }
})
