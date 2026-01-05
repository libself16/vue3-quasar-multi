import { useGame } from "src/common/composables/useGame"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useRouter } from "vue-router"

export function useLocalCommon() {
  const router = useRouter()
  const { openGame } = useGame()
  const { isAGLM } = useAgentCode()

  const SA_GAME_PRODUCT_CODE = 1185,
    AG_GAME_PRODUCT_CODE = 1203

  const afterLogin = async () => {
    await router.push({ path: "/" })
    await new Promise((resolve) => setTimeout(resolve, 500))
    await openCurrentGame()
  }

  //目前這連結特規+特規 , 集成id 取不到自遊戲list 的集成id對應
  const openCurrentGame = async () => {
    await router.push({ path: "/" })
    if (isAGLM.value) {
      await openGame(1, AG_GAME_PRODUCT_CODE, "", "", false, null)
      return
    }
    await openGame(1, SA_GAME_PRODUCT_CODE, "", "", false, null)
  }

  return {
    afterLogin,
    openCurrentGame
  }
}
