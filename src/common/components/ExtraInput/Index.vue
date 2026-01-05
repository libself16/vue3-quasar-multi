<template>
  <q-input
    v-model="inputValue"
    :rules="field.is_required ? [Rules.required()] : []"
    lazy-rules
    outlined
    :class="inputClasses"
    :placeholder="$t(`bank_column.${field.field_code}`)"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import { useRule } from "src/common/hooks/useRule"
import { computed, useAttrs } from "vue"

const Rules = useRule()
const attrs = useAttrs()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  styleVariant?: "default" | "custom"
  field: {
    field_code: string
    field_name: string
    is_required: boolean
    type: number
    values: [] | null
  }
}

const props = defineProps<Props>()

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const inputClasses = computed(() => {
  const baseClasses = ["mb-2"]
  if (props.styleVariant === "custom") {
    baseClasses.push("extra-input--custom")
  } else {
    baseClasses.push("extra-input--default")
  }
  return baseClasses.join(" ")
})
</script>

<style lang="scss" scoped>
.extra-input--custom {
  :deep(.q-field__control::before) {
    border: 1px solid #ffffff47;
    border-radius: 0.375rem;
  }

  :deep(.q-field__native) {
    color: #fff !important;
  }

  :deep(.q-field__native input) {
    color: #fff !important;
  }

  :deep(.q-field__label) {
    color: #fff !important;
  }

  :deep(.q-field--focused .q-field__label) {
    color: #fff !important;
  }

  :deep(.q-field__control input) {
    color: #fff !important;
  }

  :deep(.q-field__control input::placeholder) {
    color: rgba(255, 255, 255, 0.7) !important;
  }
}
</style>
