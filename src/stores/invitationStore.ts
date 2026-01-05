import { reactive } from "vue"
import { defineStore } from "pinia"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { INVITATION_STATUS } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import type * as Request from "src/api/request.type"

export type InvitationState = Response.InvitationList & {
  query: Request.GetInvitations
}

export const useInvitationStore = defineStore("invitationStore", () => {
  const { activeWalletCurrencyId, userWalletList } = useUserInfo()
  const invitationState = reactive<InvitationState>({
    query: {
      member_account: "",
      currency_id: 0,
      status: INVITATION_STATUS.Enums.All,
      offset: 0,
      size: 10
    },
    list: [],
    pagination: {
      page: 1,
      offset: 0,
      size: 10,
      total: 0
    }
  })

  function initInvitationState() {
    invitationState.query.member_account = ""
    invitationState.query.status = INVITATION_STATUS.Enums.All
    invitationState.query.offset = 0
    invitationState.query.size = 10
    invitationState.list.length = 0
    invitationState.pagination.page = 1
    invitationState.pagination.offset = 0
    invitationState.pagination.size = 10
    invitationState.pagination.total = 0

    if (activeWalletCurrencyId.value) {
      invitationState.query.currency_id = activeWalletCurrencyId.value
      return
    }

    if (userWalletList.value.length) {
      invitationState.query.currency_id = userWalletList.value[0].currency_id
      return
    }

    invitationState.query.currency_id = 0
  }

  return {
    invitationState,
    initInvitationState
  }
})
