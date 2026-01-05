<template>
  <q-select
    v-model="inputValue"
    :options="field.values || []"
    v-bind="attrs"
    emit-value
    map-options
    :display-value="inputValue ? undefined : field.edit ? $t('placeholder.pleaseEnter2') : ''"
    :rules="field.required ? [Rules.required()] : []"
    lazy-rules
    :class="attrs.class"
    :disable="!field.edit"
    :dark="isDark"
  >
  </q-select>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue"
import { useRule } from "src/common/hooks/useRule"
import { INPUT_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"
import type * as Response from "src/api/response.type"

const attrs = useAttrs()
const Rules = useRule()
const { isDark } = useEnv()

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
    type: INPUT_TYPE.Enums
    values: Response.BaseListType[]
    column_label?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null, // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: INPUT_TYPE.Enums.SELECT,
    values: []
  })
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})
</script>
