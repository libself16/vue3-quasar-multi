<template>
  <div class="reg-area">
    <div class="con-info">
      <div class="con">
        <div class="form-layout">
          <div class="title">{{ $t("menu.register") }}</div>
          <div v-if="isPhoneRegisterMode" class="form-validation">
            <div class="sub-title">
              {{ $t("common.tip.enter_phone_tip") }}
            </div>
            <q-form class="w-full mt-6 px-4" @submit.prevent="registerSms">
              <div class="block relative w-4/5 mb-3">
                <q-input
                  ref="phoneRef"
                  bg-color="white"
                  v-model="formSms.phone"
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
                  v-model="formSms.sms_otp"
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
                <q-btn id="btn-otp" class="btn-submit" :disable="!formSms.phone || counting" @click="getOtpCode">
                  {{ $t("common.btn.otp") }}</q-btn
                >
              </div>
              <div class="input-area">
                <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!agreeTerms">
                  {{ $t("common.btn.register") }}</q-btn
                >
              </div>
            </q-form>
          </div>
          <div v-else class="form-validation mt-6">
            <q-form class="modal-form px-4" @submit.prevent="register">
              <div class="input-area">
                <label class="field-label" for=""
                  >{{ $t("member.register.username") }}<span class="manred">*</span></label
                >
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    v-model="formData.account"
                    outlined
                    :placeholder="$t('placeholder.pleaseEnterUsername')"
                    class="form-style"
                    lazy-rules
                    :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for=""
                  >{{ $t("member.register.fullName") }}<span class="manred">*</span></label
                >
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    v-model="formData.fullname"
                    :placeholder="$t('placeholder.pleaseEnterFullNameShort')"
                    class="form-style"
                    lazy-rules
                    :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for=""
                  >{{ $t("member.register.contactNo") }}<span class="manred">*</span></label
                >
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    v-model="formData.phone"
                    :placeholder="$t('placeholder.pleaseEnterContactNo')"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                  <!-- <Error :validate="v$.formData.phone.$errors" /> -->
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for="Password"
                  >{{ $t("member.register.password") }}<span class="manred">*</span></label
                >
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    v-model="formData.password"
                    type="password"
                    :placeholder="$t('placeholder.pleaseEnterPassword')"
                    class="form-style"
                    lazy-rules
                    :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for="Password"
                  >{{ $t("member.register.confirmPassword") }}<span class="manred">*</span></label
                >
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    type="password"
                    id="confirm_password"
                    v-model="formData.confirm_password"
                    name="confirm_password"
                    :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
                    class="form-style"
                    lazy-rules
                    :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for="">{{ $t("member.register.contact1") }}</label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    id="phone"
                    v-model="formData.contacts.contact1"
                    name="phone"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.noRule]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for="">{{ $t("member.register.contact2") }}</label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    id="phone"
                    v-model="formData.contacts.contact2"
                    name="phone"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.noRule]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for="">{{ $t("member.register.email") }}<span class="manred">*</span></label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    id="email"
                    v-model="formData.email"
                    name="email"
                    :placeholder="$t('placeholder.pleaseEnterEmail')"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.required(), Rules.email]"
                  />
                </div>
              </div>
              <div class="input-area">
                <label class="field-label" for=""
                  >{{ $t("member.register.affiliate") }}<span class="manred"></span
                ></label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    outlined
                    id="ref_account"
                    v-model="formData.ref_account"
                    name="ref_account"
                    class="form-style"
                  />
                </div>
              </div>

              <div class="input-area">
                <span class="input-text">{{ $t("common.tip.reg_tip") }}</span>
              </div>
              <div class="input-area">
                <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
              </div>
            </q-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"

import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()

const { isLoading, handleRegister, handleRegisterSms, handleLogin, handleGetOTP } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isPhoneRegisterMode } = useEnv()

const agreeTerms = ref(true)
let formData = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: undefined,
  email: "",
  phone: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})
let formSms = reactive<Request.RegisterSms>({
  register_method: REGISTER_METHOD.Enums.Phone,
  phone: "",
  sms_otp: ""
})
const phoneRef = ref()
const counting = ref(false)

async function getOtpCode() {
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

async function registerSms() {
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

async function register() {
  const { status } = await handleRegister({
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password,
    fullname: formData.fullname,
    ref_account: formData.ref_account,
    email: formData.email,
    phone: formData.phone,
    contacts: formData.contacts
  })

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
    login_method: LOGIN_METHOD.Enums.Password,
    username: formData.account,
    password: formData.password
  }
  await login(payload)
}

async function login(payload: Request.login) {
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
  router.push({ name: "HomePage" })
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33/assets/css/_variable.sass"
@import "app/template/set33/assets/css/main.sass"
.con
  min-width: 61.875rem
  .form-layout
    width: 59.375rem
    margin-left: auto
    margin-right: auto
    +pad-width
      width: 90vw
    .title
      font-size: 1.5rem
      font-weight: 700
      margin-left: 0
      padding-left: 1rem
    .sub-title
      font-size: 1.25rem
      margin-top: 1.875rem
      margin-bottom: .625rem
      padding-left: 1rem
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
    .term-area
      @apply flex justify-center items-center w-full mb-5
      +iphone-width
        @apply flex-col
      :deep(.q-checkbox)
        .q-icon
          color: #fff
      .text-link
        color: #007DC5
        cursor: pointer
::v-deep(.q-field__messages)
  color: #ed4014
  font-size: 0.8rem
  +pad-width
    font-size: 2vw
  +iphone-width
    font-size: 3.2vw
::v-deep(.q-field__marginal)
  height:2.375rem
::v-deep(.q-field__control)
  border-radius: 1.25rem
  height: 2.375rem
  .q-field__native
    font-weight: 500
    height: 2.375rem
    &:focus
      color: rgba(28, 30, 34, 0.70)
    +iphone-width
      font-size: 4vw

.form-validation
  min-width: 59.375rem
  +pad-width
    min-width: 100%
  +iphone-width
    min-width: 100%
</style>
