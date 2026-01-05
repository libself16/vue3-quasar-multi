import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useQuasar } from "quasar"
import { computed, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import {
  INPUT_TYPE,
  COLUMN_NAME,
  WALLET_TYPE,
  REPORT_DATE_TYPES,
  MEMBER_AGENT_QUOTA_SEARCH_TYPE,
  MEMBER_AGENT_QUOTA_BALANCE_TYPE
} from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { defineStore } from "pinia"
import { useEnv } from "src/common/hooks/useEnv"
import { getLastOrOverDay, getToday, getYesterday } from "src/common/utils/dayjsUtils"

type WalletDropItem = {
  label: string
  value: number
}

export const useMemberManagement = defineStore("useMemberManagement", () => {
  const { isCredit } = useEnv()
  const { nowLang } = useLanguage()
  const $q = useQuasar()
  const { t } = useI18n()
  const { preciseMultiply, preciseDivide, moneyFormat } = useCommon()
  const {
    inUseWallet,
    userWalletMap,
    getWalletLabel,
    getMemberAgentQuotaList,
    getLowerLevelMemberAgentQuotaList,
    getMemberAgentQuotaMoneyHistory,
    updateMemberAgentQuotaBalance,
    getMemberAgentCustomizeColumn,
    getMemberAgentReferralList,
    getMemberAgentTagList,
    createMemberAgent,
    updateMemberAgent,
    getMemberAgentInfo,
    getMemberAgentQuotaAmount,
    getMemberAgentBetReport,
    getMemberAgentWagerList,
    getMemberAgentWagerDetail,
    getMemberAgentReport,
    getMemberTeamAgentReport
  } = useUserInfo()

  const activeTab = ref("manage") // 目前選擇的頁籤（manage: 會員代理額度管理, detail: 會員代理額度明細, betReport: 投注報表, betRecordQuery: 投注紀錄查詢, agentReport: 代理報表）
  const datePickerShow = ref(false) // 日期選擇器是否顯示
  const page = ref(1) // 頁數
  const offset = ref(0) // 當前筆數
  const size = ref(10) // 每頁顯示數量
  const totalPage = ref(0) // 總共有幾頁
  const showDialog = ref(false)
  const remainQuotaAmount = ref(0)
  const dialogType = ref(1) // 加減款類型
  const targetAccount = ref() // 欲加減款帳號
  const dialogAmount = ref("") // 加減款金額
  const dialogMemberIsAgent = ref(false) // 是否為會員代理
  const dialogIncreaseItem = ref(0) // 加減款項目（0: 點數, 1: 代理額度）
  const memberAccount = ref("") // 會員帳號
  const recommenderAccount = ref("") // 推薦人帳號
  const searchSubordinateMemberAccount = ref("") // 搜尋下級會員帳號
  // 保存最後一次成功搜尋的參數
  const lastSearchMemberAccount = ref("") // 最後一次搜尋的會員帳號
  const lastSearchRecommenderAccount = ref("") // 最後一次搜尋的推薦人帳號
  const lastSearchSubordinateMemberAccount = ref("") // 最後一次搜尋的下級會員帳號
  const lastSearchDateRange = ref({ from: "", to: "" }) // 最後一次搜尋的日期範圍
  const lastSearchChangeType = ref(0) // 最後一次搜尋的變更類型
  const lastSearchBetNumber = ref("") // 最後一次搜尋的注單編號
  const lastSearchSettlementDate = ref(false) // 最後一次搜尋的結算日期
  const lastSearchBetDate = ref(false) // 最後一次搜尋的投注日期
  const lastSearchCurrencyId = ref(0) // 最後一次搜尋的幣別id
  const betNumber = ref("") // 注單編號
  const dateRange = ref<any>({ from: "", to: "" }) // 搜尋日期範圍
  const changeType = ref(0) // 搜尋類型（0: 全部, 1: 代理加款, 2: 代理減款
  const settlementDate = ref(false) // 是否搜尋結算日期
  const betDate = ref(false) // 是否搜尋投注日期
  const showAddSubordinateStatus = ref(false) // 是否顯示新增下級會員畫面
  const memberAgentCustomizeColumn = ref<Response.MemberCustomizeColumnListData[]>([]) // 後台會員資料自訂欄位
  const originalMemberAgentCustomizeColumnData = ref<Record<string, any>>({}) // api回傳的會員編輯欄位資料
  const memberAgentCustomizeColumnData = ref<Record<string, any>>({}) // 會員編輯欄位資料
  const memberAgentReferralList = ref<{ label: string; value: number }[]>([]) // 推薦人列表
  const memberAgentTagList = ref<Response.MemberAgentTagListData[]>([]) // 標籤列表
  const memberAgentCustomizeColumnId = ref(0) // 要編輯的會員id
  const memberAgentAccount = ref("") // 會員代理帳號
  const showSubordinateMemberAccount = ref<{ account: string; memberId: number } | null>(null) // 目前顯示的下級會員帳號
  const agentReportCurrencyId = ref(inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0) // 代理報表幣別
  const dateType = ref(REPORT_DATE_TYPES.Enums.LastSevenDays) // 代理報表日期類型
  const isLoading = ref(false) // 代理報表需要loading
  const manageRows = ref<Response.GetMemberAgentQuotaList[]>([]) // 會員管理數據
  const detailRows = ref<Response.GetMemberAgentQuotaMoneyHistory[]>([]) // 會員帳變明細數據
  const betReportRows = ref<Response.GetMemberAgentBetReportItem[]>([]) // 投注報表數據
  const betRecordQueryRows = ref<Response.GetMemberAgentWagerListItemData[]>([]) // 投注紀錄查詢數據
  const betReportSummary = ref<Response.GetMemberAgentBetReportSummaryItem>() // 投注報表數據總覽
  const betRecordQuerySummary = ref<Response.GetMemberAgentWagerListItemSummary>() // 投注紀錄查詢數據總覽
  const agentReportRows = ref<Response.GetMemberTeamAgentReportList[]>([]) // 代理報表團隊數據
  const agentReportOwnData = ref<Response.GetMemberAgentReport>() // 代理報表自身數據

  const tabOptions = computed(() => {
    return [
      { label: t("menu.membershipManagement"), value: "manage" },
      { label: t("menu.memberChangeDetails"), value: "detail" },
      { label: t("member.membershipManagement.betReport"), value: "betReport" },
      { label: t("member.membershipManagement.betRecordQuery"), value: "betRecordQuery" },
      { label: t("member.membershipManagement.agentReport"), value: "agentReport" }
    ]
  })

  const changeTypeOptions = computed(() => {
    return [
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction
      }
    ]
  })

  const operationOptions = computed(() => {
    return [
      { label: t("common.btn.addAmount"), value: MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add },
      { label: t("common.btn.minusAmount"), value: MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Minus }
    ]
  })

  const manageColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "center" as const },
      { name: "level", label: t("tableHeader.level"), field: "level", align: "center" as const },
      { name: "register_date", label: t("tableHeader.registerTime"), field: "register_date", align: "center" as const },
      {
        name: "last_login_date",
        label: t("tableHeader.lastLoginTime"),
        field: "last_login_date",
        align: "center" as const
      },
      { name: "balance", label: t("common.btn.point"), field: "balance", align: "center" as const },
      {
        name: "remain_quota_amount",
        label: t("tableHeader.balance"),
        field: "remain_quota_amount",
        align: "center" as const
      },
      { name: "actions", label: t("tableHeader.operating"), field: "actions", align: "center" as const }
    ]
  })

  const detailColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "center" as const },
      {
        name: "updated_at_unix",
        label: t("tableHeader.accountChangeTime"),
        field: "updated_at_unix",
        align: "center" as const
      },
      { name: "action_type", label: t("tableHeader.accountType"), field: "action_type", align: "center" as const },
      {
        name: "transaction_code",
        label: t("tableHeader.accountVariableObject"),
        field: "transaction_code",
        align: "center" as const
      },
      { name: "amount", label: t("tableHeader.amount"), field: "amount", align: "center" as const },
      {
        name: "before_balance",
        label: t("tableHeader.amountBeforeChanges"),
        field: "before_balance",
        align: "center" as const
      },
      {
        name: "after_balance",
        label: t("tableHeader.amountAfterChange"),
        field: "after_balance",
        align: "center" as const
      }
    ]
  })

  const betReportColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" as const },
      {
        name: "bet_count",
        label: t("tableHeader.orderQuantity"),
        field: "bet_count",
        align: "center" as const
      },
      {
        name: "win_count",
        label: t("tableHeader.winningNumber"),
        field: "win_count",
        align: "center" as const
      },
      {
        name: "bet_amount",
        label: t("tableHeader.bettingAmount"),
        field: "bet_amount",
        align: "center" as const
      },
      {
        name: "valid_bet_amount",
        label: t("tableHeader.validBetAmount"),
        field: "valid_bet_amount",
        align: "center" as const
      },
      { name: "payout", label: t("common.payout"), field: "payout", align: "center" as const },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit", align: "center" as const },
      { name: "profit_rate", label: t("tableHeader.profitRatio"), field: "profit_rate", align: "center" as const },
      { name: "bonus", label: t("tableHeader.activityBonus"), field: "bonus", align: "center" as const }
    ]
  })

  const agentReportColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" as const },
      {
        name: "member_count",
        label: t("member.membershipManagement.teamMember"),
        field: "member_count",
        align: "center" as const
      },
      { name: "currency_id", label: t("member.profile.currency"), field: "currency_id", align: "center" as const },
      {
        name: "bet_count",
        label: t("member.membershipManagement.teamBetNumber"),
        field: "bet_count",
        align: "center" as const
      },
      {
        name: "deposit",
        label: t("member.membershipManagement.teamDepositAmount"),
        field: "deposit",
        align: "center" as const
      },
      {
        name: "withdraw",
        label: t("member.membershipManagement.teamWithdrawalAmount"),
        field: "withdraw",
        align: "center" as const
      },
      {
        name: "bet_amount",
        label: t("member.membershipManagement.teamBetAmount"),
        field: "bet_amount",
        align: "center" as const
      },
      {
        name: "valid_bet",
        label: t("member.membershipManagement.teamValidBetAmount"),
        field: "valid_bet",
        align: "center" as const
      },
      {
        name: "prize",
        label: t("member.membershipManagement.teamPayoutAmount"),
        field: "prize",
        align: "center" as const
      },
      {
        name: "profit",
        label: t("member.membershipManagement.teamProfit"),
        field: "profit",
        align: "center" as const
      },
      {
        name: "rate",
        label: t("member.membershipManagement.teamProfitRatio"),
        field: "rate",
        align: "center" as const
      },
      {
        name: "bonus",
        label: t("member.membershipManagement.teamActivityBonus"),
        field: "bonus",
        align: "center" as const
      }
    ]
  })

  const agentReportTopAreaColumns = computed(() => {
    return [
      { label: t("menu.userAccount"), value: agentReportOwnData.value?.team?.member_account ?? "-" },
      {
        label: t("member.profile.currency"),
        value: currencyName(lastSearchCurrencyId.value)
      },
      {
        label: t("member.membershipManagement.orderQuantity"),
        value: moneyFormat(agentReportOwnData.value?.personal?.bet_count) ?? "-"
      },
      { label: t("menu.deposit"), value: moneyFormat(agentReportOwnData.value?.personal?.deposit) ?? "-" },
      { label: t("menu.withdrawal"), value: moneyFormat(agentReportOwnData.value?.personal?.withdraw) ?? "-" },
      {
        label: t("tableHeader.bettingAmount"),
        value: moneyFormat(agentReportOwnData.value?.personal?.bet_amount) ?? "-"
      },
      {
        label: t("tableHeader.validBetAmount"),
        value: moneyFormat(agentReportOwnData.value?.personal?.valid_bet) ?? "-"
      },
      { label: t("common.payout"), value: moneyFormat(agentReportOwnData.value?.personal?.prize) ?? "-" },
      {
        label: t("member.referralRebate.profit"),
        value: moneyFormat(agentReportOwnData.value?.personal?.profit) ?? "-"
      },
      {
        label: t("tableHeader.profitRatio"),
        value: agentReportOwnData.value?.personal?.rate ? `${agentReportOwnData.value?.personal?.rate}%` : "-"
      },
      { label: t("tableHeader.activityBonus"), value: moneyFormat(agentReportOwnData.value?.personal?.bonus) ?? "-" }
    ]
  })

  const agentReportBottomAreaColumns = computed(() => {
    return [
      {
        label: t("member.membershipManagement.teamMember"),
        value: moneyFormat(agentReportOwnData.value?.team?.member_count) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamBetNumber"),
        value: moneyFormat(agentReportOwnData.value?.team?.bet_count) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamDepositAmount"),
        value: moneyFormat(agentReportOwnData.value?.team?.deposit) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamWithdrawalAmount"),
        value: moneyFormat(agentReportOwnData.value?.team?.withdraw) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamBetAmount"),
        value: moneyFormat(agentReportOwnData.value?.team?.bet_amount) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamValidBetAmount"),
        value: moneyFormat(agentReportOwnData.value?.team?.valid_bet) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamPayoutAmount"),
        value: moneyFormat(agentReportOwnData.value?.team?.prize) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamProfit"),
        value: moneyFormat(agentReportOwnData.value?.team?.profit) ?? "-"
      },
      {
        label: t("member.membershipManagement.teamProfitRatio"),
        value: agentReportOwnData.value?.team?.rate ? `${agentReportOwnData.value?.team?.rate}%` : "-"
      },
      {
        label: t("member.membershipManagement.teamActivityBonus"),
        value: moneyFormat(agentReportOwnData.value?.team?.bonus) ?? "-"
      }
    ]
  })

  const betRecordQueryColumns = computed(() => {
    return [
      { name: "wager_code", label: t("tableHeader.betNumber"), field: "wager_code", align: "center" as const },
      { name: "gaming_site", label: t("member.register.gaming_site"), field: "gaming_site", align: "center" as const },
      { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" as const },
      { name: "created_at", label: t("tableHeader.bettingTime"), field: "created_at", align: "center" as const },
      {
        name: "settled_at",
        label: t("member.referralRebate.settlementTime"),
        field: "settled_at",
        align: "center" as const
      },
      { name: "status", label: t("tableHeader.status"), field: "status", align: "center" as const },
      {
        name: "channel_code",
        label: t("tableHeader.bettingSource"),
        field: "channel_code",
        align: "center" as const
      },
      { name: "product_title", label: t("tableHeader.product"), field: "product_title", align: "center" as const },
      { name: "game_title", label: t("common.games"), field: "game_title", align: "center" as const },
      {
        name: "bet_amount",
        label: t("tableHeader.bettingAmount"),
        field: "bet_amount",
        align: "center" as const
      },
      {
        name: "valid_bet_amount",
        label: t("tableHeader.validBetAmount"),
        field: "valid_bet_amount",
        align: "center" as const
      },
      { name: "payout", label: t("common.payout"), field: "payout", align: "center" as const },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit", align: "center" as const },
      { name: "bonus", label: t("tableHeader.activityBonus"), field: "bonus", align: "center" as const }
    ]
  })

  const dialogIncreaseItemOptions = computed(() => {
    if (dialogIncreaseItem.value === -1) {
      return [
        { label: t("shareholder_platform.please_select"), value: -1 },
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value }
      ]
    } else {
      return [
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value }
      ]
    }
  })

  const hasCountry = computed(() => {
    return memberAgentCustomizeColumn.value.find((item) => item.column_name === "country") ?? null
  })

  const formattedDateRange = computed(() => {
    if (typeof dateRange.value === "string") {
      if (!dateRange.value) return ""
      return `${dateRange.value} 00:00:00 ~ ${dateRange.value} 23:59:59`
    } else {
      if (!dateRange.value?.from || !dateRange.value?.to) return ""
      return `${dateRange.value.from} 00:00:00 ~ ${dateRange.value.to} 23:59:59`
    }
  })

  const formattedStartDate = computed(() => {
    if (!dateRange.value.from) return ""

    return `${dateRange.value.from} 00:00:00`
  })

  const formattedEndDate = computed(() => {
    if (!dateRange.value.to) return ""

    return `${dateRange.value.to} 23:59:59`
  })

  const betReportSummaryList = computed(() => {
    return [
      betReportSummary?.value?.page?.bet_count ?? "-",
      betReportSummary?.value?.page?.win_count ?? "-",
      moneyFormat(betReportSummary?.value?.page?.bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.page?.valid_bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.page?.payout) ?? "-",
      moneyFormat(betReportSummary?.value?.page?.profit) ?? "-",
      betReportSummary?.value?.page?.profit_rate ? `${betReportSummary?.value?.page?.profit_rate}%` : "-",
      betReportSummary?.value?.page?.bonus ?? "-"
    ]
  })

  const betReportSummaryTotalList = computed(() => {
    return [
      betReportSummary?.value?.total?.bet_count ?? "-",
      betReportSummary?.value?.total?.win_count ?? "-",
      moneyFormat(betReportSummary?.value?.total?.bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.valid_bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.payout) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.profit) ?? "-",
      betReportSummary?.value?.total?.profit_rate ? `${betReportSummary?.value?.total?.profit_rate}%` : "-",
      betReportSummary?.value?.total?.bonus ?? "-"
    ]
  })

  const betRecordQuerySummaryList = computed(() => {
    return [
      moneyFormat(betRecordQuerySummary?.value?.page?.bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.page?.valid_bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.page?.payout) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.page?.profit) ?? "-"
    ]
  })

  const betRecordQuerySummaryTotalList = computed(() => {
    return [
      moneyFormat(betRecordQuerySummary?.value?.total?.bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.valid_bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.payout) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.profit) ?? "-"
    ]
  })

  /** 代理報表幣別列表 */
  const agentReportCurrencyList = computed<WalletDropItem[]>(() => {
    return Object.keys(userWalletMap.value).map((e) => {
      const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
      const label = getWalletLabel(cashWallet)
      const value = cashWallet.currency_id
      return { label, value }
    })
  })

  const dayTypeTabs = computed(() => [
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
      value: REPORT_DATE_TYPES.Enums.Today
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
      value: REPORT_DATE_TYPES.Enums.Yesterday
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
      value: REPORT_DATE_TYPES.Enums.LastSevenDays
    }
  ])

  const currencyName = (currencyId: number) => {
    return agentReportCurrencyList.value?.find((item) => item.value === currencyId)?.label ?? "-"
  }

  /** 切換頁籤 */
  const handlerChangeActiveTab = (newTab: string) => {
    resetPage()

    switch (newTab) {
      case "manage":
        handlerGetMemberAgentQuotaBalance()
        handlerGetMemberAgentQuotaAmount()
        break
      default:
        // 要填搜尋條件才可以搜尋，故不做任何事情
        break
    }
  }

  /** 返回直屬下級列表 */
  const handlerBackSubordinateMember = () => {
    resetPageNumber()
    resetPage()
    handlerGetMemberAgentQuotaBalance()
    handlerGetMemberAgentQuotaAmount()
  }

  const onInputChange = (val: string | number | null) => {
    const strVal = typeof val === "string" ? val : val !== null ? String(val) : ""
    // 過濾掉非數字與小數點、限制只有一個小數點
    const cleaned = strVal
      .replace(/[^\d.]/g, "") // 移除非數字和小數點
      .replace(/^\.{1,}/g, "") // 不允許開頭是小數點
      .replace(/(\..*)\./g, "$1") // 僅保留第一個小數點

    dialogAmount.value = cleaned
  }

  const searchTypeName = (type: number) => {
    const label = changeTypeOptions.value.find((e) => e.value === type)?.label as string
    if (label) return t(label)
    return "-"
  }

  const parseDate = (dateStr: number | string) => {
    const time = Number(dateStr)

    if (time <= 0) return "-"

    const date = new Date(preciseMultiply(time, 1000))

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  /** 確認required欄位是否填寫 */
  const checkRequiredFields = () => {
    const requiredFields = memberAgentCustomizeColumn.value.filter((item) => item.required)
    const requiredFieldsData = requiredFields.map((item) => memberAgentCustomizeColumnData.value[item.column_name])
    if (requiredFieldsData.some((item) => !item)) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("common.validate.mustNotBeEmpty"),
        icon: "warning",
        timeout: 1000
      })
      return false
    }

    return true
  }

  /** 返回下級列表畫面 */
  const handlerBackAddSubordinateMember = () => {
    resetPage()
    handlerGetMemberAgentQuotaBalance()
    handlerGetMemberAgentQuotaAmount()
  }

  /** 進入新增下級頁面的onMounted內容 */
  const handlerOnMountedAddSubordinateMember = async () => {
    if (!memberAgentCustomizeColumnId.value) {
      await handlerGetMemberAgentCustomizeColumn({ type: "register" })
      handlerGetMemberAgentReferralList()
    } else {
      await handlerGetMemberAgentCustomizeColumn({ type: "manage" })
      handlerGetMemberAgentInfo()
    }

    handlerGetMemberAgentTagList()
  }

  /** 重置頁數 */
  const resetPageNumber = () => {
    page.value = 1
    offset.value = 0
    totalPage.value = 0
  }

  /** 重置資料 */
  const resetPage = () => {
    resetPageNumber()
    datePickerShow.value = false
    manageRows.value = []
    detailRows.value = []
    betReportRows.value = []
    betRecordQueryRows.value = []
    agentReportRows.value = []
    agentReportOwnData.value = undefined
    betReportSummary.value = undefined
    betRecordQuerySummary.value = undefined
    memberAgentTagList.value = []
    memberAgentReferralList.value = []
    originalMemberAgentCustomizeColumnData.value = {}
    memberAgentCustomizeColumn.value = []
    memberAgentCustomizeColumnData.value = {}
    memberAgentCustomizeColumnId.value = 0
    showAddSubordinateStatus.value = false
    memberAccount.value = ""
    recommenderAccount.value = ""
    showSubordinateMemberAccount.value = null
    searchSubordinateMemberAccount.value = ""
    dateType.value = REPORT_DATE_TYPES.Enums.LastSevenDays
    // 重置最後一次搜尋的參數
    lastSearchMemberAccount.value = ""
    lastSearchRecommenderAccount.value = ""
    lastSearchSubordinateMemberAccount.value = ""
    lastSearchDateRange.value = { from: "", to: "" }
    lastSearchChangeType.value = 0
    lastSearchBetNumber.value = ""
    lastSearchSettlementDate.value = false
    lastSearchBetDate.value = false
    betNumber.value = ""
    dateRange.value = { from: "", to: "" }
    changeType.value = 0
    settlementDate.value = false
    betDate.value = false
  }

  /** 切換data頁數 */
  const handleChangePage = (newPage: number) => {
    offset.value = (newPage - 1) * size.value

    switch (activeTab.value) {
      case "manage":
        handlerGetMemberAgentQuotaBalance()
        handlerGetMemberAgentQuotaAmount()
        break
      case "detail":
        handlerGetMemberAgentQuotaMoneyHistory()
        break
      case "betReport":
        getMemberAgentBetReportData()
        break
      case "betRecordQuery":
        getMemberAgentWagerListData()
        break
      case "agentReport":
        getMemberTeamAgentReportData()
        break
    }
  }

  /** 搜尋下級會員 或 下級會員的下級會員 */
  const handlerSearchSubordinateMember = async () => {
    resetPageNumber()

    if (!showSubordinateMemberAccount.value?.account) {
      // 保存搜尋參數
      lastSearchMemberAccount.value = memberAccount.value
      lastSearchRecommenderAccount.value = recommenderAccount.value
      handlerGetMemberAgentQuotaBalance()
    } else {
      // 保存搜尋參數
      lastSearchSubordinateMemberAccount.value = searchSubordinateMemberAccount.value
      handlerGetLowerLevelMemberAgentQuotaList()
    }
  }

  /** 搜尋帳變明細 */
  const handlerSearchAccountAmount = async () => {
    if (!memberAccount.value) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseEnterUserAccount"),
        position: "top"
      })
      return
    }

    if (
      !dateRange.value ||
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top"
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    lastSearchChangeType.value = changeType.value
    await handlerGetMemberAgentQuotaMoneyHistory()
  }

  /** 搜尋投注報表 */
  const handlerSearchBetReport = async () => {
    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top"
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    await getMemberAgentBetReportData()
  }

  /** 在投注報表點擊帳號 */
  const searchAccountBetReport = (account: string) => {
    activeTab.value = "betRecordQuery"
    memberAccount.value = account

    handlerSearchBetRecordQuery()
  }

  /** 搜尋投注紀錄查詢 */
  const handlerSearchBetRecordQuery = async () => {
    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top"
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    lastSearchBetNumber.value = betNumber.value
    lastSearchSettlementDate.value = settlementDate.value
    lastSearchBetDate.value = betDate.value
    await getMemberAgentWagerListData()
  }

  const handlerSearchAgentReport = async () => {
    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top"
      })
      return
    }

    isLoading.value = true
    resetPageNumber()
    // 保存搜尋參數
    lastSearchDateRange.value = dateRange.value
    lastSearchCurrencyId.value = agentReportCurrencyId.value

    // 不可超過31天
    const { startTime, endTime } = handlerGetTimeFormat()
    const days = Math.ceil((endTime - startTime) / (60 * 60 * 24))
    if (days > 31) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime31Days"),
        position: "top"
      })
      isLoading.value = false
      return
    }

    await Promise.all([getMemberAgentReportData(), getMemberTeamAgentReportData()])
    isLoading.value = false
  }

  /** 打開加減款彈窗 */
  const handlerClickOperation = (account: string, memberId: number, type: number, isMemberAgent = false) => {
    switch (type) {
      case 1:
      case 2:
        targetAccount.value = account
        dialogAmount.value = ""
        dialogType.value = type
        dialogMemberIsAgent.value = isMemberAgent
        showDialog.value = true
        handlerGetMemberAgentQuotaAmount()
        break
      case 3:
        resetPage()
        showSubordinateMemberAccount.value = { account, memberId }
        handlerGetLowerLevelMemberAgentQuotaList()
        break
      case 4:
        memberAgentCustomizeColumnId.value = memberId
        showAddSubordinateStatus.value = true
        break
    }
  }

  /** 取得會員代理額度 */
  const handlerGetMemberAgentQuotaAmount = async () => {
    if (!isCredit.value || !inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return

    const { data } = await getMemberAgentQuotaAmount({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number
    })

    remainQuotaAmount.value = Number(data.remain_quota_amount ?? 0)
  }

  /** 加減款下級代理的額度 */
  const handlerClickSubmit = async () => {
    if (!dialogAmount.value || Number(dialogAmount.value) <= 0) {
      $q.notify({
        type: "negative",
        message: t("common.validate.mustNotBeEmpty"),
        position: "top"
      })
      return
    }

    const params: Request.UpdateMemberAgentQuotaBalance = {
      member_account: targetAccount.value,
      type: dialogIncreaseItem.value === 0 ? dialogType.value : dialogType.value + 2,
      amount: dialogAmount.value,
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number
    }

    const { status } = await updateMemberAgentQuotaBalance(params)

    if (status) {
      $q.notify({
        type: "positive",
        message: t("report.success"),
        position: "top"
      })

      showDialog.value = false
      dialogIncreaseItem.value = 0
      handlerGetMemberAgentQuotaBalance()
      handlerGetMemberAgentQuotaAmount()
    }
  }

  /** 取得會員的下級會員列表 */
  const handlerGetMemberAgentQuotaBalance = async () => {
    manageRows.value = []

    if (!inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return

    const { data } = await getMemberAgentQuotaList({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      downline_member_account: lastSearchMemberAccount.value,
      recommender_account: lastSearchRecommenderAccount.value,
      size: String(size.value),
      offset: String(offset.value)
    })

    manageRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得下級會員的 下級會員列表 */
  const handlerGetLowerLevelMemberAgentQuotaList = async () => {
    const { data } = await getLowerLevelMemberAgentQuotaList({
      account: showSubordinateMemberAccount.value?.memberId,
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      downline_member_account: lastSearchSubordinateMemberAccount.value
    })

    manageRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得後台會員資料自訂欄位 */
  const handlerGetMemberAgentCustomizeColumn = async (type: Request.GetMemberAgentCustomizeColumn) => {
    const { data } = await getMemberAgentCustomizeColumn(type)

    memberAgentCustomizeColumn.value = data.map((column) => {
      // select 選單翻譯label，國碼保留原始
      if (column.type === INPUT_TYPE.Enums.SELECT) {
        column.values = column.values.map((val) => {
          if (column.column_name === COLUMN_NAME.Enums.MEMBER_LEVEL) {
            val.label = val.label?.[nowLang.value as keyof typeof val.label] as string
          } else if (column.column_name !== COLUMN_NAME.Enums.COUNTRY) {
            val.label = t(`member_customize_column.${val.label}`)
          }
          return val
        })
      }

      // column_label、placeholder 抓欄位名或字典檔
      if (column.lang && column.lang[nowLang.value]) {
        column.column_label = column.lang[nowLang.value]
      } else {
        column.column_label = t(`member.register.${column.column_name}`)
      }

      return column
    })

    memberAgentCustomizeColumnData.value = {
      ...memberAgentCustomizeColumn.value.reduce((acc, item) => {
        acc[item.column_name] = item.column_name === "ref_account" ? memberAgentAccount.value : null
        return acc
      }, {} as Record<string, string | boolean | number | null>),
      is_enabled: false,
      is_member_agent: false,
      is_blocked: false
    }
  }

  /** 取得推薦人列表 */
  const handlerGetMemberAgentReferralList = async () => {
    const { data } = await getMemberAgentReferralList()

    memberAgentReferralList.value = data.map((item) => ({
      label: item.member_account,
      value: item.member_id
    }))
  }

  /** 取得標籤列表 */
  const handlerGetMemberAgentTagList = async () => {
    const { data } = await getMemberAgentTagList()

    memberAgentTagList.value = data.map((item) => ({
      ...item,
      checked: false
    }))
  }

  /** 新增下級會員 */
  const handlerCreateMemberAgent = async () => {
    // 找到 ref_account 的值
    const refAccountLabel = memberAgentCustomizeColumnData.value.ref_account

    // 在 memberAgentReferralList 中找到對應的 value
    const referralItem = memberAgentReferralList.value.find((item) => item.label === refAccountLabel)

    if (referralItem) {
      // 將 ref_account 的值改為找到的 value
      memberAgentCustomizeColumnData.value.ref_account = referralItem.value
    }

    const params: any = {
      ...memberAgentCustomizeColumnData.value,
      label: memberAgentTagList.value.filter((item) => item.checked).map((item) => item.id)
    }

    // 新增下級會員
    const { status } = await createMemberAgent(params)

    return status
  }

  /** 編輯下級會員 */
  const handlerUpdateMemberAgent = async () => {
    const params: any = {
      member_id: originalMemberAgentCustomizeColumnData.value.id,
      ...memberAgentCustomizeColumnData.value,
      label: memberAgentTagList.value.filter((item) => item.checked).map((item) => item.id)
    }

    const { status } = await updateMemberAgent(params)

    return status
  }

  /** 取得下級會員資料 */
  const handlerGetMemberAgentInfo = async () => {
    const { data } = await getMemberAgentInfo(memberAgentCustomizeColumnId.value)

    memberAgentTagList.value.forEach((item) => {
      if (data.labels?.includes(item.id)) {
        item.checked = true
      }
    })

    originalMemberAgentCustomizeColumnData.value = data

    memberAgentCustomizeColumnData.value = {
      ...memberAgentCustomizeColumn.value.reduce((acc, item) => {
        if ((item.column_name === "gender" || item.column_name === "gaming_site") && !data[item.column_name]) {
          acc[item.column_name] = null
        } else {
          acc[item.column_name] = data[item.column_name]
        }
        return acc
      }, {} as Record<string, string | boolean | number | null>),
      is_enabled: data.enabled,
      is_member_agent: data.is_member_agent,
      is_blocked: data.block
    }
  }

  /** 時間格式 */
  const handlerGetTimeFormat = () => {
    let startTime
    let endTime

    if (typeof lastSearchDateRange.value === "string") {
      // 選同一天
      startTime = preciseDivide(new Date(lastSearchDateRange.value).setHours(0, 0, 0), 1000)
      endTime = preciseDivide(new Date(lastSearchDateRange.value).setHours(23, 59, 59), 1000)
    } else {
      // 選不同天
      startTime = preciseDivide(new Date(lastSearchDateRange.value.from).setHours(0, 0, 0), 1000)
      endTime = preciseDivide(new Date(lastSearchDateRange.value.to).setHours(23, 59, 59), 1000)
    }

    return { status: startTime <= endTime, startTime, endTime }
  }

  /** 取得會員帳變明細 */
  const handlerGetMemberAgentQuotaMoneyHistory = async () => {
    detailRows.value = []

    const { status, startTime, endTime } = handlerGetTimeFormat()

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top"
      })
      return
    }

    const params: Request.GetMemberAgentQuotaMoneyHistory = {
      member_account: lastSearchMemberAccount.value,
      str_time: startTime,
      end_time: endTime,
      search_type: lastSearchChangeType.value,
      size: String(size.value),
      offset: String(offset.value)
    }

    const { data } = await getMemberAgentQuotaMoneyHistory(params)

    if (!data?.list) return

    detailRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得下級會員投注報表 */
  const getMemberAgentBetReportData = async () => {
    betReportRows.value = []
    betReportSummary.value = undefined

    const { status, startTime, endTime } = handlerGetTimeFormat()

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top"
      })
      return
    }

    const params: Request.GetMemberAgentBetReport = {
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      str_time: startTime,
      end_time: endTime,
      offset: offset.value,
      size: size.value
    }

    if (lastSearchMemberAccount.value) {
      params.member_account = lastSearchMemberAccount.value
    }

    const { data } = await getMemberAgentBetReport(params)

    betReportRows.value = data.list
    betReportSummary.value = data.summary
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得下級會員投注紀錄 */
  const getMemberAgentWagerListData = async () => {
    betRecordQueryRows.value = []
    betRecordQuerySummary.value = undefined

    const { status, startTime, endTime } = handlerGetTimeFormat()

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top"
      })
      return
    }

    const params: Request.GetMemberAgentWagerList = {
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      str_time: startTime,
      end_time: endTime,
      offset: offset.value,
      size: size.value
    }

    if (lastSearchMemberAccount.value) {
      params.member_account = lastSearchMemberAccount.value
    }

    if (lastSearchBetNumber.value) {
      params.wager_code = lastSearchBetNumber.value
    }

    if (lastSearchBetDate.value && lastSearchSettlementDate.value) {
      params.date_type = [2]
    } else if (lastSearchBetDate.value) {
      params.date_type = [0]
    } else if (lastSearchSettlementDate.value) {
      params.date_type = [1]
    }

    const { data } = await getMemberAgentWagerList(params)

    betRecordQueryRows.value = data.list
    betRecordQuerySummary.value = data.summary
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 打開第三方投注紀錄詳細頁面 */
  const handlerGetMemberAgentWagerDetail = async (wagerCode: string, productCode: number) => {
    const { data } = await getMemberAgentWagerDetail({ wager_code: wagerCode, product_code: productCode })
    // 獲取網址後另開分頁打開第三方詳細頁面
    if (data.content) {
      window.open(data.content, "_blank")
    }
  }

  /** 取得代理報表 */
  const getMemberAgentReportData = async () => {
    agentReportOwnData.value = undefined

    const { status, startTime, endTime } = handlerGetTimeFormat()

    const startTimeISO = new Date(startTime * 1000)?.toISOString()
    const endTimeISO = new Date(endTime * 1000)?.toISOString()

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top"
      })
      return
    }

    const { data } = await getMemberAgentReport({
      currency_id: lastSearchCurrencyId.value,
      start_time: startTimeISO,
      end_time: endTimeISO
    })

    agentReportOwnData.value = data

    isLoading.value = false
  }

  /** 取得團隊代理報表 */
  const getMemberTeamAgentReportData = async () => {
    agentReportRows.value = []

    const { status, startTime, endTime } = handlerGetTimeFormat()

    const startTimeISO = new Date(startTime * 1000)?.toISOString()
    const endTimeISO = new Date(endTime * 1000)?.toISOString()

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top"
      })
      return
    }

    const { data } = await getMemberTeamAgentReport({
      currency_id: lastSearchCurrencyId.value,
      start_time: startTimeISO,
      end_time: endTimeISO,
      offset: offset.value,
      size: size.value
    })

    agentReportRows.value = data.list
    totalPage.value = Math.ceil(data.pagination.total / size.value)
    page.value = Math.floor(data.pagination.offset / data.pagination.size) + 1
    offset.value = (page.value - 1) * size.value

    isLoading.value = false
  }

  watchEffect(() => {
    if (activeTab.value !== "agentReport") return

    switch (dateType.value) {
      case REPORT_DATE_TYPES.Enums.Today:
        dateRange.value = String(getToday())
        break
      case REPORT_DATE_TYPES.Enums.Yesterday:
        dateRange.value = String(getYesterday())
        break
      case REPORT_DATE_TYPES.Enums.LastSevenDays:
        // 最近7天(包含今天)
        dateRange.value = { from: getLastOrOverDay(-6), to: getLastOrOverDay(0) }
        break
    }
  })

  return {
    activeTab,
    datePickerShow,
    page,
    offset,
    size,
    totalPage,
    showDialog,
    remainQuotaAmount,
    dialogType,
    targetAccount,
    dialogAmount,
    dialogMemberIsAgent,
    dialogIncreaseItem,
    tabOptions,
    dialogIncreaseItemOptions,
    hasCountry,
    memberAccount,
    recommenderAccount,
    searchSubordinateMemberAccount,
    lastSearchMemberAccount,
    lastSearchRecommenderAccount,
    lastSearchSubordinateMemberAccount,
    lastSearchDateRange,
    lastSearchChangeType,
    lastSearchBetNumber,
    lastSearchSettlementDate,
    lastSearchBetDate,
    betNumber,
    settlementDate,
    betDate,
    showAddSubordinateStatus,
    dateRange,
    formattedDateRange,
    formattedStartDate,
    formattedEndDate,
    betReportSummaryList,
    betReportSummaryTotalList,
    betRecordQuerySummaryList,
    betRecordQuerySummaryTotalList,
    agentReportCurrencyList,
    dayTypeTabs,
    changeType,
    memberAgentAccount,
    showSubordinateMemberAccount,
    agentReportCurrencyId,
    dateType,
    isLoading,
    manageRows,
    detailRows,
    betReportRows,
    betRecordQueryRows,
    betReportSummary,
    betRecordQuerySummary,
    agentReportRows,
    changeTypeOptions,
    operationOptions,
    manageColumns,
    detailColumns,
    betReportColumns,
    agentReportColumns,
    agentReportTopAreaColumns,
    agentReportBottomAreaColumns,
    betRecordQueryColumns,
    memberAgentCustomizeColumn,
    memberAgentCustomizeColumnId,
    memberAgentCustomizeColumnData,
    memberAgentReferralList,
    memberAgentTagList,
    currencyName,
    handlerChangeActiveTab,
    handlerBackSubordinateMember,
    onInputChange,
    searchTypeName,
    parseDate,
    searchAccountBetReport,
    checkRequiredFields,
    handlerBackAddSubordinateMember,
    handlerOnMountedAddSubordinateMember,
    resetPage,
    handleChangePage,
    handlerSearchSubordinateMember,
    handlerSearchAccountAmount,
    handlerSearchBetReport,
    handlerSearchBetRecordQuery,
    handlerSearchAgentReport,
    handlerClickOperation,
    handlerGetMemberAgentQuotaAmount,
    handlerClickSubmit,
    handlerGetMemberAgentQuotaBalance,
    handlerGetMemberAgentQuotaMoneyHistory,
    handlerGetMemberAgentCustomizeColumn,
    handlerGetMemberAgentReferralList,
    handlerCreateMemberAgent,
    handlerUpdateMemberAgent,
    handlerGetMemberAgentInfo,
    handlerGetMemberAgentTagList,
    getMemberAgentBetReportData,
    getMemberAgentWagerListData,
    handlerGetMemberAgentWagerDetail
  }
})
