import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_r016/pages/HomePage/index.vue"),
    meta: {
      keepScrollPosition: true
    },
    children: [
      {
        path: "home/:gameType",
        name: "home",
        component: () => import("app/template/set_r016/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_r016/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set_r016/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_r016/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set_r016/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_r016/pages/HomePage/Promotion.vue")
      },
      {
        path: "/webInformationCms/:id?",
        name: "webInformation",
        component: () => import("app/template/set_r016/pages/HomePage/WebInformation.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/set_r016/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/set_r016/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPassForgetPassword/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/set_r016/pages/QuickPassForgetPassword/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/set_r016/pages/HomePage/ContactUs.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set_r016/pages/HomePage/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_r016/pages/HomePage/ReferralRebate/Index.vue")
          }
        ]
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r016/pages/HomePage/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r016/pages/HomePage/Collaboration/Index.vue")
      },
      {
        path: "/shareholderPlatform",
        name: "ShareholderPlatform",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r016/pages/HomePage/ShareholderPlatform/Index.vue")
      },
      {
        path: "/inviteBonus",
        name: "InviteBonus",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r016/pages/HomePage/InviteBonus/Index.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_r016/pages/HomePage/index.vue"),
    meta: {
      needAuth: true,
      keepScrollPosition: true
    },
    children: [
      {
        path: "",
        name: "memberCenter",
        component: () => import("app/template/set_r016/pages/MemberCenter/Index.vue")
      },
      {
        path: "/profile",
        name: "memberProfile",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberProfile.vue")
      },
      {
        path: "/inbox",
        name: "memberInbox",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberInbox.vue")
      },
      {
        path: "/bank",
        name: "memberBank",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberBank.vue")
      },
      {
        path: "/bankAdd/:id?",
        name: "memberBankAdd",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberBankAdd.vue")
      },
      {
        path: "/changePassword",
        name: "memberChangePassword",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberChangePassword.vue")
      },
      {
        path: "/changeWithdrawalPassword",
        name: "memberChangeWithdrawalPassword",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberChangeWithdrawalPassword.vue")
      },
      {
        path: "/history",
        name: "history",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberHistory.vue")
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberOrders.vue")
      },
      {
        path: "/deposit",
        name: "MemberDeposit",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberDeposit.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
        }
      },
      {
        path: "/withdrawal",
        name: "MemberWithdrawal",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberWithdrawal.vue")
      },
      {
        path: "/vip",
        name: "memberVip",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberVip.vue")
      },
      {
        path: "/chatroom",
        name: "memberChatRoom",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberChatRoom.vue")
      },
      {
        path: "/chat/:memberId",
        name: "memberChat",
        component: () => import("app/template/set_r016/pages/MemberCenter/MemberChat.vue")
      },
      {
        path: "/rouletteGame",
        name: "RouletteGame",
        meta: {},
        component: () => import("app/template/set_r016/pages/RouletteGame/Index.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("app/template/set_r016/pages/Login/Index.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]
    },
    component: () => import("app/template/set_r016/pages/Register/Index.vue")
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
