import { ref, reactive } from "vue"
import { defineStore } from "pinia"
import { MEMBER_NAV_ICON_TYPE } from "src/common/utils/constants"

type Nav = {
  i18nKey: string
  routerName: string
  activeRouteName: string[]
  icon: MEMBER_NAV_ICON_TYPE.Enums
  show: boolean
}

export const useMemberNavStore = defineStore("memberNavStore", () => {
  const navs = ref<Nav[]>([])

  const setNavs = (newNavs: Nav[]) => {
    navs.value = newNavs
  }
  return { navs, setNavs }
})
