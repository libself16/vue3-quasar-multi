import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    component: () => import("app/template/set33_GREEN/pages/HomePage/Index.vue"),
    children: [
      {
        path: "",
        name: "HomePage",
        component: () => import("app/template/set33_GREEN/pages/HomePage/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "login",
        name: "Login",
        component: () => import("app/template/set33_GREEN/pages/Login/Index.vue")
      },
      {
        path: "register",
        name: "Register",
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]
        },
        component: () => import("app/template/set33_GREEN/pages/Register/Index.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        component: () => import("app/template/set33_GREEN/pages/ProductLobby/Index.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set33_GREEN/pages/GameLobby/Index.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set33_GREEN/pages/SabaPage/Index.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        component: () => import("app/template/set33_GREEN/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        component: () => import("app/template/set33_GREEN/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:account/:token",
        name: "QuickPass",
        component: () => import("app/template/set33_GREEN/pages/QuickPass/Index.vue")
      },
      {
        path: "/promotion",
        name: "Promotion",
        component: () => import("app/template/set33_GREEN/pages/HomePage/Promotion.vue")
      },
      {
        path: "cmsHome/:cmsId",
        name: "CmsHome",
        component: () => import("app/template/set33_GREEN/pages/HomePage/CmsHome.vue")
      },
      {
        path: "webInformationCms/:id?",
        name: "WebInformationCms",
        component: () => import("app/template/set33_GREEN/pages/WebInformationCms/Index.vue")
      },
      {
        path: "download",
        name: "download",
        component: () => import("app/template/set33_GREEN/pages/HomePage/Download.vue")
      }
    ]
  },
  {
    path: "/profile",
    name: "MemberPage",
    component: () => import("app/template/set33_GREEN/pages/HomePage/Index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "MemberIndex",
        component: () => import("app/template/set33_GREEN/pages/MemberCenter/Index.vue"),
        children: [
          {
            path: "",
            name: "MemberProfile",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/Profile.vue"),
            children: [
              {
                path: "",
                name: "ProfileDetail",
                component: () => import("app/template/set33_GREEN/pages/MemberCenter/components/Profile/Detail.vue")
              },
              {
                path: "/bank",
                name: "ProfileBank",
                component: () => import("app/template/set33_GREEN/pages/MemberCenter/components/Profile/Bank.vue")
              },
              {
                path: "/password",
                name: "ProfilePassword",
                component: () => import("app/template/set33_GREEN/pages/MemberCenter/components/Profile/Password.vue")
              },
              {
                path: "/inbox",
                name: "ProfileInbox",
                component: () => import("app/template/set33_GREEN/pages/MemberCenter/components/Profile/Inbox.vue")
              }
            ]
          },
          {
            path: "/deposit",
            name: "MemberDeposit",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/Deposit.vue"),
            meta: {
              triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
            }
          },
          {
            path: "/withdrawal",
            name: "MemberWithdrawal",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/Withdrawal.vue")
          },
          {
            path: "/history",
            name: "MemberHistory",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/History.vue")
          },
          {
            path: "/orders",
            name: "MemberOrder",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/Order.vue")
          },
          {
            path: "/vip",
            name: "MemberVip",
            component: () => import("app/template/set33_GREEN/pages/MemberCenter/MemberVip.vue")
          }
          // {
          //   path: "/referral",
          //   name: "Referral",
          //   component: () => import("app/template/set33_GREEN/pages/MemberCenter/Refer.vue")
          // }
        ]
      }
    ]
  },
  {
    path: "/deposit-qr-code",
    name: "DepositQRCode",
    component: () => import("app/template/set33_GREEN/pages/DepositQRCode/Index.vue")
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
