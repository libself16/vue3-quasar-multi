import { watchEffect, onMounted, onBeforeUnmount, reactive, watch } from "vue"
import { storeToRefs } from "pinia"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useAIHelperStore } from "src/stores/aiHelperStore"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { AI_HELPER_EVENT, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import * as Response from "src/api/response.type"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
interface IMessage {
  type: "event"
  data: Response.AIHelperEvent
}

type AIHelperEventRoute = () => void

// 確保 message 事件監聽器只註冊一次
let isMessageListenerRegistered = false
let hookInstanceCount = 0
let sharedMessageHandler: ((event: MessageEvent) => void) | null = null

export function useAIHelperEvent(options?: { maxRetry?: number; retryDelay?: number }) {
  const { isLogin } = useAuth()
  const { envData } = useEnv()
  const env = envData()
  const { isDown } = useMediaQuery()
  const eventbus = injectStrict(EventBusKey)
  const aiHelperStore = useAIHelperStore()
  const {
    iframeOrigin,
    iframeUrl,
    isAIHelperShow,
    isAIHelperIframeShow,
    isAIHelperReady,
    aiHelperNoGreetingsYet,
    aiHelperIframeRef,
    aiHelperEventRouteIndex,
    isAIHelperNewMessage
  } = storeToRefs(aiHelperStore)

  const maxRetry = options?.maxRetry ?? 10
  const retryDelay = options?.retryDelay ?? 1000
  const retryMap = reactive<Record<string, number>>({})

  const aiHelperEventRoutes: Record<AI_HELPER_EVENT_ROUTES.Enums, AIHelperEventRoute[]> = {
    [AI_HELPER_EVENT_ROUTES.Enums.HOME]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.AGENCY_FUNCTION_PROMOTION })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.DEPOSIT]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.FIRST_DISCOUNT }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DAILY_BONUS }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DEPOSIT_LOTTO_NUMBER })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.PROMOTION]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.FIRST_DISCOUNT }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DAILY_BONUS }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DEPOSIT_LOTTO_NUMBER }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.VIP })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.PRODUCT_LOBBY]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.BET_BONUS }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DEPOSIT_LOTTO_NUMBER })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.BET_BONUS }),
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DEPOSIT_LOTTO_NUMBER })
    ]
  }

  function postAIHelperIframeEvent(data: Response.AIHelperEvent) {
    const eventKey = data.event
    if (!eventKey) {
      console.warn("[AIHelper] Invalid event name.")
      return
    }

    const tryPost = () => {
      if (!isAIHelperReady.value) {
        const currentRetry = retryMap[eventKey] ?? 0
        if (currentRetry < maxRetry) {
          retryMap[eventKey] = currentRetry + 1
          setTimeout(tryPost, retryDelay)
        } else {
          console.warn(`[AIHelper] Max retry reached for event: ${eventKey}`)
        }
        return
      }

      if (
        isAIHelperShow.value &&
        aiHelperIframeRef.value &&
        aiHelperIframeRef.value.contentWindow &&
        iframeOrigin.value &&
        data.event
      ) {
        const message: IMessage = {
          type: "event",
          data
        }

        try {
          aiHelperIframeRef.value.contentWindow.postMessage(message, iframeOrigin.value)

          retryMap[eventKey] = 0

          if (data.event === AI_HELPER_EVENT.Enums.GREETING) {
            aiHelperNoGreetingsYet.value = false
          }
        } catch (err) {
          console.error("[AIHelper] Failed to post message:", err)
        }
      }
    }

    retryMap[eventKey] = 0
    tryPost()
  }

  function closeAIHelper() {
    isAIHelperShow.value = false
    isAIHelperIframeShow.value = false
  }

  function handleAIHelperRouteEvent(routeKey: AI_HELPER_EVENT_ROUTES.Enums) {
    const events = aiHelperEventRoutes[routeKey]
    if (!events?.length) return

    const index = aiHelperEventRouteIndex.value.get(routeKey) ?? 0

    try {
      events[index]()
    } catch (err) {
      console.error(`執行 ${routeKey} 的事件失敗`, err)
    }

    const nextIndex = (index + 1) % events.length
    aiHelperEventRouteIndex.value.set(routeKey, nextIndex)
  }

  // 共享的 message 處理函數（直接從 store 獲取值）
  function createSharedMessageHandler() {
    return (event: MessageEvent) => {
      // 直接從 store 獲取最新的值，避免閉包問題
      // 使用 storeToRefs 以確保正確訪問 ref 值
      const currentStore = useAIHelperStore()
      const {
        iframeOrigin: currentOriginRef,
        isAIHelperReady: isReadyRef,
        isAIHelperNewMessage: newMessageRef
      } = storeToRefs(currentStore)

      if (!currentOriginRef.value || event.origin !== currentOriginRef.value) return

      const data = event.data
      if (data?.status === "connected" && data?.type === AI_HELPER_EVENT.Enums.ASSISTANT_READY) {
        isReadyRef.value = true
      }

      // 判斷有新訊息時，要顯示紅點
      if (data?.type === AI_HELPER_EVENT.Enums.NEW_MESSAGE) {
        newMessageRef.value++
      }
    }
  }

  // 發送 viewport 事件給 iframe
  const sendMobileEvent = () => {
    const isMobile = !!isDown.phone
    const data: Response.AIHelperEvent = {
      event: AI_HELPER_EVENT.Enums.VIEWPORT,
      type: "viewport",
      isMobile
    }

    postAIHelperIframeEvent(data)
  }

  // API開關 + 登入才顯示
  watchEffect(async () => {
    if (env.ai_helper && isLogin.value) {
      isAIHelperShow.value = true
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {}
      return
    }

    closeAIHelper()
  })

  watchEffect(() => {
    if (isAIHelperShow.value && aiHelperNoGreetingsYet.value && isAIHelperReady.value) {
      const data: Response.AIHelperEvent = {
        event: AI_HELPER_EVENT.Enums.GREETING
      }

      postAIHelperIframeEvent(data)
      sendMobileEvent()
    }
  })

  watch(isAIHelperIframeShow, (newVal: boolean) => {
    isAIHelperNewMessage.value = 0
  })

  onMounted(() => {
    hookInstanceCount++

    // 確保 message 事件監聽器只註冊一次
    if (!isMessageListenerRegistered) {
      sharedMessageHandler = createSharedMessageHandler()
      window.addEventListener("message", sharedMessageHandler)
      isMessageListenerRegistered = true
    }

    eventbus.on("handleAIHelperEvent", async (data) => {
      if (data) {
        postAIHelperIframeEvent(data)
      }
    })
  })

  onBeforeUnmount(() => {
    hookInstanceCount--

    // 只在最後一個使用該 hook 的組件卸載時才移除監聽器
    if (hookInstanceCount === 0 && isMessageListenerRegistered && sharedMessageHandler) {
      window.removeEventListener("message", sharedMessageHandler)
      isMessageListenerRegistered = false
      sharedMessageHandler = null
    }
  })

  return {
    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 是否顯示 AI 銷售助手 */
    isAIHelperShow,

    /** 是否顯示 AI 銷售助手 iframe  */
    isAIHelperIframeShow,

    /** 是否有新訊息 */
    isAIHelperNewMessage,

    /** 銷售助手是否連線完成 */
    isAIHelperReady,

    /** iframe vue ref */
    aiHelperIframeRef,

    /** 尚未問候 */
    aiHelperNoGreetingsYet,

    /** 發射 event 給 iframe */
    postAIHelperIframeEvent,

    /** 關閉 AI 銷售助手 */
    closeAIHelper,

    /** 各頁面需要觸發的 AI 銷售助手事件 */
    handleAIHelperRouteEvent,

    sendMobileEvent
  }
}
