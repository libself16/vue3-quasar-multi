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
    :borderless="!isMobile"
    class="form-input mb-2"
    :class="{ 'pb-4': !field.required }"
    :type="hiddenColumn(field.column_name) && !showPassword ? 'password' : 'text'"
    :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    autocomplete="new-password"
  >
    <template #append v-if="hiddenColumn(field.column_name)">
      <q-icon
        class="eye-icon"
        :name="showPassword ? 'visibility' : 'visibility_off'"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()
const { isMobile } = useMediaQuery()

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

const showPassword = ref(false)
</script>

<style lang="sass" scoped>
@import "app/template/okbet_blackGold/assets/css/_variable.sass"

.form-input
  :deep(.q-field__inner)
    .q-field__control
      height: 2.5rem
      .q-field__append
        height: 100%
  :deep(.q-field__control)
    &:before
      border-bottom: 1px solid $gray-border-color
</style>
