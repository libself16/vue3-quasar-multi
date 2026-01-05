import { ref, reactive, computed, watch } from "vue"
import { useApi } from "src/common/hooks/useApi"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { INVITATION_STATUS, REBATE_STATUS } from "src/common/utils/constants"
import {
  getCollaborationStatistics,
  getCollaborationVisibility,
  getInvitations,
  getRebates
} from "src/api/collaboration"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useCommon } from "src/common/hooks/useCommon"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"

export function useCollaboration() {
  const router = useRouter()
  const route = useRoute()
  const { availCurrencyList, currencyIdMap, currencyCodeMap, getAvailCurrencyList, formatterCurrency } = useBank()
  const { activeWalletCurrencyCode } = useUserInfo()
  const { nowLang } = useLanguage()
  const { moneyFormat, genEnumToArray, copyMessage } = useCommon()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()

  const referralCode = ref("-")
  const accountNumber = ref("")
  const activeTab = ref("invitationDetails")
  const showTip = ref(false)
  const handleShowTip = () => {
    console.log("handleShowTip")
    showTip.value = true
  }
  const tableRowClass = () => {
    return "cursor-pointer"
  }
  const currencyDropdown = computed(() => {
    if (!availCurrencyList.value.length) return []

    return availCurrencyList.value.map((e) => {
      return {
        label: formatterCurrency(e.code) || "",
        value: e.id
      }
    })
  })
  const invitationsData = reactive<Response.InvitationList>({
    list: [],
    pagination: {
      page: 1,
      offset: 0,
      size: 10,
      total: 0
    }
  })
  const invitationsStatusDropdown = computed(() => {
    return genEnumToArray(INVITATION_STATUS.Enums).map((e) => {
      return {
        label: t(INVITATION_STATUS.I18nKeys[e as INVITATION_STATUS.Enums]),
        value: e
      }
    })
  })
  const rebateDate = reactive<Response.RebateList>({
    list: [],
    pagination: {
      page: 1,
      offset: 0,
      size: 10,
      total: 0
    }
  })
  const invitationsStatusCode = computed(() => {
    return INVITATION_STATUS.I18nKeys[invitationsStatusId.value]
  })
  const collaborationCurrencyCode = computed(() => {
    if (!collaborationCurrencyId.value || !currencyIdMap.value) return ""

    return formatterCurrency(currencyIdMap.value[collaborationCurrencyId.value]?.code || "")
  })

  const invitationsStatusId = ref(INVITATION_STATUS.Enums.All)
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

  const invitationsTableColumns = computed(() => {
    const columns = [
      { name: "member_account", label: t("collaboration.member_account"), field: "member_account" },
      { name: "deposit_count", label: t("collaboration.deposit_count"), field: "deposit_count" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "deposit_amount", label: t("collaboration.deposit_amount"), field: "deposit_amount" },
      { name: "valid_bet_amount", label: t("collaboration.valid_bet_amount"), field: "valid_bet_amount" },
      { name: "status", label: t("collaboration.status"), field: "status" }
    ]

    return columns
  })

  const rebateDateTableColumns = computed(() => {
    const columns = [
      { name: "settled_time", label: t("collaboration.settlement_time"), field: "settled_time" },
      {
        name: "active_member_count",
        label: t("collaboration.achieved_active_member_count"),
        field: "active_member_count"
      },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "valid_bet_amount", label: t("collaboration.valid_bet_amount"), field: "valid_bet_amount" },
      { name: "level", label: t("collaboration.commission_level"), field: "level" },
      { name: "rebate_amount", label: t("collaboration.commission_amount"), field: "rebate_amount" }
    ]

    return columns
  })

  async function initCollaborationDate() {
    function getDates() {
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0") // 月份要 +1
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}/${month}/${day}`
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
  const collaborationCurrencyId = ref(0)
  const isInitFinish = ref(false)
  const isLoading = ref(false)
  const showCollaboration = ref(false)

  const collaborationState = reactive<Response.CollaborationStatistics>({
    banner: "",
    active_member_count: 0,
    valid_bet_amount: 0,
    referral_code: "",
    title: "",
    detail: ""
  })

  function changeCurrency(item: Response.BaseListType) {
    collaborationCurrencyId.value = item.value as number
    handleGetCollaboration()
  }

  function changeInvitationsStatus(item: Response.BaseListType) {
    invitationsStatusId.value = item.value as number
  }

  async function handleGetCollaborationVisibility() {
    try {
      isLoading.value = true
      const { status, data } = await useApi(getCollaborationVisibility)
      isLoading.value = false
      isInitFinish.value = true

      if (status && data) {
        showCollaboration.value = true
        return
      }

      showCollaboration.value = false
    } catch (error) {
      isLoading.value = false
    }
  }

  async function handleGetCollaboration() {
    try {
      const payload: Request.GetCollaborationStatistics = {
        lang: nowLang.value,
        currency_id: collaborationCurrencyId.value
      }
      isLoading.value = true
      const { status, data } = await useApi(getCollaborationStatistics, payload)
      isLoading.value = false
      isInitFinish.value = true

      if (status) {
        collaborationState.banner = data.banner
        collaborationState.active_member_count = data.active_member_count
        collaborationState.valid_bet_amount = data.valid_bet_amount
        collaborationState.referral_code = data.referral_code
        referralCode.value = data.referral_code
        collaborationState.referral_code = data.referral_code
        collaborationState.title = data.title
        collaborationState.detail = data.detail.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  async function handleGetInvitations() {
    try {
      const payload: Request.GetInvitationList = {
        member_account: accountNumber.value,
        currency_id: collaborationCurrencyId.value,
        status: invitationsStatusId.value,
        offset: (invitationsData.pagination.page - 1) * invitationsData.pagination.size,
        size: 10
      }
      if (!payload.member_account) {
        delete payload.member_account
      }
      if (payload.status < 0) {
        delete payload.status
      }
      isLoading.value = true
      const { status, data } = await useApi(getInvitations, payload)
      isLoading.value = false
      isInitFinish.value = true
      //
      if (status && data) {
        invitationsData.list.length = 0
        invitationsData.pagination.offset = 0
        invitationsData.pagination.size = 10
        invitationsData.pagination.total = 0

        const list = data.list.map((e) => {
          return {
            member_id: e.member_id,
            member_account: e.member_account,
            deposit_count: moneyFormat(e.deposit_count),
            deposit_amount: moneyFormat(e.deposit_amount),
            valid_bet_amount: moneyFormat(e.valid_bet_amount),
            status: INVITATION_STATUS.I18nKeys[e.status as INVITATION_STATUS.Enums],
            currency_id: formatterCurrency(currencyIdMap.value![collaborationCurrencyId.value]?.code || ""),
            currency_code: e.currency_code,
            showDetail: false
          }
        })
        invitationsData.pagination.page =
          data.pagination.offset === 0 ? 1 : data.pagination.offset / data.pagination.size + 1
        invitationsData.pagination.offset = data.pagination.offset
        invitationsData.pagination.size = data.pagination.size
        invitationsData.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
        Object.assign(invitationsData.list, list)
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  async function handleGetRebates() {
    try {
      const payload: Request.GetRebates = {
        start_time: `${selectedDate.value.from ? selectedDate.value.from : selectedDate.value}`,
        end_time: `${selectedDate.value.to ? selectedDate.value.to : selectedDate.value}`,
        currency_id: collaborationCurrencyId.value,
        offset: (rebateDate.pagination.page - 1) * rebateDate.pagination.size,
        size: 10
      }
      isLoading.value = true
      const { status, data } = await useApi(getRebates, payload)
      isLoading.value = false
      isInitFinish.value = true
      //
      if (status && data) {
        rebateDate.list.length = 0
        rebateDate.pagination.offset = 1
        rebateDate.pagination.size = 10
        rebateDate.pagination.total = 0

        const list = data.list.map((e) => {
          return {
            id: e.id,
            settled_time: parseDate(e.settled_time),
            active_member_count: moneyFormat(e.active_member_count),
            valid_bet_amount: moneyFormat(e.valid_bet_amount),
            level: e.level,
            rebate_amount: moneyFormat(e.rebate_amount),
            currency_id: formatterCurrency(currencyIdMap.value![collaborationCurrencyId.value]?.code || ""),
            currency_code: e.currency_code,
            status: e.status,
            showDetail: false
          }
        })
        rebateDate.pagination.page =
          data.pagination.offset === 0 ? 1 : data.pagination.offset / data.pagination.size + 1
        rebateDate.pagination.offset = data.pagination.offset
        rebateDate.pagination.size = data.pagination.size
        rebateDate.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
        Object.assign(rebateDate.list, list)
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  const handleInvitationsDataPagination = (page: number) => {
    console.log(page)
    invitationsData.pagination.page = page
    handleGetInvitations()
  }

  const handleRebateDatePagination = (page: number) => {
    rebateDate.pagination.page = page
    handleGetRebates()
  }

  async function initCollaborationCurrency() {
    isLoading.value = true
    await getAvailCurrencyList()
    isLoading.value = false

    if (activeWalletCurrencyCode.value && currencyCodeMap.value) {
      const currency = currencyCodeMap.value[activeWalletCurrencyCode.value]
      if (currency) {
        collaborationCurrencyId.value = currency.id
        return
      }
    }

    if (availCurrencyList.value.length) {
      collaborationCurrencyId.value = availCurrencyList.value[0].id
    }
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

    const isoString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
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

  // 切換語系call api
  watch(nowLang, (newValue) => {
    if (isInitFinish.value) {
      handleGetCollaboration()
    }
  })

  // 開發環境標記
  const useMockData = ref(false)

  // 使用假數據替換真實數據
  const loadMockInvitationsData = () => {
    const mockList = [
      {
        member_id: 12345,
        member_account: "testuser001",
        deposit_count: 5,
        deposit_amount: 1000.0,
        valid_bet_amount: 5000.0,
        status: INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        showDetail: false
      },
      {
        member_id: 12346,
        member_account: "testuser002",
        deposit_count: 2,
        deposit_amount: 500.0,
        valid_bet_amount: 1200.0,
        status: INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED],
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        showDetail: false
      },
      {
        member_id: 12347,
        member_account: "testuser003",
        deposit_count: 8,
        deposit_amount: 2500.0,
        valid_bet_amount: 8000.0,
        status: INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        showDetail: false
      },
      {
        member_id: 12348,
        member_account: "testuser004",
        deposit_count: 3,
        deposit_amount: 750.0,
        valid_bet_amount: 2300.0,
        status: INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED],
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        showDetail: false
      },
      {
        member_id: 12349,
        member_account: "testuser005",
        deposit_count: 12,
        deposit_amount: 3500.0,
        valid_bet_amount: 15000.0,
        status: INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        showDetail: false
      }
    ]
    invitationsData.list = mockList as any
    invitationsData.pagination.page = 1
    invitationsData.pagination.offset = 0
    invitationsData.pagination.size = 10
    invitationsData.pagination.total = 1
  }

  const loadMockRebateData = () => {
    const mockList = [
      {
        id: 1001,
        settled_time: "2024/01/15 14:30:25",
        active_member_count: 12,
        valid_bet_amount: 250090.0,
        level: 1,
        rebate_amount: 1250.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.NOT_COLLECTED,
        showDetail: false
      },
      {
        id: 1002,
        settled_time: "2024/01/14 09:15:10",
        active_member_count: 8,
        valid_bet_amount: 18500.0,
        level: 2,
        rebate_amount: 925.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.COLLECTED,
        showDetail: false
      },
      {
        id: 1003,
        settled_time: "2024/01/13 16:45:30",
        active_member_count: 15,
        valid_bet_amount: 32000.0,
        level: 1,
        rebate_amount: 1600.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.REJECTED,
        showDetail: false
      },
      {
        id: 1004,
        settled_time: "2024/01/12 11:20:15",
        active_member_count: 6,
        valid_bet_amount: 12800.0,
        level: 3,
        rebate_amount: 640.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.NOT_COLLECTED,
        showDetail: false
      },
      {
        id: 1005,
        settled_time: "2024/01/11 08:45:50",
        active_member_count: 20,
        valid_bet_amount: 45000.0,
        level: 2,
        rebate_amount: 2250.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.COLLECTED,
        showDetail: false
      },
      {
        id: 1006,
        settled_time: "2024/01/10 16:30:40",
        active_member_count: 10,
        valid_bet_amount: 22500.0,
        level: 1,
        rebate_amount: 1125.0,
        currency_id: formatterCurrency(currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "") || "PHP",
        currency_code: currencyIdMap.value?.[collaborationCurrencyId.value]?.code || "PHP",
        status: REBATE_STATUS.Enums.NOT_COLLECTED,
        showDetail: false
      }
    ]
    rebateDate.list = mockList as any
    rebateDate.pagination.page = 1
    rebateDate.pagination.offset = 0
    rebateDate.pagination.size = 10
    rebateDate.pagination.total = 1
  }

  // 切換使用假數據
  const toggleMockData = (enabled: boolean) => {
    useMockData.value = enabled
    if (enabled) {
      loadMockInvitationsData()
      loadMockRebateData()
    }
  }

  return {
    /** 查詢中 */
    isLoading,

    /** 會員帳號 */
    accountNumber,

    /** 幣別下拉選單 */
    currencyDropdown,

    /** 推薦碼 **/
    referralCode,

    /** 當前幣別id */
    collaborationCurrencyId,

    /** 當前幣別code */
    collaborationCurrencyCode,

    /** 切換幣別 */
    changeCurrency,

    /** 合營代理統計數據 */
    collaborationState,

    /** 是否顯示合營代理 */
    showCollaboration,

    /** 取得是否顯示合營代理 */
    handleGetCollaborationVisibility,

    /** 取得合營代理統計數據 */
    handleGetCollaboration,

    /** 初始化合營代理查詢幣別 */
    initCollaborationCurrency,

    /** 取得合營代理邀請 */
    handleGetInvitations,

    /** 邀請狀態 */
    invitationsStatusId,

    /** 切換邀請狀態 */
    changeInvitationsStatus,

    /** 邀請狀態下拉選單 */
    invitationsStatusDropdown,

    /** 邀請狀態code */
    invitationsStatusCode,

    /** 初始化合營代理查詢日期 */
    initCollaborationDate,

    /** 顯示合營代理查詢日期 */
    displayDate,

    /**  */
    selectedDate,

    /** 取得合營代理反佣 */
    handleGetRebates,

    /**  */
    invitationsTableColumns,

    /**  */
    invitationsData,

    /** 邀請分頁 */
    handleInvitationsDataPagination,

    /** 取得合營代理反佣 */
    rebateDateTableColumns,

    /**  */
    rebateDate,

    /**  */
    handleRebateDatePagination,

    /**  */
    activeTab,

    /**  */
    handleShowTip,
    showTip,

    tableRowClass,
    handleShareReferralCode,

    /** 開發環境標記 */
    useMockData,

    /** 載入假邀請數據 */
    loadMockInvitationsData,

    /** 載入假佣金數據 */
    loadMockRebateData,

    /** 切換使用假數據 */
    toggleMockData
  }
}
