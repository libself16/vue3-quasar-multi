import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { reactive } from 'vue'

const router = useRouter()

// 往後所有state型別定義都固定以此方式命名(stateType)
interface stateType {
  [key: string]: any
  path: string
  name: string
}

export const useRouterStore = defineStore('routerData', () => {
  const routeData: stateType = reactive({
    path: '/',
    name: '首頁'
  })

  const go = () => {
    router.push({ path: routeData.path })
  }

  return { routeData, go }
})
