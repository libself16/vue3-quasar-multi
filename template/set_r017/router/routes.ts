import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_r017/layout/Index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_r017/pages/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/ProductLobby.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/GameLobby.vue")
      },
      {
        path: "cmsCustomPage/:cmsCustomPageId",
        name: "CmsCustomPage",
        component: () => import("app/template/set_r017/pages/CmsCustomPage.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/SabaPage/Index.vue")
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r017/pages/Collaboration/Index.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set_r017/pages/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_r017/pages/ReferralRebate/Index.vue")
          }
        ]
      },
      {
        path: "/ai_agent",
        name: "AIAgent",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/AIAgent/Index.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_r017/pages/Promotion.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/set_r017/pages/PromotionDetail.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/set_r017/pages/PromotionDetail.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "webInformation",
        component: () => import("app/template/set_r017/pages/WebInformation.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        component: () => import("app/template/set_r017/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        component: () => import("app/template/set_r017/pages/ForgotPass/Step2.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_r017/layout/Index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "memberCenter",
        component: () => import("app/template/set_r017/pages/Member/Index.vue"),
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        children: [
          {
            path: "",
            name: "memberSummary",
            component: () => import("app/template/set_r017/pages/Member/MemberSummary.vue")
          },
          {
            path: "profile",
            name: "memberProfile",
            component: () => import("app/template/set_r017/pages/Member/MemberProfile.vue")
          },
          {
            path: "vip",
            name: "MemberVip",
            component: () => import("app/template/set_r017/pages/Member/MemberVip.vue")
          },
          {
            path: "deposit",
            name: "MemberDeposit",
            meta: {
              footerContentClass: ["hidden"]
            },
            component: () => import("app/template/set_r017/pages/Member/MemberDeposit.vue")
          },
          {
            path: "withdraw",
            name: "MemberWithdraw",
            meta: {
              footerContentClass: ["hidden"]
            },
            component: () => import("app/template/set_r017/pages/Member/MemberWithdraw .vue")
          },
          {
            path: "bank",
            name: "memberBank",
            meta: {
              footerContentClass: ["hidden"]
            },
            component: () => import("app/template/set_r017/pages/Member/MemberBank.vue")
          },
          {
            path: "bankAdd/:id?",
            name: "memberBankAdd",
            meta: {
              footerContentClass: ["hidden"]
            },
            component: () => import("app/template/set_r017/pages/Member/MemberBankAdd.vue")
          },
          {
            path: "order",
            name: "MemberOrder",
            component: () => import("app/template/set_r017/pages/Member/MemberOrder.vue")
          },
          {
            path: "inbox",
            name: "memberInbox",
            component: () => import("app/template/set_r017/pages/Member/MemberInbox.vue")
          }
        ]
      },
      {
        path: "profileCenter",
        name: "memberProfileCenter",
        component: () => import("app/template/set_r017/pages/MemberWithoutNav/Index.vue"),
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        children: [
          {
            path: "detail",
            name: "MemberProfileDetail",
            component: () => import("app/template/set_r017/pages/MemberWithoutNav/MemberProfileDetail.vue")
          },
          {
            path: "loginPassword",
            name: "MemberLoginPassword",
            component: () => import("app/template/set_r017/pages/MemberWithoutNav/MemberLoginPassword.vue")
          },
          {
            path: "withdrawPassword",
            name: "MemberWithdrawPassword",
            component: () => import("app/template/set_r017/pages/MemberWithoutNav/MemberWithdrawPassword.vue")
          }
        ]
      },
      {
        path: "history",
        name: "history",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/History.vue"),
        children: [
          {
            path: "all",
            name: "HistoryAll",
            component: () => import("app/template/set_r017/pages/History.vue")
          },
          {
            path: "member",
            name: "HistoryMember",
            component: () => import("app/template/set_r017/pages/History.vue")
          },
          {
            path: "ai",
            name: "HistoryAi",
            component: () => import("app/template/set_r017/pages/History.vue")
          }
        ]
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
