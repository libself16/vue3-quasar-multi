import { computed, reactive, watchEffect, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { QTableProps, QDateProps, QScrollAreaProps } from "quasar"
import { moneyHistoryList, moneyHistoryTotal } from "src/api/report"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { useEnv } from "src/common/hooks/useEnv"
import {
  ACTION_TYPE,
  HISTORY_SEARCH_TYPE,
  REPORT_DATE_TYPES,
  WALLET_TYPE,
  HISTORY_UPDATED_BY_TYPE
} from "src/common/utils/constants"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { getLastOrOverDay, getToday, getYesterday } from "src/common/utils/dayjsUtils"
import { useUserInfo } from "src/common/composables/useUserInfo"

interface Pagination {
  page: number
  rowsPerPage: number
  rowsNumber: number
  totalPage: number
}

interface IHistoryState {
  list: Response.MoneyHistoryList
  query: Request.MoneyHistory
  pagination: Pagination
}

interface SearchParams {
  cahceQuery: boolean
  isLazyLoad: boolean
}

type WalletDropItem = {
  label: string
  value: number
}

export function useHistory() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const { isCash, aiAgentStatus } = useEnv()
  const isLoading = ref(false)
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()
  const { inUseWallet, userWalletMap, getWalletLabel } = useUserInfo()

  const validBet = ref(0)
  const winLoss = ref(0)

  const validBetAmount = computed(() => validBet.value)
  const winLossAmount = computed(() => winLoss.value)

  const currencyHeader = computed(() => (isCash.value ? t("tableHeader.currency") : "Point"))

  const searchTabs = computed(() => {
    return Object.keys(HISTORY_SEARCH_TYPE.I18nKeys).map((e) => {
      return {
        label: t(HISTORY_SEARCH_TYPE.I18nKeys[e as any as HISTORY_SEARCH_TYPE.Enums]),
        value: parseInt(e)
      }
    })
  })

  const dayTypeTabs = computed(() => [
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
      value: REPORT_DATE_TYPES.Enums.LastSevenDays
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastForuteenDays]),
      value: REPORT_DATE_TYPES.Enums.LastForuteenDays
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays]),
      value: REPORT_DATE_TYPES.Enums.LastThirtyDays
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.CustomDate]),
      value: REPORT_DATE_TYPES.Enums.CustomDate
    }
  ])

  const walletTypeTabs = computed(() => {
    return Object.keys(WALLET_TYPE.I18nKeys).map((e) => {
      return {
        label: t(WALLET_TYPE.I18nKeys[e as any as WALLET_TYPE.Enums]),
        value: parseInt(e)
      }
    })
  })

  const historyTableColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "accountChangeTime",
      field: "accountChangeTime",
      align: "center",
      label: t("tableHeader.accountChangeTime")
    },
    { name: "currency", field: "currency", align: "center", label: currencyHeader.value },
    { name: "accountType", field: "accountType", align: "center", label: t("tableHeader.accountType") },
    {
      name: "accountVariableObject",
      field: "accountVariableObject",
      align: "center",
      label: t("tableHeader.accountVariableObject")
    },
    { name: "amount", field: "amount", align: "center", label: t("tableHeader.amount") },
    {
      name: "amountBeforeChanges",
      field: "amountBeforeChanges",
      align: "center",
      label: t("tableHeader.amountBeforeChanges")
    },
    {
      name: "amountAfterChange",
      field: "amountAfterChange",
      align: "center",
      label: t("tableHeader.amountAfterChange")
    }
  ])

  const aiHistoryTableColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "accountChangeTime",
      field: "accountChangeTime",
      align: "center",
      label: t("tableHeader.accountChangeTime")
    },
    { name: "currency", field: "currency", align: "center", label: currencyHeader.value },
    { name: "accountType", field: "accountType", align: "center", label: t("tableHeader.accountType") },
    {
      name: "accountVariableObject",
      field: "accountVariableObject",
      align: "center",
      label: t("tableHeader.accountVariableObject")
    },
    { name: "betMethod", field: "betMethod", align: "center", label: t("tableHeader.bettingMethod") },
    { name: "amount", field: "amount", align: "center", label: t("tableHeader.amount") },
    {
      name: "amountBeforeChanges",
      field: "amountBeforeChanges",
      align: "center",
      label: t("tableHeader.amountBeforeChanges")
    },
    {
      name: "amountAfterChange",
      field: "amountAfterChange",
      align: "center",
      label: t("tableHeader.amountAfterChange")
    }
  ])

  const aiBettingHistoryTabs = computed(() => {
    return [
      {
        label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.All]),
        value: HISTORY_UPDATED_BY_TYPE.Enums.All
      },
      {
        label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member]),
        value: HISTORY_UPDATED_BY_TYPE.Enums.Member
      },
      {
        label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai]),
        value: HISTORY_UPDATED_BY_TYPE.Enums.Ai
      }
    ]
  })

  const dynamicColumns = computed(() => {
    return !!aiAgentStatus.value && historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory
      ? aiHistoryTableColumns.value
      : historyTableColumns.value
  })

  const bettingHistoryCurrencyList = computed<WalletDropItem[]>(() => {
    return Object.keys(userWalletMap.value).map((e) => {
      const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
      const label = getWalletLabel(cashWallet)
      const value = cashWallet.currency_id
      return { label, value }
    })
  })

  const historyState = reactive<IHistoryState>({
    list: [],
    query: {
      search_type: HISTORY_SEARCH_TYPE.Enums.All,
      start_date: "",
      end_date: "",
      offset: 0,
      size: 20,
      dateType: REPORT_DATE_TYPES.Enums.LastSevenDays,
      wallet_types: [],
      updated_by: -1,
      currency_id: 0
    },
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 20,
      totalPage: 1
    }
  })

  const handleDateRangePick: QDateProps["onUpdate:modelValue"] = (value) => {
    if (!value) return
    historyState.query.dateType = REPORT_DATE_TYPES.Enums.CustomDate
    if (typeof value === "string") {
      historyState.query.start_date = value
      historyState.query.end_date = value
      return
    }

    historyState.query.start_date = value.from
    historyState.query.end_date = value.to
  }

  const handleWalleyTypeClick = (value: WALLET_TYPE.Enums) => {
    const index = historyState.query.wallet_types.indexOf(value)
    if (index === -1) {
      historyState.query.wallet_types.push(value)
      return
    }
    historyState.query.wallet_types.splice(index, 1)
  }

  // 塞入ActionTarget參數
  function genActionTarget(item: Response.MoneyHistory) {
    switch (item.action_type) {
      case ACTION_TYPE.Enums.PROMOTION:
      case ACTION_TYPE.Enums.REBATE:
        return item.promotion_title && item.promotion_title[locale.value]
          ? `${item.promotion_title[locale.value]}`
          : "unknow"
      case ACTION_TYPE.Enums.BET:
        let actionTarget = ""
        if (item.product_name) {
          actionTarget += item.product_name
        }
        if (item.game_name) {
          actionTarget += ` [${item.game_name}]`
        }
        return actionTarget
      default:
        return ""
    }
  }

  function genSearchType(type: HISTORY_SEARCH_TYPE.Enums): string[] {
    let actionTypes = Object.values(ACTION_TYPE.Enums).filter((value) => typeof value === "number")

    if (type === HISTORY_SEARCH_TYPE.Enums.Deposit) {
      actionTypes = actionTypes.filter(
        (e) => e === ACTION_TYPE.Enums.DEPOSIT || e === ACTION_TYPE.Enums.ADJUSMENT_DEPOSIT
      )
    }

    if (type === HISTORY_SEARCH_TYPE.Enums.Withdrawal) {
      actionTypes = actionTypes.filter(
        (e) =>
          e === ACTION_TYPE.Enums.WITHDRAWAL ||
          e === ACTION_TYPE.Enums.ADJUSMENT_WITHDRAWAL ||
          e === ACTION_TYPE.Enums.WITHDRAWAL_REJECTED
      )
    }

    if (type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
      actionTypes = actionTypes.filter((e) => e === ACTION_TYPE.Enums.BET)
    }

    if (type === HISTORY_SEARCH_TYPE.Enums.Promotion) {
      actionTypes = actionTypes.filter((e) => e > 6)
    }

    return actionTypes.map((e) => `${e}`)
  }

  async function getHistoryList(searchParams: SearchParams = { cahceQuery: true, isLazyLoad: false }) {
    try {
      if (historyState.pagination?.page && historyState.pagination?.rowsPerPage) {
        historyState.query.offset = (historyState.pagination.page - 1) * historyState.pagination.rowsPerPage
      }

      const payload: Request.MoneyHistoryList = {
        search_type: genSearchType(historyState.query.search_type),
        start_date: historyState.query.start_date.replace(/\//g, "-"),
        end_date: historyState.query.end_date.replace(/\//g, "-"),
        offset: historyState.query.offset,
        size: historyState.query.size,
        wallet_types: historyState.query.wallet_types
      }

      if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
        if (!!historyState.query.currency_id) {
          payload.currency_id = String(historyState.query.currency_id)
        }

        if (!!aiAgentStatus.value && historyState.query.updated_by !== HISTORY_UPDATED_BY_TYPE.Enums.All) {
          payload.updated_by = String(historyState.query.updated_by)
        }
      }

      isLoading.value = true
      const { status, data } = await useApi(moneyHistoryList, payload)
      isLoading.value = false

      if (status) {
        // 同步pagination
        historyState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        historyState.pagination.rowsPerPage = data.pagination.size
        historyState.pagination.rowsNumber = data.pagination.total

        // 儲存query
        if (searchParams.cahceQuery) {
          router.replace({
            query: {
              search_type: historyState.query.search_type,
              updated_by: historyState.query.updated_by,
              currency_id: historyState.query.currency_id,
              start_date: payload.start_date,
              end_date: payload.end_date,
              page: historyState.pagination?.page || 1,
              rowsPerPage: historyState.pagination?.rowsPerPage || 20,
              dateType: historyState.query.dateType,
              walletTypes: JSON.stringify(historyState.query.wallet_types)
            }
          })
        }

        if (!data.list) {
          historyState.list = []
          return
        }

        const formatList = data.list.map((e) => {
          e.action_target = genActionTarget(e)
          return e
        })

        if (searchParams?.isLazyLoad) {
          historyState.list = [...historyState.list, ...formatList]
          return
        }

        if (data.list.length !== 0) {
          historyState.list = formatList
        } else {
          historyState.list = []
        }
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  async function lazyLoadHistoryList() {
    if (isLoading.value || historyState.list.length >= historyState.pagination.rowsNumber) return
    historyState.pagination.page++
    await getHistoryList({ cahceQuery: false, isLazyLoad: true })
  }

  function initHistoryQuery() {
    const { dateType, start_date, end_date, page, rowsPerPage, search_type, walletTypes, updated_by, currency_id } =
      route.query
    if (dateType) {
      historyState.query.dateType = Number(dateType)
    }
    if (start_date) {
      historyState.query.start_date = `${start_date}`
    }
    if (end_date) {
      historyState.query.end_date = `${end_date}`
    }
    if (walletTypes) {
      historyState.query.wallet_types = JSON.parse(walletTypes as string)
    }
    if (page && historyState.pagination?.page) {
      historyState.pagination.page = Number(page)
    }
    if (rowsPerPage && historyState.pagination?.rowsPerPage) {
      historyState.pagination.rowsPerPage = Number(rowsPerPage)
    }

    const IntSearchType = Number(search_type)
    if (Object.values(HISTORY_SEARCH_TYPE.Enums).includes(IntSearchType)) {
      historyState.query.search_type = IntSearchType
    }

    const IntHistoryType = Number(updated_by)
    if (Object.values(HISTORY_UPDATED_BY_TYPE.Enums).includes(IntHistoryType)) {
      historyState.query.updated_by = IntHistoryType
    }

    if (currency_id) {
      historyState.query.currency_id = Number(currency_id)
    }
  }

  function resetHistoryQuery(rowsPerPage?: number) {
    historyState.pagination.page = 1
    historyState.pagination.rowsPerPage = rowsPerPage || 10
    historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.All
    historyState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  }

  const getHistoryTotal = async () => {
    try {
      const payload: Request.MoneyHistoryTotal = {
        start_date: historyState.query.start_date.replace(/\//g, "-"),
        end_date: historyState.query.end_date.replace(/\//g, "-"),
        offset: historyState.query.offset,
        wallet_types: historyState.query.wallet_types,
        currency_id: String(historyState.query.currency_id)
      }

      if (!!aiAgentStatus.value && historyState.query.updated_by !== HISTORY_UPDATED_BY_TYPE.Enums.All) {
        payload.updated_by = String(historyState.query.updated_by)
      }

      const { status, data } = await useApi(moneyHistoryTotal, payload)

      if (status) {
        validBet.value = Number(data?.valid_bet_amount_total ?? 0)
        winLoss.value = Number(data?.player_profit ?? 0)
        return data
      }
    } catch (err) {
      console.log("err :>> ", err)
    }
  }

  const handlePagination = (page: number) => {
    historyState.pagination.page = page
    getHistoryList()
  }

  const handleTableRequest: QTableProps["onRequest"] = (props) => {
    handlePagination(props.pagination.page)
  }

  const handleScroll: QScrollAreaProps["onScroll"] = async (info) => {
    if (info.verticalPercentage > 0.7) {
      await lazyLoadHistoryList()
    }
  }

  const currencyName = (currencyCode?: string) => {
    if (isCash.value) {
      if (isGOG.value && currencyCode === "CNY") {
        return "USDT"
      }

      if (isIDRToEUR.value && currencyCode === "IDR") {
        return "EUR"
      }

      if (isNBL1.value && currencyCode === "IDR") {
        return "Rp"
      }

      return currencyCode ? currencyCode : ""
    }
    return "Point"
  }

  const handleFormSubmit = () => {
    historyState.pagination.page = 1
    getHistoryList()
  }

  const handlerChangeBetHistoryTab = async () => {
    const name = route.name

    // ai相關歷史紀錄頁面
    if (name !== "history") {
      if (!aiAgentStatus.value) {
        // AI沒打開就不能進
        router.push({ name: "history" })
        return
      } else {
        // AI有開則切換相對的歷史紀錄tab
        switch (name) {
          case "HistoryMember":
            historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.Member
            break
          case "HistoryAi":
            historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.Ai
            break
          default:
            historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.All
            break
        }
      }
    }
  }

  // 時間類型選擇
  watchEffect(() => {
    if (
      !historyState.query.dateType ||
      historyState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate ||
      !Object.values(REPORT_DATE_TYPES.Enums).includes(historyState.query.dateType)
    ) {
      return
    }

    if (historyState.query.dateType === REPORT_DATE_TYPES.Enums.Today) {
      historyState.query.start_date = getToday()
      historyState.query.end_date = getToday()
      return
    }

    if (historyState.query.dateType === REPORT_DATE_TYPES.Enums.Yesterday) {
      historyState.query.start_date = getYesterday()
      historyState.query.end_date = getYesterday()
      return
    }

    const subtractdays = REPORT_DATE_TYPES.SubtractDays[historyState.query.dateType]
    historyState.query.start_date = getLastOrOverDay(subtractdays)
    historyState.query.end_date = getLastOrOverDay(0)
  })

  // 同步page size
  watchEffect(() => {
    if (historyState.pagination?.rowsPerPage) {
      historyState.query.size = historyState.pagination.rowsPerPage
    }
  })
  //  分頁器的頁數
  watchEffect(() => {
    historyState.pagination.totalPage = Math.ceil(
      historyState.pagination.rowsNumber / historyState.pagination.rowsPerPage
    )
  })

  return {
    /** api查詢中 */
    isLoading,

    /** 會員歷史紀錄表單欄位 */
    historyTableColumns,

    /** 會員歷史紀錄表單欄位(包含AI) */
    aiHistoryTableColumns,

    /** 會員歷史紀錄資料 */
    historyState,

    /** 搜索類型 */
    searchTabs,

    /** 時間類型 */
    dayTypeTabs,

    /** 錢包類型 */
    walletTypeTabs,

    /** 歷史紀錄-AI投注歷史的TAB */
    aiBettingHistoryTabs,

    /** 歷史紀錄-投注歷史table的columns */
    dynamicColumns,

    /** 歷史紀錄-投注歷史的幣別清單 */
    bettingHistoryCurrencyList,

    /** 歷史紀錄-投注歷史 有效投注金額 */
    validBetAmount,

    /** 歷史紀錄-投注歷史 輸贏金額 */
    winLossAmount,

    /** Quasar 時間範圍選擇 */
    handleDateRangePick,

    /** 錢包類型參數點擊 */
    handleWalleyTypeClick,

    /** 初始化會員歷史紀錄query參數 */
    initHistoryQuery,

    /** 重置會員歷史紀錄query參數 */
    resetHistoryQuery,

    /** 取得歷史紀錄總計 */
    getHistoryTotal,

    /** 取得會員歷史紀錄api */
    getHistoryList,

    /** 懶加載會員歷史紀錄api */
    lazyLoadHistoryList,

    /** 分頁控制器 */
    handlePagination,

    /** q-table 查詢 */
    handleTableRequest,

    /** q-scroll滑動加載 */
    handleScroll,

    /** 查詢click */
    handleFormSubmit,

    /** 歷史紀錄-投注歷史 判斷可否進入AI歷史頁面 */
    handlerChangeBetHistoryTab,

    // 判斷是否為現金版
    currencyName,

    /** 幣別header */
    currencyHeader
  }
}
