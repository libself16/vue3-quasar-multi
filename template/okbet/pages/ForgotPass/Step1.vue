<template>
  <BannerMember />
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label"></div>
        <div class="title">{{ $t("member.forgotPassword.forgotPassword") }}</div>
      </div>
      <div class="forget-password-type-content form-content">
        <div class="form-item row">
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
        </div>
      </div>

      <div v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" class="forget-password-form">
        <q-form @submit.prevent="forgetPassword">
          <div class="form-content">
            <div class="form-item row">{{ $t("member.forgotPassword.resetPassword") }}</div>

            <div class="form-item row">
              {{ $t("common.tip.forgotPasswordTitle") }}
            </div>
            <div class="form-item row">
              <div class="required-field-info">
                <span class="required-mark required-mark-red">*&nbsp;</span>{{ $t("common.tip.forgotPasswordTip1") }}
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="">
                {{ $t("member.forgotPassword.registeredAccount") }}
                <span class="required-mark">&nbsp;*</span></label
              >
              <div class="field-input w-3/5">
                <q-input
                  bg-color="white"
                  v-model="formData.account"
                  outlined
                  class="form-style"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <div class="form-content"></div>
              <label class="field-label" for=""
                >{{ $t("member.forgotPassword.registeredEmail") }}<span class="required-mark">&nbsp;*</span></label
              >
              <div class="field-input w-3/5">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.email"
                  class="form-style"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <div class="form-item q-pt-sm">
              <div>
                {{ $t("common.tip.forgotPasswordTip2") }}
              </div>
            </div>
            <div class="action-btns row justify-center">
              <q-btn class="submit-btn" text-color="black" type="submit" :loading="isLoading">
                {{ $t("common.btn.submit") }}</q-btn
              >
            </div>
          </div>
        </q-form>
      </div>
      <div v-else class="forget-password-form form-sms">
        <q-form @submit.prevent="forgetPasswordSms">
          <div class="form-content">
            <div class="form-item row">
              {{ $t("common.tip.forgotPasswordTitle2") }}
            </div>
            <div class="form-item block relative w-3/5 mb-3">
              <q-input
                ref="phoneRef"
                bg-color="white"
                v-model="smsData.phone"
                outlined
                :placeholder="$t('placeholder.phoneNumber')"
                class="w-full"
                lazy-rules
                :rules="[Rules.required()]"
                unmasked-value
              >
              </q-input>
            </div>
            <div class="form-item block relative w-3/5 mb-3">
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
              <q-btn id="btn-otp" class="otp-btn" :disable="!smsData.phone || counting" @click="getOtpCode">
                {{ $t("common.btn.otp") }}</q-btn
              >
            </div>
            <div class="action-btns row justify-center">
              <q-btn text-color="black" class="submit-btn" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
            </div>
          </div>
        </q-form>
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
import BannerMember from "app/template/okbet/components/BannerMember.vue"
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
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/okbet/assets/css/_variable.sass'

.forget-password-layout
  padding-top: 3rem
  +iphone-width
    padding-top: 0
  .forget-password-content
    color: $text-light-color
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    border-radius: .5rem
    background: $background-eclipse-gray-color
    +iphone-width
      margin-top: 0
      padding: 0
      background: $background-midnight-gray-color
    .forget-password-title-content
      margin-top: 2.5rem
      padding: 0 2.5rem
    .forget-password-type-content
      margin-top: 2.5rem
      padding: 0 2.5rem
      +iphone-width
        width: 80%
        margin: 1rem auto 0
        padding: 1rem 1.5rem
        background: $background-eclipse-gray-color
        border-radius: .5rem .5rem 0 0
    .forget-password-form
      width: 100%
      border-radius: .5rem
      padding: 2rem 2.5rem
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        +iphone-width
          width: 80%
          margin: 0 auto 1rem
          padding: 1rem 1.5rem
          background: $background-eclipse-gray-color
          border-radius: 0 0 .5rem .5rem
        .form-item
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .otp-btn
            background: $yellow-active
            color: $text-dark-color
            &:hover
              background: linear-gradient(0deg, rgba($background-light-color, 0.20) 0%, rgba($background-light-color, 0.20) 100%), $yellow-active
.form-sms
  .counting-text
    text-align: center
    position: absolute
    top: 0.55rem
    right: 0.7rem
    height: 2.375rem
    width: 5.625rem
    margin-left: 0
    font-size: 1rem
    line-height: 2.375rem
    white-space: nowrap
    color: $text-dark-color
    opacity: .6
  #btn-otp
    position: absolute
    top: .5rem
    right: -7.15rem
    height: 2.375rem
    width: 5.625rem
    font-size: 1rem
    line-height: 2.375rem
    padding: 0
    text-transform: none
    white-space: nowrap
</style>
