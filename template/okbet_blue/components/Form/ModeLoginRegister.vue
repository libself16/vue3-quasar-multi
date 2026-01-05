<template>
  <div class="login-register-wrapper" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="isPhoneRegisterMode ? showVerifyModal([handleLoginSms]) : showVerifyModal([login])"
      autocomplete="new-password"
    >
      <!-- 手機號碼 -->
      <div v-if="isPhoneRegisterMode">
        <h2 class="form-title mb-2">
          {{ $t("member.login.phoneFormTitle") }}
        </h2>
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>
        <div class="form-container">
          <q-input
            v-model="formLogin.phone"
            ref="phoneRef"
            class="form-input border-bottom mobile-form-input"
            dense
            borderless
            :placeholder="$t('member.login.phone')"
            lazy-rules
            :rules="[Rules.required()]"
            autocomplete="new-password"
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
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            v-model="formLogin.password"
            class="form-input border-bottom mobile-form-input"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
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
          <!-- SMS -->
          <div class="sms-container" v-else>
            <q-input
              v-model="formLogin.sms_otp"
              class="form-input"
              dense
              borderless
              :placeholder="$t('member.login.verifyCode')"
              lazy-rules
              :rules="[Rules.required()]"
              autocomplete="new-password"
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
              :disable="isLoading || !formLogin.phone"
            />
          </div>
        </div>
      </div>
      <div class="form-container" v-else>
        <q-input
          v-model="formLogin.username"
          class="form-input border-bottom mobile-form-input"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          lazy-rules
          :rules="[Rules.required()]"
          autocomplete="new-password"
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
          v-model="formLogin.password"
          class="form-input border-bottom mobile-form-input"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterPassword')"
          lazy-rules
          :rules="[Rules.required()]"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
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
      <div class="btn-password-container mt-3">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(false)" :disable="isLoading">
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
      <div class="btn-password-container mt-3" v-if="isPhoneRegisterMode">
        <q-btn
          v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("common.btn.smsLogin") }}
        </q-btn>
        <q-btn
          v-else
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.passwordLogin") }}
        </q-btn>
      </div>
      <div class="form-bottom">
        <div class="terms-container">
          <div class="term-row">
            <span>
              1. {{ $t("member.terms.news") }}
              <router-link :to="{ name: 'PrivacyPolicy' }" target="_blank" class="term-link-yellow">
                {{ $t("home.privacy_policy") }}</router-link
              >.
            </span>
          </div>
          <div class="term-row">
            <span>
              2. {{ $t("member.terms.over21") }} {{ companyName }}
              <router-link :to="{ name: 'TermAndCondition' }" target="_blank" class="term-link-yellow">
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
          <!-- $q.platform.is.mobile -->
          <q-checkbox
            v-if="$q.platform.is.mobile"
            v-model="agreeTerms"
            checked-icon="check_circle"
            unchecked-icon="radio_button_unchecked"
            class="agree-checkbox"
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
    </q-form>
    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])" autocomplete="new-password">
      <div class="form-container" v-if="customInputList.length !== 0">
        <!-- CMS欄位 -->
        <PhoneInput
          v-model:phone="formRegister.phone"
          v-model:country="formRegister.country"
          :class="'form-input'"
        ></PhoneInput>
        <template v-for="(column, key) in customInputList" :key="key">
          <!-- 文字輸入框 -->
          <SmsOtpInput
            v-if="column.column_name === 'sms_otp'"
            :field="column"
            :phone="formRegister?.phone"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></SmsOtpInput>
          <ExtraInput
            v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
            :field="column"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></ExtraInput>
          <!-- 下拉選單類型 -->
          <ExtraSelect
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
            v-model="(formRegister as Request.register)[column?.column_name]"
            :field="column"
            :class="'form-input'"
          ></ExtraSelect>
          <DateInput
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
            :field="column"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></DateInput>
        </template>
      </div>
      <q-btn class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <div class="btn-password-container mt-2">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(true)" :disable="isLoading">
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/okbet_blue/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { FIELD_TYPE, LOGIN_METHOD, PIXEL_CODE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isPhoneRegisterMode, companyName } = useEnv()
const { isLoading, handleGetOTP, hiddenColumn, handleRegisterCustomInput, handleLogin, handleRegister, auth } =
  useAuth()
const { getUserWalletList, getUserInfo2 } = useUserInfo()
const { getFavoriteGames } = useGame()
const { loginImg, svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { nowLang } = useLanguage()
const eventbus = injectStrict(EventBusKey)
const { handleOpenLiveChat } = useLiveChat()
const { handleTriggerPixelCode } = usePixelCodes()

const isLoginMode = ref(true)
const agreeTerms = ref(true)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
    case "sms_otp":
      return false

    default:
      return true
  }
}

const customInputList = ref<Response.RegistInputCustomList>([])

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "" // 手機用
})

const formRegister = ref<Request.register>({
  is_customize: true
})

// 切換 登入/註冊 模式
function changeDialog(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formRegister.value = {
    is_customize: true
  }

  if (!status) {
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
  }
}

// 切換手機登入時  - password/otp 模式
function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formLogin.login_method = type
  formLogin.username = ""
  formLogin.password = ""
  formLogin.phone = ""
  formLogin.sms_otp = ""
}

async function register() {
  const { status } = await handleRegister(formRegister.value)

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })

  if (isPhoneRegisterMode.value) {
    formLogin.phone = formRegister.value.phone
    formLogin.sms_otp = formRegister.value.sms_otp
    await loginSms()
  } else {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  }
}

async function getOtpCode() {
  counting.value = true
  const { status } = await handleGetOTP({ phone: formLogin.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

function handleLoginSms() {
  if (formLogin.login_method === LOGIN_METHOD.Enums.Password) {
    formLogin.username = formLogin.phone
    login()
    return
  }
  loginSms()
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp
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

async function login() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
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

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  eventbus.on("openLogin", (show: boolean) => {
    changeDialog(true)
  })

  eventbus.on("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventbus.emit("registerFormReady")
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/form.scss";
@import "app/template/okbet_blue/assets/css/button.scss";

.login-register-wrapper {
  .form-input {
    :deep(.q-field__inner) {
      @apply text-white;
      height: fit-content;
      border: 1px solid $border-dark-secondary;
      border-radius: 0.25rem;
    }
    :deep(.q-field__native) {
      @apply text-white;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px $primary-bg-light-blue inset !important;
        -webkit-text-fill-color: #fff !important;
        box-shadow: 0 0 0 30px $primary-bg-light-blue inset !important;
        color: #fff !important;
        border-radius: 0 !important;
      }
    }
  }
  @include phone-width {
    .mobile-form-input {
      :deep(.q-field__inner) {
        border: none;
      }
    }
  }
}

.pc {
  .form-title {
    @apply text-white text-base font-bold;
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

    :deep(.form-input) {
      margin-top: 0 !important;
    }

    .form-input {
      width: 18.875rem;
    }
    .btn-send {
      background: $primary-yellow;
      color: $secondary-bg-light-blue;
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $primary-bg-light-blue;
    height: 2.5rem;
    width: 100%;
    position: relative;
    background: $primary-yellow;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-password {
      color: $primary-yellow;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: $primary-yellow;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
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
      border: 1px solid $border-dark-secondary;
      border-radius: 1rem;
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
        background-color: rgb(204, 204, 204);
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        font-family: "Open Sans";
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
        margin: 0;
        padding: 0;
        font-size: 0.875rem;
        line-height: 1;
        list-style: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
          sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        position: relative;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      position: absolute;
      right: 0;
      bottom: -5rem;
      left: 0;
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-yellow;
          cursor: pointer;
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
}
.h5 {
  .form-title {
    @apply text-white text-base font-bold;
    text-align: center;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-subtitle {
    @apply text-white text-base;
    font-family: HelveticaLight;
    font-weight: 200;
    line-height: 1;
    text-transform: capitalize;
    text-align: center;
    min-height: 1.375rem;
  }
  .sms-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .form-input {
      width: 15.5rem;
    }
    .btn-send {
      background: $primary-yellow;
      color: $secondary-bg-light-blue;
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin: 0.1875rem 1rem 0 1rem;
    }
  }
  .form-container {
    margin: 0.6875rem auto;
    box-shadow: rgba(0, 24, 30, 0.06) 0px 0.4375rem 0.6875rem;
    padding-bottom: 0.625rem;
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    background: $primary-yellow;
    color: $secondary-bg-light-blue;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.0625rem;
    margin-bottom: 1rem;
    .btn-password {
      color: $primary-yellow;
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: $primary-yellow;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    border-radius: 16px;
    border: 0.5px solid rgb(202, 222, 255);
    backdrop-filter: blur(20px);
    .terms-container {
      @apply text-white;
      width: 100%;
      height: 8.75rem;
      border: 1px solid $border-dark-secondary;
      border-radius: 1rem;
      overflow-y: scroll;
      padding: 0.75rem 0.625rem 0px;
      .term-row {
        width: 100%;
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
        font-weight: 400;
        font-family: Helvetica;
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
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-yellow;
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
}
.term-link-yellow {
  color: $primary-yellow;
}
.agree-container {
  ::v-deep(.q-checkbox__inner--truthy) {
    color: $primary-yellow !important;
  }
}
</style>
