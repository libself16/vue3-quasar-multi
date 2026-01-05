import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export const routes = [
  {
    path: "/",
    component: () => import("app/template/set_ed3/layouts/main.vue"),
    meta: {},
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("app/template/set_ed3/pages/Home/Index.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_ed3/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/set_ed3/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_ed3/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set_ed3/pages/Home/CmsHome.vue")
      },
      {
        path: "webInformationCms/:id?",
        name: "WebInformationCms",
        component: () => import("app/template/set_ed3/pages/WebInformationCms/Index.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_ed3/pages/Promotion/Index.vue")
      },
      {
        path: "/forgotPass/:token",
        name: "ForgotPasswordWithToken",
        component: () => import("app/template/set_ed3/pages/Password/ForgotPasswordWithToken.vue")
      },
      {
        path: "/quickPass/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/set_ed3/pages/Password/QuickPassword.vue")
      },
      {
        path: "/vip",
        name: "vip",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_ed3/pages/Vip/Index.vue")
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_ed3/pages/Home/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_ed3/pages/Home/Collaboration.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_ed3/pages/Home/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_ed3/pages/Home/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  }
] as RouteRecordRaw[]

export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
