import type { RouteRecordRaw, NavigationGuardWithThis } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    component: () => import("app/template/set_sjpn2/layouts/mainLayout.vue"),
    meta: {},
    children: [
      {
        path: "",
        component: () => import("app/template/set_sjpn2/pages/HomePage/Index.vue"),
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Login"
        },
        children: [
          {
            path: "",
            name: "HomePage",
            component: () => import("app/template/set_sjpn2/pages/HomePage/Home.vue"),
            meta: {
              triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
            }
          },
          {
            path: "productLobby/:gameType",
            name: "ProductLobby",
            component: () => import("app/template/set_sjpn2/pages/ProductLobby/Index.vue")
          },
          {
            path: "gameLobby/:gameType/:productCode?",
            name: "GameLobby",
            component: () => import("app/template/set_sjpn2/pages/GameLobby/Index.vue")
          },
          {
            path: "favouriteLobby",
            name: "FavouriteLobby",
            component: () => import("app/template/set_sjpn2/pages/FavouriteLobby/Index.vue")
          },
          {
            path: "popularLobby",
            name: "PopularLobby",
            component: () => import("app/template/set_sjpn2/pages/PopularLobby/Index.vue")
          },
          {
            path: "forgotPass",
            name: "ForgotPass",
            component: () => import("app/template/set_sjpn2/pages/ForgotPass/Step1.vue")
          },
          {
            path: "forgotPass/:token",
            component: () => import("app/template/set_sjpn2/pages/ForgotPass/Step2.vue")
          },
          {
            path: "webInformationCms/:id",
            name: "WebInformation",
            component: () => import("app/template/set_sjpn2/pages/WebInformation/Index.vue")
          },
          {
            path: "termsOfUse",
            name: "TermsOfUse",
            component: () => import("app/template/set_sjpn2/pages/TermsOfUse/Index.vue"),
            children: [
              {
                path: "generalTerms",
                name: "GeneralTerms",
                component: () => import("app/template/set_sjpn2/pages/TermsOfUse/GeneralTerms.vue")
              },
              {
                path: "campaignterms",
                name: "CampaignTerms",
                component: () => import("app/template/set_sjpn2/pages/TermsOfUse/CampaignTerms.vue")
              }
            ]
          },
          {
            path: "favouriteLobby",
            name: "favouriteLobby",
            component: () => import("app/template/set_sjpn2/pages/FavouriteLobby/Index.vue")
          }
        ]
      },
      {
        path: "login",
        name: "Login",
        component: () => import("app/template/set_sjpn2/pages/Login/Index.vue")
      },
      {
        path: "quickPass/:account/:token",
        component: () => import("app/template/set_sjpn2/pages/HomePage/Index.vue"),
        children: [
          {
            path: "",
            name: "QuickPass",
            component: () => import("app/template/set_sjpn2/pages/QuickPass/Index.vue")
          }
        ]
      },
      {
        path: "/profile",
        name: "MemberPage",
        component: () => import("app/template/set_sjpn2/pages/HomePage/Index.vue"),
        meta: {
          needAuth: true,
          goRouteIfNoToken: "Login"
        },
        children: [
          {
            path: "",
            component: () => import("app/template/set_sjpn2/pages/MemberCenter/Index.vue"),
            children: [
              // {
              //   path: "",
              //   name: "MemberProfile",
              //   component: () => import("app/template/set_sjpn2/pages/MemberCenter/components/Profile/Detail.vue")
              // },
              {
                path: "vip",
                name: "MemberVip",
                component: () => import("app/template/set_sjpn2/pages/MemberCenter/Vip.vue")
              },
              {
                path: "history",
                name: "MemberHistory",
                component: () => import("app/template/set_sjpn2/pages/MemberCenter/History.vue")
              },
              // {
              //   path: "kyc",
              //   name: "MemberKyc",
              //   component: () => import("app/template/set_sjpn2/pages/MemberCenter/Kyc.vue")
              // },
              {
                path: "membershipManagement",
                name: "MembershipManagement",
                component: () => import("app/template/set_sjpn2/pages/MemberCenter/MembershipManagement.vue")
              }
            ]
          }
        ]
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  // console.log(to, "to")
  // console.log(from, "from")
  // console.log(next, "next")
  next()
}
