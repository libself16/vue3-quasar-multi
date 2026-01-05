import { ref } from "vue"
import { defineStore } from "pinia"
import { AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"

export const useAIRpgStore = defineStore("aiRpgStore", () => {
  const iframeOrigin = ref("")
  const iframeUrl = ref("")
  const isAIRpgShow = ref(false)
  const isAIRpgIframeShow = ref(false)
  const isAIRpgReady = ref(false)
  const aiRpgNoGreetingsYet = ref(true)
  const aiRpgIframeRef = ref<HTMLIFrameElement | null>(null)
  const aiRpgEventRouteIndex = ref(new Map<AI_HELPER_EVENT_ROUTES.Enums, number>())

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

    /** RPG 頁面發送次數 */
    aiRpgEventRouteIndex
  }
})
