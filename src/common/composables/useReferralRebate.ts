import { ref, reactive, computed, watch } from "vue"
import { useApi } from "src/common/hooks/useApi"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import {
  getReferralRebateSummary,
  getReferralRebateStatement,
  getReferralRebateEvents,
  getReferralRebateEventsStatements
} from "src/api/referral_rebate"
import { getReferralInfo } from "src/api/referral"

import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE, CALCULATE_TYPE } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"

export function useReferralRebate() {
  const { availCurrencyList, currencyIdMap, currencyCodeMap, getAvailCurrencyList, formatterCurrency } = useBank()
  const { moneyFormat, genEnumToArray, copyMessage } = useCommon()
  const { activeWalletCurrencyCode } = useUserInfo()

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()

  // 參數定義

  const activeTab = ref("eventStatement")
  const isLoading = ref(false)
  const referralCode = ref("-")
  const referralRebateCurrencyId = ref(1)
  const referralRebateSummary = reactive<Response.ReferralRebateSummary>({
    calculate_type: 0,
    profit: "0",
    valid_bet_amount: "0",
    revenue_amount: "0"
  })
  const returnReferralRebateSummary = reactive({
    calculate_type: 0,
    summary_amount: "0",
    revenue_amount: "0"
  })
  const selectedEventId = ref<number | null | undefined>()

  const referralRebateStatements = reactive<Response.ReferralRebateStatementsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  const referralRebateStatementsTableColumns = computed(() => {
    return [
      { name: "account", label: t("member.referralRebate.account"), field: "account" },
      { name: "tier", label: t("member.referralRebate.tier"), field: "tier" },
      { name: "deposit_amount", label: t("member.referralRebate.depositAmount"), field: "deposit_amount" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "game_type", label: t("member.referralRebate.gametype"), field: "game_type" },
      { name: "valid_bet_amount", label: t("member.referralRebate.validBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit" }
    ]
  })

  const referralRebateEventsStatementsTableColumns = computed(() => {
    return [
      { name: "account", label: t("member.referralRebate.account"), field: "account" },
      { name: "tier", label: t("member.referralRebate.tier"), field: "tier" },
      { name: "rate", label: t("member.referralRebate.rate"), field: "rate" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "valid_bet_amount", label: t("member.referralRebate.validBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit" },
      { name: "revenue_amount", label: t("member.referralRebate.revenueAmount"), field: "revenue_amount" }
    ]
  })

  const referralRebateEvents = reactive<Response.ReferralRebateEventsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  const referralRebateEventsTableColumns = computed(() => {
    let columns = [
      { name: "settlement_time", label: t("member.referralRebate.settlementTime"), field: "settlement_time" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "valid_bet_amount", label: t("member.referralRebate.totalValidBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: t("member.referralRebate.totalProfit"), field: "profit" },
      { name: "revenue_amount", label: t("member.referralRebate.totalRevenueAmount"), field: "revenue_amount" },
      { name: "distribution_time", label: t("member.referralRebate.distributionTime"), field: "distribution_time" }
    ]

    if ($q.platform.is.mobile) {
      columns = [...columns, { name: "action", label: "action", field: "action" }]
    }

    return columns
  })

  const referralRebateEventsStatements = reactive<Response.ReferralRebateStatementsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  // 下級投注報表參數
  const accountNumber = ref("")
  const gameTypeId = ref(0)
  const selectedDate = ref({
    from: "",
    to: ""
  })

  const displayDate = computed(() => {
    if (selectedDate.value && selectedDate.value.from && selectedDate.value.to) {
      return `${selectedDate.value.from} - ${selectedDate.value.to}`
    }
    if (selectedDate.value && typeof selectedDate.value === "string")
      return `${selectedDate.value} - ${selectedDate.value}`
    return ""
  })

  const currencyDropdown = computed(() => {
    if (!availCurrencyList.value.length) return []

    return availCurrencyList.value.map((e) => {
      return {
        label: formatterCurrency(e.code) || "",
        value: e.id
      }
    })
  })

  const gameTypeDropdown = computed(() => {
    return genEnumToArray(GAME_TYPE.Enums).map((e) => {
      return {
        label: t(GAME_TYPE.I18nKeys[e as GAME_TYPE.Enums]),
        value: e
      }
    })
  })

  const gameTypeDropdownWithAll = computed(() => {
    return [
      {
        label: t("menu.all"),
        value: 0
      },
      ...genEnumToArray(GAME_TYPE.Enums).map((e) => {
        console.log(GAME_TYPE.I18nKeys[e as GAME_TYPE.Enums], e)
        return {
          label: t(GAME_TYPE.I18nKeys[e as GAME_TYPE.Enums]),
          value: e
        }
      })
    ]
  })

  const referralRebateCurrencyCode = computed(() => {
    if (!referralRebateCurrencyId.value || !currencyIdMap.value) return ""

    return formatterCurrency(currencyIdMap.value[referralRebateCurrencyId.value]?.code || "")
  })

  const gameTypeCode = computed(() => {
    return gameTypeId.value === 0 ? "menu.all" : GAME_TYPE.I18nKeys[gameTypeId.value]
  })

  function changeCurrency(item: Response.BaseListType) {
    referralRebateCurrencyId.value = item.value ? Number(item.value) : referralRebateCurrencyId.value
    getSummary()
    getEvents()

    if (router.currentRoute.value.name === "ReferralRebateEvent") {
      getEventsStatements(selectedEventId.value!, false)
    } else {
      getStatement(false)
    }
  }

  function changeGameType(item: Response.BaseListType) {
    gameTypeId.value = Number(item.value)
  }

  const initDetail = () => {
    const currentRouteName = router.currentRoute.value.name

    if (currentRouteName === "ReferralRebateEvent") {
      const eventId = Number(router.currentRoute.value.params.id)
      handleDetailClick(eventId)
    }
  }

  async function initReferralRebateCurrency() {
    isLoading.value = true
    await getAvailCurrencyList()
    isLoading.value = false

    if (activeWalletCurrencyCode.value && currencyCodeMap.value) {
      const currency = currencyCodeMap.value[activeWalletCurrencyCode.value]
      if (currency) {
        referralRebateCurrencyId.value = currency.id
        return
      }
    }

    if (availCurrencyList.value.length) {
      referralRebateCurrencyId.value = availCurrencyList.value[0].id
    }
  }

  async function initReferralRebateDate() {
    function getDates() {
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0") // 月份要 +1
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      return {
        today: formatDate(today),
        sevenDaysAgo: formatDate(sevenDaysAgo)
      }
    }

    const result = getDates()

    selectedDate.value.from = result.sevenDaysAgo
    selectedDate.value.to = result.today
  }

  // 當期總計
  const getSummary = async () => {
    isLoading.value = true

    const payload: Request.getReferralRebateSummary = {
      currency_id: referralRebateCurrencyId.value
    }

    const { status, data } = await useApi(getReferralRebateSummary, payload)
    isLoading.value = false
    console.log(data)

    if (status && data) {
      referralRebateSummary.calculate_type = data.calculate_type
      referralRebateSummary.profit = data.profit
      referralRebateSummary.revenue_amount = data.revenue_amount
      referralRebateSummary.valid_bet_amount = data.valid_bet_amount
      returnReferralRebateSummary.summary_amount = data.calculate_type === 1 ? data.valid_bet_amount : data.profit
      returnReferralRebateSummary.revenue_amount = data.revenue_amount
      returnReferralRebateSummary.calculate_type = data.calculate_type
    }
  }

  // 當期反佣結算明細 (下級投注報表)
  const getStatement = async (showAll: boolean) => {
    isLoading.value = true

    const payload: Request.getReferralRebateStatements = {
      currency_id: referralRebateCurrencyId.value,
      account: accountNumber.value,
      game_type: gameTypeId.value,
      offset: (referralRebateStatements.pagination.page - 1) * referralRebateStatements.pagination.size,
      size: 20
    }

    // 刪除 game_type、account
    if (showAll) {
      console.log("showAll")
      delete payload.game_type
      delete payload.account
    } else if (gameTypeId.value === 0) {
      console.log("gameTypeId.value === 0")
      delete payload.game_type
    }

    const { status, data } = await useApi(getReferralRebateStatement, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateStatements.list.length = 0
      referralRebateStatements.pagination.page = 1
      referralRebateStatements.pagination.offset = 1
      referralRebateStatements.pagination.size = 10
      referralRebateStatements.pagination.total = 0

      const list = data.list.map((e) => {
        console.log(e)
        return {
          account: e.account,
          tier: e.tier,
          deposit_amount: moneyFormat(e.deposit_amount),
          currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
          game_type: GAME_TYPE.I18nKeys[e.game_type as GAME_TYPE.Enums],
          valid_bet_amount: moneyFormat(e.valid_bet_amount),
          profit: moneyFormat(e.profit),
          rate: e.rate ?? "",
          revenue_amount: moneyFormat(e.revenue_amount)
        }
      })
      referralRebateStatements.pagination.offset = data.pagination.offset
      referralRebateStatements.pagination.size = data.pagination.size
      referralRebateStatements.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      Object.assign(referralRebateStatements.list, list)
    }
  }

  // 反佣明細
  const getEvents = async () => {
    isLoading.value = true

    const payload: Request.getReferralRebateEvents = {
      currency_id: referralRebateCurrencyId.value,
      start_time: `${formatDate(selectedDate.value.from ? selectedDate.value.from : selectedDate.value, false)}`,
      end_time: `${formatDate(selectedDate.value.to ? selectedDate.value.to : selectedDate.value, true)}`,
      offset: (referralRebateEvents.pagination.page - 1) * referralRebateEvents.pagination.size,
      size: 20
    }

    const { status, data } = await useApi(getReferralRebateEvents, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateEvents.list.length = 0
      referralRebateEvents.pagination.page = 1
      referralRebateEvents.pagination.offset = 1
      referralRebateEvents.pagination.size = 10
      referralRebateEvents.pagination.total = 0

      const list = data.list.map((e) => {
        return {
          id: e.id,
          settlement_time: parseDate(e.settlement_time),
          currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
          valid_bet_amount: moneyFormat(e.valid_bet_amount),
          profit: moneyFormat(e.profit),
          revenue_amount: moneyFormat(e.revenue_amount),
          distribution_time: parseDate(e.distribution_time),
          action: "action"
        }
      })

      referralRebateEvents.pagination.offset = data.pagination.offset
      referralRebateEvents.pagination.size = data.pagination.size
      referralRebateEvents.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      Object.assign(referralRebateEvents.list, list)
    }
  }

  // 反佣結算明細
  const getEventsStatements = async (eventId: number, showAll: boolean) => {
    isLoading.value = true

    const payload: Request.getReferralRebateEventsStatements = {
      event_id: eventId,
      account: accountNumber.value,
      game_type: gameTypeId.value,
      currency_id: referralRebateCurrencyId.value,
      offset: (referralRebateEventsStatements.pagination.page - 1) * referralRebateEventsStatements.pagination.size,
      size: 20
    }

    // 刪除 game_type、account
    if (showAll) {
      delete payload.game_type
      delete payload.account
    } else if (gameTypeId.value === 0) {
      delete payload.game_type
    }

    const { status, data } = await useApi(getReferralRebateEventsStatements, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateEventsStatements.list.length = 0
      referralRebateEventsStatements.pagination.page = 1
      referralRebateEventsStatements.pagination.offset = 1
      referralRebateEventsStatements.pagination.size = 10
      referralRebateEventsStatements.pagination.total = 0

      const list = data.list.map((e, index) => {
        return {
          index: index,
          account: e.account,
          tier: e.tier,
          rate: `${e.rate} %`,
          currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
          valid_bet_amount: moneyFormat(e.valid_bet_amount),
          profit: moneyFormat(e.profit),
          revenue_amount: moneyFormat(e.revenue_amount)
        }
      })
      referralRebateEventsStatements.pagination.offset = data.pagination.offset
      referralRebateEventsStatements.pagination.size = data.pagination.size
      referralRebateEventsStatements.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      Object.assign(referralRebateEventsStatements.list, list)
      console.log(referralRebateEventsStatements, data)
    }
  }

  // 專屬推薦碼
  const getReferralCode = async () => {
    const { status, data } = await useApi(getReferralInfo)

    if (status && data) {
      referralCode.value = data.code
    }
  }

  const handleShareReferralCode = () => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        referral_code: referralCode.value
      }
    })

    copyMessage(window.location.href)
  }

  function formatDate(dateStr: string, isEnd: boolean) {
    const date = new Date(dateStr)

    if (isEnd) {
      date.setHours(23, 59, 59)
    } else {
      date.setHours(0, 0, 0)
    }

    // 設定時區 +08:00
    const offset = 8 * 60
    const tzOffset =
      (offset >= 0 ? "+" : "-") +
      String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0") +
      ":" +
      String(Math.abs(offset) % 60).padStart(2, "0")

    const isoString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}:${String(date.getSeconds()).padStart(2, "0")}${tzOffset}`

    return isoString
  }

  function parseDate(dateStr: string) {
    if (!dateStr) return "- -"
    const date = new Date(dateStr)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }

  const handleReferralRebateStatementsPagination = (page: number) => {
    referralRebateStatements.pagination.page = page
    getStatement(false)
  }

  const handleReferralRebateEventsPagination = (page: number) => {
    referralRebateEvents.pagination.page = page
    getEvents()
  }

  const eventId = ref<number>()
  const handlereferralRebateEventsStatementsPagination = (page: number) => {
    referralRebateEventsStatements.pagination.page = page
    if (eventId.value) {
      getEventsStatements(eventId.value, false)
    }
  }

  const handleEventsRowClick = (evt: Event, row: any, index: number) => {
    eventId.value = row.id

    if (eventId.value !== undefined) {
      handleDetailClick(eventId.value)
    }
  }

  const handleDetailClick = (eventId: number) => {
    selectedEventId.value = eventId

    router.push({
      path: "/referral_rebate/event/" + eventId
    })
    changeGameType({ label: "", value: 0 })
    getEventsStatements(eventId, true)
  }

  const tableRowClass = () => {
    return "cursor-pointer"
  }

  watch(route, async () => {
    if (route.name === "ReferralRebate") {
      selectedEventId.value = null

      await getSummary()
      await getStatement(false)
      await getEvents()
    }
  })

  // 假資料生成函數
  const generateMockReferralRebateStatements = () => {
    const mockList = [
      {
        account: "user001",
        tier: "1",
        deposit_amount: "10,000.00",
        currency_id: "USDT",
        game_type: "game_type.sport",
        valid_bet_amount: "50,000.00",
        profit: "5,000.00",
        rate: "2.5",
        revenue_amount: "125.00"
      },
      {
        account: "user002",
        tier: "2",
        deposit_amount: "25,000.00",
        currency_id: "USDT",
        game_type: "game_type.live_casino",
        valid_bet_amount: "80,000.00",
        profit: "-3,200.00",
        rate: "3.0",
        revenue_amount: "240.00"
      },
      {
        account: "user003",
        tier: "1",
        deposit_amount: "15,000.00",
        currency_id: "USDT",
        game_type: "game_type.slot",
        valid_bet_amount: "120,000.00",
        profit: "8,500.00",
        rate: "2.0",
        revenue_amount: "170.00"
      },
      {
        account: "user004",
        tier: "3",
        deposit_amount: "50,000.00",
        currency_id: "USDT",
        game_type: "game_type.sport",
        valid_bet_amount: "200,000.00",
        profit: "12,000.00",
        rate: "3.5",
        revenue_amount: "420.00"
      },
      {
        account: "user005",
        tier: "2",
        deposit_amount: "8,000.00",
        currency_id: "USDT",
        game_type: "game_type.lottery",
        valid_bet_amount: "35,000.00",
        profit: "2,800.00",
        rate: "2.8",
        revenue_amount: "98.00"
      }
    ]

    referralRebateStatements.list.length = 0
    Object.assign(referralRebateStatements.list, mockList)
    referralRebateStatements.pagination.page = 1
    referralRebateStatements.pagination.offset = 1
    referralRebateStatements.pagination.size = 10
    referralRebateStatements.pagination.total = 1
  }

  const generateMockReferralRebateEvents = () => {
    const mockList = [
      {
        id: 1,
        settlement_time: "2024/01/15 00:00:00",
        currency_id: "USDT",
        valid_bet_amount: "485,000.00",
        profit: "23,100.00",
        revenue_amount: "1,053.00",
        distribution_time: "2024/01/16 10:30:00",
        action: "action"
      },
      {
        id: 2,
        settlement_time: "2024/01/08 00:00:00",
        currency_id: "USDT",
        valid_bet_amount: "520,000.00",
        profit: "31,500.00",
        revenue_amount: "1,260.00",
        distribution_time: "2024/01/09 10:30:00",
        action: "action"
      },
      {
        id: 3,
        settlement_time: "2024/01/01 00:00:00",
        currency_id: "USDT",
        valid_bet_amount: "380,000.00",
        profit: "18,200.00",
        revenue_amount: "910.00",
        distribution_time: "2024/01/02 10:30:00",
        action: "action"
      },
      {
        id: 4,
        settlement_time: "2023/12/25 00:00:00",
        currency_id: "USDT",
        valid_bet_amount: "650,000.00",
        profit: "45,000.00",
        revenue_amount: "1,575.00",
        distribution_time: "2023/12/26 10:30:00",
        action: "action"
      },
      {
        id: 5,
        settlement_time: "2023/12/18 00:00:00",
        currency_id: "USDT",
        valid_bet_amount: "420,000.00",
        profit: "28,000.00",
        revenue_amount: "1,120.00",
        distribution_time: "2023/12/19 10:30:00",
        action: "action"
      }
    ]

    referralRebateEvents.list.length = 0
    Object.assign(referralRebateEvents.list, mockList)
    referralRebateEvents.pagination.page = 1
    referralRebateEvents.pagination.offset = 1
    referralRebateEvents.pagination.size = 10
    referralRebateEvents.pagination.total = 1
  }

  const generateMockReferralRebateEventsStatements = () => {
    const mockList = [
      {
        index: 0,
        account: "user001",
        tier: "1",
        rate: "2.5 %",
        currency_id: "USDT",
        valid_bet_amount: "50,000.00",
        profit: "5,000.00",
        revenue_amount: "125.00"
      },
      {
        index: 1,
        account: "user002",
        tier: "2",
        rate: "3.0 %",
        currency_id: "USDT",
        valid_bet_amount: "80,000.00",
        profit: "-3,200.00",
        revenue_amount: "240.00"
      },
      {
        index: 2,
        account: "user003",
        tier: "1",
        rate: "2.0 %",
        currency_id: "USDT",
        valid_bet_amount: "120,000.00",
        profit: "8,500.00",
        revenue_amount: "170.00"
      },
      {
        index: 3,
        account: "user004",
        tier: "3",
        rate: "3.5 %",
        currency_id: "USDT",
        valid_bet_amount: "200,000.00",
        profit: "12,000.00",
        revenue_amount: "420.00"
      },
      {
        index: 4,
        account: "user005",
        tier: "2",
        rate: "2.8 %",
        currency_id: "USDT",
        valid_bet_amount: "35,000.00",
        profit: "2,800.00",
        revenue_amount: "98.00"
      },
      {
        index: 5,
        account: "user006",
        tier: "1",
        rate: "2.2 %",
        currency_id: "USDT",
        valid_bet_amount: "45,000.00",
        profit: "3,500.00",
        revenue_amount: "99.00"
      }
    ]

    referralRebateEventsStatements.list.length = 0
    Object.assign(referralRebateEventsStatements.list, mockList)
    referralRebateEventsStatements.pagination.page = 1
    referralRebateEventsStatements.pagination.offset = 1
    referralRebateEventsStatements.pagination.size = 10
    referralRebateEventsStatements.pagination.total = 1
  }

  return {
    activeTab,

    /** 查詢中 */
    isLoading,

    /** 幣別下拉選單 */
    currencyDropdown,

    /** 遊戲類別下拉選單 */
    gameTypeDropdown,

    /** 遊戲類別下拉選單含全部 */
    gameTypeDropdownWithAll,
    gameTypeId,

    /** 推薦碼 */
    referralCode,

    /** 當前幣別id */
    referralRebateCurrencyId,

    /** 總計 */
    referralRebateSummary,
    /** 返回總計 */
    returnReferralRebateSummary,
    /** 當前幣別code */
    referralRebateCurrencyCode,

    /** 當前遊戲名稱code */
    gameTypeCode,

    /** 初始化明細 */
    initDetail,

    /** 初始化幣別 */
    initReferralRebateCurrency,

    /** 初始化日期 */
    initReferralRebateDate,

    /** 切換幣別 */
    changeCurrency,

    /** 切換遊戲類別 */
    changeGameType,

    /** 當期總計 */
    getSummary,

    /** 當期反佣結算明細 (下級投注報表) */
    getStatement,

    /** 反佣明細 */
    getEvents,

    /** 反佣結算明細 */
    getEventsStatements,

    /** 取得專屬優惠碼 */
    getReferralCode,

    /** 會員帳號 */
    accountNumber,

    selectedDate,

    displayDate,

    referralRebateStatements,

    referralRebateStatementsTableColumns,

    referralRebateEventsStatementsTableColumns,

    referralRebateEvents,

    referralRebateEventsStatements,

    referralRebateEventsTableColumns,

    handleReferralRebateStatementsPagination,

    handleReferralRebateEventsPagination,

    handlereferralRebateEventsStatementsPagination,

    handleShareReferralCode,

    handleEventsRowClick,

    handleDetailClick,

    tableRowClass,

    selectedEventId,

    /** 假資料生成函數 */
    generateMockReferralRebateStatements,
    generateMockReferralRebateEvents,
    generateMockReferralRebateEventsStatements
  }
}
