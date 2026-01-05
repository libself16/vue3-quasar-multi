import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { QTableProps, QDateProps } from "quasar"
import { storeToRefs } from "pinia"
import { useCommon } from "src/common/hooks/useCommon"
import { useRebateStore } from "src/stores/rebateStore"
import { useApi } from "src/common/hooks/useApi"
import { useBank } from "src/common/composables/useBank"
import { getRebates } from "src/api/collaboration"
import { REBATE_STATUS } from "src/common/utils/constants"

export function useRebate() {
  const { t } = useI18n()
  const { formatterCurrency } = useBank()
  const { genEnumToDropdown } = useCommon()
  const rebateStore = useRebateStore()
  const { rebateState } = storeToRefs(rebateStore)
  const { initRebateState } = rebateStore

  const isLoading = ref(false)
  const dateRangePickerMenuRef = ref()

  const statusDropDown = computed(() => {
    const list = genEnumToDropdown(REBATE_STATUS.Enums, REBATE_STATUS.I18nKeys)
    return list.map((e) => {
      return {
        label: t(e.label),
        value: e.value
      }
    })
  })

  const totalPages = computed(() => {
    const total = rebateState.value.pagination.total ?? 0
    return Math.max(1, Math.ceil(total / rebateState.value.pagination.size))
  })

  const rebateTableColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "settled_time",
      field: "settled_time",
      label: t("collaboration.settlement_time"),
      align: "center"
    },
    {
      name: "active_member_count",
      field: "active_member_count",
      label: t("collaboration.achieved_active_member_count"),
      align: "center"
    },
    {
      name: "currency_code",
      field: "currency_code",
      label: t("collaboration.currency"),
      align: "center"
    },
    {
      name: "valid_bet_amount",
      field: "valid_bet_amount",
      label: t("collaboration.achieved_valid_bet_amount"),
      align: "center"
    },
    {
      name: "level",
      field: "level",
      label: t("collaboration.commission_level"),
      align: "center"
    },
    {
      name: "rebate_amount",
      field: "rebate_amount",
      label: t("collaboration.commission_amount"),
      align: "center"
    }
    // {
    //   name: "status",
    //   field: "status",
    //   label: t("collaboration.claim_status"),
    //   align: "center"
    // }
  ])

  const settlementTime = computed({
    get() {
      if (!rebateState.value.query.start_time || !rebateState.value.query.end_time) return ""

      return `${rebateState.value.query.start_time}-${rebateState.value.query.end_time}`
    },
    set(newValue) {
      // console.log("newValue", newValue)
    }
  })

  const handleDateRangePick: QDateProps["onUpdate:modelValue"] = (value, reason) => {
    if (!value) return

    if (reason === "add-day") {
      rebateState.value.query.start_time = value
      rebateState.value.query.end_time = value
      return
    }

    if (reason === "add-range") {
      rebateState.value.query.start_time = value.from
      rebateState.value.query.end_time = value.to
    }
  }

  const closeDateRangePicker = () => {
    dateRangePickerMenuRef.value.hide()
  }

  const handlePagination = async (page: number) => {
    rebateState.value.pagination.page = page
    getRebateList()
  }

  async function getRebateList() {
    try {
      rebateState.value.query.offset = (rebateState.value.pagination.page - 1) * rebateState.value.pagination.size

      rebateState.value.query.size = rebateState.value.pagination.size

      isLoading.value = true
      const { status, data } = await useApi(getRebates, rebateState.value.query)
      isLoading.value = false

      if (status) {
        rebateState.value.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        rebateState.value.pagination.total = data.pagination.total

        if (!data.list) {
          rebateState.value.list.length = 0
          return
        }

        rebateState.value.list = data.list.map((e) => {
          e.currency_code = formatterCurrency(e.currency_code) as string
          return e
        })
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  function submit() {
    rebateState.value.pagination.page = 1
    getRebateList()
  }

  return {
    /** 查詢中 */
    isLoading,

    /** 佣金明細領取狀態下拉選單 */
    statusDropDown,

    /** 佣金明細資料 */
    rebateState,

    /** 佣金明細表格欄位 */
    rebateTableColumns,

    /** 結算時間查詢欄位顯示 */
    settlementTime,

    /** 佣金明細列表頁數 */
    totalPages,

    /** Quasar 時間選擇器 Ref */
    dateRangePickerMenuRef,

    /** Quasar 時間範圍選擇 */
    handleDateRangePick,

    /** 關閉 Quasar 時間選擇器 */
    closeDateRangePicker,

    /** 初始化佣金明細資料 */
    initRebateState,

    /** 取得佣金明細列表 */
    getRebateList,

    /** 佣金明細列表切換分頁 */
    handlePagination,

    /** 佣金明細查詢按鈕submit */
    submit
  }
}
