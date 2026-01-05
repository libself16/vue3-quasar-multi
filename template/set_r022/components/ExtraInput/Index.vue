<template>
  <q-input
    v-model="inputValue"
    :rules="
      field?.column_rule?.enabled
        ? [
            (val) =>
              checkCustomRule({
                val,
                Rules,
                column_rule: field?.column_rule ? field.column_rule : DEFAULT_CUSTOM_COLUMN_RULE,
                column_name: field.column_name
              }),
            Rules.noWhitespace()
          ]
        : field.required
        ? [Rules.required()]
        : []
    "
    lazy-rules
    class="form-input mb-2"
    :class="{ 'pb-4': !field.required }"
    :type="hiddenColumn(field.column_name) && !showPassword ? 'password' : 'text'"
    :placeholder="
      customPlaceholder
        ? customPlaceholder
        : field?.lang?.[nowLang]
        ? field?.lang?.[nowLang]
        : $t(`member.register.${field.column_name}`)
    "
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
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule, CustomColumnRuleType, DEFAULT_CUSTOM_COLUMN_RULE } from "src/common/hooks/useRule"
import { computed, ref } from "vue"
import { checkCustomRule } from "src/common/utils/customRulesUtils"
import * as Response from "src/api/response.type"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  field: Response.RegistInputCustom
  customPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    column_rule: {
      ...DEFAULT_CUSTOM_COLUMN_RULE
    },
    customize: false,
    edit: false,
    lang: {},
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
.form-input
  ::v-deep(.q-field__inner)
    .q-field__control
      height: 40px
      .q-field__append
        height: 100%
</style>
