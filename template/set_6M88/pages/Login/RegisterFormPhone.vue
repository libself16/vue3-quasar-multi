<template>
  <div class="phone-register-tip">
    {{ $t("common.tip.enter_phone_tip") }}
  </div>
  <q-form @submit.prevent="registerSms" autocomplete="new-password">
    <div class="login-form-box">
      <q-select
        rounded
        class="custom-input"
        :disable="isLoading"
        outlined
        v-model="country"
        :options="countryCode"
        lazy-rules
        :rules="[Rules.required()]"
        :label="$t('member.register.country')"
      />
      <q-input
        ref="phoneRef"
        rounded
        outlined
        v-model="formSms.phone"
        :label="$t('placeholder.phoneNumber')"
        class="custom-input"
        lazy-rules
        :rules="[Rules.required()]"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-phone" />
        </template>
      </q-input>

      <div class="login-btn-wrap">
        <div class="login-btn-btm">
          <q-btn
            class="login-btn"
            size=".75rem"
            padding=".5rem 0"
            unelevated
            no-caps
            :disable="!formSms.phone || counting"
            @click="getOtpCode"
          >
            {{ $t("common.btn.otp") }}</q-btn
          >
        </div>
      </div>
    </div>
    <div class="login-form-box">
      <q-input
        rounded
        outlined
        v-model="formSms.sms_otp"
        :label="$t('placeholder.enterOTP')"
        class="custom-input"
        lazy-rules
        :rules="[Rules.required()]"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-shield-alt" />
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

    <div class="login-btn-wrap">
      <div class="login-btn-btm">
        <q-btn
          class="login-btn"
          size=".75rem"
          padding=".5rem 0"
          unelevated
          no-caps
          type="submit"
          :loading="isLoading"
          :disabled="!agreeTerms"
        >
          {{ $t("common.btn.register") }}</q-btn
        >
        <q-btn
          class="text-[#005f79]"
          @click="router.push({ name: 'Home' })"
          size=".75rem"
          padding=".5rem 0"
          unelevated
          no-caps
        >
          Skip & Enter
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"

import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()

const { isLoading, handleRegisterSms, handleLogin, handleGetOTP } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const phoneRef = ref()
const counting = ref(false)
const agreeTerms = ref(true)

const countryCode = ref(["+84"])
const country = ref("")
const formSms = reactive<Request.RegisterSms>({
  register_method: REGISTER_METHOD.Enums.Phone,
  phone: "",
  sms_otp: ""
})

const getOtpCode = async () => {
  // phoneRef.value.validate()

  // if (phoneRef.value.hasError) {
  //   return $q.notify({
  //     type: "negative",
  //     message: t("common.validate.verificationError"),
  //     position: "top"
  //   })
  // }

  const { status } = await handleGetOTP({
    phone_number: formSms.phone,
    country_code: country.value,
    request_type: SMS_OTP_TYPE.Enums.Register
  })
  if (status) {
    counting.value = true
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

const registerSms = async () => {
  const { status } = await handleRegisterSms(formSms)
  if (!status) {
    return
  }
  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formSms.phone,
    sms_otp: formSms.sms_otp
  }
  await login(payload)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await getUserWalletList()
  await getUserInfo()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "Home" })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/custom.scss";
@import "../../assets/css/_variable.scss";

.phone-register-tip {
  @apply text-xs mb-2 text-center;
  color: $primary;
}

.counting-text {
  @apply text-sm text-center block my-4;
  color: $primary;
}
</style>
