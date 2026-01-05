import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, type Ref } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import { useEnv } from "src/common/hooks/useEnv"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"

export function useFooterListCms() {
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()
  const { nowLang } = useLanguage()

  // useCmsListQuery 讀取 FOOTER_SETTINGS 類型的 CMS 列表
  const { data: tqvFooterSettingsCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.FOOTER_SETTINGS }) as {
    data: Ref<Response.CmsItem[] | undefined>
  }

  const cmsFooterLogos = computed(() => {
    if (!tqvFooterSettingsCmsList?.value?.length) {
      return []
    }
    return tqvFooterSettingsCmsList.value[0]?.Setting?.logo_sort?.map(
      (e: string) =>
        `${VITE_APP_DYNAMIC_RESOURCE_URL}/${e}?v=${tqvFooterSettingsCmsList.value![0].Setting.updated_time}`
    )
  })

  const cmsFooterTextContent = computed(() => {
    if (!tqvFooterSettingsCmsList?.value?.length) {
      return null
    }

    const pageList = tqvFooterSettingsCmsList.value[0]?.Page?.filter(
      (e: { lang: LANGUAGE_TYPE.Enums; title: string; content: string }) => e.lang === nowLang.value
    )

    if (pageList.length) {
      pageList[0].content = pageList[0].content.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
      return pageList[0]
    }

    return null
  })

  return {
    cmsFooterLogos,
    cmsFooterTextContent
  }
}
