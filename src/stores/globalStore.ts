import { ref, reactive } from "vue"
import { defineStore } from "pinia"

type GlobalState = {
  backRouteName: string
  logoutRouteName: string
  isAsideShow: boolean
}

export const useGlobalStore = defineStore("globalStore", () => {
  const globalState = reactive<GlobalState>({
    backRouteName: "home",
    logoutRouteName: "home",
    isAsideShow: false
  })

  const setBackRouteName = (routeName: string) => {
    globalState.backRouteName = routeName
  }

  const setLogoutRouteName = (routeName: string) => {
    globalState.logoutRouteName = routeName
  }

  const setIsAsideShow = (status: boolean) => {
    globalState.isAsideShow = status
  }
  return { globalState, setBackRouteName, setLogoutRouteName, setIsAsideShow }
})
