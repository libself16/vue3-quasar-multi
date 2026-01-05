import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useApi } from "src/common/hooks/useApi"
import { getAnnouncementList } from "src/api/announcement"
import { useAnnouncementStore } from "src/stores/announcementStore"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useEnv } from "src/common/hooks/useEnv"
import { LANGUAGE_TYPE, ANNOUNCEMENT_DISPLAY_TYPE, ANNOUNCEMENT_MEMBER_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

export const ANNOUNCEMENT_EVENTS = {
  SHOW_SINGLE: "openSingleAnnouncement",
  SHOW_ALL_CONTENT: "openAllContentAnnouncement",
  SHOW_IMAGE: "openImageAnnouncement",
  FLOW_FINISHED: "finishedAnnouncement"
} as const

export type AllContentDialogPayload = {
  announcements: Response.AnnouncementList
  showDontShowTodayCheckbox: boolean
}

export type ImageDialogPayload = {
  announcement: Response.Announcement
  index: number
  total: number
  showDontShowTodayCheckbox: boolean
}

type FetchResult = {
  skipped: boolean
  announcements: Response.AnnouncementList
}

export function useAnnouncement() {
  const { t } = useI18n()
  const announcementStore = useAnnouncementStore()
  const { nowLang } = useLanguage()
  const { eventEmit } = useEventBus()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const isLoading = ref(false)
  const isFlowRunning = ref(false)
  const imageIndex = ref(0)
  const announcementType = ref<ANNOUNCEMENT_MEMBER_TYPE.Enums>(ANNOUNCEMENT_MEMBER_TYPE.Enums.All)

  const announcementTypes = computed(() => {
    return Object.keys(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys).map((e) => {
      return {
        label: t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[e as any as ANNOUNCEMENT_MEMBER_TYPE.Enums]),
        value: parseInt(e)
      }
    })
  })

  const localizedAnnouncements = computed(() => {
    const langKey = nowLang.value as LANGUAGE_TYPE.Enums
    const list = announcementStore.announcementList ?? []

    return list
      .map((item) => {
        const newItem = { ...item }

        const details = typeof newItem.detail === "object" && newItem.detail ? newItem.detail : {}

        let langDetail = details[langKey]

        if (!langDetail) {
          const allLangDetails = Object.values(details)
          if (allLangDetails.length > 0) {
            langDetail = allLangDetails[0]
          } else {
            langDetail = {
              title: "",
              content: "",
              image_path: ""
            }
          }
        }

        newItem.langDetail = { ...langDetail }

        if (newItem.langDetail.image_path) {
          newItem.langDetail.image_path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${newItem.langDetail.image_path}`
        }

        return newItem
      })
      .filter((e) => e.detail)
  })

  const allContentAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.ALL_CONTENT)
    )
  })

  const imagesAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.IMAGES)
    )
  })

  const marqueeAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.MARQUEE)
    )
  })

  const showAllContentCheckbox = computed(
    () => allContentAnnouncements.value.length > 0 && imagesAnnouncements.value.length === 0
  )

  function emitShowAllContent() {
    if (!allContentAnnouncements.value.length) return

    const payload: AllContentDialogPayload = {
      announcements: allContentAnnouncements.value,
      showDontShowTodayCheckbox: showAllContentCheckbox.value
    }

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_ALL_CONTENT, payload)
  }

  function emitShowImage(index: number) {
    const items = imagesAnnouncements.value
    if (!items.length || !items[index]) return

    imageIndex.value = index
    const payload: ImageDialogPayload = {
      announcement: items[index],
      index,
      total: items.length,
      showDontShowTodayCheckbox: index === items.length - 1
    }

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_IMAGE, payload)
  }

  function handleShowSingleAnnouncement(id: number) {
    const items = marqueeAnnouncements.value
    if (!items.length) return

    const announcement = marqueeAnnouncements.value.find((item) => item.id === id)
    if (!announcement) return

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_SINGLE, announcement)
  }

  function emitFlowFinished() {
    isFlowRunning.value = false
    eventEmit(ANNOUNCEMENT_EVENTS.FLOW_FINISHED)
  }

  async function handleGetAnnouncementList(): Promise<FetchResult> {
    isLoading.value = true
    try {
      const { status, data } = await useApi(getAnnouncementList)

      if (!status || !data || !data.length) {
        announcementStore.setStoreAnnouncementList([])
        return { skipped: true, announcements: [] }
      }
      announcementStore.setStoreAnnouncementList(data)

      if (announcementStore.shouldSkipToday) {
        return { skipped: true, announcements: [] }
      }

      return { skipped: false, announcements: data }
    } finally {
      isLoading.value = false
    }
  }

  async function initAnnouncementFlow() {
    const { skipped } = await handleGetAnnouncementList()
    if (skipped) {
      return { started: false, reason: "skip" as const }
    }

    imageIndex.value = 0

    if (allContentAnnouncements.value.length) {
      isFlowRunning.value = true
      emitShowAllContent()
      return { started: true, mode: "allContent" as const }
    }

    if (imagesAnnouncements.value.length) {
      isFlowRunning.value = true
      emitShowImage(0)
      return { started: true, mode: "images" as const }
    }

    emitFlowFinished()
    return { started: false, reason: "empty" as const }
  }

  function handleAllContentClosed(options?: { dontShowToday?: boolean }) {
    if (!isFlowRunning.value) return

    if (options?.dontShowToday) {
      announcementStore.markDontShowToday()
      emitFlowFinished()
      return
    }

    if (imagesAnnouncements.value.length) {
      emitShowImage(0)
      return
    }

    emitFlowFinished()
  }

  function handleImageClosed(options?: { dontShowToday?: boolean }) {
    if (!isFlowRunning.value) return

    if (options?.dontShowToday) {
      announcementStore.markDontShowToday()
      emitFlowFinished()
      return
    }

    const nextIndex = imageIndex.value + 1
    if (nextIndex < imagesAnnouncements.value.length) {
      emitShowImage(nextIndex)
      return
    }

    emitFlowFinished()
  }

  return {
    /** 查詢公告類型  */
    announcementType,

    /** 公告類型清單 */
    announcementTypes,

    /** 全內容公告 */
    allContentAnnouncements,

    /** 圖片公告 */
    imagesAnnouncements,

    /** 跑馬燈 */
    marqueeAnnouncements,

    /** 執行API中 */
    isLoading,

    /** 公告流程中 */
    isFlowRunning,

    /** 當前圖片公告index */
    currentImageIndex: imageIndex,

    /** 取得公告清單 */
    handleGetAnnouncementList,

    /** 初始化公告 */
    initAnnouncementFlow,

    /** 關閉全內容公告 */
    handleAllContentClosed,

    /** 關閉圖片公告 */
    handleImageClosed,

    /** 顯示單筆公告 */
    handleShowSingleAnnouncement
  }
}
