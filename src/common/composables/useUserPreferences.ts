import { ref, computed, reactive, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useQuasar, QTableProps } from "quasar"
import dayjs from "dayjs"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useUserPreferencesStoreStore } from "src/stores/userPreferencesStore"
import { useApi } from "src/common/hooks/useApi"
import { toUnixTimestamp, toMsUnixTimestamp } from "src/common/utils/dayjsUtils"
import {
  getPreferencesExclusion,
  putPreferencesExclusion,
  getBetLimitList,
  getBetLimitListStatus,
  getBetLimitItem,
  postBetLimitItem,
  putBetLimitItem
} from "src/api/userPreferences"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { ERROR_CODE_TYPE, ALERT_DIALOG_TYPE } from "src/common/utils/constants"

interface IBetLimitState {
  list: Response.GetBetLimitList
  query: {
    size: number
    offset: number
  }
  pagination: {
    page: number
    rowsPerPage: number
    rowsNumber: number
    totalPage: number
  }
}

export function useUserPreferences() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()
  const { currencyHeader } = useCurrency()
  const { eventEmit } = useEventBus()
  const userPreferencesStore = useUserPreferencesStoreStore()
  const { betRestrictionFormState } = storeToRefs(userPreferencesStore)
  const { setBetRestrictionExclusion } = userPreferencesStore

  const isLoading = ref(false)

  //#region 自我限制

  const betRestrictionDatetimeShortcuts = computed(() => {
    return [
      {
        text: `24 ${t("common.btn.hour")}`,
        onClick: () => {
          return dayjs().add(1, "day").toDate()
        }
      },
      {
        text: t("common.btn.one_week"),
        onClick: () => {
          return dayjs().add(1, "week").toDate()
        }
      },
      {
        text: t("common.btn.one_month"),
        onClick: () => {
          return dayjs().add(1, "month").toDate()
        }
      }
    ]
  })

  const betRestrictionDatetime = ref<number | null>(null)

  const betRestrictionDatetimeSetted = computed(() => {
    if (betRestrictionFormState.value.exclusion_at && betRestrictionFormState.value.exclusion_at > 0) return true

    return false
  })

  const disableDate = (date: any) => {
    return dayjs(date).isBefore(dayjs().startOf("day"))
  }

  const disableTime = (date: any) => {
    const now = dayjs()
    const selected = dayjs(date)

    // 如果不是今天，不限制時間
    if (!selected.isSame(now, "day")) return false

    // 如果是今天，禁用比目前還早的時間（依據 hour/minute/second）
    return selected.isBefore(now, "minute") // 可改為 'second' 更精確
  }

  const handleGetPreferencesExclusion = async () => {
    try {
      isLoading.value = true
      const { status, data } = await useApi(getPreferencesExclusion)
      isLoading.value = false

      if (!status) return

      setBetRestrictionExclusion(data.exclusion_at)
      if (data.exclusion_at) {
        betRestrictionDatetime.value = dayjs(data.exclusion_at).valueOf()
        return
      }

      betRestrictionDatetime.value = null
    } catch (error) {
      isLoading.value = false
    }
  }

  const handlePutPreferencesExclusion = async () => {
    if (betRestrictionDatetimeSetted.value || !betRestrictionDatetime.value || betRestrictionDatetime.value <= 0) return

    try {
      isLoading.value = true
      const params: Request.PutPreferencesExclusion = {
        exclusion_at: betRestrictionDatetime.value
      }

      const { status } = await useApi(putPreferencesExclusion, params)
      isLoading.value = false

      if (status) {
        setBetRestrictionExclusion(betRestrictionDatetime.value)
        $q.notify({
          type: "positive",
          message: t("common.alarm.settingSuccessful"),
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      isLoading.value = false
    }
  }
  //#endregion

  //#region 自我限額

  const betLimitDatetimeShortcuts = computed(() => {
    return [
      {
        text: `24 ${t("common.btn.hour")}`,
        onClick: () => {
          const start = dayjs().startOf("day")
          const end = start.add(1, "day").endOf("day")
          return [start.toDate(), end.toDate()]
        }
      },
      {
        text: t("common.btn.one_week"),
        onClick: () => {
          const start = dayjs().startOf("day")
          const end = start.add(1, "week").endOf("day")
          return [start.toDate(), end.toDate()]
        }
      },
      {
        text: t("common.btn.one_month"),
        onClick: () => {
          const start = dayjs().startOf("day")
          const end = start.add(1, "month").endOf("day")
          return [start.toDate(), end.toDate()]
        }
      }
    ]
  })

  const betLimitColumnMain = computed<QTableProps["columns"]>(() => [
    {
      name: "dateRange",
      field: "dateRange",
      align: "center",
      label: t("member.profile.setRange")
    },
    { name: "currency_id", field: "currency_id", align: "center", label: currencyHeader.value },
    { name: "restrict_amount", field: "restrict_amount", align: "center", label: t("member.profile.quota") },
    { name: "amount", field: "amount", align: "center", label: t("member.profile.currentAccumulatedQuota") },
    {
      name: "func",
      field: "func",
      align: "center",
      label: t("member.profile.function")
    }
  ])

  const betLimitColumnSub = computed<QTableProps["columns"]>(() => [
    {
      name: "dateRange",
      field: "dateRange",
      align: "center",
      label: t("member.profile.setRange")
    },
    { name: "currency_id", field: "currency_id", align: "center", label: currencyHeader.value },
    { name: "restrict_amount", field: "restrict_amount", align: "center", label: t("member.profile.quota") }
  ])

  const isBetLimit = ref(false)
  const betLimitForm = reactive<Request.BetLimitForm>({
    currency_id: 0,
    restrict_amount: "",
    restriction_id: 0,
    setting_id: 0,
    now_date_time: 0,
    date_range: [],
    last_restrict_amount: ""
  })
  const betLimitState = reactive<IBetLimitState>({
    list: [],
    query: {
      size: 5,
      offset: 0
    },
    pagination: {
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 5,
      totalPage: 1
    }
  })

  const isTodayAfterTimestamp = (targetTimestamp: number) => {
    const targetDate = dayjs.unix(targetTimestamp).startOf("day")
    const today = dayjs().startOf("day")
    return today.isAfter(targetDate)
  }

  const handleGetBetLimitStatus = async (currency_id: number) => {
    const payload: Request.GetBetLimitListStatus = { now_time: dayjs().unix(), currency_id }
    try {
      isLoading.value = true
      const { status } = await useApi(getBetLimitListStatus, payload)
      isLoading.value = false

      isBetLimit.value = !status
    } catch (error) {
      isLoading.value = false
    }
  }

  const handleGetBetLimitList = async () => {
    try {
      if (betLimitState.pagination?.page && betLimitState.pagination?.rowsPerPage) {
        betLimitState.query.offset = (betLimitState.pagination.page - 1) * betLimitState.pagination.rowsPerPage
      }

      const payload: Request.GetBetLimitList = {
        offset: betLimitState.query.offset,
        size: betLimitState.query.size
      }

      isLoading.value = true
      const { status, data } = await useApi(getBetLimitList, payload)
      isLoading.value = false

      if (status) {
        // 同步pagination
        betLimitState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        betLimitState.pagination.rowsPerPage = data.pagination.size
        betLimitState.pagination.rowsNumber = data.pagination.total

        router.replace({
          query: {
            page: betLimitState.pagination?.page || 1,
            rowsPerPage: betLimitState.pagination?.rowsPerPage || 5
          }
        })

        if (!data.list || data.list.length === 0) {
          betLimitState.list = []
          return
        }

        const formatList = data.list.map((betLimit) => {
          betLimit.expanded = false
          betLimit.settings = betLimit.settings.map((setting) => {
            setting.currency_id = betLimit.currency_id
            return setting
          })
          return betLimit
        })
        betLimitState.list = formatList
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  const initBetLimitQueryString = () => {
    const { page, rowsPerPage } = route.query

    if (page && betLimitState.pagination?.page) {
      betLimitState.pagination.page = Number(page)
    }
    if (rowsPerPage && betLimitState.pagination?.rowsPerPage) {
      betLimitState.pagination.rowsPerPage = Number(rowsPerPage)
    }
  }

  const handleBetLimitPagination = (page: number) => {
    betLimitState.pagination.page = page
    handleGetBetLimitList()
  }

  const handleGetBetLimitItem = async (id: string) => {
    const payload: Request.GetBetLimitItem = {
      id,
      now_time: dayjs().unix()
    }
    try {
      isLoading.value = true
      const { status, data } = await useApi(getBetLimitItem, payload)
      isLoading.value = false

      if (status) {
        betLimitForm.restriction_id = data.id
        betLimitForm.setting_id = data.setting_id
        betLimitForm.currency_id = data.currency_id
        betLimitForm.date_range = [toMsUnixTimestamp(data.begin_date), toMsUnixTimestamp(data.end_date)]
        betLimitForm.last_restrict_amount = data.restrict_amount
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  const handlePostBetLimitItem = async (): Promise<{ status: boolean }> => {
    const restrict_amount = Number(betLimitForm.restrict_amount)
    if (isNaN(restrict_amount)) {
      eventEmit("openAlertDialog", {
        type: ALERT_DIALOG_TYPE.Enums.WARN,
        show: true,
        titleI18n: "",
        contentI18n: "common.alarm.invalid_amount_format",
        footerBtnTextI18n: "common.btn.confirm2"
      })
      return { status: false }
    }

    try {
      const params: Request.PostBetLimitItem = {
        begin_date: toUnixTimestamp(betLimitForm.date_range[0]),
        end_date: toUnixTimestamp(betLimitForm.date_range[1]),
        currency_id: betLimitForm.currency_id,
        restrict_amount
      }

      isLoading.value = true
      const { status, code } = await useApi(postBetLimitItem, params)
      isLoading.value = false

      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.settingSuccessful"),
          position: "top",
          timeout: 1000
        })
        return { status }
      }

      switch (code) {
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE:
          eventEmit("openAlertDialog", {
            type: ALERT_DIALOG_TYPE.Enums.WARN,
            show: true,
            titleI18n: "",
            contentI18n: ERROR_CODE_TYPE.I18nKeys[code] as string,
            footerBtnTextI18n: "common.btn.confirm2"
          })
          break

        default:
          break
      }

      return { status }
    } catch (error) {
      isLoading.value = false
      return { status: false }
    }
  }

  const handlePutBetLimitItem = async (): Promise<{ status: boolean }> => {
    const restrict_amount = Number(betLimitForm.restrict_amount)
    if (isNaN(restrict_amount)) {
      eventEmit("openAlertDialog", {
        type: ALERT_DIALOG_TYPE.Enums.WARN,
        show: true,
        titleI18n: "",
        contentI18n: "common.alarm.invalid_amount_format",
        footerBtnTextI18n: "common.btn.confirm2"
      })
      return { status: false }
    }

    try {
      const params: Request.PutBetLimitItem = {
        restriction_id: betLimitForm.restriction_id,
        setting_id: betLimitForm.setting_id,
        currency_id: betLimitForm.currency_id,
        now_date_time: dayjs().startOf("day").unix(),
        restrict_amount
      }

      isLoading.value = true
      const { status, code } = await useApi(putBetLimitItem, params)
      isLoading.value = false

      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.changeSuccess"),
          position: "top",
          timeout: 1000
        })

        return { status }
      }

      switch (code) {
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING:
          eventEmit("openAlertDialog", {
            type: ALERT_DIALOG_TYPE.Enums.WARN,
            show: true,
            titleI18n: "",
            contentI18n: ERROR_CODE_TYPE.I18nKeys[code] as string,
            footerBtnTextI18n: "common.btn.confirm2"
          })
          break

        default:
          break
      }

      return { status }
    } catch (error) {
      isLoading.value = false
      return { status: false }
    }
  }

  // 同步page size
  watchEffect(() => {
    if (betLimitState.pagination?.rowsPerPage) {
      betLimitState.query.size = betLimitState.pagination.rowsPerPage
    }
  })
  //  分頁器的頁數
  watchEffect(() => {
    betLimitState.pagination.totalPage = Math.ceil(
      betLimitState.pagination.rowsNumber / betLimitState.pagination.rowsPerPage
    )
  })
  //#endregion

  return {
    /** 查詢中 */
    isLoading,

    /** 禁用過去日期 */
    disableDate,

    /** 禁用過去時間 */
    disableTime,

    /** 投注限額快捷時間 */
    betLimitDatetimeShortcuts,

    /** 投注限制快捷時間 */
    betRestrictionDatetimeShortcuts,

    /** 是否已設定投注限制時間 */
    betRestrictionDatetimeSetted,

    /** 投注限制時間 */
    betRestrictionDatetime,

    /** 投注限制時間 */
    handleGetPreferencesExclusion,

    /** 設定投注限制時間 */
    handlePutPreferencesExclusion,

    /** 是否達到限額上限 */
    isBetLimit,

    /** 自我限額列表資料 */
    betLimitState,

    /** 自我限額主表單欄位 */
    betLimitColumnMain,

    /** 自我限額子表單欄位 */
    betLimitColumnSub,

    /** 會員自我限制額度form */
    betLimitForm,

    /** 檢查日期是否大於今天 */
    isTodayAfterTimestamp,

    /** 取得會員自我限額狀態 */
    handleGetBetLimitStatus,

    /** 取得會員自我限制額度列表 */
    handleGetBetLimitList,

    /** 自我限額初始化query staing */
    initBetLimitQueryString,

    /** 分頁控制器 */
    handleBetLimitPagination,

    /** 取得會員自我限制額度 */
    handleGetBetLimitItem,

    /** 建立會員自我限制額度 */
    handlePostBetLimitItem,

    /** 修改會員自我限制額度 */
    handlePutBetLimitItem
  }
}
