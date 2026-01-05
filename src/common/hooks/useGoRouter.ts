import { reactive, getCurrentInstance, computed } from "vue"
import { useStore } from "src/store"
import { logout } from "src/api/login"
import { useRouter } from "vue-router"
import { tabLabelFormatter } from "src/common/utils/site"

export function useGoRouter() {
  // 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
  // 因此可以解決this.$Message 諸如此類問題
  const { proxy }: any = getCurrentInstance()
  const store = useStore()
  const router = useRouter()
  const tabData = reactive(store.state.tabData)

  const addTab = (event: Event, item: any) => {
    const tabInfo = item
    store.commit("SET_ACTIVE_TAB", tabInfo.name)
    if (!tabInfo.isMenu) store.commit("SET_ACTIVE_TABINFO", item.params ? item.params : {})
    if (tabData.find((tab: any) => tab.name === tabInfo.name)) return

    store.commit("SET_TAB", {
      name: tabInfo.name,
      params: tabInfo.params,
      status: true,
      tabCmp: tabInfo.link
    })

    localStorage.setItem("tabData", JSON.stringify(store.state.tabData))
  }

  const goInit = (path = "Index") => {
    let routerName = path
    switch (path) {
      case "CustomDetail":
        routerName = "MemberList"
        break
      case "EventDetail":
        routerName = "EventList"
        break
      case "SopEventDetail":
        routerName = "SopEventList"
        break
    }
    goRouter(null, {
      link: routerName,
      name: `${tabLabelFormatter(routerName)}`,
      isMenu: true
    })
  }

  const goRouter = (e: any = null, item: any) => {
    addTab(e, item)
    if (item.isMenu) router.push({ name: item.link })
    else router.push({ name: item.link, params: item.params })
  }

  const goLogin = async () => {
    await logout().then((res) => {
      localStorage.removeItem("publicToken")
      localStorage.removeItem("tabData")
      localStorage.removeItem("userData")
      router.push({ name: "Login" })
      proxy.$Message["success"]({
        background: true,
        content: "登出成功"
      })
    })
  }

  return { goRouter, goLogin, goInit }
}
