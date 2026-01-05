import { ref } from "vue"
import { defineStore } from "pinia"
import { AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"

export const useAIHelperStore = defineStore("aiHelperStore", () => {
  const iframeOrigin = ref("")
  const iframeUrl = ref("")
  const isAIHelperShow = ref(false)
  const isAIHelperIframeShow = ref(false)
  const isAIHelperReady = ref(false)
  const aiHelperNoGreetingsYet = ref(true)
  const isAIHelperNewMessage = ref(0)
  const aiHelperIframeRef = ref<HTMLIFrameElement | null>(null)
  const aiHelperEventRouteIndex = ref(new Map<AI_HELPER_EVENT_ROUTES.Enums, number>())

  return {
    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 是否顯示 AI 銷售助手 */
    isAIHelperShow,

    /** 是否顯示 AI 銷售助手 iframe  */
    isAIHelperIframeShow,

    /** 銷售助手是否連線完成 */
    isAIHelperReady,

    /** iframe vue ref */
    aiHelperIframeRef,

    /** 尚未問候 */
    aiHelperNoGreetingsYet,

    /** 是否有新訊息 */
    isAIHelperNewMessage,

    /** 銷售助手頁面發送次數 */
    aiHelperEventRouteIndex
  }
})
