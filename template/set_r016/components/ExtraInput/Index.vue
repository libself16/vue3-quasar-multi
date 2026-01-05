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
        : isRequired(field.required)
    "
    bg-color="white"
    class="form-input"
    :type="typeText"
    :placeholder="
      customPlaceholder
        ? customPlaceholder
        : field?.lang?.[nowLang]
        ? field?.lang?.[nowLang]
        : $t(`member.register.${field.column_name}`)
    "
    dense
    borderless
    lazy-rules
    unmasked-value
    no-error-icon
    hide-bottom-space
  >
    <template v-if="showIcon" #prepend>
      <div class="form-icon">
        <img :src="svgIcon(hiddenColumn(field.column_name) ? 'password-gray' : 'account-gray')" alt="icon" />
      </div>
      <div class="divider" />
    </template>
    <template v-if="hiddenColumn(field.column_name)" #append>
      <q-icon
        class="eye-icon"
        :name="showPassword ? 'visibility' : 'visibility_off'"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule, DEFAULT_CUSTOM_COLUMN_RULE } from "src/common/hooks/useRule"
import { checkCustomRule } from "src/common/utils/customRulesUtils"
import * as Response from "src/api/response.type"

const Rules = useRule()
const { nowLang } = useLanguage()
const { svgIcon } = useSiteImg()
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
const showPassword = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const typeText = computed(() => {
  if (hiddenColumn(props.field.column_name)) return showPassword.value ? "text" : "password"
  return "text"
})

const showIcon = computed(() => {
  const item = props.field.column_name
  return item === "account" || item === "password" || item === "confirm_password"
})

const isRequired = (required: boolean) => {
  return required ? [Rules.required(), Rules.noWhitespace()] : [Rules.noWhitespace()]
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
</style>
