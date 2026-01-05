import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useRouter, useRoute } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useGame } from "src/common/composables/useGame"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import type * as Request from "src/api/request.type"

export function useMayaMiniApp() {
  const $q = useQuasar()
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const { getFavoriteGames } = useGame()
  const { getUserWalletList, getUserInfo } = useUserInfo()
  const { reset, handleMayaLogin, auth } = useAuth()
  const { getValueFromUrl } = useCommon()
  const { getGiftsList } = useClaimGift()
  const loginBySessionID = async () => {
    try {
      // sessionID 應由 maya mini app 入口開啟時傳入
      // d6ad64b6-4cfa-4189-8a03-78456173834e sessionID
      const sessionID = getValueFromUrl("sessionId")
      if (!sessionID) {
        console.log("[maya mini app - loginBySessionID]: ", `no session id`)
        return
      }

      // 移除 sessionId 避免重送
      const url = new URL(window.location.href)
      url.searchParams.delete("sessionId")
      window.history.replaceState(null, "", url.toString())

      // if (sessionID === auth.value.maya_last_session_id) {
      //   console.log("[maya mini app - loginBySessionID]: ", `same session id`)
      //   return router.replace({
      //     path: "/"
      //   })
      // }

      reset()

      console.log("[maya mini app - loginBySessionID]: ", `sessionID: ${sessionID}`)

      const params: Request.MayaLogin = {
        session_id: sessionID
      }

      const { status, data } = await handleMayaLogin(params)

      console.log("[maya mini app - loginBySessionID api response]: ", status)
      console.log("[maya mini app - loginBySessionID api response]: ", JSON.stringify(data))

      if (!status) {
        return router.replace({
          path: "/"
        })
      }

      /// 登入後流程 ///
      await getFavoriteGames()
      await getUserWalletList()
      await getUserInfo()
      await getGiftsList()
      $q.notify({
        type: "positive",
        message: t("common.alarm.loginSuccess"),
        position: "top",
        timeout: 1000
      })

      return router.replace({
        path: "/"
      })
      /// 登入後流程 ///
    } catch (error) {
      console.log("[maya mini app - loginBySessionID]: ", error)
      return router.replace({
        path: "/"
      })
    }
  }

  return {
    loginBySessionID
  }
}
