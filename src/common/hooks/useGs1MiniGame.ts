import { ref, reactive, computed, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { GS1_MINI_GAME_EVENT } from "src/common/utils/constants"
import { useApi } from "src/common/hooks/useApi"
import { getMiniGameAuthKey, postLaunchMiniGame } from "src/api/miniGame"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

export function useGs1MiniGame() {
  const { isLogin } = useAuth()
  const { activeWalletCurrencyId } = useUserInfo()
  const { envData } = useEnv()
  const envInfo = envData()

  const isLoading = ref(false)
  const isMiniGameIconShow = ref(false)
  const isMiniGameDialogShow = ref(false)
  const iframeOrigin = ref("https://gamification.gs1hub.com")
  const miniGameState = reactive<Response.PostLaunchMiniGame>({
    auth_key: "",
    gs1_data: {
      username: "",
      player_id: "",
      session_token: "",
      gs1_player_id: 0
    }
  })

  const iframeUrl = computed(() => {
    return `https://gamification.gs1hub.com/?parentUrl=${window.location.origin}/&amp;d=%3Cscript%3Edocument.write(new%20Date().toISOString().split('T')[0])%3C/script%3E`
  })

  const miniGameIframeRef = ref<HTMLIFrameElement | null>(null)

  async function handleGetMiniGameAuthKey() {
    try {
      isLoading.value = true
      const { status, data } = await useApi(getMiniGameAuthKey)
      isLoading.value = false

      if (status) {
        miniGameState.auth_key = data.auth_key
        miniGameState.gs1_data.username = ""
        miniGameState.gs1_data.player_id = ""
        miniGameState.gs1_data.session_token = ""
        miniGameState.gs1_data.gs1_player_id = 0
        showMiniGameIframeDialog()
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  async function handlePostLaunchMiniGame() {
    try {
      const payload: Request.PostLaunchMiniGame = { currency_id: activeWalletCurrencyId.value }
      isLoading.value = true
      const { status, data } = await useApi(postLaunchMiniGame, payload)
      isLoading.value = false

      if (status) {
        miniGameState.auth_key = data.auth_key
        miniGameState.gs1_data.username = data.gs1_data.username
        miniGameState.gs1_data.player_id = data.gs1_data.player_id
        miniGameState.gs1_data.session_token = data.gs1_data.session_token
        miniGameState.gs1_data.gs1_player_id = data.gs1_data.gs1_player_id
        showMiniGameIframeDialog()
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  function closeMiniGame() {
    isMiniGameIconShow.value = false
    closeMiniGameIframeDialog()
  }

  function handleMiniGameIconClick() {
    if (isLogin.value) {
      handlePostLaunchMiniGame()
      return
    }
    handleGetMiniGameAuthKey()
  }

  function showMiniGameIframeDialog() {
    window.addEventListener("message", handleMiniGameIframeMessage)
    isMiniGameDialogShow.value = true
  }

  function closeMiniGameIframeDialog() {
    window.removeEventListener("message", handleMiniGameIframeMessage)
    isMiniGameDialogShow.value = false
  }

  function handleMiniGameIframeMessage(event: MessageEvent) {
    if (!iframeOrigin.value || event.origin !== iframeOrigin.value) return
    // Check if the message is requesting the username
    if (event.data.type === GS1_MINI_GAME_EVENT.Enums.REQUEST_USERNAME) {
      const iframe = miniGameIframeRef.value

      if (iframe) {
        const iframeWindow = iframe.contentWindow
        // Construct the message to send back to the iframe
        const message = {
          _username: miniGameState.gs1_data.player_id, // Replace {username} with the actual player id
          _okey: miniGameState.auth_key, // Replace {okey} with the actual operator auth key
          _token: miniGameState.gs1_data.session_token // Replace {token} with the actual token received when sync player with GS1
          // _username: "DemoPlayer1", // Replace {username} with the actual player id
          // _okey: "76aad168a0a444c4b1af9022227b8964",
          // _token:
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdXNlcm5hbWUiOiJEZW1vUGxheWVyMSIsImNvdW50cnlfaWQiOjEsIm9wZXJhdG9yX2lkIjoxLCJvYXV0aF9rZXkiOiI3NmFhZDE2OGEwYTQ0NGM0YjFhZjkwMjIyMjdiODk2NCIsInBsYXllcl9pZCI6MTcsIm9wbGF5ZXJfaWQiOiIzIiwicmV3YXJkX3Nob3AiOnRydWUsImV4cCI6MTc1NTE2MzUzMCwiaWF0IjoxNzU1MDc3MTMwfQ.B7IK3oN03zd6YB5c0i3HJMKBA0MW6b1zDnJoDoRPczM"
        }
        // Send the message to the iframe
        iframeWindow?.postMessage(JSON.stringify(message), "*")
      }
    }

    if (event.data === GS1_MINI_GAME_EVENT.Enums.CLOSE_IFRAME) {
      closeMiniGameIframeDialog()
    }
  }

  onMounted(async () => {
    isMiniGameIconShow.value = envInfo.gs1_small_game ? true : false
  })

  return {
    /** mini game 資料 */
    miniGameState,

    /** 是否顯示小遊戲懸浮icon */
    isMiniGameIconShow,

    /** 是否顯示小遊戲 iframe dialog  */
    isMiniGameDialogShow,

    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 小遊戲dom ref */
    miniGameIframeRef,

    /** 關閉 mini game */
    closeMiniGame,

    /** 開啟 iframe 彈窗 */
    handleMiniGameIconClick,

    /** 關閉 iframe 彈窗 */
    closeMiniGameIframeDialog
  }
}
