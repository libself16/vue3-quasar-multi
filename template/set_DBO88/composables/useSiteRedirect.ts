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
    console.log(`did: ${item.did}`)
    switch (item.did) {
      /*
        * 僅限存取款
        1. 未登入狀態，彈出登入視窗
        2. 一般登入，跳轉至存款頁面
      */
      case "deposit":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "DepositWithdrawal", query: { type: "deposit" } })
        return
      case "withdrawal":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "DepositWithdrawal", query: { type: "withdrawal" } })
        return
      case "basic_information":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "Profile" })
        return
      case "withdrawal_setting":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        eventbus.emit("openAddBankCard", true)
        return
      case "change_password":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "ChangePassword" })
        return
      case "site_message":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "Inbox" })
        return
      case "history":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "TransactionHistory" })
        return
      case "processing_order":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "PendingTransaction" })
        return
      case "kyc":
        if (!isLogin.value) {
          handleEventShow(item, "openLoginWithRegister")
          return
        }
        break
      case "register":
        if (!isLogin.value) {
          handleEventShow(item, "openLoginWithRegister")
          return
        }
        break
      case "forget_password":
        // 忘記密碼彈窗只在未登入狀態下顯示
        if (!isLogin.value) {
          handleEventShow(item, "openLoginWithRegister")
          return
        }
        break
      case "contact_us":
        router.push({ name: "ContactUs" })
        return
      case "member_level":
        if (!isLogin.value) return eventbus.emit("openLoginWithRegister", true)
        router.push({ name: "vip" })
        return
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
      eventbus.emit("openDepositWithWithdrawal", true, "deposit")
    } else {
      router.push({ name: "MemberDeposit" })
    }
  }

  const handleRedirectWithdrawal = () => {
    if (isMayaLogin.value) {
      eventbus.emit("openDepositWithWithdrawal", true, "withdrawal")
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
