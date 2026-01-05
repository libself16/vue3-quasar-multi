import { QTableProps, useQuasar } from "quasar"
import { moneyHistoryList, moneyPendingList } from "src/api/report"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { useEnv } from "src/common/hooks/useEnv"
import { ACTION_TYPE, HISTORY_SEARCH_TYPE, PENDING_SEARCH_TYPE, REPORT_DATE_TYPE } from "src/common/utils/constants"
import { getLastOrOverDay } from "src/common/utils/dayjsUtils"
import { computed, reactive, watchEffect, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

interface Pagination {
  page: number
  rowsPerPage: number
  rowsNumber: number
  totalPage: number
}
interface MoneyHistoryState {
  list: Response.MoneyHistoryList
  query: Request.MoneyHistory
  pagination: Pagination
  isLoading: boolean
}

interface MoneyPendingState {
  list: Response.MoneyPendingList
  query: Request.MoneyPending
  pagination: Pagination
  isLoading: boolean
}

interface FormatMoneyHistory extends Response.MoneyHistory {
  action_target?: string
}

interface Item {
  id: number
  transaction_code: string
  updated_at?: string
  currency_code: string
  action_type: number
  amount: string
  before_balance: string
  after_balance: string
  product_name?: string
  game_name?: string
  promotion_title: {
    [key: string]: string
  } | null
}

interface SearchParams {
  noCahceQuery?: boolean
  isLazyLoad?: boolean
}

export function useReport() {
  const $q = useQuasar()
  const { t, locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const { isCash } = useEnv()

  // 塞入ActionTarget參數
  function genActionTarget(item: Item) {
    switch (item.action_type) {
      case ACTION_TYPE.Enums.PROMOTION:
        return item.promotion_title && item.promotion_title[locale.value]
          ? `${item.promotion_title[locale.value]}`
          : "unknow"
      case ACTION_TYPE.Enums.BET:
      case ACTION_TYPE.Enums.WITHDRAWAL:
      case ACTION_TYPE.Enums.DEPOSIT:
        let actionTarget = ""
        if (item.product_name) {
          actionTarget += item.product_name
        }
        if (item.game_name) {
          actionTarget += ` [${item.game_name}]`
        }
        return actionTarget
      default:
        return "unknow"
    }
  }

  //#region common
  const dateTypes = computed(() => {
    return Object.keys(REPORT_DATE_TYPE.I18nKeys).map((e) => {
      return {
        label: REPORT_DATE_TYPE.I18nKeys[e as any as REPORT_DATE_TYPE.Enums],
        value: parseInt(e)
      }
    })
  })

  //#region common without custom date
  const dateTypesWithoutCustomDate = computed(() => {
    const dateTypes = Object.keys(REPORT_DATE_TYPE.I18nKeys).map((e) => {
      return {
        label: REPORT_DATE_TYPE.I18nKeys[e as any as REPORT_DATE_TYPE.Enums],
        value: parseInt(e)
      }
    })

    dateTypes.pop()
    return dateTypes
  })

  //#endregion

  //#region 歷史紀錄

  const moneyHistorySearchTypes = computed(() => {
    return Object.keys(HISTORY_SEARCH_TYPE.I18nKeys).map((e) => {
      return {
        label: HISTORY_SEARCH_TYPE.I18nKeys[e as any as HISTORY_SEARCH_TYPE.Enums],
        value: parseInt(e)
      }
    })
  })

  const moneyHistorySearchTypesWithoutPromotion = computed(() => {
    const searchTypes = Object.keys(HISTORY_SEARCH_TYPE.I18nKeys).map((e) => {
      return {
        label: HISTORY_SEARCH_TYPE.I18nKeys[e as any as REPORT_DATE_TYPE.Enums],
        value: parseInt(e)
      }
    })

    searchTypes.pop()
    return searchTypes
  })

  const moneyHistoryTableColumns = computed<QTableProps["columns"]>(() => [
    { name: "timeNumber", field: "timeNumber", align: "center", label: t("tableHeader.timeNumber") },
    {
      name: "accountChangeTime",
      field: "accountChangeTime",
      align: "center",
      label: t("tableHeader.accountChangeTime")
    },
    { name: "currency", field: "currency", align: "center", label: isCash.value ? t("tableHeader.currency") : "Point" },
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

  const moneyHistoryState = reactive<MoneyHistoryState>({
    list: [],
    query: {
      search_type: HISTORY_SEARCH_TYPE.Enums.All,
      start_date: "",
      end_date: "",
      offset: 0,
      size: 20,
      dateType: REPORT_DATE_TYPE.Enums.LastSevenDays
    },
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 20,
      totalPage: 1
    },
    isLoading: false
  })

  async function getMoneyHistoryList(searchParams?: SearchParams) {
    try {
      if (moneyHistoryState.pagination?.page && moneyHistoryState.pagination?.rowsPerPage) {
        moneyHistoryState.query.offset =
          (moneyHistoryState.pagination.page - 1) * moneyHistoryState.pagination.rowsPerPage
      }

      const payload: Request.MoneyHistory = {
        search_type: moneyHistoryState.query.search_type,
        start_date: moneyHistoryState.query.start_date.replace(/\//g, "-"),
        end_date: moneyHistoryState.query.end_date.replace(/\//g, "-"),
        offset: moneyHistoryState.query.offset,
        size: moneyHistoryState.query.size
      }
      moneyHistoryState.isLoading = true
      const { status, data } = await useApi(moneyHistoryList, payload)
      moneyHistoryState.isLoading = false

      if (status) {
        // 同步pagination
        moneyHistoryState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        moneyHistoryState.pagination.rowsPerPage = data.pagination.size
        moneyHistoryState.pagination.rowsNumber = data.pagination.total

        // 儲存query
        if (!searchParams?.noCahceQuery) {
          router.replace({
            query: {
              search_type: payload.search_type,
              start_date: payload.start_date,
              end_date: payload.end_date,
              page: moneyHistoryState.pagination?.page || 1,
              rowsPerPage: moneyHistoryState.pagination?.rowsPerPage || 20,
              dateType: moneyHistoryState.query.dateType
            }
          })
        }

        if (!data.list) {
          moneyHistoryState.list = [{ id: 0 }]
          return
        }

        if (searchParams?.isLazyLoad) {
          moneyHistoryState.list = [...moneyHistoryState.list, ...data.list]
          return
        }

        let formatList: FormatMoneyHistory[] = []
        if (data.list.length !== 0) {
          formatList = data.list.map((item: Response.MoneyHistory, index: number) => {
            return {
              ...item,
              action_target: genActionTarget(item as Item)
            }
          })
        } else formatList = [{ id: 0 }]

        moneyHistoryState.list = [...formatList]
      }
    } catch (error) {
      moneyHistoryState.isLoading = false
    }
  }

  async function lazyLoadMoneyHistoryList() {
    if (moneyHistoryState.isLoading || moneyHistoryState.list.length >= moneyHistoryState.pagination.rowsNumber) return
    moneyHistoryState.pagination.page++
    await getMoneyHistoryList({ noCahceQuery: true, isLazyLoad: true })
  }

  async function initMoneyHistoryQuery() {
    const { dateType, start_date, end_date, page, rowsPerPage, search_type } = route.query
    if (dateType) {
      moneyHistoryState.query.dateType = Number(dateType)
    }
    if (start_date) {
      moneyHistoryState.query.start_date = `${start_date}`
    }
    if (end_date) {
      moneyHistoryState.query.end_date = `${end_date}`
    }
    if (page && moneyHistoryState.pagination?.page) {
      moneyHistoryState.pagination.page = Number(page)
    }
    if (rowsPerPage && moneyHistoryState.pagination?.rowsPerPage) {
      moneyHistoryState.pagination.rowsPerPage = Number(rowsPerPage)
    }
    const IntSearchType = Number(search_type)
    if (Object.values(HISTORY_SEARCH_TYPE.Enums).includes(IntSearchType)) {
      moneyHistoryState.query.search_type = IntSearchType
    }
  }

  // 時間選擇
  watchEffect(() => {
    if (
      moneyHistoryState.query.dateType &&
      moneyHistoryState.query.dateType !== REPORT_DATE_TYPE.Enums.CustomDate &&
      Object.values(REPORT_DATE_TYPE.Enums).includes(moneyHistoryState.query.dateType)
    ) {
      const subtractdays = REPORT_DATE_TYPE.SubtractDays[moneyHistoryState.query.dateType]
      moneyHistoryState.query.start_date = getLastOrOverDay(subtractdays)
      moneyHistoryState.query.end_date = getLastOrOverDay(0)
    }
  })

  // 同步page size
  watchEffect(() => {
    if (moneyHistoryState.pagination?.rowsPerPage) {
      moneyHistoryState.query.size = moneyHistoryState.pagination.rowsPerPage
    }
  })
  //  分頁器的頁數
  watchEffect(() => {
    moneyHistoryState.pagination.totalPage = Math.ceil(
      moneyHistoryState.pagination.rowsNumber / moneyHistoryState.pagination.rowsPerPage
    )
  })

  //#endregion

  //#region 待處理訂單

  const moneyPendingSearchTypes = computed(() => {
    return Object.keys(PENDING_SEARCH_TYPE.I18nKeys).map((e) => {
      return {
        label: PENDING_SEARCH_TYPE.I18nKeys[e as any as PENDING_SEARCH_TYPE.Enums],
        value: parseInt(e)
      }
    })
  })

  const moneyPendingTableColumns = computed<QTableProps["columns"]>(() => [
    { name: "type", field: "type", align: "center", label: t("tableHeader.type") },
    {
      name: "no",
      field: "no",
      align: "center",
      label: t("tableHeader.no")
    },
    { name: "cashFlowType", field: "cashFlowType", align: "center", label: t("tableHeader.cashFlowType") },
    { name: "paymentProvider", field: "paymentProvider", align: "center", label: t("tableHeader.paymentProvider") },
    {
      name: "currency",
      field: "currency",
      align: "center",
      label: t("tableHeader.currency")
    },
    { name: "amount", field: "amount", align: "center", label: t("tableHeader.amount") },
    {
      name: "actualAmount",
      field: "actualAmount",
      align: "center",
      label: t("tableHeader.actualAmount")
    },
    {
      name: "dateOfApplication",
      field: "dateOfApplication",
      align: "center",
      label: t("tableHeader.dateOfApplication")
    },
    {
      name: "status",
      field: "status",
      align: "center",
      label: t("tableHeader.status")
    }
  ])

  const moneyPendingState = reactive<MoneyPendingState>({
    list: [],
    query: {
      search_type: PENDING_SEARCH_TYPE.Enums.Deposit,
      start_date: "",
      end_date: "",
      offset: 0,
      size: 20,
      dateType: REPORT_DATE_TYPE.Enums.LastSevenDays
    },
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 20,
      totalPage: 1
    },
    isLoading: false
  })

  async function getMoneyPendingList(searchParams?: SearchParams) {
    try {
      if (moneyPendingState.pagination?.page && moneyPendingState.pagination?.rowsPerPage) {
        moneyPendingState.query.offset =
          (moneyPendingState.pagination.page - 1) * moneyPendingState.pagination.rowsPerPage
      }

      const payload: Request.MoneyPending = {
        search_type: moneyPendingState.query.search_type,
        start_date: moneyPendingState.query.start_date,
        end_date: moneyPendingState.query.end_date,
        offset: moneyPendingState.query.offset,
        size: moneyPendingState.query.size
      }
      moneyPendingState.isLoading = true
      const { status, data } = await useApi(moneyPendingList, payload)
      moneyPendingState.isLoading = false
      if (status) {
        // 同步pagination
        moneyPendingState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        moneyPendingState.pagination.rowsPerPage = data.pagination.size
        moneyPendingState.pagination.rowsNumber = data.pagination.total

        // 儲存query
        if (!searchParams?.noCahceQuery) {
          router.replace({
            query: {
              search_type: payload.search_type,
              start_date: payload.start_date,
              end_date: payload.end_date,
              page: moneyPendingState.pagination?.page || 1,
              rowsPerPage: moneyPendingState.pagination?.rowsPerPage || 20,
              dateType: moneyPendingState.query.dateType
            }
          })
        }

        if (!data.list) {
          moneyPendingState.list = [{ trans_code: "" }]
          return
        }

        if (searchParams?.isLazyLoad) {
          moneyPendingState.list = [...moneyPendingState.list, ...data.list]
          return
        }

        if (data.list.length !== 0) {
          moneyPendingState.list = data.list.map((e) => {
            e.isActive = false
            return e
          })
        } else {
          moneyPendingState.list = [{ trans_code: "" }]
        }
      }
    } catch (error) {
      moneyPendingState.isLoading = false
    }
  }

  async function lazyLoadMoneyPendingList() {
    if (moneyPendingState.isLoading || moneyPendingState.list.length >= moneyPendingState.pagination.rowsNumber) return
    moneyPendingState.pagination.page++
    await getMoneyPendingList({ noCahceQuery: true, isLazyLoad: true })
  }

  async function initMoneyPendingQuery() {
    const { dateType, start_date, end_date, page, rowsPerPage, search_type } = route.query
    if (dateType) {
      moneyPendingState.query.dateType = Number(dateType)
    }
    if (start_date) {
      moneyPendingState.query.start_date = `${start_date}`
    }
    if (end_date) {
      moneyPendingState.query.end_date = `${end_date}`
    }
    if (page && moneyPendingState.pagination?.page) {
      moneyPendingState.pagination.page = Number(page)
    }
    if (rowsPerPage && moneyPendingState.pagination?.rowsPerPage) {
      moneyPendingState.pagination.rowsPerPage = Number(rowsPerPage)
    }
    const IntSearchType = Number(search_type)
    if (Object.values(HISTORY_SEARCH_TYPE.Enums).includes(IntSearchType)) {
      moneyPendingState.query.search_type = IntSearchType
    }
  }
  // 時間選擇
  watchEffect(() => {
    if (
      moneyPendingState.query.dateType &&
      moneyPendingState.query.dateType !== REPORT_DATE_TYPE.Enums.CustomDate &&
      Object.values(REPORT_DATE_TYPE.Enums).includes(moneyPendingState.query.dateType)
    ) {
      const subtractdays = REPORT_DATE_TYPE.SubtractDays[moneyPendingState.query.dateType]
      moneyPendingState.query.start_date = getLastOrOverDay(subtractdays)
      moneyPendingState.query.end_date = getLastOrOverDay(0)
    }
  })

  // 同步page size
  watchEffect(() => {
    if (moneyPendingState.pagination?.rowsPerPage) {
      moneyPendingState.query.size = moneyPendingState.pagination.rowsPerPage
    }
  })
  //  分頁器的頁數
  watchEffect(() => {
    moneyPendingState.pagination.totalPage = Math.ceil(
      moneyPendingState.pagination.rowsNumber / moneyPendingState.pagination.rowsPerPage
    )
  })
  //#endregion

  return {
    /** 時間選擇清單 */
    dateTypes,

    /** 沒有自定義的時間選擇清單 */
    dateTypesWithoutCustomDate,

    /** 初始化會員金流歷史紀錄query參數 */
    initMoneyHistoryQuery,

    /** 會員金流歷史紀錄表單欄位 */
    moneyHistoryTableColumns,

    /** 會員金流歷史紀錄search type 清單 */
    moneyHistorySearchTypes,

    /** 會員金流歷史紀錄search type 清單 沒有優惠活動 */
    moneyHistorySearchTypesWithoutPromotion,

    /** 會員金流歷史資料 */
    moneyHistoryState,

    /** 取得會員金流歷史api */
    getMoneyHistoryList,

    /** 懶加載會員金流歷史api */
    lazyLoadMoneyHistoryList,

    /** 初始化會員處理中訂單query參數 */
    initMoneyPendingQuery,

    /** 會員處理中訂單表單欄位 */
    moneyPendingTableColumns,

    /** 會員處理中訂單search type 清單 */
    moneyPendingSearchTypes,

    /** 會員處理中訂單資料 */
    moneyPendingState,

    /** 取得會員處理中訂單api */
    getMoneyPendingList,

    /** 懶加載會員處理中訂單api */
    lazyLoadMoneyPendingList
  }
}
