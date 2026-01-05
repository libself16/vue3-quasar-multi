import { useRoute, useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { ref, watchEffect, nextTick } from "vue"
import type * as Request from "src/api/request.type"
import { CMS_OPENING_METHOD } from "src/common/utils/constants"
import { useCommonQueryString } from "src/common/composables/useCommonQueryString"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useTrafficAnalysis } from "src/common/hooks/useTrafficAnalysis"
import { useInitStore } from "src/stores/initStore"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { usePixelCodesTrigger } from "src/common/hooks/usePixelCodesTrigger"

export interface InitializeFunc {
  task?: (() => void | Promise<void>)[]
  loginRouterName?: string
  siteRedirect?: (item: Request.RedirectPayload) => void
  siteQueryString?: () => void
}

export function useInit() {
  const { getGiftsList } = useClaimGift()
  const route = useRoute()
  const router = useRouter()
  const { visitWebsite, updateIsCordova, updateInviteCode } = useEnv()
  const { getAgentSetting } = useLanguage()
  const { getUserInfo, getUserInfo2, getUserWalletList, getLevelsInfo, getUserRemark } = useUserInfo()
  const { initGameTypeList, initAllGameList, getAllProducts } = useGame()
  const { handleLogoList } = useLogo()
  const { handleLoginByToken, reset, handleAccessToken } = useAuth()
  const { handleInviteCodeQueryString, handleTitleQueryString } = useCommonQueryString()
  const { handleTrafficAnalysis } = useTrafficAnalysis()
  const { handleGetPixelCodes } = usePixelCodes()
  usePixelCodesTrigger()
  const initStore = useInitStore()
  const { isReady } = storeToRefs(initStore)
  const { setIsReady } = initStore

  const initPayload = ref<InitializeFunc>()

  async function initialize(item?: InitializeFunc) {
    initPayload.value = item
    const platform_token = route.query.platform_token
    let login_token = route.query.login_token

    // 有platform_token就不要login_token
    if (typeof platform_token === "string" && platform_token) {
      reset()
      await handleAccessToken(platform_token)
      login_token = ""
      const query = { ...router.currentRoute.value.query }
      delete query.platform_token
      delete query.login_token
      router.push({ name: item?.loginRouterName || "home", query })
    }

    if (typeof login_token === "string" && login_token) {
      reset()
      const { status, data } = await handleLoginByToken(login_token)
      if (status && data?.need_change_password === false) {
        const query = { ...router.currentRoute.value.query }
        delete query.login_token
        router.push({ name: item?.loginRouterName || "home", query })
      }
    }

    if (item && item.task && item.task.length) {
      Promise.all(item.task.map((func) => func())).finally(() => setIsReady(true))
      return
    }
    Promise.all([
      visitWebsite(),
      getAgentSetting(),
      initGameTypeList(),
      initAllGameList(),
      getAllProducts(),
      getUserInfo(),
      getLevelsInfo(),
      getUserRemark(),
      getUserWalletList(),
      handleLogoList(),
      getGiftsList(),
      handleGetPixelCodes()
    ]).finally(() => (isReady.value = true))
  }

  watchEffect(async () => {
    if (isReady.value) {
      await nextTick()
      if (initPayload.value?.siteQueryString) {
        initPayload.value.siteQueryString()
      }

      handleTrafficAnalysis()

      await handleTitleQueryString()
      await handleInviteCodeQueryString()
      const isCordova = route.query.isCordova
      const redirect = route.query.redirect
      const query = { ...router.currentRoute.value.query }
      if (typeof isCordova === "string" && isCordova) {
        updateIsCordova(isCordova)

        delete query.isCordova
        router.replace({ query })
      }

      if (typeof redirect === "string" && redirect && initPayload.value?.siteRedirect) {
        delete query.redirect
        initPayload.value.siteRedirect({
          did: redirect,
          opening_method: CMS_OPENING_METHOD.Enums.REDIRECT,
          query: query
        })
      }
    }
  })

  return {
    /** 是否初始化完畢 */
    isReady,

    /** 初始化網站資料 */
    initialize
  }
}
