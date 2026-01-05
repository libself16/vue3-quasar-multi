import { boot } from "quasar/wrappers"
import axios from "axios"
import { useEnvInfoStore } from "src/stores/envStore"

// import {} from '@/boot/env/types';

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {}
// }

export default boot(async () => {
  return new Promise((resolve, reject) => {
    const { updatedEnvInfo } = useEnvInfoStore()
    const getEnvFile = async () => {
      // 根據環境變數設定不同的 JSON 檔案路徑
      if (process.env.NODE_ENV === "development") {
        await import("src/env/environment.json").then((module: any) => {
          updatedEnvInfo(module, "")
        })
        return
      }

      // 生產環境
      const res = await axios.get("/environment.json")
      updatedEnvInfo(res.data, "")
    }

    resolve(getEnvFile())
  })
})
