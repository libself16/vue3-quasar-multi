<template>
  <div class="input-container">
    <q-input
      v-model="inputValue"
      :rules="field.required ? [Rules.required()] : []"
      lazy-rules
      bg-color="white"
      outlined
      class="mb-2"
      :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    >
      <q-menu>
        <q-date v-model="inputValue" mask="YYYY-MM-DD" minimal color="primary" />
      </q-menu>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage";
import { useRule } from "src/common/hooks/useRule";
import { computed } from 'vue';


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
