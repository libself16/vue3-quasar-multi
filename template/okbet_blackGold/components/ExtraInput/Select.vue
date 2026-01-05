<template>
  <q-select
    v-model="inputValue"
    :options="field.values || []"
    emit-value
    map-options
    :borderless="!isMobile"
    lazy-rules
    clearable
    :display-value="inputValue ? undefined : label"
    :rules="field.required ? [Rules.required()] : []"
    :option-value="(opt) => opt.value"
    :option-label="(opt) => selectLabel(opt.label)"
    :dense="true"
    class="form-input"
    :class="{ 'pb-4': !field.required }"
  >
  </q-select>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"

const { t } = useI18n()
const Rules = useRule()
const { nowLang } = useLanguage()
const { isMobile } = useMediaQuery()
interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  class?: string
  field: {
    column_name: string
    customize: boolean
    edit: boolean
    lang?: {
      [key: string]: string
    }
    required: boolean
    type: number
    values: []
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null, // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: 1,
    values: []
  })
})

const label = computed(() => {
  if (props.field.lang) {
    return props.field?.lang[nowLang.value]
  }
  return t(`member.register.${props.field.column_name}`)
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const selectLabel = (label: string) => {
  if (props.field.column_name === "currency") return label
  else return t(`member_customize_column.${label}`)
}
</script>

<style lang="scss" scoped>
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

.form-input {
  ::v-deep(.q-field__control) {
    border-bottom: 1px solid $gray-border-color;
  }
  ::v-deep(.q-field__marginal) {
    color: $primary-gold-color;
  }
}
</style>
