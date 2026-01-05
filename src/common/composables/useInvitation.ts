import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { QTableProps } from "quasar"
import { storeToRefs } from "pinia"
import { useCommon } from "src/common/hooks/useCommon"
import { useInvitationStore } from "src/stores/invitationStore"
import { useApi } from "src/common/hooks/useApi"
import { useBank } from "src/common/composables/useBank"
import { getInvitations } from "src/api/collaboration"
import type * as Request from "src/api/request.type"
import { INVITATION_STATUS } from "src/common/utils/constants"

export function useInvitation() {
  const { t } = useI18n()
  const { formatterCurrency } = useBank()
  const { genEnumToDropdown } = useCommon()
  const invitationStore = useInvitationStore()
  const { invitationState } = storeToRefs(invitationStore)
  const { initInvitationState } = invitationStore

  const isLoading = ref(false)

  const statusDropDown = computed(() => {
    const list = genEnumToDropdown(INVITATION_STATUS.Enums, INVITATION_STATUS.I18nKeys)
    return list.map((e) => {
      return {
        label: t(e.label),
        value: e.value
      }
    })
  })

  const totalPages = computed(() => {
    const total = invitationState.value.pagination.total ?? 0
    return Math.max(1, Math.ceil(total / invitationState.value.pagination.size))
  })

  const invitationTableColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      field: "member_account",
      label: t("collaboration.member_account"),
      align: "center"
    },
    {
      name: "deposit_count",
      field: "deposit_count",
      label: t("collaboration.deposit_count"),
      align: "center"
    },
    {
      name: "currency_code",
      field: "currency_code",
      label: t("collaboration.currency"),
      align: "center"
    },
    {
      name: "deposit_amount",
      field: "deposit_amount",
      label: t("collaboration.deposit_amount"),
      align: "center"
    },
    {
      name: "valid_bet_amount",
      field: "valid_bet_amount",
      label: t("collaboration.valid_bet_amount"),
      align: "center"
    },
    {
      name: "status",
      field: "status",
      label: t("collaboration.status"),
      align: "center"
    }
  ])

  const handlePagination = async (page: number) => {
    invitationState.value.pagination.page = page
    getInvitationList()
  }

  async function getInvitationList() {
    try {
      invitationState.value.query.offset =
        (invitationState.value.pagination.page - 1) * invitationState.value.pagination.size

      invitationState.value.query.size = invitationState.value.pagination.size

      const payload: Request.GetInvitationList = {
        member_account: invitationState.value.query.member_account,
        currency_id: invitationState.value.query.currency_id,
        offset: invitationState.value.query.offset,
        size: invitationState.value.query.size
      }

      if (invitationState.value.query.status >= 0) {
        payload.status = invitationState.value.query.status
      }

      isLoading.value = true
      const { status, data } = await useApi(getInvitations, payload)
      isLoading.value = false

      if (status) {
        invitationState.value.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        invitationState.value.pagination.total = data.pagination.total

        if (!data.list) {
          invitationState.value.list.length = 0
          return
        }

        invitationState.value.list = data.list.map((e) => {
          e.currency_code = formatterCurrency(e.currency_code) as string
          return e
        })
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  function submit() {
    invitationState.value.pagination.page = 1
    getInvitationList()
  }

  return {
    /** 查詢中 */
    isLoading,

    /** 邀請明細狀態下拉選單 */
    statusDropDown,

    /** 邀請明細資料 */
    invitationState,

    /** 邀請明細表格欄位 */
    invitationTableColumns,

    /** 邀請明細列表頁數 */
    totalPages,

    /** 初始化邀請明細資料 */
    initInvitationState,

    /** 取得邀請明細列表 */
    getInvitationList,

    /** 邀請明細列表切換分頁 */
    handlePagination,

    /** 邀請明細查詢按鈕submit */
    submit
  }
}
