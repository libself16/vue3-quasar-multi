<template>
  <div class="sms-container">
    <q-input
      v-model="inputValue"
      class="form-input flex-1"
      bg-color="white"
      :rules="field.required ? [Rules.required()] : []"
      :placeholder="field.lang[nowLang] ? field.lang[nowLang] : $t(`member.register.${field.column_name}`)"
      dense
      borderless
      lazy-rules
      unmasked-value
      no-error-icon
      hide-bottom-space
    />
    <!-- 倒數秒數 -->
    <q-btn v-if="counting" class="btn-submit" flat borderless disable>
      <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
        {{ `${totalSeconds}S` }}
      </vue-countdown>
    </q-btn>
    <q-btn
      v-else
      class="btn-submit"
      :label="$t('common.btn.send')"
      @click="getOtpCode"
      :disable="isLoading || !phone || !country"
    />
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useQuasar } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { GetOTP } from "src/api/request.type"
import { SMS_OTP_TYPE } from "src/common/utils/constants"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

const Rules = useRule()
const { isLoading, handleGetOTP } = useAuth()
const { nowLang } = useLanguage()

const counting = ref(false)
const $q = useQuasar()
const { t } = useI18n()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  phone: string
  country: string
  field: {
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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  phone: "",
  country: "",
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    lang: {},
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
  const payload: GetOTP = {
    phone_number: props.phone,
    country_code: props.country,
    request_type: SMS_OTP_TYPE.Enums.Register
  }
  const { status } = await handleGetOTP(payload)
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.sms-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 0.625rem;

  .btn-submit {
    @apply flex items-center justify-center mx-auto;
    @include fontStyle(0.875rem, 400);

    border-radius: 0.5rem;
    background: $gradient01;
    color: $neutral01;
    margin-left: 0.5rem;
    width: 5.625rem;
    height: 2.5rem;

    &.btns-sms {
      margin-top: 1.5rem;

      @include phone-width() {
        margin-top: 2rem;
      }
    }
  }
}
</style>
