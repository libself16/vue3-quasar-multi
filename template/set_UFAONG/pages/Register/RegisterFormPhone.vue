<template>
  <div class="phone-register-tip">
    {{ $t("common.tip.enter_phone_tip") }}
  </div>
  <q-form @submit.prevent="registerSms">
    <div class="field-input flex">
      <q-input
        ref="phoneRef"
        rounded
        outlined
        v-model="formSms.phone"
        :label="$t('placeholder.phoneNumber')"
        bg-color="white"
        color="black"
        class="input-style"
        lazy-rules
        :rules="[Rules.noRule]"
        unmasked-value
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-phone" class="text-black ml-2" />
        </template>
      </q-input>
      <q-btn class="otp-btn" :disable="!formSms.phone || counting" @click="getOtpCode">
        {{ $t("common.btn.otp") }}</q-btn
      >
    </div>
    <div class="field-input flex items-center">
      <q-input
        rounded
        outlined
        v-model="formSms.sms_otp"
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
      <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!agreeTerms">
        {{ $t("common.btn.register") }}</q-btn
      >
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
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"

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

const formSms = reactive<Request.RegisterSms>({
  register_method: REGISTER_METHOD.Enums.Phone,
  phone: "",
  sms_otp: ""
})

const getOtpCode = async () => {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top"
    })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: formSms.phone })
  if (status) {
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
@import "../../assets/css/variable.scss";
@import "src/common/css/_variable.sass";
@import "../../assets/css/main.scss";

.input-style {
  @apply w-10/12;

  @include phone-width {
    @apply w-8/12;
  }
}

.phone-register-tip {
  @apply mb-2 ml-2;
  color: $primary;
}

.skip-enter {
  color: $primary;
  font-size: 0.875rem;
}
</style>
