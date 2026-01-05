<template>
  <div class="dialog-overlay" role="dialog" aria-modal="true" @click.self="emitClose">
    <div class="dialog-container">
      <header class="dialog-header">
        <span class="dialog-title">{{ t("menu.announcement") }}</span>
        <q-icon name="close" class="header-close" @click="emitClose"></q-icon>
      </header>

      <div class="dialog-body">
        <div class="body-left">
          <q-select
            v-model="announcementType"
            :options="announcementTypes"
            emit-value
            map-options
            standout
            square
            class="select-announcement-type"
            popup-content-class="select-announcement-type-popup"
            behavior="menu"
            dense
            @update:model-value="
              (value) => {
                currentIndex = 0
              }
            "
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="select-announcement-type-option">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- sidebar -->
          <div class="sidebar">
            <div class="sidebar-list-pc">
              <button
                v-for="(item, idx) in announcementsFiltered"
                :key="item.id"
                type="button"
                class="sidebar-item"
                :class="{ active: idx === currentIndex }"
                @click="select(idx)"
              >
                <span class="sidebar-text">{{ item.langDetail?.title || "" }}</span>
              </button>
            </div>
            <div class="sidebar-list-h5">
              <q-icon
                name="arrow_back_ios"
                class="nav-arrow"
                :class="{ disabled: isPreviousDisabled }"
                @click="goPrevious"
              ></q-icon>
              <div class="nav-tab">
                {{ currentAnnouncement?.langDetail?.title || "" }}
              </div>
              <q-icon
                name="arrow_forward_ios"
                class="nav-arrow"
                :class="{ disabled: isNextDisabled }"
                @click="goNext"
              ></q-icon>
            </div>
          </div>
        </div>
        <div class="body-right">
          <!-- content -->
          <div class="announcement-detail" v-if="currentAnnouncement">
            <h3 class="detail-title">{{ currentAnnouncement.langDetail?.title }}</h3>
            <!-- <img
              v-if="currentAnnouncement.langDetail?.image_path"
              v-lazy-load="currentAnnouncement.langDetail.image_path"
              :alt="currentAnnouncement.langDetail?.title"
              class="detail-image"
            /> -->
            <div class="detail-body" v-html="currentAnnouncement.langDetail?.content"></div>
          </div>
          <div v-else class="announcement-empty">
            {{ t("announcement.empty") }}
          </div>
          <div v-if="showDontShowTodayCheckbox" class="announcement-checkbox-wrapper">
            <q-checkbox v-model="dontShowToday" :label="t('announcement.dontShowToday')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useAnnouncement } from "src/common/composables/useAnnonucement"
import { ANNOUNCEMENT_MEMBER_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type Props = {
  announcements: Response.AnnouncementList
  showDontShowTodayCheckbox?: boolean
}

type EmitPayload = {
  dontShowToday?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  announcements: () => [],
  showDontShowTodayCheckbox: false
})

const emit = defineEmits<{
  (event: "close", payload?: EmitPayload): void
}>()

const { t } = useI18n()
const { announcementType, announcementTypes } = useAnnouncement()
const currentIndex = ref(0)
const dontShowToday = ref(false)

watch(
  () => props.announcements,
  (list) => {
    if (!list.length) {
      currentIndex.value = 0
    } else if (currentIndex.value >= list.length) {
      currentIndex.value = 0
    }
  },
  { immediate: true }
)

watch(
  () => props.showDontShowTodayCheckbox,
  (flag) => {
    if (!flag) {
      dontShowToday.value = false
    }
  },
  { immediate: true }
)

const announcementsFiltered = computed(() => {
  if (announcementType.value === ANNOUNCEMENT_MEMBER_TYPE.Enums.All) {
    return props.announcements
  }
  return props.announcements.filter((item) => item.type === announcementType.value)
})
const currentAnnouncement = computed(() => announcementsFiltered.value[currentIndex.value] || null)
const isPreviousDisabled = computed(() => currentIndex.value <= 0)
const isNextDisabled = computed(() => currentIndex.value >= announcementsFiltered.value.length - 1)

function select(index: number) {
  if (index < 0 || index >= props.announcements.length) {
    return
  }
  currentIndex.value = index
}

function goPrevious() {
  if (!isPreviousDisabled.value) {
    currentIndex.value -= 1
  }
}

function goNext() {
  if (!isNextDisabled.value) {
    currentIndex.value += 1
  }
}

function emitClose() {
  const payload = props.showDontShowTodayCheckbox ? { dontShowToday: dontShowToday.value } : undefined
  emit("close", payload)
}
</script>

<style lang="scss">
.q-menu {
  &.select-announcement-type-popup {
    // --ann-select-popup-bg: #ffffff;
    //  --ann-select-popup-sh
    // --ann-select-option-text: #ffffff;
    // --ann-select-option-text-active: #ffffff;adow: 0px 0px 10px 0px #ffffff99;
    @apply scale-95;
    background-color: var(--ann-select-popup-bg, #ffffff);
    box-shadow: var(--ann-select-popup-shadow, 0px 0px 10px 0px #0000001a);
  }
}
</style>
<style scoped lang="scss">
.dialog-overlay {
  // --ann-overlay: #00000099;
  // --ann-header: #025be8;
  // --ann-header-text: #ffffff;
  // --ann-header-close: #ffffff;
  // --ann-sidebar-bg: #e6effd;
  // --ann-sidebar-text: #025be8;
  // --ann-sidebar-active-bg: #5c8cf0;
  // --ann-sidebar-active-text: #ffffff;
  // --ann-sidebar-nav-arrow: #025be8;
  // --ann-detail-bg: #ffffff;
  // --ann-detail-text: #1b2739;
  // --ann-checkbox-wrapper-bg: #1010d6;
  // --ann-checkbox-bg: #22ff0a;
  // --ann-checkbox-icon: #ff0a0a;
  // --ann-checkbox-text: #606266;
  // --ann-select-bg: #ffffff;
  // --ann-select-text: #ffffff;
  // --ann-select-icon: #ffffff;

  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001];
  background: var(--ann-overlay, #00000099);
}

.dialog-container {
  @apply flex  flex-col w-full max-w-[56.25rem]  overflow-hidden rounded-[1.5rem];
  @apply h-[36.25rem] phone:h-full;
}

.dialog-header {
  @apply flex items-center justify-between p-[1.875rem];
  background-color: var(--ann-header, #025be8);

  .dialog-title {
    @apply text-[1.5rem] leading-[1.75rem] font-bold;
    color: var(--ann-header-text, #ffffff);
  }

  .header-close {
    @apply h-6 w-6 text-[1.5rem] cursor-pointer;
    color: var(--ann-header-close, #ffffff);
  }
}

.dialog-body {
  @apply w-full h-full min-h-0;
  @apply flex phone:flex-col;
}

.body-left {
  @apply flex flex-col min-h-0 shrink-0;
  @apply w-[15rem] phone:w-full;
  @apply h-full phone:h-auto;
}

.select-announcement-type {
  @apply h-[2.375rem] shrink-0;

  :deep(.q-field__inner) {
    .q-field__prepend {
      @apply w-6 h-6 opacity-0;
    }
    .q-field__control {
      @apply min-h-[2.375rem] h-[2.375rem] shadow-none;
      background: var(--ann-select-bg, #f5f5f7);
    }

    .q-field__native {
      @apply justify-center text-sm leading-[1.125rem] font-bold;
      color: var(--ann-select-text, #025be8);
    }

    .q-field__append {
      @apply min-h-[2.375rem] h-[2.375rem];
      color: var(--ann-select-icon, #025be8);
    }
  }
}

.select-announcement-type-option {
  color: var(--ann-select-option-text, #000000);

  &.q-item--active {
    background: var(--ann-select-option-bg-active);
    .q-item__label {
      color: var(--ann-select-option-text-active, #025be8);
    }
  }
}

.sidebar {
  @apply flex-1 min-h-0 overflow-hidden;
  background-color: var(--ann-sidebar-bg, #e6effd);
}

.sidebar-list-pc {
  @apply flex-col w-full h-full overflow-y-auto;
  @apply flex phone:hidden;

  .sidebar-item {
    @apply flex items-center justify-center py-[.625rem] px-4;
    color: var(--ann-sidebar-text, #025be8);

    .sidebar-text {
      @apply text-base leading-[1.125rem] max-h-9 text-ellipsis overflow-hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    &.active {
      background: var(--ann-sidebar-active-bg, #5c8cf0);
      color: var(--ann-sidebar-active-text, #ffffff);
    }
  }
}

.sidebar-list-h5 {
  @apply items-center justify-between gap-[.625rem] px-[1rem] py-[.625rem];
  @apply hidden phone:flex;
  background-color: var(--ann-sidebar-bg, #e6effd);

  .nav-tab {
    @apply truncate text-base leading-[1.125rem];
    color: var(--ann-sidebar-text, #025be8);
  }

  .nav-arrow {
    @apply text-base font-bold;
    color: var(--ann-sidebar-nav-arrow, #025be8);

    &.disabled {
      opacity: 0.3 !important;
      cursor: not-allowed;
    }
  }
}

.body-right {
  @apply flex flex-col flex-1 min-h-0  min-w-0;
  @apply phone:w-full;
  @apply h-full phone:h-auto;
}

.announcement-detail {
  @apply flex-1 p-5 flex flex-col gap-5 min-h-0 overflow-y-auto;
  background-color: var(--ann-detail-bg, #ffffff);
  color: var(--ann-detail-text, #000000);

  .detail-title {
    @apply text-base leading-[1.125rem] font-bold text-center;
  }

  .detail-image {
    @apply w-auto h-auto max-w-full min-w-0 object-contain;
    @apply self-start phone:self-auto;
  }

  .detail-body {
    @apply text-sm;
    color: var(--ann-detail-text, #000000);
  }
}

.announcement-empty {
  @apply flex flex-1 items-center justify-center p-5 text-base leading-[1.125rem] font-bold;
  background-color: var(--ann-detail-bg, #ffffff);
  color: var(--ann-detail-text, #000000);
}

.announcement-checkbox-wrapper {
  @apply py-[.375rem] flex items-center justify-center;
  background-color: var(--ann-checkbox-wrapper-bg, #f5f5f7);
  .q-checkbox {
    :deep(.q-checkbox__inner) {
      @apply text-[1.75rem];
      color: var(--ann-checkbox-bg, #025be8);

      .q-checkbox__svg {
        background: var(--ann-checkbox-bg, #025be8);
        color: var(--ann-checkbox-icon, #ffffff);
      }

      &.q-checkbox__inner--truthy {
        color: var(--ann-checkbox-bg-active, #025be8);
        .q-checkbox__svg {
          background: var(--ann-checkbox-bg-active, #025be8);
        }
      }
    }

    :deep(.q-checkbox__label) {
      @apply text-sm font-normal;
      color: var(--ann-checkbox-text, #606266);
    }
  }
}
</style>
