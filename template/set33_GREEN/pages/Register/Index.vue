<template>
  <div class="reg-area">
    <div class="back-btn-container"><BackBtn /></div>
    <div class="con-info">
      <div class="con">
        <div class="form-layout">
          <div class="title">{{ $t("menu.register") }}</div>
          <div class="form-validation mt-6" v-if="customInputList.length !== 0">
            <q-form class="modal-form px-4" @submit.prevent="register">
              <!-- CMS欄位 -->
              <div class="input-area" v-if="phoneLabel">
                <label class="field-label" for="">{{ phoneLabel }}</label>
                <div class="field-input width-auto">
                  <PhoneInput
                    v-model:phone="formRegister.phone"
                    v-model:country="formRegister.country"
                    :class="'form-input'"
                  ></PhoneInput>
                </div>
              </div>
              <template v-for="(column, key) in customInputList" :key="key">
                <div class="input-area" v-if="column.column_name === 'sms_otp'">
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`)
                  }}</label>
                  <div class="field-input">
                    <SmsOtpInput
                      :field="column"
                      :phone="formRegister?.phone || ''"
                      :country="formRegister.country || ''"
                      :class="'form-input'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></SmsOtpInput>
                  </div>
                </div>
                <div
                  class="input-area"
                  v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`)
                  }}</label>
                  <div class="field-input">
                    <ExtraInput
                      :field="column"
                      :class="'form-input'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></ExtraInput>
                  </div>
                </div>
                <div
                  class="input-area"
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`)
                  }}</label>
                  <div class="field-input">
                    <!-- 下拉選單類型 -->
                    <ExtraSelect
                      v-model="(formRegister as Request.register)[column?.column_name]"
                      :field="column"
                      :class="'form-input'"
                    ></ExtraSelect>
                  </div>
                </div>
                <div
                  class="input-area"
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`)
                  }}</label>
                  <div class="field-input">
                    <DateInput
                      :field="column"
                      :class="'form-input'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></DateInput>
                  </div>
                </div>
              </template>
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
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"

import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import BackBtn from "src/common/components/btns/BackBtn.vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE, LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { nowLang } = useLanguage()

const { isLoading, handleRegisterCustomInput, handleRegister, handleRegisterSms, handleLogin, handleGetOTP } = useAuth()
const { getUserWalletList, getUserInfo2 } = useUserInfo()
const { getFlagImg } = useCommonImg()
const { isPhoneRegisterMode } = useEnv()

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
  sms_otp: "", // 手機用
  country: "" // 國碼用
})

const formRegister = ref<Request.register>({
  is_customize: true
})

// let formData = reactive<Request.login & Request.register>({
//   login_method: LOGIN_METHOD.Enums.Password,
//   account: "",
//   username: "",
//   password: "",
//   confirm_password: "",
//   fullname: "",
//   ref_account: undefined,
//   email: "",
//   phone: "",
//   contacts: {
//     contact1: "",
//     contact2: ""
//   }
// })
// let formSms = reactive<Request.RegisterSms>({
//   register_method: REGISTER_METHOD.Enums.Phone,
//   phone: "",
//   sms_otp: ""
// })

const phoneLabel = computed(() => {
  const countryItem = customInputList.value.filter((field) => field.column_name === "country")[0]
  const phoneItem = customInputList.value.filter((field) => field.column_name === "phone")[0]
  if (phoneItem)
    return phoneItem?.lang[nowLang.value]
      ? phoneItem?.lang[nowLang.value]
      : t(`member.register.${phoneItem.column_name}`)
  else if (countryItem && !phoneItem)
    return countryItem?.lang[nowLang.value]
      ? countryItem?.lang[nowLang.value]
      : t(`member.register.${countryItem.column_name}`)
  else return null
})

async function register() {
  let status: boolean

  if (isPhoneRegisterMode.value) {
    // 手機註冊模式，使用 RegisterSms API
    // 分開發送手機號碼和國碼
    const registerSmsData: Request.RegisterSms = {
      register_method: REGISTER_METHOD.Enums.Phone,
      phone: formRegister.value.phone!,
      sms_otp: formRegister.value.sms_otp!,
      country: formRegister.value.country!
    }
    const result = await handleRegisterSms(registerSmsData)
    status = result.status
  } else {
    // 一般註冊模式
    const result = await handleRegister(formRegister.value)
    status = result.status
  }

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })

  if (!isPhoneRegisterMode.value) {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  } else {
    formLogin.phone = formRegister.value.phone
    formLogin.sms_otp = formRegister.value.sms_otp
    formLogin.country = formRegister.value.country
    await loginSms()
  }
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp,
    country: formLogin.country
  }
  const { status } = await handleLogin(payload)

  if (!status) {
    return
  }
  await getUserWalletList()
  await getUserInfo2()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "HomePage" })
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
  await getUserWalletList()
  await getUserInfo2()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "HomePage" })
}

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []

  const { referral_code } = route.query
  if (referral_code) {
    formRegister.value.ref_account = referral_code as string
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/main.sass"
.back-btn-container
  min-width: 320px
  width: 990px
  margin-top: 1.25rem
  margin-bottom: .625rem
  +pad-width
    width: 100%
.con
  min-width: 61.875rem
  +phone-width
    min-width: 0
  .form-layout
    width: 950px
    // max-width: 40.625rem
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
::v-deep(.q-field__messages)
  color: #ed4014
  font-size: 0.8rem
  +pad-width
    font-size: 2vw
  +iphone-width
    font-size: 3.2vw
::v-deep(.q-field__marginal)
  height:38px
::v-deep(.q-field__control)
  border-radius: 20px
  height: 38px
  padding-left:10px
  .q-field__native
    font-weight: 500
    height:38px
    &:focus
      color: rgba(28, 30, 34, 0.70)
    // +iphone-width
    //   font-size: 4vw

.form-validation
  margin-top: 25px
  min-width: 950px
  +pad-width
    min-width: 100%
  +iphone-width
    min-width: 100%
</style>
