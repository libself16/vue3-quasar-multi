<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- sms -->
    <q-form v-if="formSms.login_method === LOGIN_METHOD.Enums.Sms" @submit="handleSmsSubmit">
      <h2 class="form-title">
        {{ $t("member.login.phoneFormTitle") }}
      </h2>
      <h3 class="form-subtitle">
        {{ $t("member.login.phoneFormSubtitle") }}
      </h3>
      <!-- 手機號碼 -->
      <div class="form-container">
        <q-input
          v-model="formSms.phone"
          ref="phoneRef"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.login.phone')"
          lazy-rules
          :rules="[Rules.noRule]"
          @blur="checkPhone"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- SMS -->
        <div class="sms-container">
          <q-input
            v-model="formSms.sms_otp"
            class="form-input"
            dense
            borderless
            :placeholder="$t('member.login.verifyCode')"
            lazy-rules
            :rules="[Rules.otp]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('shield')" alt="verify-code" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <!-- 倒數秒數 -->
          <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
            <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
              {{ `${totalSeconds}S` }}
            </vue-countdown>
          </q-btn>
          <q-btn
            v-else
            class="btn-send hide-hover"
            :label="$t('common.btn.send')"
            @click="getOtpCode"
            :disable="isLoading || !formSms.phone"
          />
        </div>
      </div>
      <q-btn class="btn-submit mt-1 hide-hover" type="submit" :disable="!agreeTerms" :loading="isLoading">
        {{ $t("common.btn.register") }} / {{ $t("common.btn.login") }}
      </q-btn>
      <div class="btn-password-container">
        <q-btn
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.password") }} {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
    <!-- password -->
    <q-form v-else @submit="showVerifyModal([loginPassword])">
      <div class="form-container">
        <q-input
          v-model="formSms.username"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.login.phone')"
          lazy-rules
          :rules="[Rules.noRule]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <q-input
          v-model="formSms.password"
          class="form-input"
          dense
          borderless
          :placeholder="$t('common.btn.password')"
          lazy-rules
          :rules="[(val) => Rules.password(val)]"
          :type="showPassword ? 'text' : 'password'"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('password')" alt="phone-number" />
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
      </div>

      <div class="forgot-container">
        <q-btn flat class="hide-hover" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div>
      <q-btn class="btn-submit mt-5 hide-hover" type="submit" :disable="!agreeTerms" :loading="isLoading">
        {{ $t("common.btn.login") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("member.login.useVerifyCode") }}
        </q-btn>
      </div>
    </q-form>
    <div class="form-bottom">
      <div class="terms-container">
        <div class="term-row">
          <span>
            1. {{ $t("member.terms.news") }}
            <router-link :to="{ name: 'PrivacyPolicy' }" target="_blank" class="text-primary">
              {{ $t("home.privacy_policy") }}</router-link
            >.
          </span>
        </div>
        <div class="term-row">
          <span>
            2. {{ $t("member.terms.over21") }} {{ companyName }}
            <router-link :to="{ name: 'TermAndCondition' }" target="_blank" class="text-primary">
              {{ $t("home.term_condition") }}</router-link
            >.
          </span>
        </div>
        <div class="term-row">
          <span> 3. {{ $t("member.terms.notGovernment") }} </span>
        </div>
        <div class="term-row">4. {{ $t("member.terms.notStudent") }}</div>
        <div class="term-row">5. {{ $t("member.terms.companyPunish", { company: companyName }) }}</div>
      </div>
      <div class="agree-container">
        <q-checkbox
          v-if="$q.platform.is.mobile"
          v-model="agreeTerms"
          checked-icon="check_circle"
          unchecked-icon="radio_button_unchecked"
          color="term"
          size="xs"
          :disable="isLoading"
        />
        <q-checkbox v-else v-model="agreeTerms" color="term" size="xs" :disable="isLoading" />

        <span class="agree-text">{{ $t("member.terms.agreeTerms") }} </span>
      </div>
      <div class="help-container">
        <p class="help-row">
          <span>{{ $t("member.login.needHelp") }} ? </span>
          <span class="contact-us" @click="handleOpenLiveChat">
            <div class="contact-icon">
              <img :src="svgIcon('service')" alt="phone-number" />
            </div>
            {{ $t("home.contact_us") }}
          </span>
        </p>
        <img :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="game-responsibly" />
      </div>
    </div>
    <div v-if="$q.platform.is.mobile" class="copyright">
      <div class="flex justify-center items-center">
        <img :src="loginImg('pagcor.png')" alt="pagcor" class="w-24 h-7" />
        <img :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="w-24 h-7 ml-3" />
      </div>
      <div class="mt-1">Copyright© 2024 {{ companyName }} ALL RIGHTS RESERVED</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { ERROR_CODE_TYPE, LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleRegisterSms, handleLogin, handleGetOTP, handleCheckPhone, auth } = useAuth()
const { getUserWalletList, getUserInfo, getUserInfo2 } = useUserInfo()
const { getFavoriteGames } = useGame()
const { companyName } = useEnv()
const { handleOpenLiveChat } = useLiveChat()
const { loginImg, svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const eventbus = injectStrict(EventBusKey)

const phoneRef = ref()
const counting = ref(false)
const agreeTerms = ref(true)
const numberExist = ref(false)
const showPassword = ref(false)

const props = defineProps({
  isPasswordLoginMode: {
    type: Boolean,
    default: false,
    required: false
  }
})

let formSms = reactive<Request.RegisterSms & Request.login>({
  login_method: LOGIN_METHOD.Enums.Sms,
  register_method: REGISTER_METHOD.Enums.Phone,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "" // 手機用
})

function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formSms.login_method = type
  formSms.username = ""
  formSms.password = ""
  formSms.phone = ""
  formSms.sms_otp = ""
}

async function checkPhone() {
  phoneRef.value.validate()
  if (phoneRef.value.hasError) {
    return
  }
  const { code } = await handleCheckPhone({ phone: formSms.phone })

  if (code === ERROR_CODE_TYPE.Enums.PHONE_EXIST) {
    numberExist.value = true
    return
  }

  numberExist.value = false
}

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

function handleSmsSubmit() {
  if (numberExist.value) {
    showVerifyModal([loginSms])
    return
  }
  showVerifyModal([registerSms])
}

async function registerSms() {
  const payload: Request.RegisterSms = {
    register_method: REGISTER_METHOD.Enums.Phone,
    phone: formSms.phone,
    sms_otp: formSms.sms_otp
  }
  const { status } = await handleRegisterSms(payload)
  if (!status) {
    return
  }
  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })

  await loginSms()
}

async function loginPassword() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formSms.username,
    password: formSms.password
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await loginAfter()
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formSms.phone,
    sms_otp: formSms.sms_otp
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await loginAfter()
}

async function loginAfter() {
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    await getUserInfo()
    await getUserInfo2()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
  }
  eventbus.emit("openLogin", false)
}

function goForgotPassword() {
  eventbus.emit("openForgotPassword", true)
  eventbus.emit("openLogin", false)
}

onMounted(() => {
  if (props.isPasswordLoginMode) {
    changeLoginMethod(LOGIN_METHOD.Enums.Password)
  }

  eventbus.on("openLogin", (show: boolean, isPasswordLogin?: boolean) => {
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  })

  eventbus.on("changeRegisterForm", () => {
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  })

  eventbus.emit("registerFormReady")
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/form.scss";
@import "app/template/okbet_purple/assets/css/button.scss";
@import "app/template/okbet_purple/assets/css/product.scss";

.pc {
  .form-title {
    font-size: 1rem;
    color: $text-light-secondary;
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $color-subtitle;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .form-input {
      width: 18.875rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
      background: $bg-secondary;
      color: $text-light-secondary;

      &.counting {
        opacity: 1 !important;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    height: 2.5rem;
    width: 100%;
    position: relative;
    background: $bg-secondary;
    color: $text-light-secondary;
  }
  .btn-password-container {
    @apply flex justify-center items-center;
    color: $text-light-secondary;
    .btn-password {
      @apply font-normal text-sm;
      overflow-wrap: break-word;
    }
  }
  .form-bottom {
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      width: 25rem;
      height: 8.75rem;
      border: 1px solid $border-dark;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.5rem 0.375rem;
      margin-bottom: 0.5rem;
      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $border-dark;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: $text-light-secondary;
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.13rem;
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }
    .agree-container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .agree-text {
        @apply text-sm relative cursor-pointer;
        margin: 0;
        padding: 0;
        color: $text-light-secondary;
        line-height: 1;
        list-style: none;
        white-space: nowrap;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      position: absolute;
      right: 0;
      bottom: 0.625rem;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        @apply text-sm font-semibold;
        color: $text-light-secondary;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          @apply flex items-center font-normal cursor-pointer;
          height: 1.5rem;
          color: $bg-secondary;
          .contact-icon {
            margin: 0 0.625rem;
            img {
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }
      .game-responsibly {
        width: 4.6875rem;
        height: 1.5625rem;
      }
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
    }
  }
}

.h5 {
  .form-title {
    font-family: Helvetica;
    text-align: center;
    color: $text-gray-secondary;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-subtitle {
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: $text-gray-secondary;
    text-align: center;
    min-height: 1.375rem;
  }
  .form-container {
    margin: 0.6875rem auto;
    background: $bg-dark-secondary;
    border: 1px solid $border-dark;
    border-radius: 0.5rem;
  }
  .sms-container {
    @apply w-full relative;
    .btn-send {
      @apply absolute;
      width: 8.9375rem;
      height: 3rem;
      top: 0.5rem;
      right: 0.75rem;
      overflow: inherit;
      line-height: 2.1875rem;
      color: $text-light-secondary;
      background: $bg-secondary;
      font-size: 0.9647rem;
      border-radius: 0.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: capitalize;
      &.counting {
        &.disabled {
          opacity: 1 !important;
        }
      }
      &.disabled {
        opacity: 0.5 !important;
      }
    }
  }
  .btn-submit {
    @apply w-full;
    height: 3.0625rem;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    background: $bg-secondary;
    color: $text-light-secondary;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    @apply flex justify-center items-center;
    margin-top: 1.0625rem;
    .btn-password {
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
      text-transform: capitalize;
    }
  }
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    color: $text-light-secondary;
    backdrop-filter: blur(20px);
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border: 1px solid $border-dark;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.75rem 0.625rem 0px;
      .term-row {
        width: 100%;
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
        font-weight: 400;
      }
    }
    .agree-container {
      width: 100%;
      padding-top: 0.5rem;
      box-shadow: rgba(0, 24, 30, 0.06) 0px -4px 6px;
      .agree-text {
        font-size: 0.8269rem;
        line-height: 1.125rem;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.625rem;
      .help-row {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        color: $text-light-secondary;
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $bg-secondary;
          cursor: pointer;
          .contact-icon {
            margin: 0 2px;
            img {
              width: 1.25rem;
              height: 1.25rem;
            }
          }
        }
      }
      .game-responsibly {
        display: none;
      }
    }
  }
  .copyright {
    margin-top: 1.25rem;
    color: $text-light-secondary;
    text-align: center;
    font-family: Helvetica;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.0625rem;
    text-transform: capitalize;
    padding: 0px 0px 1.3125rem;
    letter-spacing: 0px;
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
}
.terms-container {
  .text-primary {
    color: $bg-secondary !important;
  }
}
.form-container {
  :deep(.q-field__native) {
    color: $text-light-secondary;
  }
  :deep(.q-field__inner) {
    border: 1px solid $border-dark !important;
  }
}
.h5 {
  .form-container {
    :deep(.q-field__inner) {
      border: none !important;
    }
  }
}
.agree-container {
  :deep(.q-checkbox__bg) {
    color: $bg-secondary !important;
  }
  :deep(.q-checkbox__inner) {
    color: $bg-secondary !important;
  }
}
</style>
