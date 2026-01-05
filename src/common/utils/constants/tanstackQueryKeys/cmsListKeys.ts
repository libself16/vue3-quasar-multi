import { CMS_TYPE } from "src/common/utils/constants"

// CMS
export const TANSTACK_QUERY_KEY_CMS_LIST = "cmsList"

export const TANSTACK_QUERY_KEY_CMS_SPECIFIC_LIST = (type: CMS_TYPE.Enums | number) => `list?type=${type}`

// 1
export const TANSTACK_QUERY_KEY_CMS_LIST_HOME = `list?type=${CMS_TYPE.Enums.HOME}`

// 2
export const TANSTACK_QUERY_KEY_CMS_LIST_NAVIGATION_BAR = `list?type=${CMS_TYPE.Enums.NAVIGATION_BAR}`

// 3
export const TANSTACK_QUERY_KEY_CMS_LIST_MENU = `list?type=${CMS_TYPE.Enums.MENU}`

// 4
export const TANSTACK_QUERY_KEY_CMS_LIST_H5_BOTTOM_MENU = `list?type=${CMS_TYPE.Enums.H5_BOTTOM_MENU}`

// 5
export const TANSTACK_QUERY_KEY_CMS_LIST_WEBSITE_INFORMATION = `list?type=${CMS_TYPE.Enums.WEBSITE_INFORMATION}`

// 6
export const TANSTACK_QUERY_KEY_CMS_LIST_FOOTER_SETTINGS = `list?type=${CMS_TYPE.Enums.FOOTER_SETTINGS}`

// 7
export const TANSTACK_QUERY_KEY_CMS_LIST_FLOATING_ICON = `list?type=${CMS_TYPE.Enums.FLOATING_ICON}`

// 8
export const TANSTACK_QUERY_KEY_CMS_LIST_CONTACT_US = `list?type=${CMS_TYPE.Enums.CONTACT_US}`

// 9
export const TANSTACK_QUERY_KEY_CMS_LIST_HOME_INFORMATION_IMAGE = `list?type=${CMS_TYPE.Enums.HOME_INFORMATION_IMAGE}`

// 10
export const TANSTACK_QUERY_KEY_CMS_LIST_POPUP = `list?type=${CMS_TYPE.Enums.POPUP}`

// 11
export const TANSTACK_QUERY_KEY_CMS_GCASH_HOME = `list?type=${CMS_TYPE.Enums.GCASH_HOME}`

// 12
export const TANSTACK_QUERY_KEY_CMS_TAG_MANAGEMENT = `list?type=${CMS_TYPE.Enums.TAG_MANAGEMENT}`
