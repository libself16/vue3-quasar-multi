import { ref, computed, reactive } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { getPromotionList } from "src/api/promotion"
import { usePromotionStore } from "src/stores/promotionStore"
import { useEnv } from "src/common/hooks/useEnv"
import type * as Response from "src/api/response.type"
import { PROMOTION_TYPE } from "src/common/utils/constants"

export type TypeItem = {
  name: string
  value: number
}

type Dialog = {
  show: boolean
  showDialog: (details: Response.Promotion) => void
  closeDialog: () => void
  detail: Response.PromotionDetail | null
}

export function usePromotion() {
  const { getLanguage } = useLanguage()
  const { promotionState, setStorePromotionList } = usePromotionStore()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()
  const nowLang = computed(() => getLanguage())

  const promotionList = computed<Response.Promotion[]>(() => {
    return promotionState.list
      .map((promotion: Response.Promotion) => {
        const promotionDetail = promotion.details?.find(
          (detail: Response.PromotionDetail) => detail.lang === nowLang.value
        )
        if (promotionDetail) {
          return {
            ...promotion,
            details: [
              {
                ...promotionDetail,
                image: `${VITE_APP_DYNAMIC_RESOURCE_URL}/${promotionDetail.image}?v=${promotion.updated_time}`,
                content: promotionDetail.content.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
              }
            ]
          }
        }
        return promotion
      })
      .filter((promotion: Response.Promotion) => promotion.details.length > 0)
      .filter((promotion: Response.Promotion) =>
        activeType.value === PROMOTION_TYPE.Enums.All ? true : promotion.type === activeType.value
      )
  })

  const activeType = ref(PROMOTION_TYPE.Enums.All)
  const typeList = ref<TypeItem[]>([
    {
      value: PROMOTION_TYPE.Enums.All,
      name: "common.btn.all"
    },
    {
      value: PROMOTION_TYPE.Enums.DepositBonus,
      name: "promotion.deposit_bonus"
    },
    {
      value: PROMOTION_TYPE.Enums.RegisterBonus,
      name: "promotion.register_bonus"
    },
    {
      value: PROMOTION_TYPE.Enums.BetBonus,
      name: "promotion.bet_bonus"
    },
    {
      value: PROMOTION_TYPE.Enums.CustomizeBonus,
      name: "promotion.customize_bonus"
    }
  ])

  function updateActiveType(item: TypeItem) {
    activeType.value = item.value
  }

  async function handlePromotionList() {
    const { status, data } = await useApi(getPromotionList)
    if (status && data.length) {
      setStorePromotionList(data)
      return
    }

    setStorePromotionList([])
  }

  const promotionDialog: Dialog = reactive<Dialog>({
    show: false,
    showDialog: (details: Response.Promotion) => {
      if (details && details.details && details.details.length) {
        const langItem = details.details.find((item) => item.lang === nowLang.value)

        if (!!langItem) {
          promotionDialog.detail = langItem
          promotionDialog.show = true
          return
        }

        promotionDialog.detail = null
        promotionDialog.show = false
        console.warn("No data matching the current language was found in the detailed description.")
      }
    },
    closeDialog: () => {
      promotionDialog.show = false
      promotionDialog.detail = null
    },
    detail: null
  })

  return {
    activeType,
    updateActiveType,
    typeList,
    promotionList,
    handlePromotionList,
    promotionDialog
  }
}
