<template>
  <q-select
    v-model="inputValue"
    :options="field.values || []"
    emit-value
    map-options
    bg-color="white"
    outlined
    lazy-rules
    clearable
    class="form-input pb-0"
    :class="{ 'mb-3': field.required, 'mb-8': !field.required }"
    :rules="field.required ? [Rules.required()] : []"
    :label="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    :option-value="opt => opt.value"
    :option-label="opt => selectLabel(opt.label)"
    :dense="true"
  >
  </q-select>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage";
import { useRule } from "src/common/hooks/useRule";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const Rules = useRule()
const { nowLang } = useLanguage()

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
    values: Array<{ value: number | string, label: string }>
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null, // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: '',
    customize: false,
    edit: false,
    required: false,
    type: 1,
    values: []
  })
})


const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const selectLabel = (label: string) => {
  if (props.field.column_name === 'currency') return label
  else return t(`member_customize_column.${label}`)
}
</script>
