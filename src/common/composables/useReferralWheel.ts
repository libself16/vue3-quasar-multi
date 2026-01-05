import { ref, computed, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { storeToRefs } from "pinia"
import { useReferralWheelStore } from "src/stores/referralWheelStore"
import {
  getReferralWheelStatus,
  getReferralWheelCurrent,
  getReferralWheelMemberInfo,
  getReferralWheelPrize,
  postReferralWheelSpin,
  getReferralWheelWinners,
  getReferralWheelMemberPrizes
} from "src/api/referral_wheel"
import { useApi } from "src/common/hooks/useApi"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { parseTimezoneDate, padTime } from "src/common/utils/dayjsUtils"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"

dayjs.extend(duration)

export function useReferralWheel() {
  const { t } = useI18n()
  const { rouletteGameImg } = useCommonImg()
  const { preciseSubtract, calculatePercentage } = useCommon()
  const { activeWalletCurrencyId } = useUserInfo()
  const store = useReferralWheelStore()
  const { referralWheelState } = storeToRefs(store)
  const {
    setReferralWheelStatus,
    setReferralWheelCurrent,
    setReferralWheelBonusMap,
    setReferralWheelTempSpinInfo,
    syncReferralWheelSpinInfo,
    useSpinCount,
    setReferralWheelPrizeList,
    setStoreWinners,
    setStoreMemberPrizes
  } = store

  //#region 活動時間
  const activityEnd = "已結束"
  const now = ref(dayjs())
  let timer: ReturnType<typeof setInterval> | null = null

  const ActivityDeadline = computed(() => {
    if (!referralWheelState.value.current) return ""

    return parseTimezoneDate({
      time: referralWheelState.value.current.end_time,
      timezoneOffset: referralWheelState.value.current.timezone
    })
  })

  const ActivityDeadlineCountdown = computed(() => {
    if (!ActivityDeadline.value) return ""
    const diff = ActivityDeadline.value.diff(now.value)
    if (diff <= 0) return "已結束"

    const dur = dayjs.duration(diff)

    if (dur.days()) {
      return `${dur.days()}${t("Info.day")} ${padTime(dur.hours())}:${padTime(dur.minutes())}:${padTime(dur.seconds())}`
    }

    return `${padTime(dur.hours())}:${padTime(dur.minutes())}:${padTime(dur.seconds())}`
  })

  const isActivityEnd = computed(() => ActivityDeadlineCountdown.value === activityEnd)

  function startCountdown() {
    timer = setInterval(() => {
      now.value = dayjs()
    }, 1000)
  }
  //#endregion

  const spinTicket = computed(() => {
    if (!referralWheelState.value.spinInfo) return 0

    const result = preciseSubtract(
      referralWheelState.value.spinInfo.max_spin_count,
      referralWheelState.value.spinInfo.used_spin_count
    )
    return result < 0 ? 0 : result
  })

  const bonusValue = computed(() => {
    if (!referralWheelState.value.bonusMap) return 0

    return referralWheelState.value.bonusMap[activeWalletCurrencyId.value] || 0
  })

  const withdrawalDiff = computed(() => preciseSubtract(100, bonusValue.value))

  const bonusPercent = computed(() =>
    calculatePercentage(referralWheelState.value.bonusMap[activeWalletCurrencyId.value], 100)
  )

  const prizeList = computed(() => {
    return referralWheelState.value.prizeList.map((e) => {
      if (e.amount === "0") {
        e.is_thank_you = true
      }

      return e
    })
  })

  const canSpin = computed(() => {
    if (!prizeList.value.length) return false
    if (!activeWalletCurrencyId.value) return false
    if (spinTicket.value < 1) return false
    if (isActivityEnd.value) return false

    return true
  })

  const isLoading = ref(false)

  async function handleReferralWheelStatus() {
    isLoading.value = true
    const { status, data } = await useApi(getReferralWheelStatus)
    isLoading.value = false

    if (status) {
      setReferralWheelStatus(data)
    }
  }

  async function handleReferralWheelMemberInfo() {
    if (!referralWheelState.value.current || !referralWheelState.value.current.id) return

    isLoading.value = true
    const payolad: Request.GetReferralWheelMemberInfo = {
      referral_wheel_id: referralWheelState.value.current.id
    }
    const { status, data } = await useApi(getReferralWheelMemberInfo, payolad)
    isLoading.value = false
    if (status) {
      setReferralWheelBonusMap(data.bonus)
      setReferralWheelTempSpinInfo(data.spin_info)
    }
  }

  async function handleReferralWheelCurrent() {
    isLoading.value = true
    const { status, data } = await useApi(getReferralWheelCurrent)
    isLoading.value = false

    if (status) {
      setReferralWheelCurrent(data)
    }
  }

  async function handleReferralWheelPrize() {
    isLoading.value = true
    const { status, data } = await useApi(getReferralWheelPrize)
    isLoading.value = false

    if (status) {
      setReferralWheelPrizeList(data)
    }
  }

  async function handleReferralWheelSpin(): Promise<{
    status: boolean
    data?: Response.PostReferralWheelSpin
  }> {
    if (!canSpin.value) return Promise.resolve({ status: false })

    const payload: Request.PostReferralWheelSpin = {
      currency_id: activeWalletCurrencyId.value
    }
    isLoading.value = true
    const { status, data } = await useApi(postReferralWheelSpin, payload)
    if (status) {
      useSpinCount()
    }
    isLoading.value = false

    return Promise.resolve({
      status,
      data
    })
  }

  async function handleReferralWheellWinners() {
    isLoading.value = true
    const { status, data } = await useApi(getReferralWheelWinners)
    isLoading.value = false
    if (status) {
      setStoreWinners(data)
    }
  }

  async function handleReferralWheelMemberPrizes() {
    if (!referralWheelState.value.current || !referralWheelState.value.current.id) return

    isLoading.value = true
    const payolad: Request.GetReferralWheelMemberPrizes = {
      referral_wheel_id: referralWheelState.value.current.id
    }

    const { status, data } = await useApi(getReferralWheelMemberPrizes, payolad)
    isLoading.value = false

    if (status) {
      setStoreMemberPrizes(data)
    }
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    /** 邀請輪盤資料 */
    referralWheelState,

    /** 活動結束時間 */
    ActivityDeadline,

    /** 倒數活動結束時間 */
    ActivityDeadlineCountdown,

    /** 活動是否結束 */
    isActivityEnd,

    /** 抽獎券數量 */
    spinTicket,

    /** 獎金 */
    bonusValue,

    /** 提款差額 */
    withdrawalDiff,

    /** 獎金百分比 */
    bonusPercent,

    /** 輪盤獎項 */
    prizeList,

    /** 是否可以轉盤 */
    canSpin,

    /** 取得邀請輪盤狀態 */
    handleReferralWheelStatus,

    /** 取得當前轉盤 */
    handleReferralWheelCurrent,

    /** 取得邀請輪盤會員資訊 */
    handleReferralWheelMemberInfo,

    /** 同步轉盤資訊從temp拿出來用 */
    syncReferralWheelSpinInfo,

    /** 使用一次抽獎券 */
    useSpinCount,

    /** 取得轉盤獎項 */
    handleReferralWheelPrize,

    /** 抽獎 */
    handleReferralWheelSpin,

    /** 取得獲獎名單 */
    handleReferralWheellWinners,

    /** 取得獎項紀錄 */
    handleReferralWheelMemberPrizes,

    /** 開始倒數 */
    startCountdown,

    /** 補上時間位數 */
    padTime
  }
}
