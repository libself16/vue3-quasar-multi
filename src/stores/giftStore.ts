import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type giftState = {
  list: Response.GiftList
}

export const useGiftStore = defineStore("giftStore", () => {
  const giftState = reactive<giftState>({
    list: []
  })

  function setStoreGiftList(list: Response.GiftList) {
    giftState.list = list.map((item) => ({
      ...item,
      options: item.options.filter((option) => Number(option.amount) > 0)
    }))
  }

  return { giftState, setStoreGiftList }
})
