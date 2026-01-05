import { CMS_TYPE } from "src/common/utils/constants"

// CMS
export const TANSTACK_QUERY_KEY_CMS_DETAIL = "cmsDetail"

export const TANSTACK_QUERY_KEY_CMS_SPECIFIC_DETAIL = (type: CMS_TYPE.Enums | number) => `detail/${type}`
