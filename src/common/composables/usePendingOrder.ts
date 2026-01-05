import { QDateProps, QScrollAreaProps, QTableProps, useQuasar } from "quasar"
import { moneyPendingCancel, moneyPendingList } from "src/api/report"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useApi } from "src/common/hooks/useApi"
import { useEnv } from "src/common/hooks/useEnv"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { getLastOrOverDay, getToday, getYesterday } from "src/common/utils/dayjsUtils"
import { computed, reactive, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

interface Pagination {
  page: number
  rowsPerPage: number
  rowsNumber: number
  totalPage: number
}

interface IPendingOrderState {
  list: Response.MoneyPendingList
  query: Request.MoneyPending
  pagination: Pagination
}

interface SearchParams {
  cahceQuery: boolean
  isLazyLoad: boolean
}

export function usePendingOrder() {
  const { t } = useI18n()
  const $q = useQuasar()
  const router = useRouter()
  const route = useRoute()
  const { isCash } = useEnv()
  const { currencyList } = useBank()
  const isLoading = ref(false)
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()

  const currencyHeader = computed(() => (isCash.value ? t("tableHeader.currency") : "Point"))

  const cancelBtnDisable = (row: Response.MoneyPending) => {
    if (row.status !== PENDING_STATUS.Enums.Pending) return true
    if (
      row.payment_type === FUND_METHOD_TYPE.Enums.EWallet &&
      row.order_type === PENDING_SEARCH_TYPE.Enums.Withdrawal
    ) {
      return true
    }

    return false
  }

  const searchTabs = computed(() => {
    return Object.keys(PENDING_SEARCH_TYPE.I18nKeys).map((e) => {
      return {
        label: t(PENDING_SEARCH_TYPE.I18nKeys[e as any as PENDING_SEARCH_TYPE.Enums]),
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

  const pendingTableColumns = computed<QTableProps["columns"]>(() => [
    { name: "type", field: "type", align: "center", label: t("tableHeader.type") },
    {
      name: "no",
      field: "no",
      align: "center",
      label: t("tableHeader.no")
    },
    { name: "cashFlowType", field: "cashFlowType", align: "center", label: t("tableHeader.cashFlowType") },
    { name: "paymentProvider", field: "paymentProvider", align: "center", label: t("tableHeader.paymentProvider") },
    { name: "currency", field: "currency", align: "center", label: currencyHeader.value },
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
    // {
    //   name: "upload",
    //   field: "upload",
    //   align: "center",
    //   label: t("tableHeader.uploadDetail")
    // }
  ])

  const pendingOrderState = reactive<IPendingOrderState>({
    list: [],
    query: {
      search_type: PENDING_SEARCH_TYPE.Enums.Deposit,
      start_date: "",
      end_date: "",
      offset: 0,
      size: 20,
      dateType: REPORT_DATE_TYPES.Enums.LastSevenDays
    },
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 20,
      totalPage: 1
    }
  })

  const pendingOrderCancel = async (params: Request.MoneyPendingCancel) => {
    const { status } = await useApi(moneyPendingCancel, params)

    if (status) {
      await getPendingOrderList()

      $q.notify({
        type: "positive",
        message: $t("common.alarm.successApplication"),
        position: "top"
      })
    }
  }

  const handleDateRangePick: QDateProps["onUpdate:modelValue"] = (value) => {
    if (!value) return
    pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.CustomDate
    if (typeof value === "string") {
      pendingOrderState.query.start_date = value
      pendingOrderState.query.end_date = value
      return
    }

    pendingOrderState.query.start_date = value.from
    pendingOrderState.query.end_date = value.to
  }

  async function getPendingOrderList(searchParams: SearchParams = { cahceQuery: true, isLazyLoad: false }) {
    try {
      if (pendingOrderState.pagination?.page && pendingOrderState.pagination?.rowsPerPage) {
        pendingOrderState.query.offset =
          (pendingOrderState.pagination.page - 1) * pendingOrderState.pagination.rowsPerPage
      }

      const payload: Request.MoneyPending = {
        search_type: pendingOrderState.query.search_type,
        start_date: pendingOrderState.query.start_date.replace(/\//g, "-"),
        end_date: pendingOrderState.query.end_date.replace(/\//g, "-"),
        offset: pendingOrderState.query.offset,
        size: pendingOrderState.query.size
      }

      isLoading.value = true
      const { status, data } = await useApi(moneyPendingList, payload)
      isLoading.value = false

      if (status) {
        // 同步pagination
        pendingOrderState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        pendingOrderState.pagination.rowsPerPage = data.pagination.size
        pendingOrderState.pagination.rowsNumber = data.pagination.total

        // 儲存query
        if (searchParams.cahceQuery) {
          router.replace({
            query: {
              search_type: payload.search_type,
              start_date: payload.start_date,
              end_date: payload.end_date,
              page: pendingOrderState.pagination?.page || 1,
              rowsPerPage: pendingOrderState.pagination?.rowsPerPage || 20,
              dateType: pendingOrderState.query.dateType
            }
          })
        }

        if (!data.list) {
          pendingOrderState.list = []
          return
        }

        if (searchParams?.isLazyLoad) {
          pendingOrderState.list = [...pendingOrderState.list, ...data.list]
          return
        }

        if (data.list.length !== 0) {
          pendingOrderState.list = data.list.map((e) => {
            e.isActive = false
            return e
          })
        } else {
          pendingOrderState.list = []
        }
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  async function lazyLoadPendingOrderList() {
    if (isLoading.value || pendingOrderState.list.length >= pendingOrderState.pagination.rowsNumber) return
    pendingOrderState.pagination.page++
    await getPendingOrderList({ cahceQuery: false, isLazyLoad: true })
  }

  function initPendingOrderQuery() {
    const { dateType, start_date, end_date, page, rowsPerPage, search_type } = route.query
    if (dateType) {
      pendingOrderState.query.dateType = Number(dateType)
    }
    if (start_date) {
      pendingOrderState.query.start_date = `${start_date}`
    }
    if (end_date) {
      pendingOrderState.query.end_date = `${end_date}`
    }
    if (page && pendingOrderState.pagination?.page) {
      pendingOrderState.pagination.page = Number(page)
    }
    if (rowsPerPage && pendingOrderState.pagination?.rowsPerPage) {
      pendingOrderState.pagination.rowsPerPage = Number(rowsPerPage)
    }
    const IntSearchType = Number(search_type)
    if (Object.values(PENDING_SEARCH_TYPE.Enums).includes(IntSearchType)) {
      pendingOrderState.query.search_type = IntSearchType
    }
  }

  function resetPendingOrderQuery(rowsPerPage?: number) {
    pendingOrderState.pagination.page = 1
    pendingOrderState.pagination.rowsPerPage = rowsPerPage || 10
    pendingOrderState.query.search_type = PENDING_SEARCH_TYPE.Enums.Deposit
    pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  }

  const handlePagination = (page: number) => {
    pendingOrderState.pagination.page = page
    getPendingOrderList()
  }

  const handleTableRequest: QTableProps["onRequest"] = (props) => {
    handlePagination(props.pagination.page)
  }

  const handleScroll: QScrollAreaProps["onScroll"] = async (info) => {
    if (info.verticalPercentage > 0.7) {
      await lazyLoadPendingOrderList()
    }
  }

  const getPaymentTypeName = (paymentType: FUND_METHOD_TYPE.Enums) => {
    if (Object.values(FUND_METHOD_TYPE.Enums).includes(paymentType)) {
      const key = FUND_METHOD_TYPE.I18nKeys[paymentType as FUND_METHOD_TYPE.Enums]
      return t(key)
    }
    return t("fund_method_type.other_pay_methods")
  }

  const currencyName = (id: number | undefined) => {
    if (isCash.value) {
      const currency = currencyList.value.find((currency) => Number(currency.value) === id)

      if (isGOG.value && currency?.label === "CNY") {
        return "USDT"
      }

      if (isIDRToEUR.value && currency?.label === "IDR") {
        return "EUR"
      }

      if (isNBL1.value && currency?.label === "IDR") {
        return "Rp"
      }

      return currency ? currency.label : ""
    }
    return "Point"
  }

  const handleFormSubmit = async () => {
    pendingOrderState.pagination.page = 1
    await getPendingOrderList()
  }

  // 時間選擇
  watchEffect(() => {
    if (
      !pendingOrderState.query.dateType ||
      pendingOrderState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate ||
      !Object.values(REPORT_DATE_TYPES.Enums).includes(pendingOrderState.query.dateType)
    ) {
      return
    }

    if (pendingOrderState.query.dateType === REPORT_DATE_TYPES.Enums.Today) {
      pendingOrderState.query.start_date = getToday()
      pendingOrderState.query.end_date = getToday()
      return
    }

    if (pendingOrderState.query.dateType === REPORT_DATE_TYPES.Enums.Yesterday) {
      pendingOrderState.query.start_date = getYesterday()
      pendingOrderState.query.end_date = getYesterday()
      return
    }

    const subtractdays = REPORT_DATE_TYPES.SubtractDays[pendingOrderState.query.dateType]
    pendingOrderState.query.start_date = getLastOrOverDay(subtractdays)
    pendingOrderState.query.end_date = getLastOrOverDay(0)
  })

  // 同步page size
  watchEffect(() => {
    if (pendingOrderState.pagination?.rowsPerPage) {
      pendingOrderState.query.size = pendingOrderState.pagination.rowsPerPage
    }
  })
  //  分頁器的頁數
  watchEffect(() => {
    pendingOrderState.pagination.totalPage = Math.ceil(
      pendingOrderState.pagination.rowsNumber / pendingOrderState.pagination.rowsPerPage
    )
  })
  //#endregion

  return {
    /** api取消訂單 */
    pendingOrderCancel,

    /** api查詢中 */
    isLoading,

    /** 取消訂單按鈕disabled狀態 */
    cancelBtnDisable,

    /** 會員處理中訂單表單欄位 */
    pendingTableColumns,

    /** 會員處理中訂單資料 */
    pendingOrderState,

    /** 搜索類型 */
    searchTabs,

    /** 時間類型 */
    dayTypeTabs,

    /** Quasar 時間範圍選擇 */
    handleDateRangePick,

    /** 初始化會員處理中訂單query參數 */
    initPendingOrderQuery,

    /** 重置會員處理中訂單query參數 */
    resetPendingOrderQuery,

    /** 取得會員處理中訂單api */
    getPendingOrderList,

    /** 懶加載會員處理中訂單api */
    lazyLoadPendingOrderList,

    /** 分頁控制器 */
    handlePagination,

    /** q-table 查詢 */
    handleTableRequest,

    /** q-scroll滑動加載 */
    handleScroll,

    /** 查詢click */
    handleFormSubmit,

    /** 取payment type label */
    getPaymentTypeName,

    /** 取currency code */
    currencyName,

    /** 幣別header */
    currencyHeader
  }
}
