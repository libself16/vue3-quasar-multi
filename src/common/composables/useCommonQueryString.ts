import { useRoute, useRouter } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { usePageTitle } from "src/common/composables/usePageTitle"

export interface IUseCommonQueryString {
  pup?: boolean
  currency?: string
  lang?: number
  useDialogIframe?: boolean
}

export function useCommonQueryString() {
  const route = useRoute()
  const router = useRouter()
  const { openGame } = useGame()
  const { isLogin } = useAuth()
  const { updateInviteCode } = useEnv()
  const { handleTitleQueryString } = usePageTitle()

  // 各版型自行擴充參數
  async function handleGameQueryString(item?: IUseCommonQueryString) {
    const game_type = route.query.game_type as string
    const product_code = route.query.product_code as string
    const game_code = route.query.game_code as string
    const pup = item?.pup
    const currency = item?.currency
    const lang = item?.lang
    const useDialogIframe = item?.useDialogIframe
    const productCode = parseInt(product_code)

    if (game_type && productCode) {
      openGame(productCode, game_code, game_type, pup, currency, lang, useDialogIframe)

      const query = { ...router.currentRoute.value.query }
      delete query.game_type
      delete query.product_code
      delete query.game_code

      await router.replace({ query })
    }
  }

  async function handleInviteCodeQueryString() {
    const inviteCode = route.query.inviteCode
    const query = { ...router.currentRoute.value.query }
    if (typeof inviteCode === "string" && inviteCode) {
      if (!isLogin.value) {
        updateInviteCode(inviteCode)
      }
      delete query.inviteCode
      await router.replace({ query })
    }
  }

  return {
    /** 處理開啟遊戲 query string */
    handleGameQueryString,

    /** 處理邀請碼 query string */
    handleInviteCodeQueryString,

    /** 處理頁面標題 query string */
    handleTitleQueryString
  }
}
