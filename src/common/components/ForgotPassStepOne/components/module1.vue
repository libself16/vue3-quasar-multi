<template>
  <div
    class="fotgot-password-area w-full h-full max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]"
    :class="isDown.phone ? 'h5' : 'pc'"
  >
    <div class="forget-password-title">
      <div
        v-if="isPhoneRegisterMode && isDown.phone && forgetMethod >= 0"
        class="back-icon"
        @click="handlerClearMode()"
      >
        <img :src="forgotPassImg('back.svg')" alt="back" />
      </div>

      {{ $t("member.forgotPassword.forgotPassword") }}
    </div>

    <div class="forget-password-content">
      <div v-if="isPhoneRegisterMode && (!isDown.phone || forgetMethod < 0)" class="forget-password-toggle">
        <q-btn-toggle
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

      <div v-if="forgetMethod >= 0" class="forget-password">
        <div v-if="!isDown.phone" class="forget-password-title">{{ $t("member.forgotPassword.forgotPassword") }}</div>

        <div v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" class="forget-password-form">
          <q-form>
            <div class="tips">
              <span>{{ `${$t("member.forgotPassword.resetPassword")},` }}</span>
              {{ $t("common.tip.forgotPasswordTitle") }}
            </div>

            <div class="form-area">
              <div class="form-item">
                <div class="field-label required">
                  {{ $t("member.forgotPassword.registeredAccount") }}
                </div>

                <q-input
                  v-model="formData.account"
                  class="form-input"
                  outlined
                  dense
                  borderless
                  lazy-rules
                  no-error-icon
                  hide-bottom-space
                  :rules="[(val) => Rules.account(val)]"
                  :placeholder="$t('placeholder.pleaseEnterUsername')"
                />
              </div>

              <div class="form-item">
                <div class="field-label required">
                  {{ $t("member.forgotPassword.registeredEmail") }}
                </div>

                <q-input
                  v-model="formData.email"
                  class="form-input"
                  outlined
                  dense
                  borderless
                  lazy-rules
                  no-error-icon
                  hide-bottom-space
                  :rules="[Rules.email]"
                  :placeholder="$t('placeholder.pleaseEnterEmail')"
                />
              </div>
            </div>
          </q-form>

          <q-btn class="btn-submit" type="submit" :loading="isLoading" @click="forgetPassword">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>

        <div v-else class="forget-password-form form-sms">
          <q-form>
            <div class="tips">
              <span>{{ `${$t("member.forgotPassword.resetPassword")},` }}</span>
              {{ $t("common.tip.forgotPasswordTitle2") }}
            </div>

            <div class="form-area">
              <div class="form-item">
                <div class="field-label required">
                  {{ $t("member.register.phone") }}
                </div>

                <div class="flex items-start justify-start">
                  <q-select
                    ref="countryCodeRef"
                    v-model="otpData.country_code"
                    :options="COUNTRY_CODE.countryCodeList"
                    class="form-input !w-auto !mr-[0.625rem]"
                    :rules="[Rules.required()]"
                    outlined
                    dense
                    borderless
                    lazy-rules
                    clearable
                    hide-bottom-space
                    :display-value="otpData.country_code ? undefined : $t('member.register.country')"
                  />

                  <q-input
                    ref="phoneRef"
                    v-model="smsData.phone"
                    :placeholder="$t('member.login.phone')"
                    class="form-input flex-1"
                    outlined
                    dense
                    borderless
                    lazy-rules
                    unmasked-value
                    no-error-icon
                    hide-bottom-space
                    :rules="[Rules.noRule]"
                  />
                </div>
              </div>

              <div class="form-item">
                <div class="field-label required">
                  {{ $t("member.login.verificationCode ") }}
                </div>
                <div class="field-sms">
                  <q-input
                    v-model="smsData.sms_otp"
                    :placeholder="$t('member.login.enterVerificationCode')"
                    class="form-input otp-style"
                    outlined
                    dense
                    borderless
                    lazy-rules
                    no-error-icon
                    hide-bottom-space
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
          </q-form>

          <q-btn class="btn-submit btns-sms" type="submit" :loading="isLoading" @click="forgetPasswordSms">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useEnv } from "src/common/hooks/useEnv"
import * as Request from "src/api/request.type"
import { FORGOT_PASS_METHOD, SMS_OTP_TYPE, COUNTRY_CODE } from "src/common/utils/constants"
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "src/common/hooks/useSiteImg"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isPhoneRegisterMode } = useEnv()
const { isLoading, handleForgetPassword, handleForgetPasswordSms, handleGetOTP } = useAuth()
const { isDown } = useMediaQuery()
const { forgotPassImg } = useSiteImg()

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

const handlerClearMode = () => {
  forgetMethod.value = -1 as FORGOT_PASS_METHOD.Enums
}

onMounted(() => {
  if (isDown.phone && isPhoneRegisterMode.value) {
    forgetMethod.value = -1 as FORGOT_PASS_METHOD.Enums
  }
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.fotgot-password-area {
  margin: 0 auto;
  padding: 1.25rem 0;

  @include phone-width() {
    padding: 0 1rem;
  }

  .forget-password-title {
    color: var(--text-01);
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .back-icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.25rem;
      background: var(--icon-05);
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 0.67rem;
      }
    }
  }

  .forget-password-content {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .forget-password-toggle {
      margin-right: 1.25rem;
      background: var(--bg-08);
      border-radius: 0.5rem;
      padding: 0.375rem 0;

      @include phone-width() {
        width: 100%;
        margin-right: 0;
      }

      .q-btn-group {
        flex-direction: row;
        flex-wrap: wrap;
        font-weight: 700;
        font-size: 0.875rem;

        @include phone-width() {
          width: 100%;
        }

        :deep(.q-btn) {
          width: 100%;
          background-color: var(--bg-08);
          padding: 0.625rem;
          color: var(--text-01);

          @include phone-width() {
            padding: 0.75rem 1.25rem;

            .q-btn__content {
              display: flex;
              align-items: center;
              justify-content: flex-start;
            }
          }

          &.text-white {
            background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
          }
        }
      }
    }

    .forget-password {
      width: 100%;
      min-height: 39.5rem;
      border-radius: 0.5rem;
      background: var(--bg-11);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;

      @include phone-width() {
        height: calc(100dvh - 12rem);
        min-height: auto;
        margin-top: 0;
        padding: 0;
        background: transparent;
      }

      .forget-password-form {
        width: 100%;
        flex: 1;
        margin-top: 0.625rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @include phone-width() {
          margin-top: 0;
        }

        .tips {
          color: var(--text-01);
          font-size: 0.875rem;
        }

        .form-area {
          @apply flex flex-col items-center justify-center;
          margin-top: 0.625rem;

          .form-item {
            width: 100%;
            max-width: 35rem;
            margin-bottom: 0.625rem;

            @include phone-width() {
              @apply w-full;
            }

            .field-label {
              color: var(--text-03);
              position: relative;
              display: inline-block;
              margin-bottom: 0.375rem;

              &.required {
                &:after {
                  content: "";
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  right: -0.75rem;
                  width: 0.375rem;
                  height: 0.375rem;
                  background-color: var(--bg-10);
                  border-radius: 50%;
                }
              }
            }

            .form-input {
              :deep(.q-field__control) {
                color: var(--primany-01);

                &::before {
                  border: 2px solid var(--input-dropdown-text-03);
                  border-radius: 0.25rem;
                  background: var(--input-dropdown-bg-01);
                }

                .q-field__native {
                  color: var(--text-01);
                  &::placeholder {
                    color: var(--input-dropdown-text-01);
                  }
                }

                .q-field__append {
                  color: var(--icon-01);
                }
              }
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
                  color: var(--btn-text-03);
                  background: var(--btn-bg-05);
                }
              }

              .otp-btn {
                background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
                color: var(--btn-text-01);
                border-radius: 0.625rem;
                padding: 0 0.625rem;
                height: 2.6875rem;
              }
            }
          }
        }
      }
    }
  }
}

.btn-submit {
  @apply flex items-center justify-center mx-auto;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
  color: var(--btn-text-01);
  width: 35rem;
  height: 2.9375rem;
  font-size: 0.875rem;
  font-weight: 700;

  @include phone-width() {
    width: 100%;
  }

  &.btns-sms {
    @include phone-width() {
      margin-top: 2rem;
    }
  }
}
</style>
