<template>
  <div class="dialog-overlay" role="dialog" aria-modal="true" @click.self="emitClose">
    <div class="dialog-container">
      <header class="dialog-header">
        <span class="dialog-title">{{ t("menu.announcement") }}</span>
        <q-icon name="close" class="header-close" @click="emitClose"></q-icon>
      </header>

      <div class="dialog-body">
        <div class="body-right">
          <div class="announcement-detail" v-if="props.announcement">
            <h3 class="detail-title">{{ props.announcement.langDetail?.title }}</h3>
            <!-- <img
              v-if="props.announcement.langDetail?.image_path"
              v-lazy-load="props.announcement.langDetail.image_path"
              :alt="props.announcement.langDetail?.title"
              class="detail-image"
            /> -->
            <div class="detail-body" v-html="props.announcement.langDetail?.content"></div>
          </div>
          <div v-else class="announcement-empty">
            {{ t("announcement.empty") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type * as Response from "src/api/response.type"

type Props = {
  announcement: Response.Announcement | null
}

const props = withDefaults(defineProps<Props>(), {
  announcement: null
})

const emit = defineEmits<{
  (event: "close"): void
}>()

const { t } = useI18n()

function emitClose() {
  emit("close")
}
</script>

<style scoped lang="scss">
.dialog-overlay {
  // --ann-overlay: #00000099;
  // --ann-header: #025be8;
  // --ann-header-text: #ffffff;
  // --ann-header-close: #ffffff;
  // --ann-detail-bg: #ffffff;
  // --ann-detail-text: #1b2739;

  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001];
  background: var(--ann-overlay, #00000099);
}

.dialog-container {
  @apply flex  flex-col w-full max-w-[41.25rem]  overflow-hidden rounded-[1.5rem];
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
    @apply h-6 w-6 text-[1.5rem];
    color: var(--ann-header-close, #ffffff);
  }
}

.dialog-body {
  @apply w-full h-full min-h-0;
  @apply flex phone:flex-col;
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
</style>
