<template>
  <q-btn-dropdown
    class="language-dropdown"
    flat
    unelevated
    :ripple="false"
    content-class="language-dropdown-content"
    no-caps
  >
    <template #label>
      <q-avatar>
        <q-img class="language-flag" :src="getFlagImg(currentLanguage)" />
      </q-avatar>
      <span class="language-text">{{ $t(currentLanguageLabel) }}</span>
    </template>
    <q-list>
      <q-item
        v-for="language in languageList"
        :key="language"
        clickable
        v-close-popup
        :active="language === currentLanguage"
        active-class="is-active"
        @click="changeLanguage(language)"
      >
        <q-img class="language-flag" :src="getFlagImg(language)" />
        <span class="language-text">{{ $t(LANGUAGE_TYPE.Labels[language as LANGUAGE_TYPE.Enums]) }}</span>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"

const { availableLanguages, getLanguage, getFlagImg, setLanguage, langListWithLabel } = useLanguage()

const languageList = computed(() => availableLanguages)
const currentLanguage = computed(() => getLanguage())

const currentLanguageLabel = computed(() => {
  return langListWithLabel.value.find((lang) => lang.value === currentLanguage.value)?.label ?? currentLanguage.value
})

const changeLanguage = (language: string) => {
  setLanguage(language)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.language-dropdown {
  @apply rounded-[2rem] flex items-center py-[.3125rem] px-[.5rem] cursor-pointer;
  border: 0.0625rem solid var(--neutral-03);
  background: var(--neutral-01);
  color: var(--secondary-01);
  :deep(.q-btn__content) {
    @apply flex-nowrap;
  }

  :deep(.q-btn-dropdown__arrow) {
    @apply hidden;
  }

  :deep(.q-avatar) {
    @apply w-5 h-5 mr-2;
  }

  .language-text {
    @apply text-[.75rem] whitespace-nowrap;
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.language-dropdown-content {
  .q-item {
    color: var(--secondary-01);
  }
  .q-item.is-active {
    color: var(--primary-01);
  }
  .language-flag {
    @apply w-5 h-5 mr-2;
  }
  .language-text {
    @apply text-[.75rem];
  }
}
</style>
