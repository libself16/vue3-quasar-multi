import { watchEffect, onMounted, onBeforeUnmount } from "vue"
import { storeToRefs } from "pinia"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useAIFansStore } from "src/stores/aiFansStore"
import { AI_HELPER_EVENT } from "src/common/utils/constants"

export function useAIFansEvent() {
  const { isLogin } = useAuth()
  const { envData } = useEnv()
  const env = envData()
  const aiFansStore = useAIFansStore()
  const {
    iframeOrigin,
    iframeUrl,
    isAIFansShow,
    isAIFansIframeShow,
    isAIFansReady,
    aiFansNoGreetingsYet,
    aiFansIframeRef
  } = storeToRefs(aiFansStore)

  function closeAIFans() {
    isAIFansShow.value = false
    isAIFansIframeShow.value = false
  }

  function handleAIFansIframeMessage(event: MessageEvent) {
    if (!iframeOrigin.value || event.origin !== iframeOrigin.value) return

    const data = event.data
    if (data?.status === "connected" && data?.type === AI_HELPER_EVENT.Enums.ASSISTANT_READY) {
      isAIFansReady.value = true
    }
  }

  // API開關 + 登入才顯示
  watchEffect(async () => {
    if (env.ai_helper && isLogin.value) {
      isAIFansShow.value = true
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {}
      return
    }

    closeAIFans()
  })

  onMounted(() => {
    window.addEventListener("message", handleAIFansIframeMessage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("message", handleAIFansIframeMessage)
  })

  return {
    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 是否顯示 AI Fans Icon */
    isAIFansShow,

    /** 是否顯示 AI Fans iframe  */
    isAIFansIframeShow,

    /** Fans 是否連線完成 */
    isAIFansReady,

    /** iframe vue ref */
    aiFansIframeRef,

    /** 尚未問候 */
    aiFansNoGreetingsYet,

    /** 關閉 AI Fans Icon */
    closeAIFans
  }
}
