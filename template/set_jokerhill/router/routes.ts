import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_jokerhill/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_jokerhill/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "",
        name: "Login",
        component: () => import("app/template/set_jokerhill/pages/HomePage/Home.vue"),
        meta: {
          login: true
        }
      },
      {
        path: "/lobby",
        name: "lobby",
        component: () => import("app/template/set_jokerhill/pages/HomePage/Lobby.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_jokerhill/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set_jokerhill/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_jokerhill/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set_jokerhill/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_jokerhill/pages/HomePage/Promotion.vue")
      },
      {
        path: "/download",
        name: "download",
        component: () => import("app/template/set_jokerhill/pages/HomePage/Download.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/set_jokerhill/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/set_jokerhill/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPassForgetPassword/:account/:token",
        name: "QuickPassForgetPassword",
        component: () => import("app/template/set_jokerhill/pages/QuickPassForgetPassword/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/set_jokerhill/pages/HomePage/ContactUs.vue")
      },
      {
        path: "webInformationCms/:id?",
        name: "WebInformationCms",
        component: () => import("app/template/set_jokerhill/pages/HomePage/WebInformation/Index.vue")
      },
      {
        path: "quickPass/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/set_jokerhill/pages/QuickPassForgetPassword/Index.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_jokerhill/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "memberProfile",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberProfile.vue")
      },
      {
        path: "/inbox",
        name: "memberInbox",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberInbox.vue")
      },
      {
        path: "/bank",
        name: "memberBank",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberBank.vue")
      },
      {
        path: "/bankAdd/:id?",
        name: "memberBankAdd",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberBankAdd.vue")
      },
      {
        path: "/changePassword",
        name: "memberChangePassword",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberChangePassword.vue")
      },
      {
        path: "/history",
        name: "history",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberHistory.vue")
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberOrders.vue")
      },
      {
        path: "/deposit",
        name: "MemberDeposit",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberDeposit.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
        }
      },
      {
        path: "/withdrawal",
        name: "MemberWithdrawal",
        component: () => import("app/template/set_jokerhill/pages/MemberCenter/MemberWithdrawal.vue")
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
