<template>
  <div :class="`${isDown.phone ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="isPhoneRegisterMode ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
      <!-- 手機號碼欄位 -->
      <div v-if="isPhoneRegisterMode">
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>
        <div class="form-container">
          <!-- sms login -->
          <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
            <div class="sms-country-phone-row">
              <!-- country code -->
              <div class="form-input-container">
                <div class="form-input-label">{{ $t("member.register.country") }}</div>
                <q-select
                  v-model="formLogin.country"
                  :options="envInfo.international_calling_code"
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input border-bottom-full flex-[1]"
                  dense
                  borderless
                  :display-value="formLogin.country ? undefined : $t('member.register.country')"
                  ref="smsRef"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                </q-select>
              </div>
              <!-- phone -->
              <div class="form-input-container flex-1">
                <div class="form-input-label">{{ $t("member.login.phone") }}</div>
                <q-input
                  v-model="formLogin.phone"
                  ref="phoneRef"
                  class="form-input border-bottom-full flex-[2]"
                  dense
                  borderless
                  :placeholder="$t('placeholder.pleaseEnterPhoneNumber')"
                  lazy-rules
                  :rules="[Rules.required()]"
                  inputmode="numeric"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                </q-input>
              </div>
            </div>

            <!-- SMS -->
            <div class="form-input-container">
              <div class="form-input-label">{{ $t("member.login.verifyCode") }}</div>
              <div class="sms-container">
                <q-input
                  v-model="formLogin.sms_otp"
                  class="form-input"
                  dense
                  borderless
                  :placeholder="$t('placeholder.pleaseEnterVerificationCode')"
                  lazy-rules
                  :rules="[Rules.required()]"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
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
            </div>
          </template>
          <!-- password login -->
          <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password">
            <div class="sms-country-phone-row">
              <div class="form-input-container">
                <div class="form-input-label">{{ $t("member.register.country") }}</div>
                <!-- country code -->
                <q-select
                  v-model="formLogin.country"
                  :options="envInfo.international_calling_code"
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input border-bottom-full flex-[1]"
                  dense
                  borderless
                  :display-value="formLogin.country ? undefined : $t('member.register.country')"
                  ref="smsRef"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                </q-select>
              </div>
              <div class="form-input-container flex-1">
                <div class="form-input-label">{{ $t("member.login.phone") }}</div>

                <!-- phone -->
                <q-input
                  v-model="formLogin.phone"
                  ref="phoneRef"
                  class="form-input border-bottom-full flex-[2]"
                  dense
                  borderless
                  :placeholder="$t('placeholder.pleaseEnterPhoneNumber')"
                  lazy-rules
                  :rules="[Rules.required()]"
                  inputmode="numeric"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                </q-input>
              </div>
            </div>
            <!-- 密碼欄位 -->
            <div class="form-input-container">
              <div class="form-input-label">{{ $t("member.register.password") }}</div>
              <q-input
                v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
                v-model="formLogin.password"
                class="form-input"
                dense
                borderless
                :placeholder="$t('placeholder.pleaseEnterPassword')"
                lazy-rules
                :rules="[Rules.required()]"
                :type="showPassword ? 'text' : 'password'"
              >
                <template #prepend>
                  <div class="divider-error"></div>
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
          </template>
        </div>
      </div>
      <!-- 帳號欄位 -->
      <div class="form-container" v-else>
        <div class="form-input-container">
          <div class="form-input-label">{{ $t("menu.account") }}</div>
          <q-input
            v-model="formLogin.username"
            class="form-input"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[Rules.required()]"
          >
            <template #prepend>
              <div class="divider-error"></div>
            </template>
          </q-input>
        </div>
        <div class="form-input-container">
          <div class="form-input-label">{{ $t("member.register.password") }}</div>
          <q-input
            v-model="formLogin.password"
            class="form-input"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #prepend>
              <div class="divider-error"></div>
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
      </div>
      <!-- 忘記密碼 -->
      <div v-if="isCash" class="forgot-container">
        <q-btn flat class="hide-hover" :disable="isLoading" @click="$router.push({ name: 'ForgotPass' })">
          {{ `${$t("member.forgotPassword.forgotPassword")}?` }}
        </q-btn>
      </div>
      <!-- 登入按鈕 -->
      <q-btn
        color="primary"
        class="btn-submit mt-6 hide-hover"
        type="submit"
        :disable="!agreeTerms"
        :loading="isLoading"
      >
        {{ $t("common.btn.login") }}
      </q-btn>
      <!-- 註冊按鈕 -->
      <div v-if="isCash" class="btn-password-container">
        <!-- 切換帳號、手機 btn -->
        <div v-if="isPhoneRegisterMode" class="flex items-center">
          <q-btn
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            flat
            class="btn-password hide-hover"
            text-color="primary"
            @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
            :disable="isLoading"
          >
            {{ $t("common.btn.smsLogin") }}
          </q-btn>
          <q-btn
            v-else
            flat
            class="btn-password hide-hover"
            text-color="primary"
            @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
            :disable="isLoading"
          >
            {{ $t("common.btn.passwordLogin") }}
          </q-btn>
          <div class="divider-vertical">/</div>
        </div>

        <div class="mr-3">{{ $t("member.login.noAccount") }}</div>
        <q-btn
          flat
          class="btn-password hide-hover"
          text-color="primary"
          @click="changeDialog(false)"
          :disable="isLoading"
        >
          {{ $t("member.forgotPassword.registeredAccount") }}
        </q-btn>
      </div>
      <!-- 條款、幫助 -->
      <div class="form-bottom">
        <div class="terms-container">
          <div class="term-row">
            <span>
              1. {{ $t("member.terms.news") }}
              <router-link :to="{ name: 'webInformation', params: { id: 1 } }" target="_blank" class="text-primary">
                {{ $t("home.privacy_policy") }}</router-link
              >.
            </span>
          </div>
          <div class="term-row">
            <span>
              2. {{ $t("member.terms.over21") }} {{ companyName }}
              <router-link :to="{ name: 'webInformation', params: { id: 1 } }" target="_blank" class="text-primary">
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
          <q-checkbox
            v-if="isDown.phone"
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
      <div v-if="isDown.phone" class="register-title">{{ $t("menu.createAccount") }}</div>

      <h3 v-if="isPhoneRegisterMode" class="form-subtitle">
        {{ $t("member.login.phoneFormSubtitle") }}
      </h3>

      <div class="form-container" v-if="customInputList.length !== 0">
        <!-- CMS欄位 -->
        <PhoneInput
          v-model:phone="formRegister.phone"
          v-model:country="formRegister.country"
          :class="'form-input'"
          :phone-disable="phoneColumnDisable"
        ></PhoneInput>
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
            :custom-placeholder="genPlaceholderByColumnRule(column)"
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
      <q-btn color="primary" class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("menu.createAccount") }}
      </q-btn>
      <div class="btn-password-container">
        <div class="mr-3">{{ $t("member.login.hasAccount") }}</div>
        <q-btn
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeDialog(true)"
          :disable="isLoading"
        >
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
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
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
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import {
  FIELD_TYPE,
  LOGIN_METHOD,
  SMS_OTP_TYPE,
  COLUMN_NAME,
  REGISTER_METHOD,
  PIXEL_CODE_TYPE
} from "src/common/utils/constants"
import { useEventBus } from "src/common/hooks/useEventBus"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import { onMounted, reactive, ref, defineExpose, watch } from "vue"
import { useI18n } from "vue-i18n"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { genPlaceholderByColumnRule } from "src/common/utils/customRulesUtils"

const { getGiftsList } = useClaimGift()
const { isDown } = useMediaQuery()
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isPhoneRegisterMode, companyName, isCash, envData } = useEnv()
const envInfo = envData()
const { isLoading, handleGetOTP, handleRegisterCustomInput, handleLogin, handleRegister, auth } = useAuth()
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

// watch(isLoginMode, (newVal) => {
//   emits("loginMode", newVal)
// })

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
@import "app/template/set_r017/assets/css/form.scss";

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;

  :deep(.q-field__inner) {
    i {
      color: var(--neutral-01);
    }
  }
}

.pc {
  .form-container {
    .input-label {
      color: var(--neutral-01);
      font-size: 0.8rem;
    }
  }

  .form-input-container {
    min-width: 8rem;
  }

  .form-input-label {
    color: var(--neutral-04);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .form-input {
    margin-top: 0;

    ::v-deep(.q-field__inner) {
      height: 2.7875rem;
      border-radius: 0.25rem;
      border: 2px solid var(--neutral-05);
      background: var(--secondary-10);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

      .q-field__native {
        color: var(--neutral-01);
      }

      .q-field__control {
        color: var(--primany-01);

        input {
          padding: 0 0.75rem;
        }
      }
    }
  }

  .form-subtitle {
    margin: 0 0 1.75rem;
    font-size: 0.875rem;
    color: var(--neutral-04);
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
    text-align: center;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .form-input {
      flex: 1;

      :deep(.q-field__control) {
        color: var(--primany-01);
      }
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 9.375rem;
      height: 2.7875rem;
      font-weight: 700;
      font-size: 0.75rem;

      &.counting {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
        color: var(--neutral-01);
        opacity: 1 !important;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 700;
    text-transform: capitalize;
    border-radius: 0.25rem;
    color: var(--primany-01);
    height: 3.75rem;
    width: 100%;
    position: relative;
    margin: 1.5rem auto;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--neutral-04);
    font-weight: 400;
    font-size: 0.875rem;

    .divider-vertical {
      color: var(--primany-01);
      margin: 0 0.75rem;
    }

    .btn-password {
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--neutral-01);

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
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .terms-container {
      width: 30.25rem;
      height: 8.75rem;
      border: 1px solid var(--neutral-05);
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
        background-color: var(--primany-01);
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: var(--neutral-04);
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
        color: var(--neutral-01);
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
      position: absolute;
      right: 0;
      bottom: -5rem;
      left: 0;
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: var(--neutral-04);
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
          color: var(--primany-01);
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
  .form-input-container {
    min-width: 8rem;
  }

  .form-input-label {
    color: var(--neutral-04);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .form-input {
    height: 3.75rem;
    padding: 0;
    margin-bottom: 0;
    ::v-deep(.q-field__inner) {
      height: 2.7875rem;
      border-radius: 0.25rem;
      border: 2px solid var(--neutral-05);
      background: var(--secondary-10);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

      .q-field__native {
        color: var(--neutral-01);
      }

      .q-field__control {
        color: var(--primany-01);
        padding: 0;

        input {
          padding: 0 0.75rem;
        }
      }
    }
  }
  .form-subtitle {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    color: var(--neutral-04);
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
    text-align: center;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .form-input {
      flex: 1;

      :deep(.q-field__control) {
        color: var(--primany-01);
      }
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 9.375rem;
      height: 2.7875rem;
      font-weight: 700;
      font-size: 0.75rem;
    }
  }

  .register-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--neutral-01);
    text-align: center;
    margin-top: 1.5rem;
  }

  .form-container {
    margin: 1.75rem auto 0;
    border-radius: 0.5rem;
    .input-label {
      padding: 0rem 0.75rem 0rem;
      color: var(--neutral-01);
      font-size: 0.8rem;
    }
  }
  .btn-submit {
    height: 60px;
    width: calc(100% - 1.5rem);
    display: flex;
    margin: 1.5rem auto;
    font-family: inherit;
    font-size: 1rem;
    border-radius: 4px;
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
    color: var(--neutral-01);
    margin-bottom: 1rem;
    font-weight: 400;
    font-size: 0.875rem;

    .divider-vertical {
      color: var(--primany-01);
      margin: 0 0.75rem;
    }

    .btn-password {
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--neutral-01);

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
    border-radius: 16px;
    backdrop-filter: blur(20px);

    .terms-container {
      width: 100%;
      height: 8.75rem;
      border: 1px solid var(--neutral-05);
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.75rem 0.625rem;
      .term-row {
        width: 100%;
        color: var(--neutral-04);
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
      color: var(--neutral-01);
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
        color: var(--neutral-04);
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primany-01);
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
</style>
