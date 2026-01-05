import { computed, Ref } from "vue"
import { useNow } from "@vueuse/core"
import dayjs from "dayjs"

export function useOnlineTime(lastLoginTime: Ref<string | number | undefined>) {
  const now = useNow({ interval: 1000 })

  const onlineTime = computed(() => {
    const value = lastLoginTime.value
    if (!value) return "00:00:00"

    const lastLogin = dayjs(value)
    const diffSeconds = dayjs(now.value).diff(lastLogin, "second")

    if (diffSeconds < 0) return "00:00:00"

    const hours = Math.floor(diffSeconds / 3600)
    const minutes = Math.floor((diffSeconds % 3600) / 60)
    const seconds = diffSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  const calcOnlineTime = (lastLoginTime: string | number | undefined) => {
    const now = useNow({ interval: 1000 })
    const value = lastLoginTime
    if (!value) return "00:00:00"

    const lastLogin = dayjs(value)
    const diffSeconds = dayjs(now.value).diff(lastLogin, "second")

    if (diffSeconds < 0) return "00:00:00"

    const hours = Math.floor(diffSeconds / 3600)
    const minutes = Math.floor((diffSeconds % 3600) / 60)
    const seconds = diffSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return {
    /** 會員在線時間 */
    onlineTime,

    /** 計算會員在線時間 */
    calcOnlineTime
  }
}
