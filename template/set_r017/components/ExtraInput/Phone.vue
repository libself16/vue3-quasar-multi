<template>
  <div class="phone-group" v-if="countryFiled || phoneFiled">
    <div v-if="countryFiled" class="form-input-container">
      <div class="form-input-label">{{ $t("member.register.country") }}</div>
      <q-select
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
    </div>

    <div v-if="phoneFiled" class="form-input-container flex-1">
      <div class="form-input-label">
        {{ phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`) }}
      </div>
      <q-input
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
  </div>
</template>

<script setup lang="ts">
import * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

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
.form-input-container
  min-width: 8rem
  .form-input-label
    color: var(--neutral-04)
    font-size: 0.875rem
    font-weight: 700
    margin-bottom: 0.25rem

.form-input
  ::v-deep(.q-field__inner)
    height: fit-content
    border-radius: 4px
    border: 2px solid var(--neutral-05)
    background: var(--secondary-10)
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5)
    .q-field__native
      color: #a6b1c3 !important
    .q-field__control
      color: var(--primany-01)
      height: 40px
    .q-field__append
      color: #a6b1c3 !important
      height: 40px

.phone-group
  display: flex
  justify-content: space-between
  align-content: center
  gap: 0.5rem
  .country
    flex-grow: 2
  .phone
    flex-grow: 1
</style>
