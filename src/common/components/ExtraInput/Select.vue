<template>
  <q-select
    v-model="inputValue"
    :options="field.values || []"
    emit-value
    map-options
    outlined
    lazy-rules
    :clearable="!field.is_required"
    behavior="menu"
    dense
    :display-value="displayValue"
    :placeholder="$t(`bank_column.${field.field_code}`)"
    :rules="[Rules.requiredInt]"
    :class="inputClasses"
    v-bind="attrs"
  >
    <template v-slot:option="scope" v-if="props.optionStyle">
      <q-item v-bind="scope.itemProps" :class="props.optionStyle">
        <q-item-section>
          <q-item-label :class="props.optionStyle">{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useRule } from "src/common/hooks/useRule"
import { computed, useAttrs, onMounted } from "vue"

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
    values: Array<{ label: string; value: any }>
  }
  optionStyle: string
}

const props = withDefaults(defineProps<Props>(), {
  optionStyle: () => ""
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const inputClasses = computed(() => {
  const baseClasses = []
  if (props.styleVariant === "custom") {
    baseClasses.push("extra-select--custom")
  } else {
    baseClasses.push("extra-select--default")
  }
  return baseClasses.join(" ")
})

const displayValue = computed(() => {
  if (!inputValue.value || !Array.isArray(props.field.values)) {
    return ""
  }

  const selectedOption = props.field.values.find((option) => option.value === inputValue.value)
  return selectedOption ? selectedOption.label : ""
})

onMounted(() => {
  // 若為必填則預設帶入第一個選項
  if (
    props.field.is_required &&
    Array.isArray(props.field.values) &&
    props.field.values.length > 0 &&
    !inputValue.value
  ) {
    const firstValue = props.field.values[0]
    if (firstValue && typeof firstValue.value !== "undefined") {
      inputValue.value = firstValue.value
    }
  }
})
</script>

<style lang="scss" scoped>
.extra-select--custom {
  :deep(.q-field__control::before) {
    border: 1px solid #ffffff47;
    border-radius: 0.375rem;
  }

  :deep(.q-field__native input) {
    color: #fff !important;
  }
}
</style>
