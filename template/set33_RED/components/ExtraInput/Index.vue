<template>
  <q-input
    v-model="inputValue"
    :rules="
      field.column_name === 'account'
        ? [Rules.required(), Rules.noWhitespace()]
        : field.required
        ? [Rules.required()]
        : []
    "
    lazy-rules
    bg-color="white"
    outlined
    class="form-input"
    :type="hiddenColumn(field.column_name) ? 'password' : 'text'"
    :class="{ 'mb-3': field.required, 'mb-8': !field.required }"
    :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
  />
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage";
import { useAuth } from "src/common/hooks/useAuth";
import { useRule } from "src/common/hooks/useRule";
import { computed } from 'vue';


const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()

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
    values: Array<{ value: number | string, label: string }>
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '', // 欄位為動態, 無法預先定義
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

</script>

<style lang="sass" scoped>
.form-input
  ::v-deep(.q-field__inner)
    .q-field__control
      height: 40px
</style>
