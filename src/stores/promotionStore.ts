import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type promotionState = {
  list: Response.PromotionList
  registerList: Response.PromotionRegisterList
  isFinishSpinRegisterRoulette: boolean
}

export const usePromotionStore = defineStore("promotionStore", () => {
  const promotionState = reactive<promotionState>({
    list: [],
    registerList: [],
    isFinishSpinRegisterRoulette: false
  })

  function setStorePromotionList(list: Response.PromotionList) {
    promotionState.list = list
  }

  function setPromotionRegisterList(list: Response.PromotionRegisterList) {
    promotionState.registerList = list
  }

  function finishSpinRegisterRoulette() {
    promotionState.isFinishSpinRegisterRoulette = true
  }

  return {
    /** 優惠 state */
    promotionState,

    /** 儲存優惠清單 */
    setStorePromotionList,

    /** 儲存註冊優惠清單 */
    setPromotionRegisterList,

    /** 結束註冊優惠轉盤 */
    finishSpinRegisterRoulette
  }
})
