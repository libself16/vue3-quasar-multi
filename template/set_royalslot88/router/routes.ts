import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_royalslot88/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_royalslot88/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_royalslot88/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set_royalslot88/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_royalslot88/pages/SabaPage/Index.vue")
      },
      {
        path: "forgotPass/:token",
        components: {
          default: () => import("app/template/set_royalslot88/pages/HomePage/Home.vue"),
          modal: () => import("app/template/set_royalslot88/components/modal/ForgotPasswordWithToken.vue")
        }
      },
      {
        path: "quickPass/:account/:token",
        name: "QuickPass",
        components: {
          default: () => import("app/template/set_royalslot88/pages/HomePage/Home.vue"),
          modal: () => import("app/template/set_royalslot88/components/modal/QuickPassword.vue")
        }
      },
      {
        path: "collaboration",
        name: "Collaboration",
        component: () => import("app/template/set_royalslot88/pages/HomePage/Collaboration.vue"),
        meta: {
          title: "Collaboration",
          hideFooter: true
        }
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true,
          hideFooter: true
        },
        component: () => import("app/template/set_royalslot88/pages/HomePage/Proxy/Index.vue")
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
