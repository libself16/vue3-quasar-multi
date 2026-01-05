import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/:catchAll(.*)*",
    component: () => import("app/template/set_r022/pages/Error404.vue")
  },
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_r022/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_r022/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set_r022/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/set_r022/pages/GameLobby/Index.vue")
      },
      {
        path: "/sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_r022/pages/SabaPage/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set_r022/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_r022/pages/HomePage/Promotion/Index.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/set_r022/pages/HomePage/Promotion/PromotionDetail.vue")
      },
      {
        path: "/referral",
        name: "Referral",
        component: () => import("app/template/set_r022/pages/HomePage/Referral/Index.vue"),
        meta: {
          needAuth: true
        }
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r022/pages/HomePage/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r022/pages/HomePage/Collaboration.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "WebInformationCms",
        component: () => import("app/template/set_r022/pages/HomePage/WebInformation.vue")
      },
      {
        path: "/webInformation",
        name: "webInformation",
        component: () => import("app/template/set_r022/pages/HomePage/WebInformation.vue"),
        children: [
          {
            path: "AboutUs",
            name: "AboutUs",
            component: () => import("app/template/set_r022/layouts/content/WebInformation/AboutUs.vue")
          },
          {
            path: "TermAndCondition",
            name: "TermAndCondition",
            component: () => import("app/template/set_r022/layouts/content/WebInformation/TermAndCondition.vue")
          },
          {
            path: "PrivacyPolicy",
            name: "PrivacyPolicy",
            component: () => import("app/template/set_r022/layouts/content/WebInformation/PrivacyPolicy.vue")
          },
          {
            path: "ResponsibleGaming",
            name: "ResponsibleGaming",
            component: () => import("app/template/set_r022/layouts/content/WebInformation/ResponsibleGaming.vue")
          }
        ]
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/set_r022/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/set_r022/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:token/:account?",
        name: "QuickPass",
        component: () => import("app/template/set_r022/pages/QuickPass/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/set_r022/pages/ContactUs/Index.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set_r022/pages/HomePage/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_r022/pages/HomePage/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_r022/pages/HomePage/index.vue"),
    meta: {
      needAuth: true,
      className: "without-padding"
    },
    children: [
      {
        path: "",
        name: "memberProfile",
        component: () => import("app/template/set_r022/pages/MemberCenter/MemberProfile.vue")
      },
      {
        path: "inbox",
        name: "memberInbox",
        component: () => import("app/template/set_r022/pages/MemberCenter/MemberInbox.vue")
      },
      {
        path: "history",
        name: "history",
        component: () => import("app/template/set_r022/pages/MemberCenter/MemberHistory.vue"),
        children: [
          {
            path: "all",
            name: "HistoryAll",
            component: () => import("app/template/set_r022/pages/MemberCenter/MemberHistory.vue")
          },
          {
            path: "member",
            name: "HistoryMember",
            component: () => import("app/template/set_r022/pages/MemberCenter/MemberHistory.vue")
          },
          {
            path: "ai",
            name: "HistoryAi",
            component: () => import("app/template/set_r022/pages/MemberCenter/MemberHistory.vue")
          }
        ]
      },
      {
        path: "orders",
        name: "orders",
        component: () => import("app/template/set_r022/pages/MemberCenter/MemberOrders.vue")
      },
      {
        path: "memberVip",
        name: "memberVip",
        component: () => import("app/template/set_r022/pages/MemberCenter/MemberVip.vue")
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
