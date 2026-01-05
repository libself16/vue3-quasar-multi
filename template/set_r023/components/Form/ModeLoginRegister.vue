<template>
  <div :class="`${isLargeTablet ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="isPhoneRegisterMode ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
      <!-- 手機號碼欄位 -->
      <div v-if="isPhoneRegisterMode">
        <h2 class="form-title mb-2">
          {{ $t("member.login.phoneFormTitle") }}
        </h2>
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>
        <div class="form-container">
          <!-- sms login -->
          <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
            <div class="sms-country-phone-row">
              <!-- country code -->
              <q-select
                v-model="formLogin.country"
                :options="envInfo.international_calling_code"
                lazy-rules
                :rules="[Rules.required()]"
                class="form-input border-bottom border-bottom-full flex-[1]"
                dense
                borderless
                :display-value="formLogin.country ? undefined : $t('member.register.country')"
                ref="smsRef"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('country')" alt="country-code" />
                  </div>
                  <div class="divider"></div>
                </template>
              </q-select>
              <!-- phone -->
              <q-input
                v-model="formLogin.phone"
                ref="phoneRef"
                class="form-input border-bottom border-bottom-full flex-[2]"
                dense
                borderless
                :placeholder="$t('member.login.phone')"
                lazy-rules
                :rules="[Rules.required()]"
                inputmode="numeric"
                autocomplete="tel"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('phone')" alt="phone-number" />
                  </div>
                  <div class="divider"></div>
                </template>
              </q-input>
            </div>

            <!-- SMS -->
            <div class="sms-container">
              <q-input
                v-model="formLogin.sms_otp"
                class="form-input"
                dense
                borderless
                :placeholder="$t('member.login.verifyCode')"
                lazy-rules
                :rules="[Rules.required()]"
                autocomplete="one-time-code"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('shield')" alt="verify-code" />
                  </div>
                  <div class="divider"></div>
                </template>
              </q-input>
              <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
                <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
                  {{ `${totalSeconds}S` }}
                </vue-countdown>
              </q-btn>
              <q-btn
                v-else
                color="primary"
                class="btn-send hide-hover"
                :label="$t('common.btn.send')"
                @click="getLoginOtpCode"
                :disable="isLoading || !formLogin.phone || !formLogin.country"
              />
            </div>
          </template>

          <!-- password login -->
          <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password">
            <div class="sms-country-phone-row">
              <!-- country code -->
              <q-select
                v-model="formLogin.country"
                :options="envInfo.international_calling_code"
                lazy-rules
                :rules="[Rules.required()]"
                class="form-input border-bottom border-bottom-full flex-[1]"
                dense
                borderless
                :display-value="formLogin.country ? undefined : $t('member.register.country')"
                ref="smsRef"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('country')" alt="country-code" />
                  </div>
                  <div class="divider"></div>
                </template>
              </q-select>
              <!-- phone -->
              <q-input
                v-model="formLogin.phone"
                ref="phoneRef"
                class="form-input border-bottom border-bottom-full flex-[2]"
                dense
                borderless
                :placeholder="$t('member.login.phone')"
                lazy-rules
                :rules="[Rules.required()]"
                inputmode="numeric"
                autocomplete="tel"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('phone')" alt="phone-number" />
                  </div>
                  <div class="divider"></div>
                </template>
              </q-input>
            </div>
            <!-- 密碼欄位 -->
            <q-input
              v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
              v-model="formLogin.password"
              class="form-input border-bottom"
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
          </template>
        </div>
      </div>
      <!-- 帳號欄位 -->
      <div class="form-container" v-else>
        <q-input
          v-model="formLogin.username"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          lazy-rules
          :rules="[Rules.required()]"
          autocomplete="username"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="loginImg(`account${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <q-input
          v-model="formLogin.password"
          class="form-input border-bottom"
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
              <img :src="loginImg(`password${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
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
      <!-- 忘記密碼 -->
      <div v-if="isCash" class="forgot-container">
        <q-btn flat class="hide-hover" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div>
      <!-- 登入按鈕 -->
      <q-btn class="btn-submit mt-5 mb-3 hide-hover" type="submit" :disable="!agreeTerms" :loading="isLoading">
        {{ $t("common.btn.login") }}
      </q-btn>
      <!-- 註冊按鈕 -->
      <div v-if="isCash" class="btn-password-container mb-3">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(false)" :disable="isLoading">
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
      <!-- 切換帳號、手機 btn -->
      <div class="btn-password-container mb-3" v-if="isPhoneRegisterMode">
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

      <!-- 條款、幫助 -->
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
          <div class="term-row">
            <span>4. {{ $t("member.terms.notStudent") }}</span>
          </div>
          <div class="term-row">
            <span>5. {{ $t("member.terms.companyPunish", { company: companyName }) }}</span>
          </div>
        </div>
        <div class="agree-container">
          <!-- isLargeTablet -->
          <q-checkbox
            v-if="isLargeTablet"
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
    </q-form>
    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
      <div class="form-container" v-if="customInputList.length">
        <!-- CMS欄位 -->
        <PhoneInput
          v-model:phone="formRegister.phone"
          v-model:country="formRegister.country"
          :class="'form-input'"
          :phone-disable="phoneColumnDisable"
        />
        <template v-for="(column, key) in customInputList" :key="key">
          <!-- 文字輸入框 -->
          <SmsOtpInput
            v-if="column.column_name === 'sms_otp'"
            :field="column"
            :phone="formRegister?.phone"
            :country="formRegister?.country"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></SmsOtpInput>
          <ExtraInput
            v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
            :field="column"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          />

          <!-- 下拉選單類型 -->
          <ExtraSelect
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
            v-model="(formRegister as Request.register)[column?.column_name]"
            :field="column"
            :class="'form-input'"
          />
          <DateInput
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
            :field="column"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          />
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

      <div
        v-if="promotionState.isFinishSpinRegisterRoulette && firstRegisterPromotion"
        class="promotion-register-wrapper"
      >
        <div class="promotion-register-content">
          <div class="content-title">{{ $t("promotion.signing_up") }}</div>
          <div class="content-value">
            {{ getCurrencyCodeById(firstRegisterPromotion.reward[0].currency_id) }}
            {{ moneyFormat(firstRegisterPromotion.reward[0].amount) }}
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/set_r023/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import {
  FIELD_TYPE,
  LOGIN_METHOD,
  SMS_OTP_TYPE,
  ERROR_CODE_TYPE,
  COLUMN_NAME,
  REGISTER_METHOD,
  PIXEL_CODE_TYPE
} from "src/common/utils/constants"
import { useEventBus } from "src/common/hooks/useEventBus"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import { onMounted, reactive, ref, computed, defineExpose } from "vue"
import { useI18n } from "vue-i18n"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"

const { getGiftsList } = useClaimGift()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLargeTablet } = useMediaQuery()
const { isPhoneRegisterMode, companyName, isCash, envData } = useEnv()
const envInfo = envData()
const { isLoading, handleGetOTP, handleRegisterCustomInput, handleLogin, handleRegister, auth, handleCheckPhone } =
  useAuth()
const { getUserWalletList, getAccountInfo } = useUserInfo()
const { getFavoriteGames } = useGame()
const { loginImg, svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { eventOn, eventEmit } = useEventBus()
const { handleOpenLiveChat } = useLiveChat()
const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const { handleTriggerPixelCode } = usePixelCodes()

const isSmsLogin = computed(() => isPhoneRegisterMode.value && formLogin.login_method === LOGIN_METHOD.Enums.Sms)

const isLoginMode = ref(true)
const agreeTerms = ref(true)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const phoneColumnDisable = ref(false)
const phoneRef = ref()
const smsRef = ref()

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
  country: "", // 手機用
  phone: "", // 手機用
  sms_otp: "" // 手機用
})

const formRegister = ref<Request.register>({
  is_customize: true
})

function handlePhoneInput(val: string) {
  formLogin.phone = val.replace(/[^0-9]/g, "")
}

// 切換 登入/註冊 模式
function changeDialog(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formLogin.sms_otp = ""
  formLogin.country = ""
  formRegister.value = {
    is_customize: true
  }

  if (status) {
    formLogin.phone = ""
    phoneColumnDisable.value = false
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
  formLogin.country = ""
}

async function register() {
  if (isPhoneRegisterMode.value) {
    formRegister.value.register_method = REGISTER_METHOD.Enums.Phone
  }
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
    formLogin.country = formRegister.value.country
    await phoneLoginSms()
  } else {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await accountLogin()
  }
}

async function getLoginOtpCode() {
  smsRef.value.validate()
  if (smsRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top"
    })
  }
  phoneRef.value.validate()
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top"
    })
  }

  counting.value = true
  const payload: Request.GetOTP = {
    phone_number: formLogin.phone as string,
    country_code: formLogin.country,
    request_type: SMS_OTP_TYPE.Enums.Login
  }
  const { status } = await handleGetOTP(payload)
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

async function handlePhoneLogin() {
  // 手機模式下，使用密碼登入
  if (formLogin.login_method === LOGIN_METHOD.Enums.Password) {
    phoneLoginPassword()
    return
  }

  phoneLoginSms()
}

async function accountLogin() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }

  await loginAfter()
}

async function phoneLoginPassword() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    country: formLogin.country,
    phone: formLogin.phone,
    password: formLogin.password
  })

  if (!status) {
    return
  }

  await loginAfter()
}

async function phoneLoginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    country: formLogin.country,
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
    await getGiftsList()
    await getFavoriteGames()
    await getUserWalletList()
    await getAccountInfo()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
  }
  eventEmit("openLogin", false)

  if (auth.value.need_update_profile === true) {
    eventEmit("openUpdateProfile", true)
  }
}

function goForgotPassword() {
  eventEmit("openForgotPassword", true)
  eventEmit("openLogin", false)
}

onMounted(async () => {
  if (isPhoneRegisterMode.value) {
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  }
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []

  eventOn("openLogin", (show: boolean) => {
    changeDialog(true)
  })

  eventOn("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventEmit("registerFormReady")
})

defineExpose({
  isLoginMode
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r023/assets/css/_variable.scss";
@import "app/template/set_r023/assets/css/form.scss";
@import "app/template/set_r023/assets/css/button.scss";

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;
}

.pc {
  height: 100%;
  overflow-y: auto;

  .form-title {
    font-size: 1rem;
    color: var(--secondary-01);
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }
  .form-input {
    ::v-deep(.q-field__inner) {
      height: fit-content;

      .q-field__control {
        &::before {
          border: none;
        }
      }
    }
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: var(--secondary-01);
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
      color: var(--text-01);
      background: var(--primary-01);
      &.counting {
        background: #f0f1f4 !important;
        color: #a7b2c4 !important;
        opacity: 1 !important;
      }
    }
  }

  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    border-radius: 0.5rem;
    color: var(--text-01);
    height: 2.5rem;
    width: 100%;
    position: relative;
    background: var(--primary-01);
    font-family: Open Sans;
  }

  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-01);

    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
      font-family: Open Sans;
    }
  }

  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--primary-01);

    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      font-family: Open Sans;
      padding: 0;
      min-height: 0;
    }
  }

  .form-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border-radius: 0.375rem;
      border: 1px solid var(--neutral-03);
      overflow-y: scroll;
      padding: 0.795625rem 0.6725rem;
      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #cccccc;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: var(--primary-02);
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
      margin: 1rem 0 0.78125rem;
      .agree-text {
        margin: 0;
        padding: 0;
        color: var(--secondary-01);
        font-size: 0.875rem;
        line-height: 1;
        list-style: none;
        position: relative;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: var(--secondary-01);
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0 0 0.84375rem;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primary-01);
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
  .promotion-register-wrapper {
    @apply relative w-full h-[6.75rem] rounded-xl mt-[3.25rem];

    &:after {
      @apply block absolute top-0 right-0 bottom-0 left-0 z-0 rounded-xl;
      content: "";
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-image: url("../../../../src/common/assets/images/roulette-game-register/bg-register.png");
    }

    .promotion-register-content {
      @apply absolute z-10;
      max-width: 260px;
      top: 22.5px;
      left: 133.23px;
      font-family: NotoSans;
      font-weight: 700;
      color: #ffffff;

      .content-title {
        @apply block max-w-full;
        font-size: 1rem;
        line-height: 1.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .content-value {
        @apply block max-w-full;
        font-size: 30px;
        line-height: 2.5625rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.h5 {
  .form-title {
    font-family: Helvetica;
    text-align: center;
    color: var(--secondary-01);
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-input {
    margin: 0 0 1rem;

    ::v-deep(.q-field__control) {
      height: 2.5rem;

      &::before {
        border-color: var(--neutral-03);
      }
    }

    &:last-child {
      margin-bottom: 1.17rem;
    }
  }
  .form-subtitle {
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: var(--secondary-01);
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
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin: 0.1875rem 1rem 0 1rem;
      color: var(--text-01);
      background: var(--primary-01);
      &.counting {
        background: #f0f1f4 !important;
        color: #a7b2c4 !important;
        opacity: 1 !important;
      }
    }
  }
  .form-container {
    margin: 0 auto;
    background: var(--neutral-01);
    border-radius: 0.5rem;
    border: 1px solid var(--neutral-03);
  }
  .btn-submit {
    height: 2.75rem;
    width: 100%;
    font-size: 1rem;
    margin-top: 1.036875rem;
    background: var(--primary-01) !important;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    line-height: normal;
    padding: 0;
    color: var(--text-01);
    font-family: Open Sans;

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
    color: var(--primary-01);

    .btn-password {
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
    margin-top: 0.6875rem;
    color: var(--primary-01);

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
    border-radius: 1rem;
    border: 1px solid var(--neutral-03);
    backdrop-filter: blur(20px);
    padding: 0.795625rem 0.6725rem;
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border-radius: 0.375rem;
      overflow-y: scroll;
      .term-row {
        width: 100%;
        color: var(--secondary-01);
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
      margin-top: 0.841875rem;
      .agree-text {
        font-size: 0.8269rem;
        line-height: 1.125rem;
        color: var(--secondary-01);
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.9425rem;
      .help-row {
        display: flex;
        align-items: center;
        color: var(--primary-02);
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primary-01);
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

  .promotion-register-wrapper {
    @apply relative w-full h-[6.21rem] rounded-xl my-[1.6875rem];

    &:after {
      @apply block absolute top-0 right-0 bottom-0 left-0 z-0 rounded-xl;
      content: "";
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-image: url("../../../../src/common/assets/images/roulette-game-register/bg-register.png");
    }

    .promotion-register-content {
      @apply absolute z-10;
      max-width: 240px;
      top: 20.68px;
      left: 122.57px;
      font-family: NotoSans;
      font-weight: 700;
      color: #ffffff;

      .content-title {
        @apply block max-w-full;
        font-size: 0.92rem;
        line-height: 1.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .content-value {
        @apply block max-w-full;
        font-size: 1.725rem;
        line-height: 2.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
