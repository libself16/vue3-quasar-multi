<template>
  <div class="announcement-dialog" role="dialog" aria-modal="true" @click.self="closeDialog">
    <div class="announcement-panel" @click.self="closeDialog">
      <div class="announcement-main">
        <q-icon name="close" class="announcement-close" @click="closeDialog"></q-icon>
        <img :src="imageSrc" :alt="currentTitle" class="announcement-image" />
      </div>

      <footer v-if="showDontShowTodayCheckbox" class="announcement-footer">
        <q-checkbox v-model="dontShowToday" :label="t('announcement.dontShowToday')" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import type * as Response from "src/api/response.type"

type Props = {
  announcement: Response.Announcement | null
  index: number
  total: number
  showDontShowTodayCheckbox?: boolean
}

type EmitPayload = {
  dontShowToday?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  announcement: null,
  index: 0,
  total: 0,
  showDontShowTodayCheckbox: false
})

const emit = defineEmits<{
  (event: "close", payload?: EmitPayload): void
}>()

const { t } = useI18n()

const dontShowToday = ref(false)

watch(
  () => props.showDontShowTodayCheckbox,
  (flag) => {
    if (!flag) {
      dontShowToday.value = false
    }
  },
  { immediate: true }
)

const currentTitle = computed(() => props.announcement?.langDetail?.title || "")

const imageSrc = computed(() => props.announcement?.langDetail?.image_path || "")

function closeDialog() {
  const payload = props.showDontShowTodayCheckbox ? { dontShowToday: dontShowToday.value } : undefined
  emit("close", payload)
}
</script>

<style scoped lang="scss">
.announcement-dialog {
  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001];
  background: var(--ann-overlay, #00000099);

  .announcement-panel {
    @apply w-full max-w-[56.25rem]  h-full flex flex-col  items-center justify-center;
  }

  .announcement-main {
    @apply relative  flex flex-col min-h-0;
  }

  .announcement-close {
    @apply absolute top-[.625rem] right-[.625rem] h-6 w-6 text-[1.5rem] cursor-pointer;
    color: var(--ann-header-close, #ffffff);
  }

  .announcement-image {
    @apply w-auto h-auto max-w-full max-h-full object-contain rounded-2xl;
  }

  .announcement-footer {
    @apply py-[.375rem] flex items-center justify-center;
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
}
</style>
