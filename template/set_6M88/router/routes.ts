import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export const routes = [
  {
    path: "/",
    component: () => import("app/template/set_6M88/layouts/mainLayout.vue"),
    meta: {},
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("app/template/set_6M88/pages/Home/Index.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "collaboration",
        name: "Collaboration",
        component: () => import("app/template/set_6M88/pages/Home/Collaboration.vue"),
        meta: {
          title: "Collaboration",
          hideFooter: true
        }
      },
      {
        path: "/promotions",
        name: "Promotions",
        component: () => import("app/template/set_6M88/pages/Promotions/Index.vue"),
        meta: {
          headerTitle: "menu.promotions"
        }
      },
      {
        path: "/account",
        name: "Account",
        component: () => import("app/template/set_6M88/pages/Account/Index.vue"),
        meta: {
          headerTitle: "menu.account",
          needAuth: true,
          goRouteIfNoToken: "Login"
        }
      },
      {
        path: "/account/inbox",
        name: "Inbox",
        component: () => import("app/template/set_6M88/pages/Account/Inbox/Index.vue"),
        meta: {
          headerTitle: "menu.inbox",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/account/profile",
        name: "Profile",
        component: () => import("app/template/set_6M88/pages/Account/Profile/Index.vue"),
        meta: {
          headerTitle: "menu.profile",
          needAuth: true,
          goRouteIfNoToken: "Login"
        }
      },
      // {
      //   path: "/account/Referral",
      //   name: "Referral",
      //   component: () => import("app/template/set_6M88/pages/Account/Referral/Index.vue"),
      //   meta: {
      //     headerTitle: "menu.referral"
      //   }
      // },
      {
        path: "/account/vip",
        name: "VIP",
        component: () => import("app/template/set_6M88/pages/Account/Vip/Index.vue"),
        meta: {
          headerTitle: "menu.vip"
        }
      },
      {
        path: "/download",
        name: "Download",
        component: () => import("app/template/set_6M88/pages/Download/Index.vue"),
        meta: {
          headerTitle: "menu.download"
        }
      },
      {
        path: "/contactUs",
        name: "ContactUs",
        component: () => import("app/template/set_6M88/pages/ContactUs/Index.vue"),
        meta: {
          headerTitle: "home.contact_us"
        }
      },
      {
        path: "webInformationCms",
        name: "WebInformationCms",
        component: () => import("app/template/set_6M88/pages/PolicyPages/index.vue")
      },
      {
        path: "/gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        component: () => import("app/template/set_6M88/pages/Lobby/GameLobby.vue"),
        meta: {
          headerTitle: "menu.game_list"
        }
      },
      {
        path: "/sabaPage",
        name: "SabaPage",
        component: () => import("app/template/set_6M88/pages/SabaPage/Index.vue"),
        meta: {
          headerTitle: "common.btn.sabaArea"
        }
      },
      {
        path: "/password/changePassword",
        name: "ChangePassword",
        component: () => import("app/template/set_6M88/pages/Password/ChangePassword.vue"),
        meta: {
          headerTitle: "menu.changePassword",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/history/transactionHistory",
        name: "TransactionHistory",
        component: () => import("app/template/set_6M88/pages/History/TransactionHistory.vue"),
        meta: {
          headerTitle: "menu.transactionHistory",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/history/pending-transaction",
        name: "PendingTransaction",
        component: () => import("app/template/set_6M88/pages/History/PendingTransaction.vue"),
        meta: {
          headerTitle: "menu.pendingTransaction",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/bank/bank-details",
        name: "BankDetails",
        component: () => import("app/template/set_6M88/pages/Bank/BankDetails.vue"),
        meta: {
          headerTitle: "menu.bankDetails",
          needAuth: true,
          goRouteIfNoToken: "Home"
        }
      },
      {
        path: "/bank/deposit",
        name: "Deposit",
        component: () => import("app/template/set_6M88/pages/Bank/Deposit.vue"),
        meta: {
          headerTitle: "menu.deposit",
          needAuth: true,
          goRouteIfNoToken: "Login",
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]
        }
      },
      {
        path: "/bank/withdraw",
        name: "Withdraw",
        component: () => import("app/template/set_6M88/pages/Bank/Withdraw.vue"),
        meta: {
          headerTitle: "menu.withdrawal",
          needAuth: true,
          goRouteIfNoToken: "Login"
        }
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set_6M88/pages/Home/ReferralRebate/Index.vue"),
        meta: {
          headerTitle: "menu.ReferralRebate",
          needAuth: true,
          goRouteIfNoToken: "Login"
        },
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_6M88/pages/Home/ReferralRebate/Index.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("app/template/set_6M88/pages/Login/Index.vue")
  },
  {
    path: "/password/forgot-password",
    name: "ForgotPassword",
    component: () => import("app/template/set_6M88/pages/Password/ForgotPassword.vue")
  },
  {
    path: "/forgotPass/:token",
    component: () => import("app/template/set_6M88/pages/Password/ForgotPasswordWithToken.vue")
  },
  {
    path: "/quickPass/:account/:token",
    name: "QuickPass",
    component: () => import("app/template/set_6M88/pages/QuickPass/Index.vue")
  }
] as RouteRecordRaw[]

export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
