<template>
  <div class="phone-group" v-if="countryFiled || phoneFiled">
    <q-select
      v-if="countryFiled"
      v-model="inputCountry"
      :options="countryFiled.values || []"
      emit-value
      map-options
      outlined
      lazy-rules
      clearable
      :display-value="inputCountry ? undefined : countryLabel"
      :rules="countryFiled.required ? [Rules.required()] : [Rules.noRule]"
      :option-value="(opt) => opt.value"
      :option-label="(opt) => opt.label"
      :dense="true"
      class="form-input pb-4 country"
    >
    </q-select>
    <q-input
      v-if="phoneFiled"
      v-model="inputPhone"
      :rules="phoneFiled.required ? [Rules.required()] : [Rules.noRule]"
      lazy-rules
      outlined
      class="form-input pb-4 phone"
      :placeholder="
        phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`)
      "
      :disable="phoneDisable"
      inputmode="numeric"
    />
  </div>
</template>

<script setup lang="ts">
import * as Response from "src/api/response.type"
import { useI18n } from "vue-i18n"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, ref } from "vue"

const { t } = useI18n()
const Rules = useRule()
const { nowLang } = useLanguage()
const { handleRegisterCustomInput } = useAuth()

interface Field {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: []
}

interface Props {
  phone: any
  country: any
  class?: string
  phoneDisable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  phone: "",
  country: null,
  phoneDisable: false
})

const emit = defineEmits(["update:phone", "update:country"])

const customInputList = ref<Response.RegistInputCustomList>([])

const phoneFiled = ref<Field>()

const countryFiled = ref<Field>()

const countryLabel = computed(() => {
  return countryFiled.value?.lang[nowLang.value]
    ? countryFiled.value?.lang[nowLang.value]
    : t(`member.register.${countryFiled.value?.column_name}`)
})

const inputPhone = computed({
  get: () => props.phone,
  set: (value: number) => emit("update:phone", value)
})

const inputCountry = computed({
  get: () => props.country,
  set: (value: number) => emit("update:country", value)
})

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  countryFiled.value = customInputList.value.filter((field) => field.column_name === "country")[0]
  phoneFiled.value = customInputList.value.filter((field) => field.column_name === "phone")[0]
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r023/assets/css/form.scss"

.form-input
  +pad-large-width
    margin: 0
    padding-left: 0
    padding-right: 0
  ::v-deep(.q-field__inner)
    border: none
    .q-field__control
      height: 40px
    .q-field__append
      height: 40px

.phone-group
  display: flex
  justify-content: space-between
  align-content: center
  +pad-large-width
    padding: 0 0.75rem

  .country
    flex-grow: 2
  .phone
    flex-grow: 1
  +pad-large-width
    width: 100%
    margin-bottom: 0.5rem
    position: relative
</style>
