import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type PixelCodeState = {
  list: Response.PixelCode[]
}

export const usePixelCodeStore = defineStore("pixelCodeStore", () => {
  const pixelCodeState = reactive<PixelCodeState>({
    list: []
  })

  function setStorePixelCodeList(list: Response.PixelCode[]) {
    pixelCodeState.list = list
  }

  return { pixelCodeState, setStorePixelCodeList }
})
