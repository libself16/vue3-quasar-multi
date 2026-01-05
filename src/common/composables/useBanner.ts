import { getBannerList } from "src/api/banner"
import type * as Request from "src/api/request.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { BANNER_POSITION, GAME_TYPE, BANNER_OPENING_METHOD } from "src/common/utils/constants"
import { useBannerStore } from "src/stores/bannerStore"
import { useEnv } from "src/common/hooks/useEnv"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import type * as Response from "src/api/response.type"

interface IPreloadCallbacks {
  onProgress?: (loaded: number, total: number) => void
  onComplete?: (allLoaded: boolean) => void
  onSingleLoad?: (url: string) => void
  onSingleError?: (url: string) => void
}

export function useBanner() {
  const { bannerState, setStoreBannerList } = useBannerStore()
  const { getLanguage } = useLanguage()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const router = useRouter()

  const bannerList = computed<Response.BannerList>(() => {
    return bannerState.list
  })

  const getBannerImage = (banner: Response.Banner) => {
    const nowLang = getLanguage()
    if (!banner) {
      return
    }
    const bannerImage = banner.image_json[nowLang]
    if (bannerImage) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${bannerImage}?v=${banner.updated_time}`
    }
  }

  async function handleBannerList(position: BANNER_POSITION.Enums, gameType?: GAME_TYPE.Enums) {
    const params: Request.ReqBannerList = {
      position
    }

    const { status, data } = await useApi(getBannerList, params)

    if (status) {
      if (position === BANNER_POSITION.Enums.ProductLobby || position === BANNER_POSITION.Enums.GameLobby) {
        const bannerList = data.filter((e) => e.game_type === gameType)
        setStoreBannerList(bannerList)
        return
      }
      setStoreBannerList(data)
    }
  }

  const handleBannerRedirect = (banner: Response.Banner) => {
    // 判斷是否為完整的 URL
    const isFullUrl = /^https?:\/\//i.test(banner.link)
    // 判斷是否為相對路徑
    const normalizedLink = banner.link.startsWith("/") ? banner.link : `/${banner.link}`

    switch (banner.opening_method) {
      // 另開新視窗
      case BANNER_OPENING_METHOD.Enums.NewTab:
        if (isFullUrl) {
          window.open(banner.link, "_blank")
        } else {
          window.open(`${window.location.origin}${normalizedLink}`, "_blank")
        }
        break

      // 當前頁面跳轉
      case BANNER_OPENING_METHOD.Enums.Redirect:
        if (isFullUrl) {
          // 直接跳轉
          window.location.href = banner.link
        } else {
          // 路由判斷，判斷是 route name 或相對路徑
          try {
            if (banner.link.startsWith("/") || banner.link.includes("/")) {
              router.push(banner.link)
            } else {
              router.push({ name: banner.link })
            }
          } catch (error) {
            router.push(normalizedLink)
          }
        }
        break
    }
  }

  /**
   * 預加載圖片
   * @param imageUrls 圖片URL數組
   * @param callbacks 回調函數
   */
  const preloadImages = (imageUrls: string[], callbacks?: IPreloadCallbacks) => {
    const totalCount = imageUrls.filter((url) => Boolean(url)).length

    if (totalCount === 0) {
      callbacks?.onComplete?.(true)
      return
    }

    let loadedCount = 0
    let errorCount = 0

    const checkComplete = () => {
      const finished = loadedCount + errorCount
      callbacks?.onProgress?.(loadedCount, totalCount)

      if (finished === totalCount) {
        const allLoaded = errorCount === 0
        callbacks?.onComplete?.(allLoaded)
      }
    }

    imageUrls.forEach((url) => {
      if (url) {
        const img = new Image()
        img.src = url

        img.onload = () => {
          loadedCount++
          callbacks?.onSingleLoad?.(url)
          checkComplete()
        }

        img.onerror = () => {
          errorCount++
          callbacks?.onSingleError?.(url)
          checkComplete()
        }
      }
    })
  }

  return {
    bannerList,
    handleBannerList,
    handleBannerRedirect,
    getBannerImage,
    preloadImages
  }
}
