<template>
  <div class="phone-group">
    <q-select
      v-if="countryFiled"
      v-model="inputCountry"
      :options="countryFiled.values || []"
      emit-value
      map-options
      bg-color="white"
      outlined
      lazy-rules
      clearable
      :rules="countryFiled.required ? [Rules.required()] : []"
      :label="
        countryFiled?.lang[nowLang] ? countryFiled?.lang[nowLang] : $t(`member.register.${countryFiled.column_name}`)
      "
      :option-label="(opt) => opt.value"
      :dense="true"
      class="form-input country pb-0"
      :class="{ 'mb-3': countryFiled.required, 'mb-8': !countryFiled.required }"
    >
    </q-select>
    <q-input
      v-if="phoneFiled"
      v-model="inputPhone"
      :rules="phoneFiled.required ? [Rules.required()] : []"
      lazy-rules
      bg-color="white"
      outlined
      class="form-input phone"
      :class="{ 'mb-3': phoneFiled.required, 'mb-8': !phoneFiled.required }"
      :placeholder="
        phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`)
      "
    />
  </div>
</template>

<script setup lang="ts">
import * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, ref } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()
const { handleRegisterCustomInput } = useAuth()

interface Field {
  column_name: string
  customize: boolean
  edit: boolean
  lang?: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: Array<{ value: number | string; label: string }>
}

interface Props {
  phone: any
  country: any
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  phone: "",
  country: null
})

const emit = defineEmits(["update:phone", "update:country"])

const customInputList = ref<Response.RegistInputCustomList>([])

const phoneFiled = ref<Field>()

const countryFiled = ref<Field>()

console.log(phoneFiled)

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

.form-input
  ::v-deep(.q-field__inner)
    height: 40px
    .q-field__control
      height: 100%
    .q-field__append
      height: 100%

.phone-group
  display: flex
  justify-content: space-between
  align-content: center
  ::v-deep(.q-field--with-bottom)
    +iphone-width
      padding: 0
  .country
    flex-grow: 1
  .phone
    flex-grow: 3
  +iphone-width
    width: 100%
    margin-bottom: 0.5rem
    position: relative
</style>
