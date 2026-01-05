<template>
  <div>
    <transition name="announcement-fade" appear @after-leave="onAllContentAfterLeave">
      <AllContentAnnouncement
        v-if="isAllContentOpen && allContentPayload"
        :announcements="allContentPayload.announcements"
        :show-dont-show-today-checkbox="allContentPayload.showDontShowTodayCheckbox"
        @close="onAllContentClose"
      />
    </transition>

    <transition name="announcement-fade" appear @after-leave="onImageAfterLeave">
      <ImagesAnnouncement
        v-if="isImageOpen && imagePayload"
        :announcement="imagePayload.announcement"
        :index="imagePayload.index"
        :total="imagePayload.total"
        :show-dont-show-today-checkbox="imagePayload.showDontShowTodayCheckbox"
        @close="onImageClose"
      />
    </transition>

    <transition name="announcement-fade" appear>
      <SingleAnnouncement
        v-if="isSingleOpen && singleAnnouncement"
        :announcement="singleAnnouncement"
        @close="onSingleClose"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import SingleAnnouncement from "./components/Single.vue"
import AllContentAnnouncement from "./components/AllContent.vue"
import ImagesAnnouncement from "./components/Images.vue"
import {
  useAnnouncement,
  ANNOUNCEMENT_EVENTS,
  type AllContentDialogPayload,
  type ImageDialogPayload
} from "src/common/composables/useAnnonucement"
import type * as Response from "src/api/response.type"
import { useEventBus } from "src/common/hooks/useEventBus"

type DialogCloseOptions = {
  dontShowToday?: boolean
}

const isSingleOpen = ref(false)
const isAllContentOpen = ref(false)
const isImageOpen = ref(false)
const singleAnnouncement = ref<Response.Announcement | null>(null)
const allContentPayload = ref<AllContentDialogPayload | null>(null)
const imagePayload = ref<ImageDialogPayload | null>(null)

const pendingAllContentClose = ref<DialogCloseOptions | undefined>(undefined)
const pendingImageClose = ref<DialogCloseOptions | undefined>(undefined)
const shouldHandleAllContentLeave = ref(false)
const shouldHandleImageLeave = ref(false)

const { eventOn } = useEventBus()
const { initAnnouncementFlow, handleAllContentClosed, handleImageClosed } = useAnnouncement()

eventOn(ANNOUNCEMENT_EVENTS.SHOW_SINGLE, (payload) => {
  singleAnnouncement.value = payload
  isSingleOpen.value = true
})

eventOn(ANNOUNCEMENT_EVENTS.SHOW_ALL_CONTENT, (payload) => {
  allContentPayload.value = payload
  isAllContentOpen.value = true
  isImageOpen.value = false
  resetPendingState()
})

eventOn(ANNOUNCEMENT_EVENTS.SHOW_IMAGE, (payload) => {
  imagePayload.value = payload
  isImageOpen.value = true
  isAllContentOpen.value = false
  shouldHandleAllContentLeave.value = false
  pendingAllContentClose.value = undefined
  pendingImageClose.value = undefined
})

eventOn(ANNOUNCEMENT_EVENTS.FLOW_FINISHED, () => {
  isAllContentOpen.value = false
  isImageOpen.value = false
  allContentPayload.value = null
  imagePayload.value = null
  resetPendingState()
})

onMounted(() => {
  initAnnouncementFlow()
})

function onSingleClose() {
  singleAnnouncement.value = null
  isSingleOpen.value = true
}

function onAllContentClose(options?: DialogCloseOptions) {
  pendingAllContentClose.value = options
  shouldHandleAllContentLeave.value = true
  isAllContentOpen.value = false
}

function onImageClose(options?: DialogCloseOptions) {
  pendingImageClose.value = options
  shouldHandleImageLeave.value = true
  isImageOpen.value = false
}

function onAllContentAfterLeave() {
  if (!shouldHandleAllContentLeave.value) return
  shouldHandleAllContentLeave.value = false
  handleAllContentClosed(pendingAllContentClose.value)
  pendingAllContentClose.value = undefined
}

function onImageAfterLeave() {
  if (!shouldHandleImageLeave.value) return
  shouldHandleImageLeave.value = false
  handleImageClosed(pendingImageClose.value)
  pendingImageClose.value = undefined
}

function resetPendingState() {
  shouldHandleAllContentLeave.value = false
  shouldHandleImageLeave.value = false
  pendingAllContentClose.value = undefined
  pendingImageClose.value = undefined
}
</script>

<style scoped lang="scss">
.announcement-fade-enter-active,
.announcement-fade-leave-active {
  transition: opacity 0.18s ease;
}

.announcement-fade-enter-from,
.announcement-fade-leave-to {
  opacity: 0;
}
</style>
