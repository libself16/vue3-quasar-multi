<template>
  <div class="phone-wrapper">
    <q-form @submit.prevent="forgetPasswordSms">
      <div class="mb-2">
        {{ $t("common.tip.forgotPasswordTitle2") }}
      </div>
      <div class="field-input flex">
        <q-input
          ref="phoneRef"
          rounded
          outlined
          v-model="smsData.phone"
          :label="$t('placeholder.phoneNumber')"
          bg-color="white"
          color="black"
          class="input-style"
          lazy-rules
          :rules="[(val) => Rules.phone(val)]"
          :mask="Rules.phoneMask"
          unmasked-value
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-phone" class="text-black ml-2" />
          </template>
        </q-input>
        <q-btn class="otp-btn" :disable="!smsData.phone || counting" @click="getOtpCode">
          {{ $t("common.btn.otp") }}</q-btn
        >
      </div>
      <div class="field-input flex items-center">
        <q-input
          rounded
          outlined
          v-model="smsData.sms_otp"
          :label="$t('placeholder.enterOTP')"
          bg-color="white"
          color="black"
          class="input-style"
          lazy-rules
          :rules="[Rules.required()]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-shield-alt" class="text-black ml-2" />
          </template>
        </q-input>
        <vue-countdown
          @end="counting = false"
          v-if="counting"
          :time="180000"
          v-slot="{ totalSeconds }"
          class="counting-text"
          >{{ `${totalSeconds}s` }}</vue-countdown
        >
      </div>
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleForgetPasswordSms, handleGetOTP } = useAuth()

const smsData = reactive({
  phone: "",
  sms_otp: ""
})
const phoneRef = ref()
const counting = ref(false)

const getOtpCode = async () => {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top"
    })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: smsData.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

const forgetPasswordSms = async () => {
  const { status, data } = await handleForgetPasswordSms(smsData)

  if (!status || !data || !data.token) return

  router.push({
    name: "QuickPassword",
    params: {
      account: smsData.phone,
      token: data.token
    }
  })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/main.scss";
</style>
