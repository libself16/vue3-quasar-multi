<template>
  <div v-if="isReady" class="login-page">
    <div class="login-container">
      <div class="logo-img" :class="{ invisible: !getSquareLogo() }">
        <img :src="getSquareLogo()" alt="logo" class="w-full h-auto" />
      </div>
      <q-form class="login-form" @submit.prevent="login">
        <!-- login method toggle -->
        <div v-if="isPhoneRegisterMode" class="input-area">
          <label class="field-label" for="PrimaryLoginCred">Login Method</label>
          <div class="field-input">
            <q-btn-toggle
              v-model="loginData.login_method"
              toggle-color="primary"
              flat
              :options="[
                { label: 'Password', value: LOGIN_METHOD.Enums.Password },
                { label: 'SMS OTP', value: LOGIN_METHOD.Enums.Sms }
              ]"
            />
          </div>
        </div>
        <!-- account -->
        <div class="input-area">
          <template v-if="isPhoneRegisterMode">
            <label class="field-label" for="">Phone Number</label>
            <div class="field-input">
              <q-input
                ref="phoneRef"
                bg-color="white"
                v-model="loginData.username"
                outlined
                placeholder="Please enter phone number"
                class="form-style"
                lazy-rules
                :rules="[Rules.noRule]"
                unmasked-value
              />
            </div>
          </template>
          <template v-else>
            <label class="field-label" for="">Username</label>
            <div class="field-input">
              <q-input
                bg-color="white"
                v-model="loginData.username"
                outlined
                class="form-style"
                lazy-rules
                :rules="[(val) => Rules.required('Required field')(val)]"
              />
            </div>
          </template>
        </div>
        <!-- passowrd -->
        <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password" class="input-area">
          <label class="field-label" for="">Password</label>
          <div class="field-input">
            <q-input
              bg-color="white"
              outlined
              v-model="loginData.password"
              class="form-style"
              type="password"
              lazy-rules
              :rules="[(val) => Rules.password(val, 'Required field')]"
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
                  v-model="loginData.sms_otp"
                  placeholder="Please enter OTP"
                  lazy-rules
                  :rules="[Rules.required('Required field')]"
                />
                <vue-countdown
                  @end="counting = false"
                  :time="180000"
                  v-if="counting"
                  v-slot="{ totalSeconds }"
                  class="counting-text"
                  >{{ `${totalSeconds}s` }}</vue-countdown
                >
                <q-btn id="btn-otp" :disable="!loginData.username || counting" @click="getOtpCode"> Get Code</q-btn>
              </div>
            </div>
          </div>
        </div>
        <!-- submit -->
        <div class="input-area">
          <q-btn class="btn-submit mt-9" type="submit" :loading="isLoading">
            LOGIN
            <img class="icon" :src="iconSvg('view-all')" alt="view-all" />
          </q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { useInit } from "src/common/composables/useInit"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import * as Request from "src/api/request.type"
import { LOGIN_METHOD } from "src/common/utils/constants"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()

const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isPhoneRegisterMode } = useEnv()
const { getSquareLogo, handleLogoList } = useLogo()
const { iconSvg } = useSiteImg()
const { getAgentSetting } = useLanguage()
const { isReady, initialize } = useInit()
const { handleGetPixelCodes } = usePixelCodes()

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

  const { status, data } = await handleLogin(payload)

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

onMounted(async () => {
  initialize({ task: [handleLogoList, getAgentSetting, handleGetPixelCodes] })
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_amuse/assets/css/_variable.sass"
@import "app/template/set_amuse/assets/css/main.sass"
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap')

.login-page
  font-family: "Jost", sans-serif
  font-weight: 500
  color: #fff
  max-width: none
  width: 100vw
  height: 100dvh
  display: flex
  justify-content: center
  align-items: center
  background:  url("app/template/set_amuse/assets/images/bg.png")
  background-size: cover
  .login-container
    width: 21.875rem
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 1.25rem
    .logo-img
      width: 18.75rem
      height: 12.5rem
    .login-form
      @apply w-full
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
        height: 3.5rem
        border: 1px solid #D37139
        background: #000
</style>
