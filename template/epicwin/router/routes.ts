import type { RouteRecordRaw, NavigationGuardWithThis } from "vue-router"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/epicwin/pages/HomePage/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/epicwin/pages/HomePage/Home.vue")
      },
      {
        path: "GameLobby/:gameTypeId/:productCode?",
        name: "GameLobby",
        component: () => import("app/template/epicwin/pages/HomePage/GameLobby.vue")
      },
      {
        path: "/followUs",
        name: "followUs",
        component: () => import("app/template/epicwin/pages/HomePage/FollowUs.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/epicwin/pages/HomePage/Promotion.vue")
      },
      {
        path: "/history",
        name: "history",
        component: () => import("app/template/epicwin/pages/HomePage/History.vue")
      },
      {
        path: "/order",
        name: "order",
        component: () => import("app/template/epicwin/pages/HomePage/Order.vue")
      },
      {
        path: "/download",
        name: "download",
        component: () => import("app/template/epicwin/pages/HomePage/Download.vue")
      },
      {
        path: "/webInformation",
        name: "webInformation",
        component: () => import("app/template/epicwin/pages/HomePage/WebInformation.vue")
      },
      {
        path: "/ForgotPass/:token",
        name: "forgetPassword",
        component: () => import("app/template/epicwin/pages/HomePage/ForgetPassword.vue")
      }
    ]
  },
  {
    path: "/profile",
    name: "MemberPage",
    component: () => import("app/template/epicwin/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "memberIndex",
        component: () => import("app/template/epicwin/pages/MemberCenter/MemberIndex.vue"),
        children: [
          {
            path: "",
            name: "memberProfile",
            component: () => import("app/template/epicwin/pages/MemberCenter/MemberProfile.vue")
          },
          {
            path: "/inbox",
            name: "memberInbox",
            component: () => import("app/template/epicwin/pages/MemberCenter/MemberInbox.vue")
          },
          {
            path: "/bankDetail",
            name: "memberBankDetail",
            component: () => import("app/template/epicwin/pages/MemberCenter/MemberBankDetail.vue")
          },
          {
            path: "/bankAdd",
            name: "memberBankAdd",
            component: () => import("app/template/epicwin/pages/MemberCenter/MemberBankAdd.vue")
          },
          {
            path: "/password",
            name: "memberPassword",
            component: () => import("app/template/epicwin/pages/MemberCenter/MemberPassword.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/deposit",
    name: "PaymentPage",
    component: () => import("app/template/epicwin/pages/HomePage/index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "paymentIndex",
        component: () => import("app/template/epicwin/pages/Payment/PaymentIndex.vue"),
        children: [
          {
            path: "",
            name: "paymentDeposit",
            component: () => import("app/template/epicwin/pages/Payment/PaymentDeposit.vue")
          },
          {
            path: "/withdraw",
            name: "paymentWithdraw",
            component: () => import("app/template/epicwin/pages/Payment/PaymentWithdraw.vue")
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
