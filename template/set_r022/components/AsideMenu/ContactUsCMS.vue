<template>
  <ul class="contact-container">
    <li
      v-for="(cmsItem, cmsIndex) in contactUsList"
      :key="cmsIndex"
      class="contact-item"
      @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
    >
      <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-icon" contain />
      <span class="contact-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

defineProps<{
  contactUsList: any[]
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.contact-container {
  @apply flex flex-col gap-[.5rem] mt-[.75rem];
  border-top: 1px solid var(--neutral-03);

  .contact-item {
    @apply flex items-center gap-[.5rem] cursor-pointer rounded-[.5rem];
    padding: 0.5rem 0 0.5rem 0.75rem;
    color: var(--primary-02);
    transition: all 0.3s ease;

    &:hover {
      background: var(--neutral-04);
    }

    .contact-icon {
      @apply w-[1.25rem] h-[1.25rem];
    }
  }
}
</style>
