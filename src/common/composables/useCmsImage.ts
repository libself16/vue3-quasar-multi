import { useEnv } from "src/common/hooks/useEnv"

interface CmsImageItem {
  img_path?: string
  img_base64?: string
  updated_time?: number
}

export function useCmsImage() {
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  /**
   * 優先使用 img_path，如果不存在或為空則使用 img_base64
   * @param item 包含圖片信息的對象
   * @returns 圖片 URL 或 base64
   */
  const getCmsImageSource = (item: CmsImageItem): string => {
    if (item.img_path) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.img_path}?v=${item.updated_time || Date.now()}`
    }

    if (item.img_base64) {
      if (item.img_base64.startsWith("data:")) {
        return item.img_base64
      } else {
        return `data:image/jpeg;base64,${item.img_base64}`
      }
    }

    return ""
  }

  return {
    getCmsImageSource
  }
}
