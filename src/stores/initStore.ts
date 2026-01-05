import { ref } from "vue"
import { defineStore } from "pinia"

export const useInitStore = defineStore("initStore", () => {
  const isReady = ref(false)

  const setIsReady = (status: boolean) => {
    isReady.value = status
  }

  return { isReady, setIsReady }
})
