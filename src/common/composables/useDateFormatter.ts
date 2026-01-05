import dayjs from "dayjs"
import type { Dayjs } from "dayjs"

export function useDateFormatter() {
  /**
   * 將日期轉換為 ISO 格式並設定時區
   * @param dateInput - 輸入日期
   * @param setEndTime - 是否設定為當日結束時間 (23:59:59)
   * @returns ISO 格式的日期時間字串 (UTC+8)
   */
  function formatToISO(dateInput: string | Date | Dayjs, setEndTime = false): string {
    if (!dateInput) return ""

    try {
      let date = dayjs(dateInput)
      if (!date.isValid()) return ""

      // 設定時間點
      date = setEndTime ? date.hour(23).minute(59).second(59) : date.hour(0).minute(0).second(0)

      // 格式化為 +08:00 時區
      return date.format("YYYY-MM-DDTHH:mm:ss+08:00")
    } catch (error) {
      return ""
    }
  }

  /**
   * 將日期轉換為易讀格式
   * @param dateInput - 輸入日期
   * @returns 人類可讀的日期時間格式 (YYYY/MM/DD HH:mm:ss)
   */
  function formatToReadable(dateInput: string | Date | Dayjs): string {
    if (!dateInput) return "- -"

    try {
      const date = dayjs(dateInput)
      if (!date.isValid()) return "- -"

      return date.format("YYYY/MM/DD HH:mm:ss")
    } catch (error) {
      console.error("格式化可讀日期時發生錯誤:", error)
      return "- -"
    }
  }

  return {
    formatToISO,
    formatToReadable
  }
}
