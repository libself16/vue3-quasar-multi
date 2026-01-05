import { storeToRefs } from "pinia"
import { giftsList, claimGift } from "src/api/gift"
import { useApi } from "src/common/hooks/useApi"
import { useGiftStore } from "src/stores/giftStore"
import * as Request from "src/api/request.type"
import { useAuth } from "src/common/hooks/useAuth"

export function useClaimGift() {
  const giftStore = useGiftStore()
  const { giftState } = storeToRefs(giftStore)
  const { setStoreGiftList } = giftStore

  const { isLogin } = useAuth()
  async function getGiftsList() {
    if (!isLogin.value) return
    const { status, data } = await useApi(giftsList)
    if (status) {
      setStoreGiftList(data)
    }
  }

  async function ClaimGift(giftData: Request.ClaimGiftData): Promise<boolean> {
    const { status } = await useApi(claimGift, giftData)
    if (status) {
      await getGiftsList()
    }

    return status
  }

  return {
    /** 禮物列表 */
    giftState,

    /** 取得禮物列表 */
    getGiftsList,

    /** 領取禮物 */
    ClaimGift
  }
}
