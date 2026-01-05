import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export const routes = [
  {
    path: "/",
    component: () => import("app/template/set_DBO88/layouts/main.vue"),
    meta: {},
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("app/template/set_DBO88/pages/Home/Index.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_DBO88/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/set_DBO88/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_DBO88/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set_DBO88/pages/Home/CmsHome.vue")
      },
      {
        path: "webInformationCms/:id?",
        name: "WebInformationCms",
        component: () => import("app/template/set_DBO88/pages/WebInformationCms/Index.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_DBO88/pages/Promotion/Index.vue")
      },
      {
        path: "/vip",
        name: "vip",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_DBO88/pages/Vip/Index.vue")
      },
      {
        path: "/depositWithdrawal",
        name: "DepositWithdrawal",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_DBO88/pages/DepositWithWithdrawal/Index.vue")
      },
      {
        path: "/history/transactionHistory",
        name: "TransactionHistory",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_DBO88/pages/History/TransactionHistory/Index.vue")
      },
      {
        path: "/history/pendingTransaction",
        name: "PendingTransaction",
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Home"
        },
        component: () => import("app/template/set_DBO88/pages/History/PendingTransaction/Index.vue")
      },
      {
        path: "/changePassword",
        name: "ChangePassword",
        component: () => import("app/template/set_DBO88/pages/ChangePassword/Index.vue")
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("app/template/set_DBO88/pages/Profile/Index.vue")
      },
      {
        path: "/inbox",
        name: "Inbox",
        component: () => import("app/template/set_DBO88/pages/Inbox/Index.vue")
      },
      {
        path: "/setWithdrawalPassword",
        name: "SetWithdrawalPassword",
        component: () => import("app/template/set_DBO88/pages/SetWithdrawalPassword/Index.vue")
      },
      {
        path: "/contactUs",
        name: "ContactUs",
        component: () => import("app/template/set_DBO88/pages/ContactUs/Index.vue")
      },
      {
        path: "/forgotPass/:token",
        name: "ForgotPasswordWithToken",
        component: () => import("app/template/set_DBO88/pages/Password/ForgotPasswordWithToken.vue")
      },
      {
        path: "/quickPass/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/set_DBO88/pages/Password/QuickPassword.vue")
      }
    ]
  }
] as RouteRecordRaw[]

export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
