import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set49/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set49/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "/lobby",
        name: "lobby",
        component: () => import("app/template/set49/pages/HomePage/Lobby.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set49/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set49/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set49/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set49/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set49/pages/HomePage/Promotion.vue")
      },
      {
        path: "/download",
        name: "download",
        component: () => import("app/template/set49/pages/HomePage/Download.vue")
      },
      {
        path: "/webInformationCms/:id?",
        name: "webInformation",
        component: () => import("app/template/set49/pages/HomePage/WebInformation.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/set49/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/set49/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPassForgetPassword/:account/:token",
        name: "QuickPassForgetPassword",
        component: () => import("app/template/set49/pages/QuickPassForgetPassword/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/set49/pages/HomePage/ContactUs.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set49/pages/HomePage/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set49/pages/HomePage/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set49/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "memberProfile",
        component: () => import("app/template/set49/pages/MemberCenter/MemberProfile.vue")
      },
      {
        path: "/inbox",
        name: "memberInbox",
        component: () => import("app/template/set49/pages/MemberCenter/MemberInbox.vue")
      },
      {
        path: "/bank",
        name: "memberBank",
        component: () => import("app/template/set49/pages/MemberCenter/MemberBank.vue")
      },
      {
        path: "/bankAdd/:id?",
        name: "memberBankAdd",
        component: () => import("app/template/set49/pages/MemberCenter/MemberBankAdd.vue")
      },
      {
        path: "/changePassword",
        name: "memberChangePassword",
        component: () => import("app/template/set49/pages/MemberCenter/MemberChangePassword.vue")
      },
      {
        path: "/changeWithdrawalPassword",
        name: "memberChangeWithdrawalPassword",
        component: () => import("app/template/set49/pages/MemberCenter/MemberChangeWithdrawalPassword.vue")
      },
      {
        path: "/history",
        name: "history",
        component: () => import("app/template/set49/pages/MemberCenter/MemberHistory.vue")
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("app/template/set49/pages/MemberCenter/MemberOrders.vue")
      },
      {
        path: "/deposit",
        name: "MemberDeposit",
        component: () => import("app/template/set49/pages/MemberCenter/MemberDeposit.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
        }
      },
      {
        path: "/withdrawal",
        name: "MemberWithdrawal",
        component: () => import("app/template/set49/pages/MemberCenter/MemberWithdrawal.vue")
      },
      {
        path: "memberVip",
        name: "MemberVip",
        component: () => import("app/template/set49/pages/MemberCenter/MemberVip.vue")
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
