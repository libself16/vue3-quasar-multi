import { useAuth } from "src/common/hooks/useAuth"
import { CMS_OPENING_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"
import type * as Request from "src/api/request.type"
import { useRouter } from "vue-router"
import { MENU } from "../utils/constants"

export function useSiteRedirect() {
  const eventbus = injectStrict(EventBusKey)
  const router = useRouter()
  const { isLogin, isMayaLogin } = useAuth()

  const handleEventShow = (item: Request.RedirectPayload, eventName: keyof Events) => {
    router.replace({ query: item.query })
    setTimeout(() => {
      eventbus.emit(eventName, true)
    }, 0)
  }

  const handleSiteRedirect = (item: Request.RedirectPayload) => {
    const routerName = MENU.RouterNameMapping[item.did]
    switch (item.did) {
      /*
        * 僅限存取款
        1. 未登入狀態，彈出登入視窗
        2. 若為 Maya 登入，彈出存款視窗
        3. 一般登入，跳轉至存款頁面
      */
      case "deposit":
        if (!isLogin.value) return eventbus.emit("openLogin", true)
        if (isMayaLogin.value) {
          eventbus.emit("openDepositDialog", true)
          return
        }
        break
      case "withdrawal":
        if (!isLogin.value) return eventbus.emit("openLogin", true)
        if (isMayaLogin.value) {
          eventbus.emit("openWithdrawalDialog", true)
          return
        }
        break
      case "basic_information":
      case "withdrawal_setting":
      case "change_password":
      case "site_message":
      case "vip":
      case "history":
      case "member_level":
      case "processing_order":
      case "kyc":
        if (!isLogin.value) {
          handleEventShow(item, "openLogin")
          return
        }
        break
      case "register":
        if (!isLogin.value) {
          handleEventShow(item, "openRegister")
          return
        }
        break
      case "forget_password":
        // 忘記密碼彈窗只在未登入狀態下顯示
        if (!isLogin.value) {
          handleEventShow(item, "openForgotPassword")
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
    router.push({ name: routerName, query: item.query })
  }

  const handleRedirectDeposit = () => {
    if (isMayaLogin.value) {
      eventbus.emit("openDepositDialog", true)
    } else {
      router.push({ name: "MemberDeposit" })
    }
  }

  const handleRedirectWithdrawal = () => {
    if (isMayaLogin.value) {
      eventbus.emit("openWithdrawalDialog", true)
    } else {
      router.push({ name: "MemberWithdrawal" })
    }
  }

  return {
    handleSiteRedirect,
    handleRedirectDeposit,
    handleRedirectWithdrawal
  }
}
