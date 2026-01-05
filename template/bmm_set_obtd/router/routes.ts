import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/bmm_set_obtd/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "/lobby",
        name: "lobby",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Lobby.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/bmm_set_obtd/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/bmm_set_obtd/pages/GameLobby/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Promotion.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/PromotionDetail.vue")
      },
      {
        path: "/ai_agent",
        name: "AIAgent",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/AIAgent/Index.vue"),
        meta: {
          needAuth: true
        }
      },
      {
        path: "/sabaPage",
        name: "SabaPage",
        component: () => import("app/template/bmm_set_obtd/pages/SabaPage/Index.vue")
      },
      // {
      //   path: "/referral",
      //   name: "Referral",
      //   component: () => import("app/template/bmm_set_obtd/pages/HomePage/Referral/Index.vue"),
      //   meta: {
      //     needAuth: true
      //   }
      // },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Collaboration/Index.vue")
      },
      {
        path: "/news",
        name: "News",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/News.vue")
      },
      {
        path: "/newsDetail/:id",
        name: "NewsDetail",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/NewsDetail.vue")
      },
      {
        path: "/download",
        name: "download",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/Download.vue")
      },
      {
        path: "/info-center",
        name: "infoCenter",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/infoCenter.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "WebInformationCms",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/WebInformation.vue")
      },
      {
        path: "/webInformation",
        name: "webInformation",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/WebInformation.vue"),
        children: [
          {
            path: "AboutUs",
            name: "AboutUs",
            component: () => import("app/template/bmm_set_obtd/layouts/content/WebInformation/AboutUs.vue")
          },
          {
            path: "TermAndCondition",
            name: "TermAndCondition",
            component: () => import("app/template/bmm_set_obtd/layouts/content/WebInformation/TermAndCondition.vue")
          },
          {
            path: "PrivacyPolicy",
            name: "PrivacyPolicy",
            component: () => import("app/template/bmm_set_obtd/layouts/content/WebInformation/PrivacyPolicy.vue")
          },
          {
            path: "ResponsibleGaming",
            name: "ResponsibleGaming",
            component: () => import("app/template/bmm_set_obtd/layouts/content/WebInformation/ResponsibleGaming.vue")
          }
        ]
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/bmm_set_obtd/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/bmm_set_obtd/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:token/:account?",
        name: "QuickPass",
        component: () => import("app/template/bmm_set_obtd/pages/QuickPass/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/ContactUs.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/bmm_set_obtd/pages/HomePage/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/bmm_set_obtd/pages/HomePage/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/bmm_set_obtd/pages/HomePage/index.vue"),
    meta: {
      needAuth: true,
      className: "without-padding"
    },
    children: [
      {
        path: "",
        name: "MemberLayout",
        component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/Index.vue"),
        children: [
          {
            path: "",
            name: "memberProfile",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberProfile.vue"),
            children: [
              {
                path: "changePassword",
                name: "memberChangePassword",
                component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberChangePassword.vue")
              },
              {
                path: "changeWithdrawalPassword",
                name: "memberChangeWithdrawalPassword",
                component: () =>
                  import("app/template/bmm_set_obtd/pages/MemberCenter/MemberChangeWithdrawalPassword.vue")
              }
            ]
          },
          {
            path: "profile-detail",
            name: "memberProfileDetail",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberProfileDetail.vue")
          },
          {
            path: "bet-limit-List",
            name: "memberBetLimitList",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberBetLimitList.vue")
          },
          {
            path: "bet-limit-add/:id?",
            name: "memberBetLimitAdd",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberBetLimitAdd.vue")
          },
          {
            path: "betting-restriction",
            name: "memberBettingRestriction",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberBettingRestriction.vue")
          },
          {
            path: "inbox",
            name: "memberInbox",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberInbox.vue")
          },
          {
            path: "bank",
            name: "memberBank",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberBank.vue")
          },
          {
            path: "bankAdd/:id?",
            name: "memberBankAdd",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberBankAdd.vue")
          },
          {
            path: "history",
            name: "history",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberHistory.vue"),
            children: [
              {
                path: "all",
                name: "HistoryAll",
                component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberHistory.vue")
              },
              {
                path: "member",
                name: "HistoryMember",
                component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberHistory.vue")
              },
              {
                path: "ai",
                name: "HistoryAi",
                component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberHistory.vue")
              }
            ]
          },
          {
            path: "orders",
            name: "orders",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberOrders.vue")
          },
          {
            path: "deposit",
            name: "MemberDeposit",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberDeposit.vue"),
            meta: {
              triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
            }
          },
          {
            path: "withdrawal",
            name: "MemberWithdrawal",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberWithdrawal.vue")
          },
          {
            path: "memberKyc",
            name: "MemberKyc",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberKYC.vue")
          },
          {
            path: "memberFunds",
            name: "MemberFunds",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberFunds.vue")
          },
          {
            path: "memberVip",
            name: "MemberVip",
            component: () => import("app/template/bmm_set_obtd/pages/MemberCenter/MemberVip.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/tgLogin",
    name: "tgLogin",
    component: () => import("app/template/bmm_set_obtd/pages/tgWebAppLogin.vue")
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
