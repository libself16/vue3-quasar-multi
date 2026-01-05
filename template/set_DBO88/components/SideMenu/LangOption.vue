<template>
  <div class="p-4">
    <div class="text-white mb-2">
      {{ t("common.language_option") }}
    </div>
    <q-select
      v-model="lang"
      :options="langListWithLabel"
      class="language-selector bg-primary rounded-lg"
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
@import "app/template/set_DBO88/assets/css/_variable.scss";

:global(.q-menu) {
  background: $dark-slate-bg;
}

.language-selector {
  :deep(.q-field__control) {
    background: $midnight-blue-bg;
  }
}

.q-field--standout.q-field--dark.q-field--highlighted {
  :deep(.q-field__control) {
    background: $midnight-blue-bg !important;
  }
}

.q-field--standout.q-field--dark.q-field--highlighted {
  :deep(.q-field__native) {
    color: $text-white !important;
  }
}

.bg-standout {
  background: $select-standout-color;
}
</style>
