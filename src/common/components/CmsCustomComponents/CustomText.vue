<template>
  <div class="custom-text-wrapper" v-if="currentContent">
    <div v-if="currentContent.title" v-html="currentContent.title" />
    <div v-html="currentContent.content" class="content" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"
import type { CmsTextPayload, CmsTextPageItem } from "src/types/cmsCustomPage"

const { nowLang } = useLanguage()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const currentContent = computed((): CmsTextPageItem | null => {
  const payload = props.entrance.payload as unknown as CmsTextPayload

  if (!payload?.page || !Array.isArray(payload.page)) {
    return null
  }

  const currentLangContent = payload.page.find((item: CmsTextPageItem) => item.lang === nowLang.value)

  return currentLangContent || payload.page[0] || null
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.custom-text-wrapper {
  .content {
    @apply text-[1.25rem] font-bold;
    color: var(--text-content, #2a354b);
  }
}
</style>
