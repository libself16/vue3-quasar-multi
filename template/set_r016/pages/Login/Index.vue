<template>
  <div v-if="isReady" class="login-page">
    <div class="area-left">
      <div class="area-left-container">
        <img class="logo" :src="getSquareLogo()" />

        <img :src="loginImg('banner.png')" class="banner" alt="login-banner" />
      </div>
    </div>

    <div class="area-right">
      <div class="area-right-container">
        <div class="flex items-center justify-between">
          <div class="title">{{ $t("menu.login") }}</div>
          <q-btn class="close" icon="close" flat dense @click="$router.push('/')" />
        </div>

        <q-form class="form-area" @submit.prevent="login">
          <!-- 帳號登入 -->
          <q-input
            v-if="loginData.login_method === LOGIN_METHOD.Enums.Password"
            v-model="loginData.username"
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            class="form-input mb-2.5"
            dense
            borderless
            lazy-rules
            no-error-icon
            hide-bottom-space
            :rules="[Rules.required()]"
          >
            <template #prepend>
              <div class="form-icon">
                <img :src="svgIcon('account-gray')" alt="account" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>

          <!-- 手機號碼登入 -->
          <template v-else>
            <div class="field-label form-title required">{{ $t("member.login.phone") }}</div>
            <div class="flex justify-center items-start mb-2.5">
              <q-select
                v-if="loginData.login_method === LOGIN_METHOD.Enums.Sms"
                ref="countryCodeRef"
                v-model="otpData.country_code"
                :options="COUNTRY_CODE.countryCodeList"
                class="form-select mr-2.5"
                :rules="[Rules.required()]"
                crounded
                dense
                borderless
                lazy-rules
                clearable
                :display-value="otpData.country_code ? undefined : $t('member.register.country')"
                no-error-icon
                hide-bottom-space
              />
              <q-input
                ref="phoneRef"
                v-model="loginData.username"
                :placeholder="$t('member.register.phone')"
                class="form-input flex-1"
                dense
                borderless
                lazy-rules
                unmasked-value
                no-error-icon
                hide-bottom-space
                :rules="[Rules.required()]"
              />
            </div>
          </template>

          <!-- 密碼 -->
          <q-input
            v-if="loginData.login_method === LOGIN_METHOD.Enums.Password"
            v-model="loginData.password"
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            dense
            borderless
            lazy-rules
            no-error-icon
            hide-bottom-space
            :rules="[Rules.required()]"
          >
            <template #prepend>
              <div class="form-icon">
                <img :src="svgIcon('password-gray')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
            <template #append>
              <q-icon
                class="eye-icon"
                :name="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- otp -->
          <template v-else>
            <div class="field-label form-title required" for="Password">{{ $t("member.login.verifyCode") }}</div>
            <q-input
              class="form-input otp-style"
              v-model="loginData.sms_otp"
              :placeholder="$t('member.login.enterVerificationCode')"
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
                  :time="180000"
                  v-if="counting"
                  v-slot="{ totalSeconds }"
                  class="counting-text"
                >
                  {{ `${totalSeconds}s` }}
                </vue-countdown>
              </template>
            </q-input>

            <q-btn
              class="btn-otp"
              :disable="!loginData.username || !otpData.country_code || counting"
              @click="getOtpCode"
            >
              {{ $t("common.btn.otp") }}
            </q-btn>
          </template>

          <!-- 忘記密碼 -->
          <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password" class="forgot-pass">
            <div @click="router.push({ name: 'ForgotPass' })">
              {{ $t("member.login.forgotPassword") }}
            </div>
          </div>

          <!-- 登入 -->
          <q-btn class="btn-submit mt-5 mb-2.5" type="submit" :loading="isLoading"> {{ $t("menu.login") }}</q-btn>

          <!-- 登入模式切換 -->
          <q-btn v-if="isPhoneRegisterMode" class="btn-submit" type="submit" @click="handlerChangeLoginMethod()">
            {{ isPasswordLogin ? $t("common.btn.phoneLogin") : $t("common.btn.passwordLogin") }}
          </q-btn>

          <div class="more-button-area">
            <template v-for="(btn, index) in moreButtonList" :key="index">
              <div v-if="btn.isShow" class="more-button" @click="handlerClickMoreButton(btn.url)">
                <img :src="loginImg(btn.icon)" class="more-button-icon" :alt="btn.url" />
                <div class="more-button-text">{{ $t(`${btn.text}`) }}</div>
              </div>
            </template>
          </div>
        </q-form>
      </div>

      <div class="introduction" @click="router.push({ name: 'webInformation' })">
        <img class="logo" :src="getSquareLogo()" />

        <div class="text">
          <img :src="loginImg('introduction.png')" class="text-icon" alt="introduction" />
          <div>{{ $t("member.login.platformIntroduction") }}</div>
        </div>
      </div>
    </div>

    <AddHomeScreen v-if="isMobile" v-model="showIosHomeScreen" />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { useAuth } from "src/common/hooks/useAuth"
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useLogo } from "src/common/composables/useLogo"
import { useInit } from "src/common/composables/useInit"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import AddHomeScreen from "app/template/set_r016/components/Dialog/AddHomeScreen.vue"
import { LOGIN_METHOD, SMS_OTP_TYPE, COUNTRY_CODE } from "src/common/utils/constants"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isMobile } = useMediaQuery()
const { isPhoneRegisterMode } = useEnv()
const { isReady, initialize } = useInit()
const { getAgentSetting } = useLanguage()
const { loginImg, svgIcon } = useSiteImg()
const { handleOpenLineLink } = useLiveChat("")
const { handleLogoList, getSquareLogo } = useLogo()
const { getUserWalletList, getAccountInfo } = useUserInfo()
const { auth, isLogin, isLoading, handleLogin, handleGetOTP } = useAuth()

const countryCodeRef = ref()
const phoneRef = ref()
const counting = ref(false)
const showPassword = ref(false)
const showIosHomeScreen = ref(false)

let loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: ""
})

const otpData = reactive<Request.GetOTP>({
  phone_number: "",
  country_code: "",
  request_type: SMS_OTP_TYPE.Enums.Login
})

const moreButtonList = ref([
  {
    url: "/register",
    text: "member.login.regsiterNow_2",
    icon: "register.png",
    isShow: true
  },
  {
    url: "/",
    text: "common.btn.visitorsLogin",
    icon: "visitors.png",
    isShow: true
  },
  {
    url: "service",
    text: "common.btn.onlineService",
    icon: "service.png",
    isShow: true
  },
  {
    url: "addHomeScreen",
    text: "common.btn.addHomeScreen",
    icon: "add-home.png",
    isShow: isMobile.value
  }
])

const isPasswordLogin = computed(() => {
  return loginData.login_method === LOGIN_METHOD.Enums.Password
})

const handlerChangeLoginMethod = () => {
  if (isPasswordLogin.value) {
    loginData.login_method = LOGIN_METHOD.Enums.Sms
  } else {
    loginData.login_method = LOGIN_METHOD.Enums.Password
  }

  loginData.username = ""
  loginData.password = ""
  loginData.sms_otp = ""
}

const handlerClickMoreButton = (url: string) => {
  if (url === "service") {
    handleOpenLineLink()
  } else if (url === "addHomeScreen") {
    showIosHomeScreen.value = true
  } else {
    router.push({ path: url })
  }
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
  otpData.phone_number = loginData.username as string
  const { status } = await handleGetOTP(otpData)
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

const login = async () => {
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
    await getAccountInfo()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
    router.push({ path: "/" })
  }
}

onMounted(() => {
  if (isLogin.value) {
    router.push({ path: "/" })
  }

  initialize({
    task: [getAgentSetting, handleLogoList]
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: url("app/template/set_r016/assets/images/background.jpg") no-repeat;
  background-size: cover;
  position: relative;

  @include phone-width() {
    flex-direction: column;
    height: 100%;
  }

  .area {
    &-left {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 3.754rem 0 7.125rem;

      @include phone-width() {
        height: auto;
        flex-direction: column;
        padding: 0 1rem;
        margin-top: 3.75rem;
      }

      &-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: auto;

        @include phone-width() {
          align-items: center;
        }

        .logo {
          width: 17.5rem;
          margin-left: 0.3rem;

          @include phone-width() {
            width: 10rem;
            margin-left: 0;
          }
        }

        .banner {
          width: 100%;
          margin-top: 1.2rem;

          @include phone-width() {
            margin: 1.25rem 0;
          }
        }
      }
    }

    &-right {
      background: url("app/template/set_r016/assets/images/login/bg.png") center / contain no-repeat;
      background-size: cover;
      min-width: 34rem;
      height: 100%;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      @include phone-width() {
        width: 100%;
        min-width: unset;
        justify-content: flex-start;
        padding: 0 1rem;
        background: url("app/template/set_r016/assets/images/login/bg-mobile.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position-x: center;
        background-position-y: 4rem;
      }

      &-container {
        background: $neutral03;
        width: 21.43754rem;
        box-shadow: $shadow03;
        border-radius: 0.625rem;
        padding: 1.25rem 1.25rem 0.625rem;
        box-shadow: $shadow03;
        z-index: 1;

        @include phone-width() {
          width: 100%;
        }

        .title {
          @include fontStyle(1.5rem);
          color: $primary04;
        }

        .close {
          font-size: 1rem;
          color: $primary04;
        }

        .form-area {
          margin-top: 1.875rem;
          width: 100%;

          .otp-style {
            width: 100%;

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

          .btn-otp {
            @include fontStyle(0.875rem);
            width: 100%;
            background: $gradient01;
            color: $neutral01;
            border-radius: 0.625rem;
            padding: 0 0.625rem;
            height: 2.25rem;
            margin-top: 0.625rem;
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

          .forgot-pass {
            @include fontStyle(0.875rem, 400);

            color: $primary09;
            cursor: pointer;
            display: flex;
            justify-content: flex-end;
            margin-top: 0.625rem;
          }

          .more-button-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            padding-top: 1.25rem;
            margin-top: 1.25rem;
            border-top: 1px solid $neutral04;

            .more-button {
              width: calc(50% - 0.3125rem);
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: $neutral04;
              border-radius: 0.625rem;
              padding: 0.625rem;
              margin-bottom: 0.625rem;
              cursor: pointer;

              &-icon {
                width: 1.25rem;
                height: 1.25rem;
              }

              &-text {
                @include fontStyle();
                color: $neutral10;
                margin-left: 0.375rem;
                word-break: break-all;
              }
            }
          }
        }
      }

      .introduction {
        width: 21.43754rem;
        background: $neutral10;
        padding: 0.625rem 1.25rem;
        margin-top: 0.625rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.625rem;
        cursor: pointer;
        z-index: 1;

        @include phone-width() {
          width: 100%;
          margin-bottom: 1.25rem;
        }

        .logo {
          width: 7.5rem;
        }

        .text {
          @include fontStyle(0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: $neutral01;

          &-icon {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.375rem;
          }
        }
      }
    }
  }
}
</style>
