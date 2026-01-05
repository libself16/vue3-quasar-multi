<template>
  <BannerMember />
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label"></div>
        <div class="title">{{ $t("member.forgotPassword.forgotPassword") }}?</div>
      </div>
      <div class="forget-password-type-content form-content">
        <q-btn-toggle
          v-if="isPhoneRegisterMode"
          v-model="forgetMethod"
          toggle-color="white"
          color="grey-5"
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

      <div v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" class="forget-password-form">
        <q-form @submit.prevent="forgetPassword">
          <div class="form-content">
            <div class="form-item">
              <span class="title">
                {{ $t("member.forgotPassword.resetPassword") }}
              </span>
            </div>
            <div class="form-item">
              <span class="tips">
                {{ $t("common.tip.forgotPasswordTitle") }}
              </span>
            </div>
            <div class="form-item row capitalize font-bold">
              <div class="required-field-info">
                <span class="required-mark required-mark-red font-black tips">
                  *&nbsp; {{ $t("common.tip.forgotPasswordTip1") }}
                </span>
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="account">
                {{ $t("member.forgotPassword.registeredAccount") }}
                <span class="required-mark">&nbsp;*</span>
              </label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  v-model="formData.account"
                  outlined
                  class="form-style"
                  lazy-rules
                  :rules="[(val) => Rules.account(val)]"
                  :placeholder="$t('placeholder.pleaseEnterUsername')"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="email"
                >{{ $t("member.forgotPassword.registeredEmail") }}
                <span class="required-mark">&nbsp;*</span>
              </label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.email"
                  class="form-style"
                  lazy-rules
                  :rules="[Rules.email]"
                  :placeholder="$t('placeholder.pleaseEnterEmail')"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="text-tip">
                {{ $t("common.tip.forgotPasswordTip2") }}
              </div>
            </div>
            <div class="btns row justify-center">
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
            <div class="form-item sms">
              <span class="title">
                {{ $t("member.forgotPassword.resetPassword") }}
              </span>
            </div>
            <div class="form-item sms">
              <span class="tips">
                {{ $t("common.tip.forgotPasswordTitle2") }}
              </span>
            </div>
            <div class="form-item">
              <label class="field-label" for="account">
                {{ $t("member.register.phone") }}
                <span class="required-mark">&nbsp;*</span>
              </label>
              <div class="field-input">
                <q-input
                  ref="phoneRef"
                  bg-color="white"
                  v-model="smsData.phone"
                  outlined
                  :placeholder="$t('member.login.phone')"
                  class="form-style sms-style"
                  lazy-rules
                  :rules="[Rules.noRule]"
                  unmasked-value
                >
                </q-input>
              </div>
            </div>
            <div class="form-item relative">
              <label class="field-label" for="account">
                {{ $t("member.login.verificationCode ") }}
                <span class="required-mark">&nbsp;*</span>
              </label>
              <div class="field-input field-sms">
                <q-input
                  bg-color="white"
                  v-model="smsData.sms_otp"
                  outlined
                  :placeholder="$t('member.login.enterVerificationCode')"
                  class="form-style sms-style otp-style"
                  lazy-rules
                  :rules="[Rules.required()]"
                >
                  <template #append>
                    <vue-countdown
                      @end="counting = false"
                      v-if="counting"
                      :time="180000"
                      v-slot="{ totalSeconds }"
                      class="counting-text"
                      >{{ `${totalSeconds}S` }}</vue-countdown
                    >
                  </template>
                </q-input>

                <q-btn class="otp-btn" :disable="!smsData.phone || counting" @click="getOtpCode">
                  {{ $t("common.btn.otp") }}</q-btn
                >
              </div>
            </div>
            <div class="btns btns-sms row justify-center">
              <q-btn text-color="black" class="submit-btn" type="submit" :loading="isLoading">
                {{ $t("common.btn.reset") }}</q-btn
              >
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
import BannerMember from "app/template/set49/components/BannerMember.vue"
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
    name: "QuickPassForgetPassword",
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
@import 'app/template/set49/assets/css/_variable.scss'

.forget-password-layout
  padding-top: 3rem
  +iphone-width
    padding-top: 0
  .forget-password-content
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    border-radius: .5rem
    background: $primary-modal-bg
    +iphone-width
      margin-top: 0
      padding: 0
      background: $secondary-gradient-bg
    .forget-password-title-content
      margin-top: 2.5rem
      padding: 0 2.5rem
      +iphone-width
        margin-top: 1rem
        padding: 0
    .forget-password-type-content
      margin-top: 2.5rem
      padding: 0 2.5rem
      +iphone-width
        width: 90%
        margin: 1rem auto 0
        padding: 1rem 1.5rem .25rem
        background: $primary-modal-bg
        border-radius: .5rem .5rem 0 0
      .q-btn-group
        gap: 1.25rem
        :deep(.q-btn)
          padding: 0
          &.text-white
            .q-btn__content
              span
                text-decoration: underline
                text-underline-offset: .125rem
    .forget-password-form
      width: 100%
      border-radius: .5rem
      padding: 2rem 2.5rem 4rem
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        +iphone-width
          width: 90%
          margin: 0 auto 2rem
          padding: 1rem 1.5rem
          background: $primary-modal-bg
          border-radius: 0 0 .5rem .5rem
        .form-item
          @apply ml-2
          .title
            @apply  uppercase font-bold
            font-family: "Century Gothic"
            +iphone-width
              padding: .5rem 0
              font-family: "NotoSansTC"
              font-weight: 700
              color: #FFC002
              font-size: .875rem
              line-height: 1.2669rem
          .tips
            @apply capitalize font-bold
            font-family: "Century Gothic"
            +iphone-width
              display: block
              width: 16.875rem
              padding: .5rem 0 0
              margin-top: .75rem
              font-weight: 700
              font-size: .875rem
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .otp-btn
            width: 11.875rem
            height: 3rem
            background: #6FCF97
            color: #fff
            text-transform: capitalize
            border-radius: .5rem
            font-size: 1.25rem
            line-height: 1.85rem
            padding: 0
            font-family: "NotoSansTC"
            +iphone-width
              @apply w-full
              font-size: 1rem
              font-weight: 500
          .field-label
            text-transform: uppercase
            color:  rgba(255, 255, 255, 0.7)
            margin-left: 1.25rem
            margin-top: 1.375rem
            display: block
            font-family: "Century Gothic"
            font-weight: 700
            .required-mark
              color: red
            +iphone-width
              font-size: .875rem
              line-height: 1.0731rem
              margin-left: 0
          .field-input
            @apply w-[75%] mt-2
            margin-left: .75rem
            +iphone-width
              width: 90%
              margin-left: 0
            &.field-sms
              @apply flex flex-nowrap gap-3
              +iphone-width
                @apply flex-col gap-6
          .text-tip
            margin-left: 1.625rem
            font-size: .875rem
            line-height: 1.0731rem
            font-family: "Century Gothic"
            font-weight: 700
            +iphone-width
              @apply ml-3 mt-7
              width: 270px
              margin-left: 0

.form-sms
  .counting-text
    display: block
    text-align: center
    border-radius: 1.25rem
    width: 3.5625rem
    height: 1.75rem
    font-family: "NotoSansTC"
    font-size: 14px
    font-weight: 500
    line-height:1.75rem
    text-underline-position: from-font
    text-decoration-skip-ink: none
    color:  rgba(255, 255, 255, 0.7)
    background: rgba(28, 30, 34, 0.3)

.btns
  gap: .75rem
  margin-top: 3.75rem
  &.btns-sms
    margin-top: 5.8125rem
    +iphone-width
      margin-top: 2rem
  +iphone-width
    margin-top: 2rem
    margin-bottom: 2rem
    &.multi-btns
      width: 83.333%
      justify-content: space-between
      margin-left: auto
      margin-right: auto
  .submit-btn
    border-radius: 8px
    background: $yellow-active
    font-size: 1.25rem
    padding: .4688rem 3.625rem
    min-height: auto
    &:hover
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), $yellow-active
    +iphone-width
      padding: .5rem 2.25rem
      min-height: auto
      font-size: 1rem

.form-style
  padding-bottom: 0
  :deep(.q-field__control)
    height: 3rem
    border-radius: .5rem
    +iphone-width
      height: 2.25rem
  :deep(.q-field__append)
    height: 3rem
  &.q-field--error
    padding-bottom: 1.25rem
  &.sms-style
    :deep(.q-field__control)
      height: 3rem
  &.otp-style
    @apply relative
    width: 70%
    +iphone-width
      width: 100%
</style>
