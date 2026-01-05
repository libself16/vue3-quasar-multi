import { CMS_TYPE, CMS_DISPLAY_LOGIN } from "src/common/utils/constants"
import { computed } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import { useAuth } from "src/common/hooks/useAuth"
import type * as Response from "src/api/response.type"

export function useNaviagtionBarListCms() {
  const { isLogin } = useAuth()

  // useCmsListQuery 讀取 NAVIGATION_BAR 類型的 CMS 列表
  const { data: tqvNavigationBarCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.NAVIGATION_BAR })

  const navigationBarList = computed(() => {
    if (!isLogin.value) {
      return tqvNavigationBarCmsList?.value?.filter((cmsItem: Response.CmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return tqvNavigationBarCmsList?.value?.filter((cmsItem: Response.CmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  return {
    navigationBarList
  }
}
