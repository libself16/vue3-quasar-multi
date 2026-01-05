import { ref, reactive } from "vue"
import { defineStore } from "pinia"
import { CMS_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type CmsListState = {
  [key in CMS_TYPE.Enums]: Response.CmsList
}

export const useCmsStore = defineStore("cmsStore", () => {
  const cmsListState = reactive<CmsListState>({
    [CMS_TYPE.Enums.HOME]: [],
    [CMS_TYPE.Enums.NAVIGATION_BAR]: [],
    [CMS_TYPE.Enums.MENU]: [],
    [CMS_TYPE.Enums.H5_BOTTOM_MENU]: [],
    [CMS_TYPE.Enums.WEBSITE_INFORMATION]: [],
    [CMS_TYPE.Enums.FOOTER_SETTINGS]: [],
    [CMS_TYPE.Enums.FLOATING_ICON]: [],
    [CMS_TYPE.Enums.CONTACT_US]: [],
    [CMS_TYPE.Enums.HOME_INFORMATION_IMAGE]: [],
    [CMS_TYPE.Enums.POPUP]: []
  })
  const cmsDetail = ref<Response.CmsItem>()

  function setCmsList(item: { type: CMS_TYPE.Enums; list: Response.CmsList }) {
    cmsListState[item.type] = item.list
  }

  function setCmsDetail(item: Response.CmsItem) {
    cmsDetail.value = item
  }

  return { cmsListState, cmsDetail, setCmsList, setCmsDetail }
})
