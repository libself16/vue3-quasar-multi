import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

export const useAgeVerificationStore = defineStore("ageVerification", () => {
  const alreadyShow = useSessionStorage<boolean>("alreadyShowAgeVerification", false)

  const updateAlreadyShow = () => {
    alreadyShow.value = true
  }

  // 關閉視窗
  const leavePage = () => {
    alreadyShow.value = false
    window.location.href = "about:blank"
    window.close()
  }

  return {
    alreadyShow,
    updateAlreadyShow,
    leavePage
  }
})
