import { storeToRefs } from "pinia"
import { useSessionStore } from "src/stores/sessionStore"

export function useSesstion() {
  const sessionStore = useSessionStore()
  const { isDiscardThreeDigits } = storeToRefs(sessionStore)
  const { setIsDiscardThreeDigits } = sessionStore

  return {
    /** 是否無條件捨棄三位數字 */
    isDiscardThreeDigits,

    /** 設定是否無條件捨棄三位數字 */
    setIsDiscardThreeDigits
  }
}
