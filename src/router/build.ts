import type { RouteRecordRaw, NavigationGuardWithThis } from "vue-router"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/okbet_green/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/okbet_green/pages/HomePage/Home.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/okbet_green/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/okbet_green/pages/GameLobby/Index.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/okbet_green/pages/HomePage/CmsHome.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/okbet_green/pages/HomePage/Promotion.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/okbet_green/pages/HomePage/PromotionDetail.vue")
      },
      // {
      //   path: "/referral",
      //   name: "Referral",
      //   component: () => import("app/template/okbet_green/pages/HomePage/Referral/Index.vue"),
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
        component: () => import("app/template/okbet_green/pages/HomePage/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/okbet_green/pages/HomePage/Collaboration/Index.vue")
      },
      {
        path: "/news",
        name: "News",
        component: () => import("app/template/okbet_green/pages/HomePage/News.vue")
      },
      {
        path: "/newsDetail/:id",
        name: "NewsDetail",
        component: () => import("app/template/okbet_green/pages/HomePage/NewsDetail.vue")
      },
      {
        path: "/download",
        name: "download",
        component: () => import("app/template/okbet_green/pages/HomePage/Download.vue")
      },
      {
        path: "/info-center",
        name: "infoCenter",
        component: () => import("app/template/okbet_green/pages/HomePage/infoCenter.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "WebInformationCms",
        component: () => import("app/template/okbet_green/pages/HomePage/WebInformation.vue")
      },
      {
        path: "/webInformation",
        name: "webInformation",
        component: () => import("app/template/okbet_green/pages/HomePage/WebInformation.vue"),
        children: [
          {
            path: "AboutUs",
            name: "AboutUs",
            component: () => import("app/template/okbet_green/layouts/content/WebInformation/AboutUs.vue")
          },
          {
            path: "TermAndCondition",
            name: "TermAndCondition",
            component: () => import("app/template/okbet_green/layouts/content/WebInformation/TermAndCondition.vue")
          },
          {
            path: "PrivacyPolicy",
            name: "PrivacyPolicy",
            component: () => import("app/template/okbet_green/layouts/content/WebInformation/PrivacyPolicy.vue")
          },
          {
            path: "ResponsibleGaming",
            name: "ResponsibleGaming",
            component: () => import("app/template/okbet_green/layouts/content/WebInformation/ResponsibleGaming.vue")
          }
        ]
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/okbet_green/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/okbet_green/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/okbet_green/pages/QuickPass/Index.vue")
      },
      {
        path: "/ContactUs",
        name: "ContactUs",
        component: () => import("app/template/okbet_green/pages/HomePage/ContactUs.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/okbet_green/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "MemberLayout",
        component: () => import("app/template/okbet_green/pages/MemberCenter/Index.vue"),
        children: [
          {
            path: "",
            name: "memberProfile",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberProfile.vue"),
            children: [
              // {
              //   path: "",
              //   name: "MemberProfile",
              //   component: () => import("app/template/set_sjpn2/pages/MemberCenter/components/Profile/Detail.vue")
              // },
              {
                path: "changePassword",
                name: "memberChangePassword",
                component: () => import("app/template/okbet_green/pages/MemberCenter/MemberChangePassword.vue")
              },
              {
                path: "changeWithdrawalPassword",
                name: "memberChangeWithdrawalPassword",
                component: () =>
                  import("app/template/okbet_green/pages/MemberCenter/MemberChangeWithdrawalPassword.vue")
              }
            ]
          },
          {
            path: "profile-detail",
            name: "memberProfileDetail",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberProfileDetail.vue")
          },
          {
            path: "inbox",
            name: "memberInbox",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberInbox.vue")
          },
          // {
          //   path: "bank",
          //   name: "memberBank",
          //   component: () => import("app/template/okbet_green/pages/MemberCenter/MemberBank.vue")
          // },
          // {
          //   path: "bankAdd/:id?",
          //   name: "memberBankAdd",
          //   component: () => import("app/template/okbet_green/pages/MemberCenter/MemberBankAdd.vue")
          // },
          // {
          //   path: "deposit",
          //   name: "MemberDeposit",
          //   component: () => import("app/template/okbet_green/pages/MemberCenter/MemberDeposit.vue")
          // },
          // {
          //   path: "withdrawal",
          //   name: "MemberWithdrawal",
          //   component: () => import("app/template/okbet_green/pages/MemberCenter/MemberWithdrawal.vue")
          // },
          {
            path: "history",
            name: "history",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberHistory.vue")
          },
          {
            path: "orders",
            name: "orders",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberOrders.vue")
          },
          {
            path: "memberKyc",
            name: "MemberKyc",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberKYC.vue")
          },
          {
            path: "memberFunds",
            name: "MemberFunds",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberFunds.vue")
          },
          {
            path: "memberVip",
            name: "MemberVip",
            component: () => import("app/template/okbet_green/pages/MemberCenter/MemberVip.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/mayaLogin",
    name: "mayaLogin",
    component: () => import("app/template/okbet_green/pages/mayaLogin.vue")
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  // console.log(to, "to")
  // console.log(from, "from")
  // console.log(next, "next")
  next()
}
