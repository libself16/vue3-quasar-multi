<template>
  <div class="form-input-container">
    <div class="form-input-label">
      {{ field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`) }}
    </div>
    <q-input
      v-model="inputValue"
      :rules="field.required ? [Rules.required()] : []"
      lazy-rules
      outlined
      class="pb-4"
      :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    >
      <q-menu>
        <q-date v-model="inputValue" mask="YYYY-MM-DD" minimal color="primary" />
      </q-menu>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage"
import { useRule } from "src/common/hooks/useRule"
import { computed } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
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
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
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
    .q-field__control
      height: 40px
</style>
