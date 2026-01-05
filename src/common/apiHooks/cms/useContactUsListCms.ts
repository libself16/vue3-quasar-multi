import { CMS_TYPE } from "src/common/utils/constants"
import { type Ref } from "vue"
import { useCmsListQuery } from "./useCmsListQuery"
import type * as Response from "src/api/response.type"

export function useContactUsListCms() {
  // useCmsListQuery 讀取 CONTACT_US 類型的 CMS 列表
  const { data: tqvContactUsListCms } = useCmsListQuery({ type: CMS_TYPE.Enums.CONTACT_US }) as {
    data: Ref<Response.CmsItem[] | undefined>
  }

  return {
    contactUsList: tqvContactUsListCms
  }
}
