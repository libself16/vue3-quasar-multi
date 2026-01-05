<template>
  <q-form @submit.prevent="registerSms">
    <div class="field-input flex">
      <q-input
        ref="phoneRef"
        v-model="formSms.phone"
        :label="$t('placeholder.phoneNumber')"
        rounded
        dense
        borderless
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
    </div>
    <div class="get-otp-wrapper">
      <q-btn class="otp-btn" :disable="!formSms.phone || counting" @click="getOtpCode">
        {{ $t("common.btn.otp") }}</q-btn
      >
      <vue-countdown
        @end="counting = false"
        v-if="counting"
        :time="180000"
        v-slot="{ totalSeconds }"
        class="counting-text"
        >{{ `${totalSeconds}s` }}</vue-countdown
      >
    </div>
    <div class="field-input flex items-center">
      <q-input
        v-model="formSms.sms_otp"
        :label="$t('placeholder.enterOTP')"
        rounded
        dense
        borderless
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
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"

import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
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
  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/form.scss";

.input-style {
  @apply w-10/12;
}

.get-otp-wrapper {
  @apply flex items-center gap-2 mb-4;

  .otp-btn {
    @apply text-white rounded-[.625rem];
    background: $primary-color-light;
  }
}
</style>
