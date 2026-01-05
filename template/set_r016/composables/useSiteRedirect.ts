import type * as Request from "src/api/request.type"
import { Events } from "src/boot/eventbus/types"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_OPENING_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useRouter } from "vue-router"
import { MENU } from "../utils/constants"

export function useSiteRedirect() {
  const eventbus = injectStrict(EventBusKey)
  const router = useRouter()
  const { isLogin } = useAuth()

  const handleSiteRedirect = (item: Request.RedirectPayload) => {
    const routerName = MENU.RouterNameMapping[item.did]

    switch (item.did) {
      case "member_level":
      case "basic_information":
      case "withdrawal_setting":
      case "change_password":
      case "site_message":
      case "history":
      case "deposit":
      case "withdrawal":
      case "processing_order":
      case "referral_rebate":
      case "kyc":
      case "chat_room":
        if (!isLogin.value) {
          router.push({ name: "Login", query: item.query })
          return
        }
        break
      case "register":
        if (!isLogin.value) {
          router.push({ name: "Register", query: item.query })
          return
        }
        break
      default:
        break
    }
    if (item.opening_method === CMS_OPENING_METHOD.Enums.NEW_TAB) {
      const routeData = router.resolve({
        name: routerName,
        query: item.query
      })
      window.open(routeData.href, "_blank")
      return
    }

    if (routerName === "home") return router.push({ name: "HomePage" })

    router.push({ name: routerName, query: item.query })
  }

  return {
    handleSiteRedirect
  }
}
