import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/okbet_redBlack/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      // {
      //   path: "/lobby",
      //   name: "lobby",
      //   component: () => import("app/template/okbet_redBlack/pages/HomePage/Lobby.vue")
      // },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/okbet_redBlack/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/okbet_redBlack/pages/GameLobby/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/Promotion.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/PromotionDetail.vue")
      },
      {
        path: "/sabaPage",
        name: "SabaPage",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/SabaPage/Index.vue")
      },
      // {
      //   path: "/referral",
      //   name: "Referral",
      //   component: () => import("app/template/okbet_redBlack/pages/HomePage/Referral/Index.vue"),
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
        component: () => import("app/template/okbet_redBlack/pages/HomePage/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/okbet_redBlack/pages/HomePage/Collaboration/Index.vue")
      },
      // {
      //   path: "/news",
      //   name: "News",
      //   component: () => import("app/template/okbet_redBlack/pages/HomePage/News.vue")
      // },
      // {
      //   path: "/newsDetail/:id",
      //   name: "NewsDetail",
      //   component: () => import("app/template/okbet_redBlack/pages/HomePage/NewsDetail.vue")
      // },
      // {
      //   path: "/download",
      //   name: "download",
      //   component: () => import("app/template/okbet_redBlack/pages/HomePage/Download.vue")
      // },
      {
        path: "/info-center",
        name: "infoCenter",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/infoCenter.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "WebInformationCms",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/WebInformation.vue")
      },
      {
        path: "/webInformation",
        name: "webInformation",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/WebInformation.vue"),
        children: [
          {
            path: "AboutUs",
            name: "AboutUs",
            component: () => import("app/template/okbet_redBlack/layouts/content/WebInformation/AboutUs.vue")
          },
          {
            path: "TermAndCondition",
            name: "TermAndCondition",
            component: () => import("app/template/okbet_redBlack/layouts/content/WebInformation/TermAndCondition.vue")
          },
          {
            path: "PrivacyPolicy",
            name: "PrivacyPolicy",
            component: () => import("app/template/okbet_redBlack/layouts/content/WebInformation/PrivacyPolicy.vue")
          },
          {
            path: "ResponsibleGaming",
            name: "ResponsibleGaming",
            component: () => import("app/template/okbet_redBlack/layouts/content/WebInformation/ResponsibleGaming.vue")
          }
        ]
      },
      // {
      //   path: "forgotPass",
      //   name: "ForgotPass",
      //   component: () => import("app/template/okbet_redBlack/pages/ForgotPass/Step1.vue")
      // },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/okbet_redBlack/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:token/:account?",
        name: "QuickPass",
        component: () => import("app/template/okbet_redBlack/pages/QuickPass/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/ContactUs.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/okbet_redBlack/pages/HomePage/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/okbet_redBlack/pages/HomePage/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/okbet_redBlack/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "MemberLayout",
        component: () => import("app/template/okbet_redBlack/pages/MemberCenter/Index.vue"),
        children: [
          {
            path: "",
            name: "memberProfile",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberProfile.vue"),
            children: [
              {
                path: "changePassword",
                name: "memberChangePassword",
                component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberChangePassword.vue")
              },
              {
                path: "changeWithdrawalPassword",
                name: "memberChangeWithdrawalPassword",
                component: () =>
                  import("app/template/okbet_redBlack/pages/MemberCenter/MemberChangeWithdrawalPassword.vue")
              }
            ]
          },
          {
            path: "profile-detail",
            name: "memberProfileDetail",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberProfileDetail.vue")
          },
          {
            path: "inbox",
            name: "memberInbox",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberInbox.vue")
          },
          {
            path: "bank",
            name: "memberBank",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberBank.vue")
          },
          {
            path: "bankAdd/:id?",
            name: "memberBankAdd",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberBankAdd.vue")
          },
          {
            path: "history",
            name: "history",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberHistory.vue")
          },
          {
            path: "orders",
            name: "orders",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberOrders.vue")
          },
          {
            path: "deposit",
            name: "MemberDeposit",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberDeposit.vue"),
            meta: {
              triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
            }
          },
          {
            path: "withdrawal",
            name: "MemberWithdrawal",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberWithdrawal.vue")
          },
          {
            path: "memberKyc",
            name: "MemberKyc",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberKYC.vue")
          },
          {
            path: "memberFunds",
            name: "MemberFunds",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberFunds.vue")
          },
          {
            path: "memberVip",
            name: "MemberVip",
            component: () => import("app/template/okbet_redBlack/pages/MemberCenter/MemberVip.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/tgLogin",
    name: "tgLogin",
    component: () => import("app/template/okbet_redBlack/pages/tgWebAppLogin.vue")
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
