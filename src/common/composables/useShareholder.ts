import { computed, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useApi } from "src/common/hooks/useApi"
import {
  getYesterdayReport,
  getMyReport,
  getMyReportDetail,
  getMyReportSummary,
  getTimeRangeTeamOverView,
  getTeamOverView,
  getShareholderInfo,
  getLatest
} from "src/api/shareholder"
import { useAuth } from "src/common/hooks/useAuth"
import { useDateFormatter } from "src/common/composables/useDateFormatter"
import { GAME_TYPE, REPORT_DATE_TYPES, MY_REPORT_TARGET } from "src/common/utils/constants"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

interface Pagination {
  page: number
  rowsPerPage: number
  rowsNumber: number
  totalPage: number
}

type ShareholderQueryState = {
  account?: string
  currency_id?: number
  start_time?: string
  end_time?: string
  entry_id?: number
  offset?: number
  summaryOffset?: number
  size?: number
}

interface IReportState {
  list: Response.MyReportEvents[] | Response.MyReportDetailsEvents[]
  query: ShareholderQueryState
  pagination: Pagination
}

interface ITeamOverViewState {
  list: Response.TeamOverView[] | Response.TimeRangeTeamOverview[]
  query: Request.TimeRangeTeamOverView
  pagination: Pagination
}

// 最新報表 Column Type
export interface NewReportTableColumnType {
  name: string
  required?: boolean
  label: string
  align?: "left" | "right" | "center"
  field: (row: Response.YesterdayReportEvents) => any
  format?: (val: any) => string
  sortable?: boolean
  classes?: (row: Response.YesterdayReportEvents) => string
  style?: string
}

// 我的報表 Column Type
export interface MyReportTableColumnType {
  name: string
  label: string
  align?: "left" | "right" | "center"
  field: (row: Response.MyReportEvents) => string | number
}

// 我的報表 Column Type
export interface MyReportSummaryTableColumnType {
  name: string
  label: string
  align?: "left" | "right" | "center"
  field: (row: Response.MyReportSummaryEvents) => string | number
}

// 我的報表詳細頁 Column Type
export interface MyReportDetailTableColumnType {
  name: string
  label: string
  align?: "left" | "right" | "center"
  field: (row: Response.MyReportDetailsEvents) => string | number | boolean
}

// Define the shared state OUTSIDE the composable function
const shareholderState = reactive<IReportState>({
  list: [],
  query: {
    account: "",
    currency_id: undefined,
    start_time: "",
    end_time: "",
    offset: 0,
    summaryOffset: 0,
    size: 15
  },
  pagination: {
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0,
    totalPage: 1
  }
})

const teamOverViewState = reactive<ITeamOverViewState>({
  list: [],
  query: {
    currency_id: 0,
    start_time: "",
    end_time: ""
  },
  pagination: {
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0,
    totalPage: 1
  }
})

// 共用 Tab
const isLoadingMyReport = ref(false)
const isLoadingMyReportSummary = ref(false)
const activeTableTab = ref()
const yesterdayReportData = ref<Response.YesterdayReport>()
const myReportMe = ref<Response.MyReport>()
const myReportDownline = ref<Response.MyReport>()
const myReporSummarytMe = ref<Response.MyReportSummary>()
const myReporSummarytDownline = ref<Response.MyReportSummary>()
const myReportDetailData = ref<Response.MyReportDetail>()
const myReportDetailId = ref<null | number>(null)
const timeRangeTeamOverViewData = ref<Response.TimeRangeTeamOverview>()
const teamOverViewData = ref<Response.TeamOverView>()
const shareholderInfo = ref<Response.ShareholderInfoList>({ list: [] })
const shareholderLatest = ref<Response.Latest>({
  downline_valid_bet: "",
  commission: ""
})

export function useShareholder() {
  const { t, locale } = useI18n()
  const { formatToISO } = useDateFormatter()
  const { auth } = useAuth()

  const SHAREHOLDER_TABS = computed(() => [
    {
      label: t("shareholder_platform.info"),
      value: "shareholder-info"
    },
    {
      label: t("shareholder_platform.introduction"),
      value: "shareholder-introduction"
    },
    {
      label: t("shareholder_platform.question"),
      value: "shareholder-question"
    }
  ])

  const SHAREHOLDER_TABLE_TABS = computed(() => [
    {
      label: t("shareholder_platform.yesterdayReport"),
      value: "newReport",
      parent: "newReport",
      isParent: true
    },
    {
      label: t("shareholder_platform.myReport"),
      value: "myReport",
      parent: "myReport",
      isParent: true
    },
    {
      label: t("shareholder_platform.myReport"),
      value: "myReportDetail",
      parent: "myReport",
      isParent: false
    },
    {
      label: t("shareholder_platform.teamData"),
      value: "teamData",
      parent: "teamData",
      isParent: true
    }
  ])

  const SHAREHOLDER_DATE_TYPE_TABS = computed(() => [
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
      value: REPORT_DATE_TYPES.Enums.Yesterday
    },
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
    }
  ])

  // 最新報表
  const yesterdayReportTableColumns = computed<NewReportTableColumnType[]>(() => [
    {
      name: "gamePlatform",
      required: true,
      label: t("shareholder_platform.game_platform_group"),
      align: "center",
      field: (row: Response.YesterdayReportEvents) =>
        row.game_type == 0
          ? t("shareholder_platform.cost")
          : t(GAME_TYPE.I18nKeys[row.game_type as GAME_TYPE.Enums].toString()),
      style: "width: 25%"
    },
    {
      name: "platformTurnover",
      required: true,
      label: t("shareholder_platform.platform_turnover"),
      align: "center",
      field: (row: Response.YesterdayReportEvents) => row.valid_bet,
      format: (val: any) => (typeof val === "number" ? val.toLocaleString() : val),
      style: "width: 25%"
    },
    {
      name: "bonusExpense",
      label: t("shareholder_platform.bonus_expense"),
      align: "center",
      field: (row: Response.YesterdayReportEvents) => row.prize_amount,
      format: (val: any) => (typeof val === "number" ? val.toLocaleString() : val),
      style: "width: 25%"
    },
    {
      name: "netProfit",
      label: t("shareholder_platform.net_profit"),
      align: "center",
      field: (row: Response.YesterdayReportEvents) => row.profit,
      format: (val: any) => (typeof val === "number" ? val.toLocaleString() : val),
      classes: (row: Response.YesterdayReportEvents) => (parseInt(row.profit) < 0 ? "text-negative" : "text-positive"),
      style: "width: 25%"
    }
  ])

  const yesterdayReportTableRows = computed<Response.YesterdayReportEvents[]>(
    () => yesterdayReportData.value?.list || []
  )

  const yesterdayReportTotals = computed(() => {
    const list = yesterdayReportData.value?.list || []
    return {
      total_turnover: list.reduce((sum, item) => sum + parseInt(item.valid_bet), 0),
      total_prize_amount: list.reduce((sum, item) => sum + parseInt(item.prize_amount), 0),
      total_profit: list.reduce((sum, item) => sum + parseInt(item.profit), 0)
    }
  })

  const setActiveTableTab = (value: any) => {
    activeTableTab.value = value

    if (value.value !== "myReportDetail") {
      myReportDetailId.value = null
      shareholderState.query.account = undefined
    }
  }

  const fetchYesterdayReport = async () => {
    // 計算昨天的日期
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0)
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)

    const { status, data } = await useApi(() =>
      getYesterdayReport({
        ...shareholderState.query,
        start_time: formatToISO(yesterdayStart),
        end_time: formatToISO(yesterdayEnd, true)
      })
    )
    if (status && data) {
      yesterdayReportData.value = data
    }
  }

  // 我的報表
  const myReportTableColumns = computed<MyReportTableColumnType[]>(() => [
    {
      name: "member_account",
      label: t("shareholder_platform.account"),
      align: "center",
      field: (row: Response.MyReportEvents) => row.member_account
    },
    {
      name: "valid_bet",
      label: t("shareholder_platform.valid_bet2"),
      align: "center",
      field: (row: Response.MyReportEvents) => row.valid_bet
    },
    {
      name: "settlement_rate",
      label: t("shareholder_platform.shareholding"),
      align: "center",
      field: (row: Response.MyReportEvents) => row.settlement_rate
    },
    {
      name: "profit",
      label: t("shareholder_platform.commission_amount"),
      align: "center",
      field: (row: Response.MyReportEvents) => row.profit
    }
  ])

  // 我的報表(統計)
  const myReportSummaryTableColumns = computed<MyReportSummaryTableColumnType[]>(() => [
    {
      name: "member_account",
      label: t("shareholder_platform.account"),
      align: "center",
      field: (row: Response.MyReportSummaryEvents) => row.member_account
    },
    {
      name: "valid_bet",
      label: t("shareholder_platform.valid_bet2"),
      align: "center",
      field: (row: Response.MyReportSummaryEvents) => row.valid_bet
    },
    {
      name: "settlement_rate",
      label: t("shareholder_platform.shareholding"),
      align: "center",
      field: (row: Response.MyReportSummaryEvents) => row.settlement_rate
    },
    {
      name: "commission",
      label: t("shareholder_platform.commission_amount"),
      align: "center",
      field: (row: Response.MyReportSummaryEvents) => row.commission
    }
  ])

  // 我的報表詳細頁
  const myReportDetailTableColumns = computed<MyReportDetailTableColumnType[]>(() => [
    {
      name: "period",
      label: t("shareholder_platform.account"),
      align: "center",
      field: (row: Response.MyReportDetailsEvents) => row.member_account
    },
    {
      name: "period",
      label: t("shareholder_platform.total_deposit"),
      align: "center",
      field: (row: Response.MyReportDetailsEvents) => row.total_deposit
    },
    {
      name: "period",
      label: t("shareholder_platform.valid_bet"),
      align: "center",
      field: (row: Response.MyReportDetailsEvents) => row.valid_bet
    },
    {
      name: "period",
      label: t("shareholder_platform.profit"),
      align: "center",
      field: (row: Response.MyReportDetailsEvents) => row.profit
    },
    {
      name: "period",
      label: t("shareholder_platform.active_rate"),
      align: "center",
      field: (row: Response.MyReportDetailsEvents) => row.active_rate
    }
  ])

  const fetchMyReportMe = async () => {
    const params: Request.MyReport = {
      currency_id: shareholderState.query.currency_id,
      start_time: shareholderState.query.start_time,
      end_time: shareholderState.query.end_time,
      offset: 0,
      size: 10000,
      target: MY_REPORT_TARGET.Enums.ME
    }
    const { status, data } = await useApi(getMyReport, params)
    if (status && data) {
      myReportMe.value = data
    }
  }
  const fetchMyReportDownline = async (isScrolling?: boolean) => {
    const reportSize = shareholderState.query.size ? shareholderState.query.size : 15
    if (isLoadingMyReport.value) return

    if (isScrolling) {
      const total = myReportDownline.value?.pagination.total

      if (total === 0) return
      if (total && total < reportSize) return

      shareholderState.query.offset = shareholderState.query.offset
        ? shareholderState.query.offset + reportSize
        : reportSize
    }

    const params: Request.MyReport = {
      currency_id: shareholderState.query.currency_id,
      start_time: shareholderState.query.start_time,
      end_time: shareholderState.query.end_time,
      offset: shareholderState.query.offset,
      size: reportSize,
      target: MY_REPORT_TARGET.Enums.DOWNLINE
    }
    isLoadingMyReport.value = true
    const { status, data } = await useApi(getMyReport, params)
    setTimeout(() => {
      isLoadingMyReport.value = false
    }, 500)

    if (status && data) {
      if (isScrolling && myReportDownline.value?.list && myReportDownline.value?.pagination) {
        myReportDownline.value.list = [...myReportDownline.value.list, ...data.list]
        myReportDownline.value.pagination = data.pagination
        return
      }
      myReportDownline.value = data
    }
  }

  const fetchMyReportSummaryMe = async () => {
    const params: Request.MyReport = {
      currency_id: shareholderState.query.currency_id,
      start_time: shareholderState.query.start_time,
      end_time: shareholderState.query.end_time,
      offset: 0,
      size: 10000,
      target: MY_REPORT_TARGET.Enums.ME
    }
    const { status, data } = await useApi(getMyReportSummary, params)
    if (status && data) {
      myReporSummarytMe.value = data
    }
  }
  const fetchMyReportSummaryDownline = async (isScrolling?: boolean) => {
    const reportSize = shareholderState.query.size ? shareholderState.query.size : 15
    if (isLoadingMyReportSummary.value) return

    if (isScrolling) {
      const total = myReporSummarytDownline.value?.pagination.total

      if (total === 0) return
      if (total && total < reportSize) return

      shareholderState.query.summaryOffset = shareholderState.query.summaryOffset
        ? shareholderState.query.summaryOffset + reportSize
        : reportSize
    }

    const params: Request.MyReport = {
      currency_id: shareholderState.query.currency_id,
      start_time: shareholderState.query.start_time,
      end_time: shareholderState.query.end_time,
      offset: shareholderState.query.summaryOffset,
      size: reportSize,
      target: MY_REPORT_TARGET.Enums.DOWNLINE
    }
    isLoadingMyReportSummary.value = true
    const { status, data } = await useApi(getMyReportSummary, params)
    setTimeout(() => {
      isLoadingMyReportSummary.value = false
    }, 500)

    if (status && data) {
      if (isScrolling && myReporSummarytDownline.value?.list && myReporSummarytDownline.value?.pagination) {
        myReporSummarytDownline.value.list = [...myReporSummarytDownline.value.list, ...data.list]
        myReporSummarytDownline.value.pagination = data.pagination
        return
      }
      myReporSummarytDownline.value = data
    }
  }

  const fetchMyReportDetail = async () => {
    if (!myReportDetailId.value) return

    const paramsForApi: Request.MyReportDetail = {
      ...shareholderState.query,
      entry_id: myReportDetailId.value
    }

    const { status, data } = await useApi(() => getMyReportDetail(myReportDetailId.value!, paramsForApi))
    if (status && data) {
      myReportDetailData.value = data
    }
  }

  const handleMyReportRowClick = (evt: Event | null, row: any, index: number | null) => {
    myReportDetailId.value = row.id
    setActiveTableTab(SHAREHOLDER_TABLE_TABS.value[2])
  }

  // 團隊數據
  const timeRangeTeamOverViewRows = computed<{ name: string; number: number }[]>(() => [
    {
      name: t("shareholder_platform.direct_subordinate_registrations"),
      number: timeRangeTeamOverViewData.value?.direct_count ?? 0
    },
    {
      name: t("shareholder_platform.direct_subordinate_first_deposits"),
      number: timeRangeTeamOverViewData.value?.direct_first_deposit_count ?? 0
    },
    {
      name: t("shareholder_platform.team_first_deposits"),
      number: timeRangeTeamOverViewData.value?.team_first_deposit_count ?? 0
    },
    {
      name: t("shareholder_platform.max_members"),
      number: timeRangeTeamOverViewData.value?.direct_online_count ?? 0
    },
    {
      name: t("shareholder_platform.direct_performance"),
      number: timeRangeTeamOverViewData.value?.direct_valid_bet ?? 0
    },
    {
      name: t("shareholder_platform.team_performance"),
      number: timeRangeTeamOverViewData.value?.team_valid_bet ?? 0
    }
  ])

  const teamOverViewDataRows = computed<{ name: string; count: string }[]>(() => [
    {
      name: t("shareholder_platform.total_direct_members"),
      count: teamOverViewData.value?.direct_count ?? ""
    },
    {
      name: t("shareholder_platform.total_members"),
      count: teamOverViewData.value?.team_member_count ?? ""
    },
    {
      name: t("shareholder_platform.total_direct_commission"),
      count: teamOverViewData.value?.total_received_commission ?? ""
    }
  ])

  const fetchTimeRangeTeamOverView = async () => {
    const { status, data } = await useApi(() => getTimeRangeTeamOverView(teamOverViewState.query))
    if (status && data) {
      timeRangeTeamOverViewData.value = data
    }
  }

  const fetchTeamOverView = async () => {
    const { status, data } = await useApi(() => getTeamOverView(teamOverViewState.query))
    if (status && data) {
      teamOverViewData.value = data
    }
  }

  const fetchShareholderInfo = async () => {
    const { status, data } = await useApi(getShareholderInfo)
    if (status && data) {
      shareholderInfo.value.list = data.list
    }
  }

  const shareholderInfoLocalized = computed(() => {
    if (!shareholderInfo.value.list.length) return
    return shareholderInfo.value.list.find((item) => item.language === locale.value)?.description_page
  })

  const fetchLatest = async (activeWalletCurrencyId: number) => {
    const query: Request.ShareholderLatest = {
      currency_id: shareholderState.query.currency_id ?? activeWalletCurrencyId
    }

    const { status, data } = await useApi(() => getLatest(query))
    if (status && data) {
      shareholderLatest.value = data
    }
  }

  return {
    SHAREHOLDER_TABS,
    SHAREHOLDER_TABLE_TABS,
    SHAREHOLDER_DATE_TYPE_TABS,
    shareholderState,
    isLoadingMyReport,
    isLoadingMyReportSummary,
    // 共用 Tab
    activeTableTab,
    setActiveTableTab,
    // 股東信息,
    fetchShareholderInfo,
    shareholderInfoLocalized,
    // 昨日報表
    fetchYesterdayReport,
    yesterdayReportData,
    yesterdayReportTableColumns,
    yesterdayReportTableRows,
    yesterdayReportTotals,
    // 我的報表
    fetchMyReportMe,
    fetchMyReportDownline,
    fetchMyReportSummaryMe,
    fetchMyReportSummaryDownline,
    fetchMyReportDetail,
    handleMyReportRowClick,
    myReportTableColumns,
    myReportSummaryTableColumns,
    myReportDetailTableColumns,
    myReportMe,
    myReportDownline,
    myReporSummarytMe,
    myReporSummarytDownline,
    myReportDetailData,
    myReportDetailId,
    // 團隊數據
    fetchTimeRangeTeamOverView,
    fetchTeamOverView,
    timeRangeTeamOverViewRows,
    timeRangeTeamOverViewData,
    teamOverViewDataRows,
    teamOverViewData,
    teamOverViewState,
    // 取得最新
    shareholderLatest,
    fetchLatest
  }
}
