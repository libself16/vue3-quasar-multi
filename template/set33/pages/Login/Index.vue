<template>
  <div class="reg-area">
    <div class="con-info">
      <div class="con">
        <div class="title">{{ $t("menu.login") }}</div>
        <div class="form-validation">
          <q-form class="modal-form px-4" @submit.prevent="login">
            <!-- login method toggle -->
            <div v-if="isPhoneRegisterMode" class="input-area">
              <label class="field-label" for="PrimaryLoginCred">{{ $t("member.login.loginType") }}</label>
              <div class="field-input">
                <q-btn-toggle
                  v-model="loginData.login_method"
                  toggle-color="primary"
                  flat
                  :options="[
                    { label: $t('common.btn.password'), value: LOGIN_METHOD.Enums.Password },
                    { label: $t('common.btn.smsOtp'), value: LOGIN_METHOD.Enums.Sms }
                  ]"
                />
              </div>
            </div>
            <!-- account -->
            <div class="input-area">
              <template v-if="isPhoneRegisterMode">
                <label class="field-label" for="">{{ $t("member.login.phone") }}</label>
                <div class="field-input">
                  <q-input
                    ref="phoneRef"
                    bg-color="white"
                    v-model="loginData.username"
                    outlined
                    autocomplete="off"
                    :placeholder="$t('placeholder.phoneNumber')"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.noRule]"
                    unmasked-value
                  />
                </div>
              </template>
              <template v-else>
                <label class="field-label" for="">{{ $t("member.login.username") }}</label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    v-model="loginData.username"
                    outlined
                    autocomplete="off"
                    :placeholder="$t('placeholder.pleaseEnterUsername')"
                    class="form-style"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </template>
            </div>
            <!-- passowrd -->
            <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password" class="input-area">
              <label class="field-label" for="">{{ $t("member.login.password") }}</label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="loginData.password"
                  autocomplete="off"
                  :placeholder="$t('placeholder.pleaseEnterPassword')"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[(val) => Rules.password(val)]"
                />
              </div>
            </div>
            <!-- otp -->
            <div v-else class="input-area">
              <label class="field-label" for="Password">OTP</label>
              <div class="field-input">
                <div class="inner-flex relative">
                  <div class="relative w-4/5">
                    <q-input
                      bg-color="white"
                      outlined
                      class="form-style"
                      type="password"
                      autocomplete="off"
                      v-model="loginData.sms_otp"
                      :placeholder="$t('placeholder.enterOTP')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                    <vue-countdown
                      @end="counting = false"
                      :time="180000"
                      v-if="counting"
                      v-slot="{ totalSeconds }"
                      class="counting-text"
                      >{{ `${totalSeconds}s` }}</vue-countdown
                    >
                    <q-btn
                      id="btn-otp"
                      class="btn-submit"
                      :disable="!loginData.username || counting"
                      @click="getOtpCode"
                    >
                      {{ $t("common.btn.otp") }}</q-btn
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- register now -->
            <div class="login-mark">
              <span class="input-text">
                {{ $t("member.login.unAccount") }} &nbsp;
                <router-link :to="{ name: 'Register' }">{{ $t("member.login.regsiterNow") }}</router-link>
              </span>
            </div>
            <!-- forgot pass -->
            <div class="login-mark">
              <span class="input-text">
                <router-link :to="{ name: 'ForgotPass' }" class="btn-for">
                  {{ $t("member.login.forgotPassword") }}
                </router-link>
              </span>
            </div>
            <!-- submit -->
            <div class="input-area">
              <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.login") }}</q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const router = useRouter()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isPhoneRegisterMode } = useEnv()

const phoneRef = ref()
const counting = ref(false)

let loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: ""
})

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
  const { status } = await handleGetOTP({ phone: loginData.username })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

async function login() {
  const payload: Request.login = {
    login_method: loginData.login_method,
    username: loginData.username
  }
  if (loginData.login_method === LOGIN_METHOD.Enums.Password) {
    payload.password = loginData.password
  }
  if (loginData.login_method === LOGIN_METHOD.Enums.Sms) {
    payload.sms_otp = loginData.sms_otp
  }

  const { status } = await handleLogin(payload)

  if (!status) {
    return
  }
  if (auth.value.access_token) {
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
}

watch(
  () => loginData.login_method,
  (newVal) => {
    loginData.password = ""
    loginData.sms_otp = ""
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33/assets/css/_variable.sass"
@import "app/template/set33/assets/css/main.sass"
::v-deep(.q-field__messages)
  color: #ed4014
  font-size: 0.9vw
  +pad-width
    font-size: 2vw
  +iphone-width
    font-size: 3.2vw
::v-deep(.q-field__marginal)
  height:38px
::v-deep(.q-field__control)
  border-radius: 20px
  height: 38px
  .q-field__native
    font-weight: 500
    height:38px
    &:focus
      color: rgba(28, 30, 34, 0.70)
    +iphone-width
      font-size: 4vw

.form-validation
  margin-top: 25px
  min-width: 950px
  .counting-text
    text-align: center
    position: absolute
    top: 0.3rem
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
    top: 0.2rem
    right: -5.625rem
    height: 2.375rem
    width: 5.625rem
    margin-left: 0
    font-size: 1rem
    line-height: 2.375rem
    padding: 0
    text-transform: none
    white-space: nowrap
  +pad-width
    min-width:100%
  +iphone-width
    min-width: 100%

.login-mark
  margin-bottom: 20px
  align-items: center
  width: 100%
  .input-text
    margin-left: 23%
    a
      color: #ffcd00
      text-decoration: underline
      font-weight: bold
    +pad-width
      width: 100%
      margin: 0px
      text-align: center
      font-size: 2vw
      +setFlex
    +iphone-width
      width: 100%
      margin: 0px
      text-align: center
      font-size: 3.5vw
      +setFlex
    label
      font-size: 16px
      width: 25%
      +pad-width
        width: 100%
      +iphone-width
        min-width: 100%
</style>
