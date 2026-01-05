<template>
  <div class="input-container">
    <q-input
      v-model="inputValue"
      :rules="field.required ? [Rules.required()] : []"
      lazy-rules
      bg-color="white"
      outlined
      class="mb-2"
      readonly
      :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="inputValue" mask="YYYY-MM-DD" minimal color="primary" :options="dateOptions">
              <div class="row items-center justify-end">
                <q-btn v-close-popup :label="t('common.btn.confirm')" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage"
import { useRule } from "src/common/hooks/useRule"
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const Rules = useRule()
const { nowLang } = useLanguage()
const { t } = useI18n()

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
  minAge?: number // 最小年龄限制，默认为18岁
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
  }),
  minAge: 0 // 默认最小年龄为18岁
})

const emit = defineEmits(["update:modelValue"])

// 计算最小可选日期（当前日期减去最小年龄）
const minSelectableDate = computed(() => {
  const today = new Date()
  const minDate = new Date(today)
  minDate.setFullYear(today.getFullYear() - props.minAge)
  // 格式化为 YYYY/MM/DD 格式
  const year = minDate.getFullYear()
  const month = String(minDate.getMonth() + 1).padStart(2, "0")
  const day = String(minDate.getDate()).padStart(2, "0")
  return `${year}/${month}/${day}`
})

// 日期选择限制函数
const dateOptions = (date: string) => {
  // 如果 minAge 为 0，则不限制日期选择范围
  if (props.minAge === 0) {
    return true
  }
  return date <= minSelectableDate.value
}

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})
</script>

<style lang="sass" scoped>
@import "app/template/okbet_green/assets/css/button.scss"

.form-input
  ::v-deep(.q-field__inner)
    .q-field__control
      height: 40px
      .q-field__append
        height: auto
</style>
