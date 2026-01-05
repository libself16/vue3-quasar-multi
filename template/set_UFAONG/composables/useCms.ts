import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed } from "vue"
import { useRouter } from "vue-router"
import { MENU } from "../utils/constants"

export function useEntranceHandler() {
  const eventbus = injectStrict(EventBusKey)
  const { handleEntrance } = useCms()
  const router = useRouter()
  const { isLogin } = useAuth()

  const getRouterInfo = computed(() => (key: string) => {
    return { name: MENU.RouterNameMapping[key] }
  })

  const handleEntranceClick = (entrance: Response.CmsEntranceItem) => {
    if (entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE) {
      const routerInfo = getRouterInfo.value(entrance.payload.did as keyof typeof MENU.RouterNameMapping)

      switch (entrance.payload.did) {
        case "basic_information":
        case "withdrawal_setting":
        case "change_password":
        case "site_message":
        case "history":
        case "deposit":
        case "withdrawal":
        case "processing_order":
        case "affiliate_detail":
        case "strategy_detail":
        case "member_strategy":
        case "agent_collaboration_strategy":
        case "kyc":
        case "vip":
          if (!isLogin.value) return router.push({ name: "Login" })
          break
        case "register":
          if (isLogin.value) return
          return router.push({ name: "Register" })
        case "forget_password":
          if (isLogin.value) return
          return router.push({ name: "ForgotPass" })
        default:
          break
      }
      if (entrance.payload.opening_method === 0) {
        const routeData = router.resolve({
          name: MENU.RouterNameMapping[entrance.payload.did as keyof typeof MENU.RouterNameMapping]
        })
        window.open(routeData.href, "_blank")
        return
      } else {
        return router.push(routerInfo)
      }
    }

    // 由於此類版面沒有產品大廳, 統一跳轉至首頁
    handleEntrance({
      entrance,
      isLoginPup: false,
      productLobbyRoute: {
        name: "Home",
        params: {}
      },
      cmsHomeRoute: {
        name: "CmsHome",
        params: { cmsId: entrance.payload.link_id }
      },
      openingMethod: entrance.payload.opening_method
    })
  }

  return {
    handleEntranceClick
  }
}
