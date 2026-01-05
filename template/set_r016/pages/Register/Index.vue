<template>
  <div v-if="isReady" class="register-page">
    <div class="area-left">
      <div class="area-left-container">
        <img class="logo" :src="getSquareLogo()" />

        <img :src="registerImg('banner.png')" class="banner" alt="register-banner" />
      </div>
    </div>

    <div class="area-right">
      <div class="area-right-container">
        <div class="flex items-center justify-between">
          <div class="title">{{ $t("menu.register") }}</div>
          <q-btn class="close" icon="close" flat dense @click="$router.push('/')" />
        </div>

        <q-form v-if="customInputList.length" class="form-area" @submit.prevent="register">
          <!-- CMS欄位 -->
          <template v-for="(column, key) in customInputList" :key="key">
            <div v-if="column.column_name === 'phone'" class="input-area">
              <div class="field-label form-title">{{ phoneLabel }}</div>
              <PhoneInput
                v-model:phone="formRegister.phone"
                v-model:country="formRegister.country"
                class="form-input"
              />
            </div>

            <div v-else-if="column.column_name === 'sms_otp'" class="input-area">
              <div class="field-label form-title">
                {{ column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`) }}
              </div>
              <SmsOtpInput
                :field="column"
                :phone="formRegister.phone || ''"
                :country="formRegister.country || ''"
                class="form-input"
                v-model="(formRegister as Request.register)[column?.column_name]"
              />
            </div>

            <!-- ipnput類型 -->
            <div v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input" class="input-area">
              <div class="field-label form-title">
                {{ column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`) }}
              </div>

              <ExtraInput
                :field="column"
                class="form-input"
                :custom-placeholder="genPlaceholderByColumnRule(column)"
                v-model="(formRegister as Request.register)[column?.column_name]"
              />
            </div>

            <!-- 下拉選單類型 -->
            <div
              v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
              class="input-area"
            >
              <div class="field-label form-title">
                {{ column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`) }}
              </div>
              <ExtraSelect
                v-model="(formRegister as Request.register)[column?.column_name]"
                :field="column"
                class="form-input"
              />
            </div>

            <div
              v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
              class="input-area"
            >
              <div class="field-label form-title">
                {{ column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${column.column_name}`) }}
              </div>
              <DateInput
                :field="column"
                class="form-input"
                v-model="(formRegister as Request.register)[column?.column_name]"
              />
            </div>
          </template>

          <q-btn class="btn-submit" type="submit" :loading="isLoading">
            {{ $t("common.btn.register") }}
          </q-btn>

          <div class="btn-login" type="submit">
            <span @click="router.push({ name: 'Login' })">
              {{ $t("menu.login") }}
            </span>
          </div>

          <div class="more-button-area">
            <template v-for="(btn, index) in moreButtonList" :key="index">
              <div v-if="btn.isShow" class="more-button" @click="handlerClickMoreButton(btn.url)">
                <img :src="registerImg(btn.icon)" class="more-button-icon" :alt="btn.url" />
                <div class="more-button-text">{{ $t(`${btn.text}`) }}</div>
              </div>
            </template>
          </div>
        </q-form>
      </div>

      <div class="introduction" @click="router.push({ name: 'webInformation' })">
        <img class="logo" :src="getSquareLogo()" />

        <div class="text">
          <img :src="registerImg('introduction.png')" class="text-icon" alt="introduction" />
          <div>{{ $t("member.login.platformIntroduction") }}</div>
        </div>
      </div>
    </div>

    <AddHomeScreen v-if="isMobile" v-model="showIosHomeScreen" />
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useRouter, useRoute } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import * as Response from "src/api/response.type"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useLogo } from "src/common/composables/useLogo"
import { useInit } from "src/common/composables/useInit"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { FIELD_TYPE, LOGIN_METHOD, COLUMN_NAME } from "src/common/utils/constants"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"
import AddHomeScreen from "app/template/set_r016/components/Dialog/AddHomeScreen.vue"
import { genPlaceholderByColumnRule } from "src/common/utils/customRulesUtils"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isMobile } = useMediaQuery()
const { isReady, initialize } = useInit()
const { registerImg } = useSiteImg()
const { handleOpenLineLink } = useLiveChat("")
const { nowLang, getAgentSetting } = useLanguage()
const { isPhoneRegisterMode, inviteCode } = useEnv()
const { handleLogoList, getSquareLogo } = useLogo()
const { getUserWalletList, getAccountInfo } = useUserInfo()
const { isLoading, isLogin, handleRegisterCustomInput, handleRegister, handleLogin } = useAuth()
const { handleGetPixelCodes } = usePixelCodes()

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

const showIosHomeScreen = ref(false)
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

const moreButtonList = ref([
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

const phoneLabel = computed(() => {
  const countryItem = customInputList.value.filter((field) => field.column_name === "country")[0]
  const phoneItem = customInputList.value.filter((field) => field.column_name === "phone")[0]
  if (phoneItem)
    return phoneItem?.lang[nowLang.value]
      ? phoneItem?.lang[nowLang.value]
      : t(`member.register.${phoneItem.column_name}`)
  else if (countryItem)
    return countryItem?.lang[nowLang.value]
      ? countryItem?.lang[nowLang.value]
      : t(`member.register.${countryItem.column_name}`)
  else return null
})

const handlerClickMoreButton = (url: string) => {
  if (url === "service") {
    handleOpenLineLink()
  } else if (url === "addHomeScreen") {
    showIosHomeScreen.value = true
  } else {
    router.push({ path: url })
  }
}

const register = async () => {
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

  if (!isPhoneRegisterMode.value) {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  } else {
    formLogin.phone = formRegister.value.phone
    formLogin.sms_otp = formRegister.value.sms_otp
    await loginSms()
  }
}

const loginSms = async () => {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp
  }
  const { status } = await handleLogin(payload)

  if (!status) {
    return
  }
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

const login = async () => {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }
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

onMounted(async () => {
  if (isLogin.value) {
    router.push({ path: "/" })
  }

  initialize({
    task: [getAgentSetting, handleLogoList, handleGetPixelCodes]
  })

  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []

  if (inviteCode.value) {
    formRegister.value.invite_code = inviteCode.value
  }

  if (inviteCode.value) {
    formRegister.value[COLUMN_NAME.Enums.INVITE_CODE] = inviteCode.value
  }
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.register-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: url("app/template/set_r016/assets/images/background.jpg") no-repeat;
  background-size: cover;
  position: relative;

  @include phone-width() {
    height: 100%;
    flex-direction: column;
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
        flex-direction: column;
        padding: 0 1rem;
        margin-top: 2.5rem;
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
      padding: 11.25rem 2rem 5rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      overflow-y: auto;

      @include phone-width() {
        width: 100%;
        min-width: unset;
        // background: none;
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

          .input-area {
            margin-bottom: 0.625rem;
          }

          .btn-submit {
            @apply flex items-center justify-center;
            @include fontStyle(0.875rem, 400);

            border-radius: 0.5rem;
            background: $gradient01;
            color: $neutral01;
            width: 18.75rem;
            height: 2.25rem;
            margin-top: 1.25rem;

            @include phone-width() {
              width: 100%;
            }
          }

          .btn-login {
            @apply flex items-center justify-center mx-auto;
            @include fontStyle(0.875rem);

            span {
              color: $primary04;
              margin-top: 1.25rem;
              cursor: pointer;
            }
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
