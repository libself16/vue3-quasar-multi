<template>
  <ModalBase v-model="modalShow" use-title :title="$t('menu.language')">
    <div class="language-wrapper">
      <ul class="language-list">
        <li v-for="language in languageList" @click="changeLanguage(language)" :key="language" class="language-item">
          <q-img class="language-img" :src="getSquareFlagImg(language)"></q-img>
          <span class="language-label">{{ getLanguageLabel(language) }}</span>
        </li>
      </ul>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import ModalBase from "./modalBase.vue"

const { availableLanguages, getSquareFlagImg, setLanguage } = useLanguage()

const languageList = computed(() => availableLanguages)

const getLanguageLabel = (language: string) => {
  return LANGUAGE_TYPE.Labels[language as keyof typeof LANGUAGE_TYPE.Labels]
}

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

const changeLanguage = (language: string) => {
  setLanguage(language)
}

onMounted(() => {
  eventbus.on("openSwitchLanguage", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style lang="scss" scoped>
.language-wrapper {
  padding: 1.1rem;

  .language-list {
    @apply grid grid-cols-3 gap-y-5;

    .language-item {
      @apply flex flex-col justify-center items-center cursor-pointer;
      transition: transform 330ms ease-in-out 0s;

      &:hover {
        transform: scale(1.1);
      }
    }

    .language-img {
      @apply max-w-[3.75rem];
    }

    .language-label {
      @apply mt-[.625rem];
    }
  }
}
</style>
