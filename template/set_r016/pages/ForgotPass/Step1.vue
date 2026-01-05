<template>
  <div class="forget-password">
    <div class="forget-password-title">
      {{ $t("member.forgotPassword.forgotPassword") }}
    </div>

    <div class="forget-password-toggle">
      <q-btn-toggle
        v-if="isPhoneRegisterMode"
        v-model="forgetMethod"
        toggle-color="white"
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
        <div v-for="(text, index) in mailTipsList" :key="index" class="tips" :class="{}">
          <span v-if="index + 1 === mailTipsList.length">＊</span>
          {{ $t(`${text}`) }}
        </div>

        <div class="form-area">
          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.forgotPassword.registeredAccount") }}
            </div>

            <q-input
              v-model="formData.account"
              class="form-input"
              rounded
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              :rules="[(val) => Rules.account(val)]"
              :placeholder="$t('placeholder.pleaseEnterUsername')"
            />
          </div>

          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.forgotPassword.registeredEmail") }}
            </div>

            <q-input
              v-model="formData.email"
              class="form-input"
              rounded
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              :rules="[Rules.email]"
              :placeholder="$t('placeholder.pleaseEnterEmail')"
            />
          </div>
        </div>

        <div class="text-tip">
          {{ $t("common.tip.forgotPasswordTip2") }}
        </div>

        <q-btn class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
    </div>

    <div v-else class="forget-password-form form-sms">
      <q-form @submit.prevent="forgetPasswordSms">
        <div v-for="(text, index) in smsTipsList" :key="index" class="tips">
          {{ $t(`${text}`) }}
        </div>

        <div class="form-area">
          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.register.phone") }}
            </div>

            <div class="flex items-center justify-start">
              <q-select
                ref="countryCodeRef"
                v-model="otpData.country_code"
                :options="COUNTRY_CODE.countryCodeList"
                class="form-input !w-auto !mr-[0.625rem]"
                :rules="[Rules.required()]"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                clearable
                :display-value="otpData.country_code ? undefined : $t('member.register.country')"
              />

              <q-input
                ref="phoneRef"
                v-model="smsData.phone"
                :placeholder="$t('member.login.phone')"
                class="form-input flex-1"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                unmasked-value
                no-error-icon
                :rules="[Rules.noRule]"
              />
            </div>
          </div>

          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.login.verificationCode ") }}
            </div>
            <div class="field-sms">
              <q-input
                v-model="smsData.sms_otp"
                :placeholder="$t('member.login.enterVerificationCode')"
                class="form-input otp-style"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                no-error-icon
                :rules="[Rules.required()]"
              >
                <template #append>
                  <vue-countdown
                    @end="counting = false"
                    v-if="counting"
                    :time="180000"
                    v-slot="{ totalSeconds }"
                    class="counting-text"
                  >
                    {{ `${totalSeconds}S` }}
                  </vue-countdown>
                </template>
              </q-input>

              <q-btn class="otp-btn" :disable="!smsData.phone || counting" @click="getOtpCode">
                {{ $t("common.btn.otp") }}
              </q-btn>
            </div>
          </div>
        </div>

        <q-btn class="btn-submit btns-sms" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
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
import * as Request from "src/api/request.type"
import { FORGOT_PASS_METHOD, SMS_OTP_TYPE, COUNTRY_CODE } from "src/common/utils/constants"
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
const otpData = reactive<Request.GetOTP>({
  phone_number: "",
  country_code: "",
  request_type: SMS_OTP_TYPE.Enums.ForgotPassword
})
const smsData = reactive({
  phone: "",
  sms_otp: ""
})
const countryCodeRef = ref()
const phoneRef = ref()
const counting = ref(false)
const mailTipsList = ref([
  "member.forgotPassword.resetPassword",
  "common.tip.forgotPasswordTitle",
  "common.tip.forgotPasswordTip1"
])
const smsTipsList = ref(["member.forgotPassword.resetPassword", "common.tip.forgotPasswordTitle2"])

const forgetPassword = async () => {
  const { status } = await handleForgetPassword({
    account: formData.account,
    email: formData.email
  })

  if (!status) return

  $q.notify({
    type: "positive",
    message: t("common.validate.LetterHasBeenSent"),
    position: "top",
    timeout: 1000
  })
}

const getOtpCode = async () => {
  countryCodeRef.value.validate()
  phoneRef.value.validate()

  if (countryCodeRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.mustNotBeEmpty"),
      position: "top"
    })
  }
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top"
    })
  }
  counting.value = true
  otpData.phone_number = smsData.phone
  const { status } = await handleGetOTP(otpData)
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
    name: "QuickPass",
    params: {
      account: smsData.phone,
      token: data.token
    }
  })
}
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.forget-password {
  max-width: 75rem;
  margin: 1.25rem auto 0;
  border-radius: 0.5rem;
  background: $primary07;
  padding: 3.75rem;

  @include phone-width() {
    margin-top: 0;
    padding: 1.25rem;
  }

  .forget-password-title {
    @include fontStyle(1.625rem);
    color: $secondary03;
  }

  .forget-password-toggle {
    margin-top: 0.625rem;

    @include phone-width() {
      width: 90%;
      border-radius: 0.5rem 0.5rem 0 0;
    }

    .q-btn-group {
      gap: 0.625rem;

      :deep(.q-btn) {
        @include fontStyle();

        background-color: $neutral01;
        padding: 0.625rem;
        color: $primary04;
        border-radius: 0.625rem;

        &.text-white {
          background: $gradient01;
        }
      }
    }
  }

  .forget-password-form {
    width: 100%;
    margin-top: 0.625rem;

    .tips {
      @include fontStyle(0.875rem, 400);
      color: $neutral01;
    }

    .form-area {
      @apply flex flex-col items-center justify-center;
      margin-top: 1.25rem;

      .form-item {
        @apply m-0;
        width: 100%;
        max-width: 37.5rem;
        margin-top: 1.25rem;

        @include phone-width() {
          @apply w-full;
        }

        .field-label {
          color: $neutral01;
        }

        .field-sms {
          @apply flex flex-nowrap gap-3;

          @include phone-width() {
            @apply flex-col;
          }

          .otp-style {
            flex: 1;

            @include phone-width() {
              width: 100%;
            }

            .counting-text {
              display: block;
              text-align: center;
              border-radius: 1.25rem;
              width: 3.5625rem;
              height: 1.75rem;
              font-size: 14px;
              font-weight: 500;
              line-height: 1.75rem;
              text-underline-position: from-font;
              text-decoration-skip-ink: none;
              color: rgba(255, 255, 255, 0.7);
              background: rgba(28, 30, 34, 0.3);
            }
          }

          .otp-btn {
            @include fontStyle(0.875rem);
            background: $gradient01;
            color: $neutral01;
            border-radius: 0.625rem;
            padding: 0 0.625rem;
            height: 2.25rem;
            margin-top: 0.25rem;
          }
        }
      }
    }

    .text-tip {
      @include fontStyle(0.875rem, 400);
      @apply mt-5 mb-10 flex items-center justify-center;

      color: $neutral01;
    }
  }
}

.btn-submit {
  @apply flex items-center justify-center mx-auto;
  @include fontStyle(0.875rem, 400);

  border-radius: 0.5rem;
  background: $gradient01;
  color: $neutral01;
  width: 18.75rem;
  height: 2.25rem;

  @include phone-width() {
    width: 100%;
  }

  &.btns-sms {
    margin-top: 1.5rem;

    @include phone-width() {
      margin-top: 2rem;
    }
  }
}
</style>
