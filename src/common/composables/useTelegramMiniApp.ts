import erudaPlugins from "eruda"
import { retrieveLaunchParams, postEvent, isTMA } from "@telegram-apps/sdk"
import { tgWebAppLogin } from "src/api/login"
import { useApi } from "src/common/hooks/useApi"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { computed } from "vue"
import type * as Request from "src/api/request.type"

export function useTelegram() {
  const $q = useQuasar()
  const router = useRouter()
  const isTelegramMiniApp = computed(() => {
    return isTMA("simple")
  })

  // 檢測是否在 Telegram 環境中(包括 Mini App、In-App Browser)
  const isTelegramEnvironment = computed(() => {
    return (
      isTelegramMiniApp.value ||
      (typeof window !== "undefined" &&
        // 檢測 Telegram WebApp API
        (!!(window as any).Telegram?.WebApp ||
          // 檢測 User Agent 中的 Telegram
          /Telegram/i.test(navigator.userAgent) ||
          // 檢測 TelegramWebviewProxy
          !!(window as any).TelegramWebviewProxy))
    )
  })

  const handleMiniAppLogin = async () => {
    console.log("[handleMiniAppLogin]")
    console.log("[isTelegramMiniApp]: ", isTelegramMiniApp.value)

    const toCloseWebApp = () => {
      return $q.notify({
        type: "negative",
        message: "Validate failed",
        position: "center",
        timeout: 1000,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => closeMiniApp()
          }
        ]
      })
    }

    const parseQueryParams = (queryString: string): Record<string, string> => {
      try {
        if (queryString.includes("__")) {
          // 檢查是否包含雙下底線
          return queryString.split("__").reduce((queryParams, item) => {
            const [key, value] = item.split("=")
            if (key && value) {
              queryParams[key] = value
            }
            return queryParams
          }, {} as Record<string, string>)
        }

        // 如果沒有雙下底線，使用 URLSearchParams 處理標準 URL 參數
        const params = new URLSearchParams(queryString)
        const queryParams: Record<string, string> = {}

        params.forEach((value, key) => {
          queryParams[key] = value
        })

        return queryParams
      } catch (error) {
        console.log("Error parsing query params:", error)
        return {}
      }
    }

    try {
      const { initDataRaw, initData, startParam } = retrieveLaunchParams()
      if (initDataRaw && initData && initData.user) {
        console.log("[startParam]: ", startParam)
        console.log("[initDataRaw]: ", initDataRaw)

        const params: Request.TgWebAppLogin = {
          // 既有欄位
          serial_code: initDataRaw,
          user: {
            id: initData.user.id,
            first_name: initData.user.firstName,
            last_name: initData.user.lastName ?? "",
            username: initData.user.username ?? "",
            language_code: initData.user.languageCode ?? "",
            allows_write_to_pm: initData.user.allowsWriteToPm ?? true
          },
          chat_instance: initData.chatInstance ?? "",
          chat_type: initData.chatType ?? "",
          auth_date: initData.authDate.getTime().toString(),
          hash: initData.hash,

          // 未來後端可能的擴充欄位
          ...Object.entries(initData).reduce((additionalFields, [fieldName, fieldValue]) => {
            const currentField = ["serial_code", "user", "chatInstance", "chatType", "authDate", "hash"]

            // 動態添加擴展的欄位
            if (!currentField.includes(fieldName)) {
              additionalFields[fieldName] = String(fieldValue)
            }

            return additionalFields
          }, {} as Record<string, string>)
        }

        const { status, data } = await useApi(tgWebAppLogin, params)

        console.log("[tgWebAppLogin api response]: ", status)
        console.log("[tgWebAppLogin api response]: ", JSON.stringify(data))

        if (status && data.launch_url) {
          const launchUrl = new URLSearchParams(data.launch_url.split("?")[1])
          const launchURLQuery = Object.fromEntries(launchUrl)

          const query = {
            ...launchURLQuery
          }

          if (startParam) {
            const startParamQueries = parseQueryParams(startParam)
            Object.assign(query, startParamQueries)
          }

          // erudaPlugins.init()

          return router.replace({
            path: "/",
            query
          })
        } else {
          console.log("[tgWebAppLogin api response]: ", "API verify failed")
          return toCloseWebApp()
        }
      } else {
        /// 驗證失敗 關閉 mini app
        return toCloseWebApp()
      }
    } catch {
      console.log("No TG login params found")
      return router.replace({ path: "/" })
    }
  }

  const closeMiniApp = () => {
    try {
      postEvent("web_app_close")
    } catch (error) {
      console.log("error", error)
    }
  }

  const expandMiniApp = () => {
    // 桌面板 展開 mini app 視窗最大化
    try {
      postEvent("web_app_expand")
    } catch (error) {
      console.log("error", error)
    }
  }

  // https://www.notion.so/wowgaming/144fc5d788a9802595e9c770fd8fd51a?pvs=4
  // 此修正為避免telegramMiniApp ios設備因為下方indicator造成的異常行為
  const handleResize = () => {
    document.body.style.height = window.visualViewport!.height + "px"
  }

  const handleScroll = () => {
    if (window.scrollY > 0) window.scrollTo(0, 0)
  }

  const listenPreventOverflow = () => {
    if (!isTelegramMiniApp.value) return

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
    }

    window.addEventListener("scroll", handleScroll)
  }

  const removeListenPreventOverflow = () => {
    if (!isTelegramMiniApp.value) return

    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", handleResize)
    }

    window.removeEventListener("scroll", handleScroll)
  }

  return {
    isTelegramMiniApp,
    isTelegramEnvironment,
    handleMiniAppLogin,
    closeMiniApp,
    expandMiniApp,
    listenPreventOverflow,
    removeListenPreventOverflow
  }
}
