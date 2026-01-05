import { CMS_TYPE, CMS_DISPLAY_DEVICE } from "src/common/utils/constants"
import { computed } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import { useAuth } from "src/common/hooks/useAuth"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"

export function useAsideMenuBtnListCms() {
  const { isLogin } = useAuth()
  const $q = useQuasar()

  // useCmsListQuery 讀取 MENU 類型的 CMS 列表
  const { data: tqvAsideMenuBtnCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.MENU })

  const asideMenuBtnList = computed(() => {
    const isMobile = $q.platform.is.mobile // 判斷是否是手機
    const isLoggedIn = isLogin.value // 登入狀態
    return tqvAsideMenuBtnCmsList?.value?.filter((item: Response.CmsItem) => {
      const displayLogin = item.Setting.payload.display_login
      const displayDevice = item.Setting.payload.display_device
      // 過濾登入狀態
      const loginCondition = !isLoggedIn ? displayLogin !== 2 : displayLogin !== 1

      // 過濾裝置類型
      let deviceCondition = true
      if (isMobile) {
        deviceCondition = displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP // 如果是手機，過濾掉 PC
      } else {
        deviceCondition = displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE // 如果是 PC，過濾掉手機
      }

      // 返回條件
      return loginCondition && deviceCondition
    })
  })

  return {
    asideMenuBtnList
  }
}
