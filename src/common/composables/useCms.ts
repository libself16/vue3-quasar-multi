import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import { getCmsDetail, getCmsList, getFloatIcon } from "src/api/cms"
import type * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import {
  CMS_DISPLAY_DEVICE,
  CMS_DISPLAY_LOGIN,
  CMS_ENTRANCE_TYPE,
  CMS_OPENING_METHOD,
  CMS_TYPE,
  CUSTOMER_SERVICES,
  LANGUAGE_TYPE,
  GAME_TYPE
} from "src/common/utils/constants"
import { useCmsStore } from "src/stores/cmsStore"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

export interface IEntranceClick {
  entrance: Response.CmsEntranceItem
  isLoginPup?: boolean
  productLobbyRoute?: {
    name: string
    params: any
  }
  cmsHomeRoute?: {
    name: string
    params: any
  }
  cmsCustomPageRoute?: {
    name: string
    params: any
  }
  openingMethod?: number
}

export function useCms() {
  const { isLogin } = useAuth()
  const cmsStore = useCmsStore()
  const { setGameTypeUsing } = useGameTypeStore()
  const { cmsListState, cmsDetail } = storeToRefs(cmsStore)
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API, siteKey } = envData()
  const { openGame, gameTypeState, getGameImageByCustomPage, getProductSquareImage } = useGame()
  const router = useRouter()
  const route = useRoute()
  const isLoading = ref(false)
  const { nowLang } = useLanguage()
  const { handleCmsLiveChatClick } = useLiveChat()
  const $q = useQuasar()
  const selectedWebInformationId = ref<number | null>(null)
  const floatIcon = ref<Response.CmsFlotIcon[]>([])
  async function handleCmsList(type: CMS_TYPE.Enums) {
    if (cmsListState.value[type].length) return
    isLoading.value = true
    const { status, data } = await useApi(getCmsList, { type })
    isLoading.value = false

    if (status) {
      /** 串圖檔的url與版本號 */
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

      const list = data.map((cms) => {
        if (cms.Setting.icon_path) {
          cms.Setting.icon_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${cms.Setting.icon_path}?v=${cms.Setting.updated_time}`
        }

        if (cms.Setting.selected_icon_path) {
          cms.Setting.selected_icon_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${cms.Setting.selected_icon_path}?v=${cms.Setting.updated_time}`
        }

        // 首頁形象圖
        if (cms.Setting.img_lang) {
          cms.Setting.img_lang = prependImageUrl(
            cms.Setting.img_lang,
            VITE_APP_DYNAMIC_RESOURCE_URL,
            cms.Setting.updated_time
          )
        }

        // 聯絡我們 - icon

        if (cms.Setting.icon_lang) {
          cms.Setting.icon_lang = prependImageUrl(
            cms.Setting.icon_lang,
            VITE_APP_DYNAMIC_RESOURCE_URL,
            cms.Setting.updated_time
          )
        }

        // 聯絡我們 - 內文圖片
        if (cms.Setting.contact_img_lang) {
          cms.Setting.contact_img_lang = prependImageUrl(
            cms.Setting.contact_img_lang,
            VITE_APP_DYNAMIC_RESOURCE_URL,
            cms.Setting.updated_time
          )
        }

        cms.Entrance.forEach((entrance) => {
          if (entrance.img_path) {
            entrance.img_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${entrance.img_path}?v=${entrance.img_path}`
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

        return cms
      })
      //裝置過濾
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
        cmsStore.setCmsList({ type, list: fliterData })
      } else {
        cmsStore.setCmsList({ type, list })
      }
      if (type === CMS_TYPE.Enums.FLOATING_ICON) {
        handleCmsFloatIcon()
      }
    }
  }

  async function handleCmsDetail(id: number) {
    isLoading.value = true
    const { status, data } = await useApi(getCmsDetail, id)
    isLoading.value = false

    if (status) {
      if (data.Setting?.icon_path) {
        data.Setting.icon_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${data.Setting.icon_path}?v=${data.Setting.updated_time}`
      }

      if (data.Entrance && Array.isArray(data.Entrance)) {
        data.Entrance.forEach((entrance) => {
          if (entrance.img_path) {
            entrance.img_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${entrance.img_path}?v=${entrance.updated_time}`
          }
        })
      }

      cmsStore.setCmsDetail(data)
    }
  }

  async function handleCmsFloatIcon() {
    isLoading.value = true
    const { status, data } = await useApi(getFloatIcon, "main")
    isLoading.value = false

    if (status) {
      floatIcon.value = data.list.map((item: Response.CmsFlotIcon) => ({
        language: item.language,
        storage_key: item.storage_key ? `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.storage_key}` : ""
      }))
    }
  }

  const navigationBarList = computed(() => {
    if (!isLogin.value) {
      return cmsListState.value[CMS_TYPE.Enums.NAVIGATION_BAR].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return cmsListState.value[CMS_TYPE.Enums.NAVIGATION_BAR].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  const webInformationList = computed(() => {
    return cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION]
  })

  const menuList = computed(() => {
    if (!isLogin.value) {
      return cmsListState.value[CMS_TYPE.Enums.MENU].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return cmsListState.value[CMS_TYPE.Enums.MENU].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  const cmsFooterLogos = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.FOOTER_SETTINGS].length) {
      return []
    }
    return cmsListState.value[CMS_TYPE.Enums.FOOTER_SETTINGS][0].Setting.logo_sort.map(
      (e) =>
        `${VITE_APP_DYNAMIC_RESOURCE_URL}/${e}?v=${
          cmsListState.value[CMS_TYPE.Enums.FOOTER_SETTINGS][0].Setting.updated_time
        }`
    )
  })

  const cmsFooterTextContent = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.FOOTER_SETTINGS].length) {
      return null
    }

    const pageList = cmsListState.value[CMS_TYPE.Enums.FOOTER_SETTINGS][0].Page.filter((e) => e.lang === nowLang.value)

    if (pageList.length) {
      pageList[0].content = pageList[0].content.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
      return pageList[0]
    }

    return null
  })

  //#region 彈窗管理
  const cmsPopupTitle = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return ""
    }

    const title = cmsListState.value[CMS_TYPE.Enums.POPUP][0].Setting.lang[nowLang.value as LANGUAGE_TYPE.Enums]

    if (title) {
      return title.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
    }
    return ""
  })

  const cmsComfirmButtonLabel = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return ""
    }

    return (
      cmsListState.value[CMS_TYPE.Enums.POPUP][0].Setting.comfirm_button_lang[nowLang.value as LANGUAGE_TYPE.Enums] ||
      ""
    )
  })

  const cmsRejectButtonLabel = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return ""
    }

    return (
      cmsListState.value[CMS_TYPE.Enums.POPUP][0].Setting.reject_button_lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
    )
  })

  const cmsPopupImgs = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return []
    }
    return cmsListState.value[CMS_TYPE.Enums.POPUP][0].Setting.pop_up_img.map(
      (e) =>
        `${VITE_APP_DYNAMIC_RESOURCE_URL}/${e}?v=${cmsListState.value[CMS_TYPE.Enums.POPUP][0].Setting.updated_time}`
    )
  })

  const cmsPopupAgreeList = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return []
    }

    return cmsListState.value[CMS_TYPE.Enums.POPUP][0].Entrance.filter((e) => e.sort !== 0).map((e, i) => {
      let label = e.lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      label = label.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
      return {
        label: label,
        value: i
      }
    })
  })

  const cmsPopupCheckAgree = ref<number[]>([])

  const cmsPopupAgreeAllText = computed(() => {
    if (!cmsListState.value[CMS_TYPE.Enums.POPUP]?.length) {
      return ""
    }

    const agreeAllList = cmsListState.value[CMS_TYPE.Enums.POPUP][0].Entrance.filter((e) => e.sort === 0)

    if (agreeAllList.length) {
      const agreeAllText = agreeAllList[0].lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      return agreeAllText.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
    }

    return ""
  })

  const cmsPopupCheckAllAgree = computed({
    get() {
      return cmsPopupAgreeList.value.every((item) => cmsPopupCheckAgree.value.includes(item.value))
    },
    set(value: boolean) {
      if (value) {
        cmsPopupCheckAgree.value = cmsPopupAgreeList.value.map((item) => item.value)
      } else {
        cmsPopupCheckAgree.value = []
      }
    }
  })
  //#endregion

  const h5BottomMenuList = computed(() => {
    if (!isLogin.value) {
      return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  const floatingIconList = computed(() => {
    if (!isLogin.value) {
      return cmsListState.value[CMS_TYPE.Enums.FLOATING_ICON].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return cmsListState.value[CMS_TYPE.Enums.FLOATING_ICON].filter((cmsItem) => {
        return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  const webInformationMenuList = computed(() => {
    const websiteInformation = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION] || []
    return websiteInformation.map((item) => ({
      id: item.url_id,
      // todo 為相容 set33 及 set49 以外版型，暫時命名為 id2，後續要重新調整命名
      id2: item.id,
      title: item.Page.find((page) => page.lang === nowLang.value)?.title || "",
      // 因應6M88 UFA 系列是將聯絡我們, 負責任遊戲等放在同一頁所以新增content 以利在同一頁跑回圈渲染資料
      content: item.Page.find((page) => page.lang === nowLang.value)?.content || ""
    }))
  })

  const setSelectedWebInformationId = (id: number) => {
    selectedWebInformationId.value = id
  }

  const webInformationData = computed(() => {
    const websiteInformation = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION] || []
    if (!websiteInformation.length) return null

    // 先嘗試用 route 判斷
    const routeId = Number(route.params.id)
    let matchedItem = null

    // 先找 url_id
    if (routeId) {
      matchedItem = websiteInformation.find((item) => item.url_id === routeId)
      // 如果 url_id 找不到，再往下找 id
      if (!matchedItem) {
        matchedItem = websiteInformation.find((item) => item.id === routeId)
      }
    }

    // 如果版型以 modal 設計為主，則可以從外部 component 傳入參數
    if (!matchedItem && selectedWebInformationId.value !== null) {
      matchedItem = websiteInformation.find((item) => item.id === selectedWebInformationId.value)
    }

    return matchedItem || websiteInformation[0]
  })

  const webInformationTitle = computed(() => {
    return webInformationData.value?.Page.find((pages: { lang: string }) => pages.lang === nowLang.value)?.title || ""
  })

  const webInformationContent = computed(() => {
    const content = webInformationData.value?.Page.find(
      (pages: { lang: string }) => pages.lang === nowLang.value
    )?.content

    if (content) {
      return content.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
    }

    return ""
  })

  async function handleEntrance(item: IEntranceClick) {
    const { payload } = item.entrance
    switch (item.entrance.type) {
      case CMS_ENTRANCE_TYPE.Enums.GAME_LINK:
        const { integration_id, product_code, game_code, game_type } = payload
        // 目前因為cms api 是給game_type 不是game_type_id 所以需要先設定game_type
        setGameTypeUsing(game_type as GAME_TYPE.Enums)
        openGame(integration_id, product_code || 0, game_code, game_type as GAME_TYPE.Enums, item.isLoginPup)
        break
      case CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY:
        if (item.productLobbyRoute) {
          const routeData = router.resolve(item.productLobbyRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.productLobbyRoute)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK:
        if (payload.link) {
          let link = payload.link
          // 如果沒有包含協議，預設加上 https://
          if (!/^https?:\/\//i.test(link)) {
            link = `https://${link}`
          }
          if (payload.opening_method === CMS_OPENING_METHOD.Enums.NEW_TAB) {
            window.open(link, "_blank")
            return
          }
          window.location.href = link
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.HOMEPAGE_SECTION:
        /**
         * 1. 各版型要新增cmsHome頁面(取代原本的popular)
         * 2. 將原本的資料改成for cmsList
         */
        if (item.cmsHomeRoute) {
          const routeData = router.resolve(item.cmsHomeRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.cmsHomeRoute)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOMER_SERVICE_LINK:
        if (payload.link_id) {
          handleCmsLiveChatClick(payload.link_id as CUSTOMER_SERVICES.Enums)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_PAGE:
        if (item.cmsCustomPageRoute) {
          const routeData = router.resolve(item.cmsCustomPageRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.cmsCustomPageRoute)
        }
        break

      default:
        break
    }
  }

  const getBreakpoints = computed(() => (cmsItem: Response.CmsItem) => {
    const mobileItems = Number(cmsItem.Setting.payload.row_show_mob)
    const pcItems = Number(cmsItem.Setting.payload.row_show_pc)

    return {
      300: {
        itemsToShow: mobileItems,
        snapAlign: "start"
      },
      700: {
        itemsToShow: mobileItems,
        snapAlign: "start"
      },
      1024: {
        itemsToShow: pcItems,
        snapAlign: "start"
      }
    }
  })

  const shouldWrapAround = computed(() => (cmsItem: Response.CmsItem) => {
    const totalItems = cmsItem.Entrance.length
    const mobileItems = Number(cmsItem.Setting.payload.row_show_mob)
    const pcItems = Number(cmsItem.Setting.payload.row_show_pc)

    return totalItems > Math.max(mobileItems, pcItems)
  })

  const shouldDisplayDevice = computed(() => (cmsItem: Response.CmsItem) => {
    const deviceSetting = cmsItem.Setting.payload.display_device as CMS_DISPLAY_DEVICE.Enums
    const isMobile = $q.platform.is.mobile

    return deviceSetting === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS
      ? true
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.DESKTOP
      ? !isMobile
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.MOBILE
      ? isMobile
      : false
  })

  const getRowLength = computed(() => (cmsItem: Response.CmsItem) => {
    return Number(cmsItem.Setting.payload.arrangement_row_pc ?? 1)
  })

  const getColumnsLength = computed(() => (cmsItem: Response.CmsItem) => {
    const columns = $q.platform.is.mobile
      ? Number(cmsItem.Setting.payload.row_show_mob)
      : Number(cmsItem.Setting.payload.row_show_pc)

    return columns
  })

  const getGridStyle = computed(() => (cmsItem: Response.CmsItem) => {
    const columns = $q.platform.is.mobile
      ? Number(cmsItem.Setting.payload.row_show_mob)
      : Number(cmsItem.Setting.payload.row_show_pc)

    return {
      "--grid-columns": columns.toString()
    }
  })

  const fliterDisplayDeviceAndLogin = computed(() => {
    const isMobile = $q.platform.is.mobile // 判斷是否是手機
    const isLoggedIn = isLogin.value // 登入狀態
    return cmsListState.value[CMS_TYPE.Enums.MENU].filter((item) => {
      const displayLogin = item.Setting.payload.display_login
      const displayDevice = item.Setting.payload.display_device
      // 過濾登入狀態
      const loginCondition = !isLoggedIn ? displayLogin !== 2 : displayLogin !== 1

      // 過濾裝置類型
      let deviceCondition = true
      if (isMobile) {
        deviceCondition = displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP // 如果是手機，過濾掉 PC
      } else {
        deviceCondition = displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE // 如果是 PC，過濾掉手機
      }

      // 返回條件
      return loginCondition && deviceCondition
    })
  })

  // 2025/06/17 PM 極端客製化需求，ME9 版型，我的功能在 PC 版必須限制為全部 & 手機版資料
  const filterMobileDisplayAndLogin = computed(() => {
    const isLoggedIn = isLogin.value // 登入狀態
    return cmsListState.value[CMS_TYPE.Enums.MENU].filter((item) => {
      const displayLogin = item.Setting.payload.display_login
      const displayDevice = item.Setting.payload.display_device
      // 過濾登入狀態
      const loginCondition = !isLoggedIn ? displayLogin !== 2 : displayLogin !== 1

      // 過濾裝置類型，只保留全部 & 手機版資料
      const deviceCondition =
        displayDevice === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS || displayDevice === CMS_DISPLAY_DEVICE.Enums.MOBILE

      // 返回條件
      return loginCondition && deviceCondition
    })
  })

  const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
    return cmsItem.Setting.payload.arrangement === 0
  })

  const cmsPaginateDataList = (list: Array<Response.CmsEntranceItem>, rows: number, columns: number) => {
    if (!list.length) return []

    if (rows < 1) {
      rows = 1
    }

    const size = rows * Math.ceil(columns)
    const pages = []

    for (let i = 0; i < list.length; i += size) {
      pages.push(list.slice(i, i + size))
    }

    return pages
  }

  return {
    /** call api 中 */
    isLoading,

    /** cms列表 */
    cmsListState,

    /** cms詳細資料 */
    cmsDetail,

    /** 取得cms列表 */
    handleCmsList,

    /** 取得cms詳細資料 */
    handleCmsDetail,

    /** cms navigation 清單 */
    navigationBarList,

    /** cms menu 清單 */
    menuList,

    /** cms web information 清單 */
    webInformationList,

    /** cms Footer LOGO清單 */
    cmsFooterLogos,

    /** cms Footer 文字區塊內容 */
    cmsFooterTextContent,

    /** cms h5 bottom Menu清單 */
    h5BottomMenuList,

    /** 懸浮 icon */
    floatingIconList,

    /** 網站說明頁menu */
    webInformationMenuList,

    /** 設定網站說明頁id */
    setSelectedWebInformationId,

    /** 網站說明資料 */
    webInformationData,

    /** 網站說明標題 */
    webInformationTitle,

    /** 網站說明內容 */
    webInformationContent,

    /** 處理cms 入口點擊 */
    handleEntrance,

    /** 處理cms 入口列表顯示幾組的參數 */
    getBreakpoints,

    /** 如果使用者故意在後台設定顯示數量大於他的上傳數量，則關閉輪播 */
    shouldWrapAround,

    /** 取得cms 應該顯示的裝置 */
    shouldDisplayDevice,

    /** 取得cms 要顯示幾列 */
    getRowLength,

    /** 取得cms 一列要顯示幾個 */
    getColumnsLength,

    /** 取得cms 應該顯示的欄位數量 */
    getGridStyle,

    /** menu過濾登入前/後+裝置*/
    fliterDisplayDeviceAndLogin,

    /** 2025/06/17 PM 極端客製化需求，ME9 版型用手機版資料 */
    filterMobileDisplayAndLogin,

    /** 檢查是否為一列輪播 */
    isCarousel,

    /** 彈窗管理標題 */
    cmsPopupTitle,

    /** 彈窗管理確認按鈕標籤 */
    cmsComfirmButtonLabel,

    /** 彈窗管理拒絕按鈕標籤 */
    cmsRejectButtonLabel,

    /** 彈窗管理圖片*/
    cmsPopupImgs,

    /** 彈窗管理同意列表 */
    cmsPopupAgreeList,

    /** 彈窗管理已同意項目 */
    cmsPopupCheckAgree,

    /** 彈窗管理全部同意文字 */
    cmsPopupAgreeAllText,

    /** 彈窗管理全部同意 */
    cmsPopupCheckAllAgree,

    /** CMS 入口列表拆分每頁要顯示的data */
    cmsPaginateDataList,

    /**懸浮icon */
    floatIcon
  }
}
