import { RouteLocationNormalized } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

declare module "vue-router" {
  interface RouteMeta {
    /** 此頁面是否需要登入後才能造訪 */
    needAuth?: boolean

    /** 若未登入，則將使用者踢回的 route (未設定則預設踢回 HomePage) */
    goRouteIfNoToken?: string

    /** okbet 控制外層homePage/index page-layout */
    className?: string

    /** 觸發後台pixel codes */
    triggerPixelCodes?: PIXEL_CODE_TYPE.Enums[]

    /** set_r017 CMS footer 的 class */
    footerContentClass?: string[]

    /** set_r017 footer nav 的 class */
    footerNavClass?: string[]
  }
}
