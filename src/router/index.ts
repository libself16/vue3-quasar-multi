import { route } from "quasar/wrappers"
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory, Router } from "vue-router"
import erudaPlugins from "eruda"
import getRoutes from "./routes"
import { useAuthStore } from "src/stores/authStore"
import axios from "axios"
import { useEnvInfoStore } from "src/stores/envStore"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export let router: Router

export default route(async function (/* { store, ssrContext } */) {
  const store = useAuthStore()
  const { updatedEnvInfo } = useEnvInfoStore()
  console.log(
    `website version: ${
      process.env.NODE_ENV === "development" ? process.env.NODE_ENV : process.env.VITE_APP_SITE_VERSION
    }`
  )

  // 取得環境變數檔裡的siteKey
  let siteKey
  if (process.env.NODE_ENV === "development") {
    await import("src/env/environment.json").then((module: any) => {
      siteKey = module.siteKey
      updatedEnvInfo(module, "")
    })
  } else {
    const res = await axios.get(`/environment.json?v=${process.env.VITE_APP_SITE_VERSION}`)
    siteKey = res.data?.siteKey
    updatedEnvInfo(res.data, "")
  }

  const { routes, beforeEach } = await getRoutes(siteKey)

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory

  router = createRouter({
    // fix: q-layout 跳路由scroll
    scrollBehavior: (to, from, savedPosition) => {
      if (to.meta.keepScrollPosition) {
        return savedPosition || {}
      }

      document.querySelector(".scroll")?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      return { top: 0, left: 0 }
    },
    routes: routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // history: createHistory(process.env.VUE_ROUTER_BASE)
    history: createWebHistory()
  })

  // template beforeEach
  if (beforeEach) {
    router.beforeEach(beforeEach)
  }

  // common beforeEach
  router.beforeEach((to, from, next) => {
    const { eruda } = to.query
    if (eruda && eruda === "on") {
      erudaPlugins.init()
    }

    const { needAuth, goRouteIfNoToken } = to.meta
    if (needAuth && !store.isLogin) {
      console.warn("token is not available. back to home page.")
      const { login_token, lang, redirect } = to.query
      const backToRouteName = router.resolve({
        name: goRouteIfNoToken || "HomePage",
        query: {
          login_token,
          lang,
          redirect
        }
      })
      return next(backToRouteName)
    }
    next()
  })

  router.afterEach(() => {
    if (window.fbq) {
      window.fbq("track", "PageView")
    }
  })

  return router
})
