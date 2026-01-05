import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type AnnouncementState = {
  announcementList: Response.AnnouncementList
  dontShowUntilTs: number | null
}

function calcNextMidnightTs(baseDate?: Date | number) {
  const reference = baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate ?? Date.now())
  const next = new Date(reference)
  next.setHours(24, 0, 0, 0)
  return next.getTime()
}

export const useAnnouncementStore = defineStore("announcementStore", {
  state: (): AnnouncementState => ({
    announcementList: [],
    dontShowUntilTs: null
  }),
  getters: {
    hasAnnouncements: (state) => state.announcementList.length > 0,
    shouldSkipToday: (state) => {
      if (!state.dontShowUntilTs) return false
      return state.dontShowUntilTs > Date.now()
    }
  },
  actions: {
    setStoreAnnouncementList(list: Response.AnnouncementList) {
      this.announcementList = Array.isArray(list) ? [...list] : []
    },
    markDontShowToday(baseDate?: Date | number) {
      this.dontShowUntilTs = calcNextMidnightTs(baseDate)
    },
    clearDontShowToday() {
      this.dontShowUntilTs = null
    }
  },
  persist: true
})

export { calcNextMidnightTs }
