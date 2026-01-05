import { computed } from "vue"
import { storeToRefs } from "pinia"
import { usePromotionStore } from "src/stores/promotionStore"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useApi } from "src/common/hooks/useApi"
import { getPromotionRegister } from "src/api/promotion"

export function usePromotionRegister() {
  const promotionStore = usePromotionStore()
  const { setPromotionRegisterList, finishSpinRegisterRoulette } = promotionStore
  const { promotionState } = storeToRefs(promotionStore)
  const { isLogin } = useAuth()
  const { envData } = useEnv()
  const { open_register_promotion } = envData()

  const promotionRegisterList = computed(() => {
    if (promotionState.value.registerList.length) {
      return promotionState.value.registerList
    }

    return []
  })

  const firstRegisterPromotion = computed(() => {
    if (promotionState.value.registerList.length) {
      return promotionState.value.registerList[0]
    }

    return null
  })

  const showPromotionRegisterDialog = computed(() => {
    if (!isLogin.value && promotionRegisterList.value.length && open_register_promotion) {
      return true
    }
    return false
  })

  async function handlePromotionRegisterList() {
    if (!open_register_promotion) return

    const { status, data } = await useApi(getPromotionRegister)
    if (status && data.length) {
      setPromotionRegisterList(data)
    }
  }

  return {
    /** 優惠 store */
    promotionState,

    /** 註冊優惠清單 */
    promotionRegisterList,

    /** 第一筆註冊優惠 */
    firstRegisterPromotion,

    /** 是否顯示註冊轉盤 */
    showPromotionRegisterDialog,

    /** 取得註冊優惠清單列表 */
    handlePromotionRegisterList,

    /** 結束註冊優惠轉盤 */
    finishSpinRegisterRoulette
  }
}
