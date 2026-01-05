<template>
  <div class="reg-area">
    <div class="con-info mt-10">
      <div class="con">
        <div class="title">{{ $t("member.forgotPassword.forgotPassword") }}</div>
        <q-btn-toggle
          v-if="isPhoneRegisterMode"
          v-model="forgetMethod"
          toggle-color="primary"
          flat
          :options="[
            {
              label: $t('common.btn.emailVerification'),
              value: FORGOT_PASS_METHOD.Enums.Email
            },
            { label: $t('common.btn.smsVerification'), value: FORGOT_PASS_METHOD.Enums.Sms }
          ]"
        />
        <div v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" class="form-validation">
          <q-form class="modal-form px-4" @submit.prevent="forgetPassword">
            <div class="area-title">{{ $t("member.forgotPassword.resetPassword") }}</div>

            <div class="area-description">
              {{ $t("common.tip.forgotPasswordTitle") }}
            </div>
            <div class="area-description">
              <div class="required-field-info">
                <span class="required-mark required-mark-red">*&nbsp;</span>{{ $t("common.tip.forgotPasswordTip1") }}
              </div>
            </div>
            <div class="input-area">
              <label class="field-label" for="">
                {{ $t("member.forgotPassword.registeredAccount") }}
                <span class="required-mark">&nbsp;*</span></label
              >
              <div class="field-input">
                <q-input
                  bg-color="white"
                  v-model="formData.account"
                  outlined
                  class="form-style"
                  lazy-rules
                  :rules="[(val) => Rules.account(val)]"
                />
              </div>
            </div>
            <div class="input-area">
              <label class="field-label" for=""
                >{{ $t("member.forgotPassword.registeredEmail") }}<span class="required-mark">&nbsp;*</span></label
              >
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.email"
                  class="form-style"
                  lazy-rules
                  :rules="[Rules.email]"
                />
              </div>
            </div>
            <div class="form-content q-pt-sm">
              <div>
                {{ $t("common.tip.forgotPasswordTip2") }}
              </div>
            </div>
            <div class="input-area q-pt-md">
              <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
            </div>
          </q-form>
        </div>
        <div v-else class="form-validation form-sms">
          <q-form class="modal-form px-4" @submit.prevent="forgetPasswordSms">
            <div class="area-description">
              {{ $t("common.tip.forgotPasswordTitle2") }}
            </div>
            <div class="block relative w-4/5 mb-3">
              <q-input
                ref="phoneRef"
                bg-color="white"
                v-model="smsData.phone"
                outlined
                :placeholder="$t('placeholder.phoneNumber')"
                class="w-full"
                lazy-rules
                :rules="[Rules.noRule]"
                unmasked-value
              >
              </q-input>
            </div>
            <div class="block relative w-4/5 mb-3">
              <q-input
                bg-color="white"
                v-model="smsData.sms_otp"
                outlined
                :placeholder="$t('placeholder.enterOTP')"
                class="w-full"
                lazy-rules
                :rules="[Rules.required()]"
              />
              <vue-countdown
                @end="counting = false"
                v-if="counting"
                :time="180000"
                v-slot="{ totalSeconds }"
                class="counting-text"
                >{{ `${totalSeconds}s` }}</vue-countdown
              >
              <q-btn id="btn-otp" class="btn-submit" :disable="!smsData.phone || counting" @click="getOtpCode">
                {{ $t("common.btn.otp") }}</q-btn
              >
            </div>
            <div class="input-area q-pt-md">
              <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useEnv } from "src/common/hooks/useEnv"
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()

const { isPhoneRegisterMode } = useEnv()
const { isLoading, handleForgetPassword, handleForgetPasswordSms, handleGetOTP } = useAuth()

const forgetMethod = ref(FORGOT_PASS_METHOD.Enums.Email)
let formData = reactive<{ account: string; email: string }>({
  account: "",
  email: ""
})
const smsData = reactive({
  phone: "",
  sms_otp: ""
})
const phoneRef = ref()
const counting = ref(false)

async function forgetPassword() {
  const { status } = await handleForgetPassword({
    account: formData.account,
    email: formData.email
  })
  if (!status) {
    return
  }
  $q.notify({
    type: "positive",
    message: t("common.validate.LetterHasBeenSent"),
    position: "top",
    timeout: 1000
  })
}

async function getOtpCode() {
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

async function forgetPasswordSms() {
  const { status, data } = await handleForgetPasswordSms(smsData)

  if (!status || !data || !data.token) return

  router.push({
    name: "QuickPass",
    params: {
      account: smsData.phone,
      token: data.token
    }
  })
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33_RED/assets/css/_variable.sass"
@import "app/template/set33_RED/assets/css/main.sass"

.con
  min-height: 31.25rem

::v-deep(.q-field__messages)
  color: #ed4014
  font-size: 0.9vw
  +pad-width
    font-size: 2vw
  +iphone-width
    font-size: 3.2vw
::v-deep(.q-field__marginal)
  height: 2.375rem
::v-deep(.q-field__control)
  height: 2.375rem
  padding-left: .625rem
  padding-top: 0
  padding-bottom: 0
  .q-field__native
    font-weight: 500
    height: 2.375rem
    &:focus
      color: rgba(28, 30, 34, 0.70)

.area-title
  font-weight: 700
  font-size: 18px
  margin: 10px 0
.area-description
  margin: 10px 0

.form-validation
  margin-top: 25px
  min-width: 950px
  +pad-width
    min-width: 720px
  +iphone-width
    min-width: 100%

.form-sms
  .counting-text
    text-align: center
    position: absolute
    top: 0
    right: 0
    height: 2.375rem
    width: 5.625rem
    margin-left: 0
    font-size: 1rem
    line-height: 2.375rem
    white-space: nowrap
    color: #000
    opacity: .6
  #btn-otp
    position: absolute
    top: 0
    right: -5.625rem
    height: 2.375rem
    width: 5.625rem
    margin-left: 0
    font-size: 1rem
    line-height: 2.375rem
    padding: 0
    text-transform: none
    white-space: nowrap
</style>
