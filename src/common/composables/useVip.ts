import { ref, computed, watchEffect } from "vue"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useEnv } from "src/common/hooks/useEnv"
import { LANGUAGE_TYPE, LEVEL_UP_TYPE } from "src/common/utils/constants"
import { useApi } from "src/common/hooks/useApi"
import { getVipList, getUserStatistics, getMultiUserStatistics } from "src/api/vip"
import type * as Response from "src/api/response.type"

export function useVip() {
  const { availCurrencyList, currencyIdMap, currencyCodeMap, getAvailCurrencyList } = useBank()
  const { activeWalletCurrencyCode, userInfo, userInfo2, accountInfo } = useUserInfo()
  const { nowLang } = useLanguage()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()

  const isLoading = ref(false)
  const vipCurrencyId = ref(0)

  const vipCurrencyCode = computed(() => {
    if (!currencyIdMap.value) return ""

    return currencyIdMap.value[vipCurrencyId.value]?.code || ""
  })

  const userStatistics = ref<Response.UserStatistics>()
  const userMultiStatistics = ref<Response.UserMultiStatistics>([])
  const memberLevelList = ref<Response.MemberLevelist>()

  const userMultiStatisticsMap = computed<Response.UserStatisticsMap>(() => {
    const result: Response.UserStatisticsMap = userMultiStatistics.value.reduce(
      (map: Response.UserStatisticsMap, item) => {
        map[item.currency_id] = item
        return map
      },
      {}
    )

    return result
  })

  // 合併benefit與reward
  const memberVipList = computed<Response.MemberVipList>(() => {
    if (!memberLevelList.value) return []

    return memberLevelList.value.map((memberLevel) => {
      const rewardBenefits = memberLevel.rewards.map((reward) => {
        let benefit = memberLevel.benefits.find((benefit) => benefit.currency_id === reward.currency_id)
        if (!benefit) {
          benefit = {
            currency_id: reward.currency_id,
            withdraw: {
              daily_limit: 0,
              max_amount: "",
              fee: "",
              monthly_free_limit: 0
            }
          }
        }

        return {
          ...reward,
          ...benefit.withdraw
        }
      })

      const result: Response.MemberVipItem = {
        id: memberLevel.id,
        level: memberLevel.level,
        title: memberLevel.titles ? memberLevel.titles[nowLang.value as LANGUAGE_TYPE.Enums] || "" : "",
        img: `${VITE_APP_DYNAMIC_RESOURCE_URL}/${memberLevel.img}?v=${memberLevel.updated_time}`,
        conditions: memberLevel.conditions,
        rewardBenefits: rewardBenefits,
        remark: memberLevel.remark,
        updated_time: memberLevel.updated_time,
        promotion_condition: memberLevel.promotion_condition,
        promotion_type: memberLevel.promotion_type
      }

      return result
    })
  })

  // 篩選語系與幣別
  const vipList = computed<Response.VipList>(() => {
    if (!memberLevelList.value) return []

    return memberLevelList.value.map((memberLevel) => {
      const condition: Response.VipCondition | undefined = memberLevel.conditions.find(
        (e) => e.currency_id === vipCurrencyId.value
      )
      const reward: Response.VipReward | undefined = memberLevel.rewards.find(
        (e) => e.currency_id === vipCurrencyId.value
      )
      const benefit: Response.VipBenefit | undefined = memberLevel.benefits.find(
        (e) => e.currency_id === vipCurrencyId.value
      )

      const vip: Response.VipItem = {
        id: memberLevel.id,
        level: memberLevel.level,
        title: memberLevel.titles ? memberLevel.titles[nowLang.value as LANGUAGE_TYPE.Enums] || "" : "",
        img: `${VITE_APP_DYNAMIC_RESOURCE_URL}/${memberLevel.img}?v=${memberLevel.updated_time}`,
        condition,
        reward,
        benefit,
        remark: memberLevel.remark,
        updated_time: memberLevel.updated_time,
        promotion_condition: memberLevel.promotion_condition,
        promotion_type: memberLevel.promotion_type
      }

      return vip
    })
  })
  const currencyDropdown = computed(() => {
    if (!availCurrencyList.value.length) return []

    return availCurrencyList.value.map((e) => {
      return {
        label: e.code,
        value: e.id
      }
    })
  })

  async function handleVipList() {
    isLoading.value = true
    const { status, data } = await useApi(getVipList)
    isLoading.value = false

    if (status) {
      memberLevelList.value = data
    }
  }

  function getLevelUpI18n(vipData: Response.MemberVipItem): string {
    if (!vipData.conditions.length) return ""
    if (vipData.conditions.length === 1) return "vip.meetingTheRequirement"
    if (vipData.promotion_type === LEVEL_UP_TYPE.Enums.All) return "vip.allRequirements"
    return "vip.meetingAnyOne"
  }

  function getCurrencyCode(currencyId?: number) {
    if (!currencyIdMap.value || !currencyId) return ""
    const currencyCode = currencyIdMap.value[currencyId]?.code || ""

    if (isGOG.value && currencyCode === "CNY") {
      return "USDT"
    }

    if (isIDRToEUR.value && currencyCode === "IDR") {
      return "EUR"
    }

    if (isNBL1.value && currencyCode === "IDR") {
      return "Rp"
    }

    return currencyCode
  }

  async function initVipSingleCurrency() {
    await handleVipList()
    isLoading.value = true
    await getAvailCurrencyList()
    isLoading.value = false

    if (activeWalletCurrencyCode.value && currencyCodeMap.value) {
      const currency = currencyCodeMap.value[activeWalletCurrencyCode.value]
      if (currency) {
        vipCurrencyId.value = currency.id
      }
      return
    }

    if (availCurrencyList.value.length) {
      vipCurrencyId.value = availCurrencyList.value[0].id
    }
  }

  async function initVipMultiCurrency() {
    isLoading.value = true
    await handleVipList()
    if (!availCurrencyList.value.length) {
      await getAvailCurrencyList()
    }
    await handleUserMultiStatistics()
    isLoading.value = false
  }

  async function handleUserStatistics(currencyId: number) {
    isLoading.value = true
    const { status, data } = await useApi(getUserStatistics, currencyId)
    isLoading.value = false

    if (status) {
      userStatistics.value = data
    }
  }

  async function handleUserMultiStatistics() {
    isLoading.value = true
    const { status, data } = await useApi(getMultiUserStatistics)
    isLoading.value = false

    if (status) {
      userMultiStatistics.value = data.list
    }
  }

  watchEffect(() => {
    if (vipCurrencyId.value) {
      handleUserStatistics(vipCurrencyId.value)
    }
  })

  return {
    /** 初始化單幣別vip頁面資訊 */
    initVipSingleCurrency,

    /** 初始化多幣別vip頁面資訊 */
    initVipMultiCurrency,

    /** 取vip資料 */
    handleVipList,

    /** 取得晉級條件文字 */
    getLevelUpI18n,

    /** 取得幣別代碼 */
    getCurrencyCode,

    /** 幣別轉換map */
    currencyIdMap,

    /** 幣別轉換map */
    currencyCodeMap,

    /** 幣別下拉選單 */
    currencyDropdown,

    /** vip頁面當前選用幣別Id */
    vipCurrencyId,

    /** vip頁面當前選用幣別Code */
    vipCurrencyCode,

    /** 單幣別會員統計資料 */
    userStatistics,
    handleUserStatistics,

    /** 多幣別會員統計資料 */
    userMultiStatistics,
    /** 多幣別會員統計資料Map */
    userMultiStatisticsMap,

    /** 會員資料 */
    userInfo,
    userInfo2,
    accountInfo,

    /** vip列表 (篩選語系與幣別)*/
    vipList,

    /** vip列表 (合併benefit與reward)*/
    memberVipList
  }
}
