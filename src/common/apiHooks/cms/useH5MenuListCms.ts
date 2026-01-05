import { CMS_DISPLAY_LOGIN, CMS_TYPE } from "src/common/utils/constants"
import { computed } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import { useAuth } from "src/common/hooks/useAuth"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"

export function useH5MenuListCms() {
  const { isLogin } = useAuth()
  const $q = useQuasar()

  // useCmsListQuery 讀取 H5_BOTTOM_MENU 類型的 CMS 列表
  const { data: tqvH5MenuCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.H5_BOTTOM_MENU })

  const h5MenuList = computed(() => {
    if (!isLogin.value) {
      return tqvH5MenuCmsList?.value?.filter((cmsItem: Response.CmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return tqvH5MenuCmsList?.value?.filter((cmsItem: Response.CmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  return {
    h5MenuList
  }
}
