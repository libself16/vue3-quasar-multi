import { ref } from "vue"
import { defineStore } from "pinia"
import { AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"

export const useAIFansStore = defineStore("aiFansStore", () => {
  const iframeOrigin = ref("")
  const iframeUrl = ref("")
  const isAIFansShow = ref(false)
  const isAIFansIframeShow = ref(false)
  const isAIFansReady = ref(false)
  const aiFansNoGreetingsYet = ref(true)
  const aiFansIframeRef = ref<HTMLIFrameElement | null>(null)
  const aiFansEventRouteIndex = ref(new Map<AI_HELPER_EVENT_ROUTES.Enums, number>())

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

    /** Fans 助手頁面發送次數 */
    aiFansEventRouteIndex
  }
})
