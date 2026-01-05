import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export const routes = [
  {
    path: "/",
    component: () => import("app/template/set_UFAONG/layouts/mainLayout.vue"),
    meta: {},
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("app/template/set_UFAONG/pages/Home/Index.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "/promotions",
        name: "Promotions",
        component: () => import("app/template/set_UFAONG/pages/Promotions/Index.vue"),
        meta: {
          headerTitle: "menu.promotions"
        }
      },
      {
        path: "/account",
        name: "Account",
        component: () => import("app/template/set_UFAONG/pages/Account/Index.vue"),
        meta: {
          headerTitle: "menu.account",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/account/inbox",
        name: "Inbox",
        component: () => import("app/template/set_UFAONG/pages/Account/Inbox/Index.vue"),
        meta: {
          headerTitle: "menu.inbox",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/account/profile",
        name: "Profile",
        component: () => import("app/template/set_UFAONG/pages/Account/Profile/Index.vue"),
        meta: {
          headerTitle: "menu.profile",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      // {
      //   path: "/account/Referral",
      //   name: "Referral",
      //   component: () => import("app/template/set_UFAONG/pages/Account/Referral/Index.vue"),
      //   meta: {
      //     headerTitle: "menu.referral"
      //   }
      // },
      // {
      //   path: "/account/memberVip",
      //   name: "Vip",
      //   component: () => import("app/template/set_UFAONG/pages/Account/Vip/Index.vue"),
      //   meta: {
      //     headerTitle: "menu.vip"
      //   }
      // },
      // {
      //   path: "/aboutUs",
      //   name: "AboutUs",
      //   component: () => import("app/template/set_UFAONG/pages/PolicyPages/AboutUs.vue"),
      //   meta: {
      //     headerTitle: "menu.about_us"
      //   }
      // },
      {
        path: "/contactUs",
        name: "ContactUs",
        component: () => import("app/template/set_UFAONG/pages/ContactUs/Index.vue"),
        meta: {
          headerTitle: "home.contact_us"
        }
      },
      // {
      //   path: "/download",
      //   name: "Download",
      //   component: () => import("app/template/set_UFAONG/pages/Download/Index.vue"),
      //   meta: {
      //     headerTitle: "menu.download"
      //   }
      // },
      {
        path: "/webInformationCms",
        name: "WebInformationCms",
        component: () => import("app/template/set_UFAONG/pages/PolicyPages/index.vue"),
        meta: {
          headerTitle: "common.tip.terms_conditions"
        }
      },
      // {
      //   path: "/termsConditions",
      //   name: "TermsConditions",
      //   component: () => import("app/template/set_UFAONG/pages/PolicyPages/TermsConditions.vue"),
      //   meta: {
      //     headerTitle: "common.tip.terms_conditions"
      //   }
      // },
      // {
      //   path: "/privacyPolicy",
      //   name: "PrivacyPolicy",
      //   component: () => import("app/template/set_UFAONG/pages/PolicyPages/PrivacyPolicy.vue"),
      //   meta: {
      //     headerTitle: "home.privacy_policy"
      //   }
      // },
      // {
      //   path: "/responsibleGaming",
      //   name: "ResponsibleGaming",
      //   component: () => import("app/template/set_UFAONG/pages/PolicyPages/ResponsibleGaming.vue"),
      //   meta: {
      //     headerTitle: "home.responsible_gaming"
      //   }
      // },
      {
        path: "/gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set_UFAONG/pages/Lobby/GameLobby.vue"),
        meta: {
          headerTitle: "menu.game_list"
        }
      },
      {
        path: "/sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_UFAONG/pages/SabaPage/Index.vue"),
        meta: {
          headerTitle: "common.btn.sabaArea"
        }
      },
      {
        path: "/password/changePassword",
        name: "ChangePassword",
        component: () => import("app/template/set_UFAONG/pages/Password/ChangePassword.vue"),
        meta: {
          headerTitle: "menu.changePassword",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/history/transactionHistory",
        name: "TransactionHistory",
        component: () => import("app/template/set_UFAONG/pages/History/TransactionHistory.vue"),
        meta: {
          headerTitle: "menu.transactionHistory",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/history/pending-transaction",
        name: "PendingTransaction",
        component: () => import("app/template/set_UFAONG/pages/History/PendingTransaction.vue"),
        meta: {
          headerTitle: "menu.pendingTransaction",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/bank/bank-details",
        name: "BankDetails",
        component: () => import("app/template/set_UFAONG/pages/Bank/BankDetails.vue"),
        meta: {
          headerTitle: "menu.bankDetails",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/bank/deposit",
        name: "Deposit",
        component: () => import("app/template/set_UFAONG/pages/Bank/Deposit.vue"),
        meta: {
          headerTitle: "menu.deposit",
          needAuth: true,
          goRouteIfNoToken: "Home",
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
        }
      },
      {
        path: "/bank/withdraw",
        name: "Withdraw",
        component: () => import("app/template/set_UFAONG/pages/Bank/Withdraw.vue"),
        meta: {
          headerTitle: "menu.withdrawal",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("app/template/set_UFAONG/pages/Login/Index.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("app/template/set_UFAONG/pages/Register/Index.vue")
  },
  {
    path: "/password/forgot-password",
    name: "ForgotPassword",
    component: () => import("app/template/set_UFAONG/pages/Password/ForgotPassword.vue")
  },
  {
    path: "/forgotPass/:token",
    component: () => import("app/template/set_UFAONG/pages/Password/ForgotPasswordWithToken.vue")
  },
  {
    path: "/quickPass/:account/:token",
    name: "QuickPass",
    component: () => import("app/template/set_UFAONG/pages/QuickPass/Index.vue")
  }
] as RouteRecordRaw[]

export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
