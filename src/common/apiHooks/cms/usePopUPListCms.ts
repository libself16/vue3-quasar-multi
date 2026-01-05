import { computed, ref } from "vue"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useCmsListQuery } from "./useCmsListQuery"
import { useEnv } from "src/common/hooks/useEnv"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"

export function usePopUPListCms() {
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()
  const { nowLang } = useLanguage()

  // useCmsListQuery 讀取 POPUP 類型的 CMS 列表
  const { data: tqvPopUpCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.POPUP })

  //#region 彈窗管理
  const cmsPopupTitle = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return ""
    }

    const title = tqvPopUpCmsList?.value?.[0]?.Setting?.lang?.[nowLang.value as LANGUAGE_TYPE.Enums]

    if (title) {
      return title.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
    }
    return ""
  })

  const cmsComfirmButtonLabel = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return ""
    }

    return tqvPopUpCmsList?.value?.[0].Setting?.comfirm_button_lang?.[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsRejectButtonLabel = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return ""
    }

    return tqvPopUpCmsList?.value?.[0]?.Setting?.reject_button_lang?.[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsPopupImgs = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return []
    }
    return tqvPopUpCmsList?.value?.[0]?.Setting?.pop_up_img?.map(
      (e: string) => `${VITE_APP_DYNAMIC_RESOURCE_URL}/${e}?v=${tqvPopUpCmsList?.value?.[0]?.Setting?.updated_time}`
    )
  })

  const cmsPopupAgreeList = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return []
    }

    return tqvPopUpCmsList?.value?.[0]?.Entrance?.filter((e: Response.CmsEntranceItem) => e.sort !== 0)?.map(
      (e: Response.CmsEntranceItem, i: number) => {
        let label = e.lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
        label = label.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
        return {
          label: label,
          value: i
        }
      }
    )
  })

  const cmsPopupCheckAgree = ref<number[]>([])

  const cmsPopupAgreeAllText = computed(() => {
    if (!tqvPopUpCmsList?.value?.length) {
      return ""
    }

    const agreeAllList = tqvPopUpCmsList?.value?.[0]?.Entrance?.filter((e: Response.CmsEntranceItem) => e.sort === 0)

    if (agreeAllList.length) {
      const agreeAllText = agreeAllList[0].lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      return agreeAllText.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
    }

    return ""
  })

  const cmsPopupCheckAllAgree = computed({
    get() {
      return cmsPopupAgreeList.value?.every((item) => cmsPopupCheckAgree.value.includes(item.value))
    },
    set(value: boolean) {
      if (value) {
        cmsPopupCheckAgree.value = cmsPopupAgreeList.value.map((item) => item.value)
      } else {
        cmsPopupCheckAgree.value = []
      }
    }
  })
  //#endregion

  return {
    /** 彈窗管理標題 */
    cmsPopupTitle,

    /** 彈窗管理確認按鈕標籤 */
    cmsComfirmButtonLabel,

    /** 彈窗管理拒絕按鈕標籤 */
    cmsRejectButtonLabel,

    /** 彈窗管理圖片*/
    cmsPopupImgs,

    /** 彈窗管理同意列表 */
    cmsPopupCheckAgree,

    /** 彈窗管理已同意項目 */
    cmsPopupAgreeList,

    /** 彈窗管理全部同意文字 */
    cmsPopupAgreeAllText,

    /** 彈窗管理全部同意 */
    cmsPopupCheckAllAgree
  }
}
