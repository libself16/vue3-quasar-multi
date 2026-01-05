<template>
  <div class="form-input-container">
    <div class="form-input-label">
      {{ field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`) }}
    </div>
    <q-select
      v-model="inputValue"
      :options="field.values || []"
      emit-value
      map-options
      outlined
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
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage"
import { useRule } from "src/common/hooks/useRule"
import { computed } from "vue"
import { useI18n } from "vue-i18n"

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

<style lang="sass" scoped>
.form-input-container
  min-width: 8rem
  height: fit-content !important
  .form-input-label
    color: var(--neutral-04)
    font-size: 0.875rem
    font-weight: 700
    margin-bottom: 0.25rem

.form-input
  ::v-deep(.q-field__inner)
    height: fit-content
    border-radius: 4px
    border: 2px solid var(--neutral-05)
    background: var(--secondary-10)
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5)
    .q-field__native
      color: #a6b1c3 !important
    .q-field__control
      height: 40px
      color: var(--primany-01)
    .q-field__append
      height: 40px
      > i
        color: #a6b1c3
</style>
