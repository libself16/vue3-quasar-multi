import { watch } from "vue"
import { useCmsDetailQuery } from "./useCmsDetailQuery"
import { useQuasar } from "quasar"

import type { UseCmsDetailQueryType } from "src/common/apiHooks/cms/useCmsDetailQuery"
import { useRouter } from "vue-router"

export function useDetailCms({ id, options = {} }: UseCmsDetailQueryType) {
  const $q = useQuasar()
  const router = useRouter()

  const {
    data: cmsDetailData,
    isLoading,
    isError,
    error,
    isSuccess
  } = useCmsDetailQuery({ id, options: { ...options } })

  // loading 的動畫處理
  watch(isLoading, (newVal) => {
    if (newVal) {
      $q.loading.show()
    } else {
      $q.loading.hide()
    }
  })

  // 監聽 API 請求完成狀態，處理錯誤情況
  watch([isError, isSuccess], ([errorStatus, successStatus]) => {
    console.log("API 狀態:", {
      isError: errorStatus,
      isSuccess: successStatus,
      error: error.value,
      data: cmsDetailData.value
    })

    if (errorStatus && error.value) {
      // API 請求發生錯誤，跳轉到首頁
      console.error("CMS Detail API 錯誤:", error.value)
      router.push({ path: "/" })
    } else if (successStatus && !cmsDetailData.value) {
      // API 請求成功但沒有有效資料（返回預設物件），跳轉到首頁
      console.warn("CMS Detail 沒有找到有效資料")
      router.push({ path: "/" })
    }
  })

  return {
    cmsDetailData
  }
}
