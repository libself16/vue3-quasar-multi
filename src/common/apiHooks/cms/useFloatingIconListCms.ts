import { CMS_TYPE, CMS_DISPLAY_LOGIN, CMS_DISPLAY_DEVICE } from "src/common/utils/constants"
import { computed, toRef, type Ref } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import type * as Response from "src/api/response.type"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAuth } from "src/common/hooks/useAuth"

export function useFloatingIconListCms() {
  const { isLogin } = useAuth()
  const { isDown } = useMediaQuery()
  const isMobile = toRef(isDown, "padXl")

  // useCmsListQuery 讀取 FLOATING_ICON 類型的 CMS 列表
  const { data: tqvFloatingIconListCms } = useCmsListQuery({ type: CMS_TYPE.Enums.FLOATING_ICON }) as {
    data: Ref<Response.CmsItem[] | undefined>
  }

  const floatingIconList = computed(() => {
    if (!isLogin.value) {
      return tqvFloatingIconListCms?.value?.filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return tqvFloatingIconListCms?.value?.filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  const shouldDisplayDevice = (cmsItem: Response.CmsItem) => {
    const deviceSetting = cmsItem.Setting.payload.display_device as CMS_DISPLAY_DEVICE.Enums

    return deviceSetting === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS
      ? true
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.DESKTOP
      ? !isMobile.value
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.MOBILE
      ? isMobile.value
      : false
  }

  return {
    floatingIconList,
    shouldDisplayDevice
  }
}
