import { onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useEnv } from "src/common/hooks/useEnv"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useBank } from "src/common/composables/useBank"

export function useCurrency() {
  const { t } = useI18n()
  const { availCurrencyList, currencyIdMap, getAvailCurrencyList } = useBank()
  const { isCash } = useEnv()
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()

  const currencyHeader = computed(() => (isCash.value ? t("tableHeader.curr") : "Point"))

  const currencyOptions = computed(() => {
    return availCurrencyList.value.map((currency) => {
      return {
        label: getCurrencyCode(currency.code),
        value: currency.id
      }
    })
  })

  function getCurrencyCode(currencyCode: string): string {
    if (isCash.value) {
      if (isGOG.value && currencyCode === "CNY") {
        return "USDT"
      }

      if (isIDRToEUR.value && currencyCode === "IDR") {
        return "EUR"
      }

      if (isNBL1.value && currencyCode === "IDR") {
        return "Rp"
      }

      return currencyCode ? currencyCode : ""
    }
    return "Point"
  }

  function getCurrencyCodeById(currencyId: number): string {
    if (!currencyId) return ""

    if (currencyIdMap.value) {
      const currencyCode = currencyIdMap.value[currencyId].code || ""
      return getCurrencyCode(currencyCode)
    }

    return getCurrencyCodeById(currencyId)
  }

  onMounted(async () => {
    if (!availCurrencyList.value.length) {
      await getAvailCurrencyList()
    }
  })

  return {
    /** 幣別表頭 */
    currencyHeader,

    /** 幣別選單 */
    currencyOptions,

    /** currency code 轉換 */
    getCurrencyCode,

    /** currency id 轉 currency code */
    getCurrencyCodeById
  }
}
