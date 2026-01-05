import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type BonusMap = {
  [key in number]: number
}

type ReferralWheelState = {
  status: boolean
  winners: Response.GetReferralWheelWinners
  memberPrizes: Response.GetReferralWheelMemberPrizes
  bonusMap: BonusMap
  spinInfo: Response.ReferralWheelBonusSpinInfo | null
  tempSpinInfo: Response.ReferralWheelBonusSpinInfo | null
  current: Response.GetReferralWheelCurrent | null
  prizeList: Response.ReferralWheelPrizeList
}

export const useReferralWheelStore = defineStore("referralWheelStore", () => {
  const referralWheelState = reactive<ReferralWheelState>({
    status: false,
    winners: [],
    memberPrizes: [],
    bonusMap: {},
    spinInfo: null,
    tempSpinInfo: null,
    current: null,
    prizeList: []
  })

  function setReferralWheelStatus(status: boolean) {
    referralWheelState.status = status
  }

  function setReferralWheelCurrent(data: Response.GetReferralWheelCurrent) {
    referralWheelState.current = data
  }

  function setReferralWheelBonusMap(data: Response.ReferralWheelBonusItem[]) {
    referralWheelState.bonusMap = data.reduce((acc, item) => {
      acc[item.currency_id] = Number(item.total_amount)
      return acc
    }, {} as BonusMap)
  }

  function syncReferralWheelSpinInfo() {
    referralWheelState.spinInfo = referralWheelState.tempSpinInfo
  }

  function useSpinCount() {
    if (referralWheelState.spinInfo) {
      referralWheelState.spinInfo.used_spin_count++
    }
  }

  function setReferralWheelTempSpinInfo(data: Response.ReferralWheelBonusSpinInfo) {
    referralWheelState.tempSpinInfo = data
  }

  function setReferralWheelPrizeList(data: Response.ReferralWheelPrizeList) {
    referralWheelState.prizeList = data
  }

  function setStoreWinners(list: Response.GetReferralWheelWinners) {
    referralWheelState.winners = list
  }

  function setStoreMemberPrizes(list: Response.GetReferralWheelMemberPrizes) {
    referralWheelState.memberPrizes = list
  }

  return {
    referralWheelState,
    setReferralWheelStatus,
    setReferralWheelCurrent,
    setReferralWheelBonusMap,
    syncReferralWheelSpinInfo,
    useSpinCount,
    setReferralWheelTempSpinInfo,
    setReferralWheelPrizeList,
    setStoreWinners,
    setStoreMemberPrizes
  }
})
