import { boot } from "quasar/wrappers"
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query"

// 建立一個新的 QueryClient 實例
const queryClient = new QueryClient({
  // 全域預設選項
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分鐘
      refetchOnWindowFocus: false // 可選：關閉視窗重新聚焦時的 refetch
    }
  }
})

export default boot(({ app }) => {
  app.use(VueQueryPlugin, { queryClient })
})
