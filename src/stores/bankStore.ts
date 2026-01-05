import { ref } from "vue"
import { defineStore } from "pinia"
import { AvailCurrencyList } from "src/api/response.type"

export const useBankStore = defineStore("bankStore", () => {
  const availCurrencyList = ref<AvailCurrencyList>([])
  return {
    availCurrencyList
  }
})
