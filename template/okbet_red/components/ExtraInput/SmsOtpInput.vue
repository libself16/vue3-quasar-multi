<template>
  <div class="sms-container">
    <q-input
      v-model="inputValue"
      :rules="field.required ? [Rules.required()] : []"
      class="form-input"
      :class="{ 'pb-4': !field.required }"
      outlined
      :placeholder="field?.lang[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
      lazy-rules
    >
      <template #prepend>
        <div class="divider-error"></div>
        <div class="form-icon">
          <img :src="svgIcon('shield')" alt="verify-code" />
        </div>
        <div class="divider"></div>
      </template>
    </q-input>
    <!-- 倒數秒數 -->
    <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
      <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
        {{ `${totalSeconds}S` }}
      </vue-countdown>
    </q-btn>
    <q-btn
      v-else
      color="primary"
      class="btn-send hide-hover"
      :label="$t('common.btn.send')"
      @click="getOtpCode"
      :disable="isLoading || !phone"
    />
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

const Rules = useRule()
const { svgIcon } = useSiteImg()
const { isLoading, handleGetOTP } = useAuth()
const { nowLang } = useLanguage()

const counting = ref(false)
const $q = useQuasar()
const { t } = useI18n()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  phone: string
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
  phone: "",
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
  set: (value: string) => emit("update:modelValue", value)
})

async function getOtpCode() {
  // phoneRef.value.validate()
  // if (phoneRef.value.hasError) {
  //   return $q.notify({
  //     type: "negative",
  //     message: t("common.validate.verificationError"),
  //     position: "top"
  //   })
  // }
  counting.value = true
  const { status } = await handleGetOTP({ phone: props.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.q-field--with-bottom
  padding-bottom: 0

.sms-container
  display: flex
  align-items: flex-start
  justify-content: space-between
  margin-top: 3px
  height: 3.75rem
  +iphone-width
    width: 100%
    margin-top: 0px
    margin-bottom: 0.5rem
    padding: 1rem 0.75rem 0.5rem
  .form-input
    width: 18.875rem
    padding-left: 0
    padding-right: 0
    ::v-deep(.q-field__inner)
      .q-field__control
        height: 2.5rem
      .q-field__marginal
        height: 100%
  .btn-send
    margin-left: .5rem
    width: 5.625rem
    height: 2.5rem
</style>
