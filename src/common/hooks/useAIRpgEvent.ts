import { watchEffect, onMounted, onBeforeUnmount } from "vue"
import { storeToRefs } from "pinia"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useAIRpgStore } from "src/stores/aiRpgStore"
import { AI_HELPER_EVENT } from "src/common/utils/constants"

export function useAIRpgEvent() {
  const { isLogin } = useAuth()
  const { envData } = useEnv()
  const env = envData()
  const aiRpgStore = useAIRpgStore()
  const { iframeOrigin, iframeUrl, isAIRpgShow, isAIRpgIframeShow, isAIRpgReady, aiRpgNoGreetingsYet, aiRpgIframeRef } =
    storeToRefs(aiRpgStore)

  function closeAIRpg() {
    isAIRpgShow.value = false
    isAIRpgIframeShow.value = false
  }

  function handleAIRpgIframeMessage(event: MessageEvent) {
    if (!iframeOrigin.value || event.origin !== iframeOrigin.value) return

    const data = event.data
    if (data?.status === "connected" && data?.type === AI_HELPER_EVENT.Enums.ASSISTANT_READY) {
      isAIRpgReady.value = true
    }
  }

  // API開關 + 登入才顯示
  watchEffect(async () => {
    if (env.ai_helper && isLogin.value) {
      isAIRpgShow.value = true
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {}
      return
    }

    closeAIRpg()
  })

  onMounted(() => {
    window.addEventListener("message", handleAIRpgIframeMessage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("message", handleAIRpgIframeMessage)
  })

  return {
    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 是否顯示 AI RPG */
    isAIRpgShow,

    /** 是否顯示 AI RPG iframe  */
    isAIRpgIframeShow,

    /** RPG 是否連線完成 */
    isAIRpgReady,

    /** iframe vue ref */
    aiRpgIframeRef,

    /** 尚未問候 */
    aiRpgNoGreetingsYet,

    /** 發射 event 給 iframe */
    // postAIRpgIframeEvent,

    /** 關閉 AI RPG 助手 */
    closeAIRpg

    /** 各頁面需要觸發的 AI RPG 事件 */
    // handleAIRpgRouteEvent
  }
}
