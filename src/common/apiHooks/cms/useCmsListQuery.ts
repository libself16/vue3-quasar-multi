import { useQuasar } from "quasar"
import { getCmsListFull } from "src/api/cms"
import type * as Response from "src/api/response.type"
import { useApiQuery } from "src/common/apiHooks/useApiQuery" // 你的泛用 hook
import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"
import { CMS_DISPLAY_DEVICE, CMS_TYPE, CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import type { UseQueryReturnType } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "src/common/utils/constants/durationTime"
import { cloneDeep } from "src/common/utils/cloneDeep"
import {
  TANSTACK_QUERY_KEY_CMS_LIST,
  TANSTACK_QUERY_KEY_CMS_SPECIFIC_LIST
} from "src/common/utils/constants/tanstackQueryKeys"
import type { UseQueryOptions } from "@tanstack/vue-query"

const prependImageUrl = (
  langMap: Record<string, string>,
  baseApi: string,
  version: string | number
): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const lang in langMap) {
    if (langMap[lang]) {
      result[lang] = `${baseApi}/${langMap[lang]}?v=${version}`
    }
  }
  return result
}

type CmsListQueryOptions = Omit<
  UseQueryOptions<
    ApiResponse<Response.CmsItem[]>, // TQueryFnData
    Error,
    Response.CmsItem[], // TData
    any[]
  >,
  "queryKey" | "queryFn"
>

interface UseCmsListQueryType {
  type: CMS_TYPE.Enums | number
  options?: CmsListQueryOptions
}

/**
 * 宣告式的 Hook，專門用於取得並「轉換」CmsList
 * @param type CMS_TYPE
 */
export function useCmsListQuery({
  type,
  options = {}
}: UseCmsListQueryType): UseQueryReturnType<Response.CmsItem[], Error> {
  const { envData } = useEnv()
  const $q = useQuasar()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, siteKey } = envData()
  const { getGameImageByCustomPage, getProductSquareImage } = useGame()

  const query = useApiQuery<typeof getCmsListFull, Response.CmsItem[]>(
    [TANSTACK_QUERY_KEY_CMS_LIST, TANSTACK_QUERY_KEY_CMS_SPECIFIC_LIST(type)], // TQV Query Key
    getCmsListFull, // API 函數
    { type }, // API payload
    {
      staleTime: FIVE_MINUTES,

      ...options,

      select: (response: ApiResponse<Response.CmsItem[]>): Response.CmsItem[] => {
        // 'response' 是 queryFn 成功回傳的完整 ApiResponse 物件

        if (!response.data) {
          console.warn(`[useCmsListQuery] API for ${type} returned status:true but no data.`)
          return [] // 回傳空陣列，避免 .map 崩潰
        }

        const { data } = response

        // 把 handleCmsList 的所有轉換邏輯搬到這裡
        // 深拷貝數據，避免修改原始 API 響應
        const list = data.map((cms) => {
          const clonedCms = cloneDeep(cms)

          if (clonedCms.Setting.icon_path) {
            clonedCms.Setting.icon_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${clonedCms.Setting.icon_path}?v=${clonedCms.Setting.updated_time}`
          }

          if (clonedCms.Setting.selected_icon_path) {
            clonedCms.Setting.selected_icon_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${clonedCms.Setting.selected_icon_path}?v=${clonedCms.Setting.updated_time}`
          }

          // 首頁形象圖
          if (clonedCms.Setting.img_lang) {
            clonedCms.Setting.img_lang = prependImageUrl(
              clonedCms.Setting.img_lang,
              VITE_APP_DYNAMIC_RESOURCE_URL,
              clonedCms.Setting.updated_time
            )
          }

          // 聯絡我們 - icon

          if (clonedCms.Setting.icon_lang) {
            clonedCms.Setting.icon_lang = prependImageUrl(
              clonedCms.Setting.icon_lang,
              VITE_APP_DYNAMIC_RESOURCE_URL,
              clonedCms.Setting.updated_time
            )
          }

          // 聯絡我們 - 內文圖片
          if (clonedCms.Setting.contact_img_lang) {
            clonedCms.Setting.contact_img_lang = prependImageUrl(
              clonedCms.Setting.contact_img_lang,
              VITE_APP_DYNAMIC_RESOURCE_URL,
              clonedCms.Setting.updated_time
            )
          }

          clonedCms.Entrance.forEach((entrance) => {
            if (entrance.img_path) {
              entrance.img_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${entrance.img_path}?v=${
                entrance.updated_time || clonedCms.Setting.updated_time
              }`
            }

            if (!entrance.img_path) {
              const gamePayload = entrance.payload

              if (entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK) {
                if (gamePayload?.product_code && gamePayload?.game_type) {
                  // 有game code抓遊戲圖
                  if (gamePayload?.game_code && gamePayload?.product_integration_id) {
                    entrance.img_path = getGameImageByCustomPage({
                      game_type: gamePayload.game_type,
                      product_integration_id: gamePayload.product_integration_id,
                      product_code: gamePayload.product_code,
                      game_code: gamePayload.game_code
                    })
                  } else {
                    // 沒有game code 但有siteKry抓產品圖
                    entrance.img_path = getProductSquareImage({
                      updated_at: 0,
                      game_type: gamePayload.game_type,
                      product_code: gamePayload.product_code,
                      siteKey
                    })
                  }
                }
              }
            }
          })

          return clonedCms
        })

        // 裝置過濾邏輯
        if (
          type === CMS_TYPE.Enums.HOME ||
          type === CMS_TYPE.Enums.HOME_INFORMATION_IMAGE ||
          type === CMS_TYPE.Enums.NAVIGATION_BAR
        ) {
          const isMobile = $q.platform.is.mobile
          const fliterData = list.filter((item) => {
            const displayDevice = item.Setting.payload.display_device

            if (displayDevice === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS) {
              return true
            }
            return isMobile
              ? displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP
              : displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE
          })

          // select 的回傳值，會成為 query.data 的新內容
          return fliterData
        } else {
          return list
        }
      }
    }
  )

  // 回傳 TQV 的 query 物件
  // query.data 現在會是 'select' 轉換後的乾淨 list
  return query
}
