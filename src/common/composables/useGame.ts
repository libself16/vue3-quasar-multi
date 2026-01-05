import { openURL, useQuasar } from "quasar"
import {
  deleteFavoriteGame,
  favoriteGame,
  getAllGameList,
  getAllProductList,
  getFavoriteGameList,
  getGameList,
  getGameTypeList,
  getProductList,
  launchGame
} from "src/api/game"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEventBus } from "src/common/hooks/useEventBus"
import {
  ERROR_CODE_TYPE,
  ALERT_DIALOG_TYPE,
  GAME_TYPE,
  INTEGRATION_ID,
  LANGUAGE_CODE,
  OPEN_GAME_MODE,
  OPEN_LOBBY_MODE,
  PLATFORM_TYPE,
  GAME_TAG_TYPE
} from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useGameStore } from "src/stores/gameStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useProductStore } from "src/stores/productStore"
import { EventBusKey } from "src/symbols"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"

export type IGetGameTypeImage = Response.GameTypeItem & {
  siteKey?: string
  imgType?: string
  siteFunc?: () => string
}

export interface IGetProductSquareImage {
  square_image?: string
  updated_at: number
  game_type: GAME_TYPE.Enums | string
  product_code: number
  siteKey?: string
  imgType?: string
}

export interface IGetProductWideImage {
  wide_image: string
  updated_at: number
  game_type: GAME_TYPE.Enums | string
  product_code: number
  siteKey?: string
}
export interface IGetProductTabImage {
  tab_image: string
  updated_at: number
  product_code: number
  siteKey?: string
}

export interface IGetGameImage {
  custom_image: string
  game_type_id: number
  integration_id: number
  product_code: number
  game_code: string
}

export interface IGetGameImageByCustomPage {
  game_type: GAME_TYPE.Enums | string
  product_integration_id: number
  product_code: number
  game_code: string
}

export function useGame() {
  const $q = useQuasar()
  const router = useRouter()
  const { t } = useI18n()
  const { isLogin, auth } = useAuth()
  const { activeWalletCurrencyCode } = useUserInfo()
  const { launchGameDialog, currencySupportDialog } = useGameDialogStore()
  const { storedGameTypeState, setGameTypeList, setGameTypeMap, setGameTypeUsing } = useGameTypeStore()
  const { productState } = useProductStore()
  const { gameState, initAllGameList, updateAllGameList, updateFavoriteList } = useGameStore()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL, VITE_APP_DYNAMIC_RESOURCE_URL, open_lobby_mode } = envData()
  const eventbus = injectStrict(EventBusKey)
  const isLoading = ref(false)
  const { nowLang } = useLanguage()
  const { isMobile, isDesktop } = useMediaQuery()
  const { eventEmit } = useEventBus()
  const { genEnumToArray } = useCommon()

  //#region func: gameType
  const gameTypeState = storedGameTypeState

  const isGameOpen = computed(() => {
    if (gameTypeState.using) {
      return GAME_TYPE.Category[gameTypeState.using] === GAME_TYPE.CategoryEnums.GameOpen
    }
    return false
  })

  async function initGameTypeList() {
    isLoading.value = true
    const { status, data } = await useApi(getGameTypeList)
    isLoading.value = false
    if (!status || !data || data.length === 0) {
      setGameTypeList([])
      setGameTypeMap({})
      return
    }

    const tempList: Response.GameTypeList = []
    const tempMap: Response.GameTypeMap = {}

    data.forEach((item: Response.GameTypeItem) => {
      const obj = {
        id: item.id,
        label: GAME_TYPE.I18nKeys[item.id as GAME_TYPE.Enums],
        frontendKey: GAME_TYPE.FrontendKey[item.id as GAME_TYPE.Enums],
        game_type: item.game_type,
        use_pc_image: item.use_pc_image,
        use_h5_image: item.use_h5_image,
        pc_image: item.pc_image,
        h5_image: item.h5_image,
        updated_at: item.updated_at
      }
      tempList.push(obj)
      tempMap[item.id] = obj
    })
    setGameTypeList(tempList)
    setGameTypeMap(tempMap)
  }

  //#endregion

  //#region func: product

  const usingProductName = computed(() => {
    if (!productState.list.length || !productState.using) return ""

    const product = productState.list.find((item) => item.product_code === productState.using)
    return product?.product_name || ""
  })

  async function getProducts(GameTypeId: GAME_TYPE.Enums, isHandleLoadingControl = true) {
    setGameTypeUsing(GameTypeId)
    // const { game_type } = gameTypeState.map[GameTypeId]
    const payload: Request.ProductList = {
      game_type_id: GameTypeId
    }

    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }

      const { status, data } = await useApi(getProductList, payload)

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (!status || !data || !data.length) {
        productState.list.length = 0
        gameState.list.length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.All].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.New].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.Hot].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.Favorites].length = 0
        return
      }

      productState.list = [...data]
    } catch (error) {
      productState.list.length = 0
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function getAllProducts() {
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getAllProductList)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data || !data.length) {
        productState.allList.length = 0
        return
      }

      productState.allList = [...data]
    } catch (error) {
      productState.allList.length = 0
      $q.loading.hide()
      isLoading.value = false
    }
  }

  function handleProductClick(integration_id: INTEGRATION_ID.Enums, product_code: number, pup = false, lang?: number) {
    productState.using = product_code
    const gameTypeCategory = GAME_TYPE.Category[gameTypeState.using]

    if (gameTypeCategory === GAME_TYPE.CategoryEnums.LobbyOpen) {
      openGame(integration_id, product_code, "", gameTypeState.using, pup, null, lang)
    } else {
      if (open_lobby_mode === OPEN_LOBBY_MODE.Enums.NEW_TAB) {
        const routeUrl = router.resolve({
          name: "GameLobby",
          params: {
            integrationId: integration_id,
            gameType: gameTypeState.using,
            productCode: product_code
          }
        })
        window.open(routeUrl.href, "_blank")
        return
      }
      router.push({
        name: "GameLobby",
        params: {
          integrationId: integration_id,
          gameType: gameTypeState.using,
          productCode: product_code
        }
      })
    }
  }

  function getGameTypeImage(item: IGetGameTypeImage): string {
    if (isMobile.value && item.use_h5_image && item.h5_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.h5_image}?v=${item.updated_at}`
    }

    if (isDesktop.value && item.use_pc_image && item.pc_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.pc_image}?v=${item.updated_at}`
    }

    if (item.siteFunc) {
      return item.siteFunc()
    }

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/gameType/${item.siteKey}/${item.frontendKey}.${
        item.imgType ? item.imgType : "png"
      }`
    }

    return ""
  }

  function getProductSquareImage(item: IGetProductSquareImage): string {
    if (item.square_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.square_image}?v=${item.updated_at}`
    }
    const gameType = typeof item.game_type === "string" ? item.game_type : gameTypeState.map[item.game_type]?.game_type

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.siteKey}/${gameType}/${item.product_code}.${
        item.imgType ? item.imgType : "png"
      }`
    }

    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${gameType}/${item.product_code}.png`
  }

  function getProductWideImage(item: IGetProductWideImage): string {
    if (item.wide_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.wide_image}?v=${item.updated_at}`
    }
    const gameType = typeof item.game_type === "string" ? item.game_type : gameTypeState.map[item.game_type]?.game_type

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.siteKey}/${gameType}/${item.product_code}.png`
    }

    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${gameType}/${item.product_code}.png`
  }

  function getProductTabImage(item: IGetProductTabImage): string {
    if (item.tab_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.tab_image}?v=${item.updated_at}`
    }

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/tabs/${item.siteKey}/${item.product_code}.png`
    }

    return `${VITE_APP_STATIC_RESOURCE_URL}/images/tabs/${item.product_code}.png`
  }

  //#endregion

  //#region func: game

  type tagItem = {
    icon: string
    iconName: string
    label: string
    value: GAME_TAG_TYPE.Enums
  }

  const gameTagList = computed(() => {
    const result: tagItem[] = []
    genEnumToArray(GAME_TAG_TYPE.Enums).forEach((e) => {
      const val = e as GAME_TAG_TYPE.Enums
      const tag: tagItem = {
        label: t(GAME_TAG_TYPE.I18nKeys[val]),
        value: val,
        icon: GAME_TAG_TYPE.BtnIcons[val],
        iconName: GAME_TAG_TYPE.BtnIcoSName[val]
      }
      result.push(tag)
    })

    return result
  })

  const integrationId = ref(INTEGRATION_ID.Enums.GSCP)
  const gameSearchType = ref(GAME_TAG_TYPE.Enums.All)

  async function handleGameSearchTypeClick(params: {
    tagValue: GAME_TAG_TYPE.Enums
    pup?: boolean
    gameTypeId: number
    productCode: number
  }): Promise<{
    isBlock: boolean
  }> {
    const { tagValue, pup, gameTypeId, productCode } = params
    // 未登入沒有favorite
    if (tagValue === GAME_TAG_TYPE.Enums.Favorites && !isLogin.value) {
      if (pup) {
        eventbus.emit("openLogin", true)
        return { isBlock: true }
      }
      router.push({ name: "Login" })
      return { isBlock: true }
    }
    gameSearchType.value = tagValue

    if (gameTypeId && productCode) {
      await handleGetGameList({
        integration_id: integrationId.value,
        game_type_id: gameTypeId,
        product_code: productCode,
        search_type: tagValue
      })
    }

    return { isBlock: false }
  }

  async function handleGetGameList(params: Request.GameList) {
    if (!params.product_code) return
    if (!params.search_type && params.search_type !== GAME_TAG_TYPE.Enums.All) return
    setGameTypeUsing(params.game_type_id)
    productState.using = params.product_code

    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getGameList, params)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data || !data.length) {
        gameState.gamesMap[params.search_type] = []
        return
      }

      gameState.gamesMap[params.search_type] = [...data]
    } catch (error) {
      gameState.gamesMap[params.search_type] = []
      $q.loading.hide()
      isLoading.value = false
    }
  }

  async function getGames(
    integration_id: INTEGRATION_ID.Enums,
    GameTypeId: GAME_TYPE.Enums,
    product_code: number,
    isHandleLoadingControl = true
  ) {
    setGameTypeUsing(GameTypeId)
    productState.using = product_code
    // const { game_type } = gameTypeState.map[GameTypeId]
    const payload: Request.GameList = {
      game_type_id: GameTypeId,
      product_code,
      integration_id
    }
    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }

      const { status, data } = await useApi(getGameList, payload)
      isLoading.value = false

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (!status || !data || !data.length) {
        gameState.list.length = 0
        return
      }

      gameState.list = [...data]
    } catch (error) {
      gameState.list.length = 0
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function getFavouriteGamesList() {
    const payload: Request.GameList = {
      is_favorited: true
    }
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getGameList, payload)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data || !data.length) {
        gameState.list.length = 0
        return
      }

      gameState.list = [...data]
    } catch {
      gameState.list.length = 0
      $q.loading.hide()
      isLoading.value = false
    }
  }

  async function getAllProviderGames(
    integration_id: INTEGRATION_ID.Enums,
    GameTypeId: GAME_TYPE.Enums,
    isHandleLoadingControl = true
  ) {
    // const { game_type } = gameTypeState.map[GameTypeId]
    const payload: Request.GameList = {
      game_type_id: GameTypeId
    }

    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }

      const { status, data } = await useApi(getGameList, payload)
      isLoading.value = false

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (!status || !data || !data.length) {
        gameState.allProviderGameList.length = 0
        return
      }

      gameState.allProviderGameList = [...data]
    } catch (error) {
      gameState.allProviderGameList.length = 0
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function getAllGames() {
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getAllGameList)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data) {
        initAllGameList()
        return
      }
      updateAllGameList(data)
    } catch (error) {
      initAllGameList()
      $q.loading.hide()
      isLoading.value = false
    }
  }

  interface ICustomGameOpen {
    product_code?: number
    openMethod?: OPEN_GAME_MODE.Enums
    game_code?: string
    game_type?: string
  }

  const customGameOpenList: (ICustomGameOpen & { openMethod: OPEN_GAME_MODE.Enums })[] = [
    {
      product_code: 1046, // 沙巴
      openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_GAME_DIALOG
    }
  ]

  function customGameOpenMethod(item: ICustomGameOpen): OPEN_GAME_MODE.Enums {
    const match = customGameOpenList.find((config) => {
      return Object.entries(config).every(([key, value]) => {
        if (key === "openMethod") return true
        return item[key as keyof ICustomGameOpen] === value
      })
    })

    return match?.openMethod ?? OPEN_GAME_MODE.Enums.DEFAULT
  }

  async function openGame(
    integration_id: number,
    product_code: number,
    game_code = "",
    game_type_id?: string | number,
    pup = false,
    currency?: string | null,
    lang?: number,
    useDialogIframe = false
  ) {
    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0"
      })
      if (!pup) {
        router.push({ name: "Login" })
      } else {
        eventbus.emit("openLogin", true)
      }
      return
    }

    let currentCurrency = currency

    if (!currency) {
      currentCurrency = activeWalletCurrencyCode.value
    }

    if (!currentCurrency) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseUseCurrency"),
        badgeStyle: "opacity: 0"
      })
      return
    }

    const payload: Request.LaunchGame = {
      is_v2: true,
      game_code,
      product_code: Number(product_code),
      integration_id: integration_id ?? INTEGRATION_ID.Enums.GSCP,
      game_type_id: gameTypeState.using,
      platform: isMobile.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
      currency: currentCurrency,
      // amuse 特規，強制使用 en，其他各版型則為使用者選擇的語言
      language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums]
    }

    try {
      $q.loading.show()
      isLoading.value = true
      const { code, data, msg } = await useApi(launchGame, payload)
      isLoading.value = false
      $q.loading.hide()

      switch (code) {
        case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
          const codeTransferI18n = {
            [ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION]: "member.profile.exclusionPeriodCannotPlayGame",
            [ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT]:
              "member.profile.CumulativeBettingAmountReachedMaximum"
          }
          eventEmit("openAlertDialog", {
            type: ALERT_DIALOG_TYPE.Enums.EMPTY,
            show: true,
            titleI18n: "",
            contentI18n: codeTransferI18n[code] || `${msg}${code ? " (" + code + ")" : ""}`,
            footerBtnTextI18n: "common.btn.submit"
          })
          break
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT:
          currencySupportDialog.showDialog()
          currencySupportDialog.currencies = data.currencies
          currencySupportDialog.integrationId = payload.integration_id
          currencySupportDialog.productCode = payload.product_code
          currencySupportDialog.gameCode = payload.game_code
          break
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
          $q.notify({
            type: "negative",
            position: "top",
            message: `${t("error_message.P_LAUNCH_GAME_GSMD_OFFLINE")} (${code})`,
            icon: "warning",
            timeout: 1000
          })
          break
        case ERROR_CODE_TYPE.Enums.SUCCESS:
          const { game_url, game_content } = data
          const gameOpenMethodCondition = customGameOpenMethod(payload)

          switch (gameOpenMethodCondition) {
            case OPEN_GAME_MODE.Enums.FORCE_USE_GAME_DIALOG:
              // 強制以「遊戲彈窗 + iframe」開啟遊戲
              launchGameDialog.showDialog()
              launchGameDialog.gameUrl = game_url
              launchGameDialog.gameContent = game_content
              break
            case OPEN_GAME_MODE.Enums.FORCE_USE_NEW_TAB:
              // 強制以「另開新分頁」開啟遊戲
              openURL(game_url || game_content, undefined, {
                menubar: false,
                toolbar: false,
                noreferrer: false
              })
              break
            default:
              // 跑預設開啟遊戲方式的邏輯
              if (game_url) {
                if (($q.platform.is.mobile || $q.platform.is.nativeMobile) && !game_url.startsWith("http://")) {
                  launchGameDialog.showDialog()
                  launchGameDialog.gameUrl = game_url
                  launchGameDialog.gameContent = game_content
                } else {
                  openURL(game_url, undefined, {
                    menubar: false,
                    toolbar: false,
                    noreferrer: false
                  })
                }
              }
              if (game_content) {
                launchGameDialog.showDialog()
                launchGameDialog.gameUrl = game_url
                launchGameDialog.gameContent = game_content
              }
          }
          break
        default:
          break
      }
    } catch (error) {
      $q.loading.hide()
      isLoading.value = false
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Internal Server Error",
        badgeStyle: "opacity: 0"
      })
    }
  }

  async function getFavoriteGames(
    { isHandleLoadingControl = true }: { isHandleLoadingControl?: boolean } = { isHandleLoadingControl: true }
  ) {
    if (!isLogin.value) return
    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }
      const { status, data } = await useApi(getFavoriteGameList)

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (status) {
        updateFavoriteList(data)
      }
    } catch (error) {
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function addfavoriteGame(game: Response.GameItem, pup?: boolean) {
    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0"
      })
      if (pup) {
        eventbus.emit("openLogin", true)
        return
      }
      router.push({ name: "Login" })
      return
    }

    if (isLoading.value) return
    const payload: Request.FavoriteGame = {
      game_id: game.game_id
    }
    isLoading.value = true
    const { status } = await useApi(favoriteGame, payload)
    isLoading.value = false
    if (status) {
      // await getFavoriteGames()
      game.is_favorite = true
      game.favorite_count = game.favorite_count + 1
    }
  }

  async function removefavoriteGame(game: Response.GameItem, pup?: boolean) {
    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0"
      })
      if (pup) {
        eventbus.emit("openLogin", true)
        return
      }
      router.push({ name: "Login" })
      return
    }

    if (isLoading.value) return
    const payload: Request.FavoriteGame = {
      game_id: game.game_id
    }
    isLoading.value = true
    const { status } = await useApi(deleteFavoriteGame, payload)
    isLoading.value = false

    if (status) {
      // await getFavoriteGames()
      game.is_favorite = false
      game.favorite_count = game.favorite_count > 0 ? game.favorite_count - 1 : game.favorite_count
    }
  }

  function getGameImage(item: IGetGameImage): string {
    if (item.custom_image) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.custom_image}`
    }
    const gameType = gameTypeState.map[item.game_type_id]?.game_type

    return `${VITE_APP_STATIC_RESOURCE_URL}/publics/images/games/${item.integration_id}/${item.product_code}/${gameType}/${item.game_code}.png`
  }

  function getGameImageByCustomPage(item: IGetGameImageByCustomPage): string {
    const gameType = gameTypeState.map[item.game_type]?.game_type

    return `${VITE_APP_STATIC_RESOURCE_URL}/publics/images/games/${item.product_integration_id}/${item.product_code}/${gameType}/${item.game_code}.png`
  }

  //#endregion

  return {
    /** 開啟遊戲類型 */
    isGameOpen,

    /** 遊戲類型資訊 */
    gameTypeState,

    /** 初始化遊戲類型列表 */
    initGameTypeList,

    /** 產品資訊 */
    productState,

    /** 當前product名稱 */
    usingProductName,

    /** 取得產品列表 */
    getProducts,

    /** 取得產品列表 */
    getAllProducts,

    /** 產品點擊（跳頁） */
    handleProductClick,

    /** 遊戲類型圖片 */
    getGameTypeImage,

    /** 取得產品圖片(方) */
    getProductSquareImage,

    /** 取得產品圖片(寬) */
    getProductWideImage,

    /** 取得產品圖片(Tab) */
    getProductTabImage,

    /** 遊戲資訊 */
    gameState,

    /** 取得所有game type項目的遊戲類型  包括got, favirite */
    initAllGameList,

    /** 遊戲標籤列表 */
    gameTagList,

    /** 集成id */
    integrationId,

    /** 遊戲搜尋類型 */
    gameSearchType,

    /** 遊戲搜尋類型點擊 */
    handleGameSearchTypeClick,

    /** 取得遊戲列表 */
    handleGetGameList,

    /** 取得遊戲列表 */
    getGames,

    /** 取得所有廠商遊戲列表 */
    getAllProviderGames,

    /** 取得所有遊戲列表 */
    getAllGames,

    /** 取的收藏ID清單 */
    getFavoriteGames,

    /** 取的收藏清單 */
    getFavouriteGamesList,

    /** 開啟遊戲 */
    openGame,

    /** 收藏遊戲 */
    addfavoriteGame,

    /** 移除收藏遊戲 */
    removefavoriteGame,

    /** 取得遊戲圖片 */
    getGameImage,

    /** 取得自定義頁面 CMS 防呆圖片 */
    getGameImageByCustomPage,

    /** 手機版啟動遊戲彈窗 */
    launchGameDialog,

    /** 幣別不支援彈窗 */
    currencySupportDialog
  }
}
