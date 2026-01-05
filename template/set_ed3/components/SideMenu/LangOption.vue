<template>
  <div class="p-4">
    <div class="language-selector-title">
      {{ t("common.language_option") }}
    </div>
    <q-select
      v-model="lang"
      :options="langListWithLabel"
      class="language-selector bg-primary rounded-lg"
      popup-content-class="language-selector-popup-content"
      dense
      dark
      options-dense
      standout="bg-standout"
      emit-value
      map-options
    >
      <template #prepend>
        <img :src="getFlagImg(lang)" :alt="`${lang} flag`" width="24" height="24" />
      </template>

      <template #option="{ itemProps, opt }">
        <q-item v-bind="itemProps">
          <div class="flex items-center">
            <img class="w-4 h-4 mr-2" :src="getFlagImg(opt.value)" :alt="`${opt} flag`" />
            <q-item-section>
              <q-item-label>{{ opt.label }}</q-item-label>
            </q-item-section>
          </div>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { langListWithLabel, getLanguage, getFlagImg, setLanguage } = useLanguage()
const lang = ref(getLanguage())

watch(
  lang,
  (val) => {
    if (val) {
      setLanguage(val)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "app/template/set_ed3/assets/css/_variable.scss";

:global(.q-menu) {
  background-color: $green03;
  border: 1px solid $green10;
}

.language-selector-title {
  @apply mb-2 font-bold;
  color: $text01;
}

.language-selector {
  :deep(.q-field__control) {
    background-color: $green03;
  }

  &.q-field--focused {
    :deep(.q-field__control) {
      background-color: $green03;
    }
    :deep(.q-field__native) {
      color: #fff !important;
    }
  }

  &:hover {
    background-color: $green03;
  }
}

.bg-standout {
  background: $select-standout-color;
}
</style>

<style lang="scss">
@import "app/template/set_ed3/assets/css/_variable.scss";

.language-selector-popup-content {
  background: $green04 !important;
  .q-item {
    background: $green04 !important;
    color: #fff !important;

    &:hover {
      background: $green03 !important;
    }
  }
}
</style>
