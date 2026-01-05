import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

interface DarkModeStoreOptions {
  /** 初始值: true 為深色模式 */
  initialValue?: boolean
}

export const useDarkModeStore = (options: DarkModeStoreOptions = {}) => {
  return defineStore("darkMode", () => {
    const { initialValue = false } = options
    const existingValue = sessionStorage.getItem("isDarkMode")
    let defaultValue = initialValue

    if (existingValue !== null) {
      try {
        const parsedValue = JSON.parse(existingValue)
        // 防呆確保值是boolean
        if (typeof parsedValue === "boolean") {
          defaultValue = parsedValue
        }
      } catch (error) {
        console.warn("Failed to parse isDarkMode from sessionStorage, using initialValue:", error)
        sessionStorage.removeItem("isDarkMode")
      }
    }

    const isDarkMode = useSessionStorage<boolean>("isDarkMode", defaultValue)

    const updateIsDarkMode = (status: boolean) => {
      isDarkMode.value = status
    }

    return {
      isDarkMode,
      updateIsDarkMode
    }
  })()
}
