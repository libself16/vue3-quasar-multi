import { defineStore } from "pinia"

type State = {
  isDiscardThreeDigits: boolean
}

export const useSessionStore = defineStore("sessionStore", {
  state: (): Partial<State> => ({
    isDiscardThreeDigits: false
  }),
  actions: {
    setIsDiscardThreeDigits(status: boolean) {
      this.isDiscardThreeDigits = status
    }
  },
  getters: {},
  persist: true
})
