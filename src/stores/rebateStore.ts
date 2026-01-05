import { reactive } from "vue"
import { defineStore } from "pinia"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { getLastOrOverDay } from "src/common/utils/dayjsUtils"
import { REBATE_STATUS } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import type * as Request from "src/api/request.type"

export type RebateState = Response.RebateList & {
  query: Request.GetRebates
}

export const useRebateStore = defineStore("rebateStore", () => {
  const dateFormat = "YYYY/MM/DD"
  const { activeWalletCurrencyId, userWalletList } = useUserInfo()
  const rebateState = reactive<RebateState>({
    query: {
      start_time: "",
      end_time: "",
      currency_id: 0,
      // status: REBATE_STATUS.Enums.NOT_COLLECTED,
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

  function initRebateState() {
    rebateState.query.start_time = getLastOrOverDay(-7, dateFormat)
    rebateState.query.end_time = getLastOrOverDay(0, dateFormat)
    // rebateState.query.status = REBATE_STATUS.Enums.NOT_COLLECTED
    rebateState.query.offset = 0
    rebateState.query.size = 10
    rebateState.list.length = 0
    rebateState.pagination.page = 1
    rebateState.pagination.offset = 0
    rebateState.pagination.size = 10
    rebateState.pagination.total = 0

    if (activeWalletCurrencyId.value) {
      rebateState.query.currency_id = activeWalletCurrencyId.value
      return
    }

    if (userWalletList.value.length) {
      rebateState.query.currency_id = userWalletList.value[0].currency_id
      return
    }

    rebateState.query.currency_id = 0
  }

  return {
    rebateState,
    initRebateState
  }
})
