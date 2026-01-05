<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form v-if="isLoginMode" @submit="showVerifyModal([login])">
      <h2 class="form-title">{{ $t("menu.login") }}</h2>
      <!-- 手機號碼 -->
      <div class="form-container">
        <q-input
          v-model="formLogin.username"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          lazy-rules
          :rules="[(val) => Rules.account(val)]"
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
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterPassword')"
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
        <p>{{ `${$t("member.forgotPassword.forgotPassword")}? ` }}</p>
        <q-btn flat class="hide-hover mx-1" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.login.reset") }}
        </q-btn>
      </div>
      <q-btn color="blue" class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.login") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn
          flat
          text-color="blue"
          class="btn-password hide-hover"
          @click="changeLoginMode(false)"
          :disable="isLoading"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
    </q-form>
    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
      <h2 class="form-title">{{ $t("menu.register") }}</h2>
      <div class="form-container">
        <!-- 帳號 -->
        <q-input
          v-model="formRegister.account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          lazy-rules
          :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- 全名 -->
        <q-input
          v-model="formRegister.fullname"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterFullNameShort')"
          lazy-rules
          :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('name')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- 電話號碼 -->
        <q-input
          v-model="formRegister.phone"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterContactNo')"
          lazy-rules
          :rules="[Rules.noRule]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('phone')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- 密碼 -->
        <q-input
          v-model="formRegister.password"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterPassword')"
          lazy-rules
          :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
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
        <!-- 確認密碼 -->
        <q-input
          v-model="formRegister.confirm_password"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
          lazy-rules
          :rules="[(val) => val === formRegister.password || $t('common.validate.consistentPassword')]"
          :type="showConfirmPassword ? 'text' : 'password'"
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
              :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </q-input>
        <!-- email -->
        <q-input
          v-model="formRegister.email"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnterEmail')"
          lazy-rules
          :rules="[Rules.required(), Rules.email]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('mail')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- email -->
        <q-input
          v-model="formRegister.ref_account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.register.affiliate')"
          lazy-rules
          :rules="[Rules.noRule]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('affiliate')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
      </div>
      <q-btn color="blue" class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <div class="btn-password-container mt-2">
        <q-btn
          flat
          text-color="blue"
          class="btn-password hide-hover"
          @click="changeLoginMode(true)"
          :disable="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { getFavoriteGames } = useGame()
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { handleTriggerPixelCode } = usePixelCodes()
const eventbus = injectStrict(EventBusKey)

const isLoginMode = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: ""
})

const formRegister = reactive<Request.register>({
  account: "",
  password: "",
  confirm_password: "",
  fullname: "",
  email: "",
  phone: "",
  ref_account: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})

function changeLoginMode(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formRegister.account = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.email = ""
  formRegister.phone = ""
  formRegister.ref_account = ""
  formRegister.contacts.contact1 = ""
  formRegister.contacts.contact2 = ""

  if (!status) {
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
  }
}

async function register() {
  const { status } = await handleRegister({
    account: formRegister.account,
    password: formRegister.password,
    confirm_password: formRegister.confirm_password,
    fullname: formRegister.fullname,
    ref_account: formRegister.ref_account,
    email: formRegister.email,
    phone: formRegister.phone,
    contacts: formRegister.contacts
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
  formLogin.username = formRegister.account
  formLogin.password = formRegister.password
  await login()
}

async function login() {
  const { status } = await handleLogin({
    login_method: formLogin.login_method,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    await getUserInfo()
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
  eventbus.on("openLogin", (show: boolean) => {
    changeLoginMode(true)
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/form.sass";
@import "app/template/set_jokerhill/assets/css/button.sass";

.pc {
  .form-title {
    @apply uppercase text-center font-bold;
    color: rgba(#141414, 0.4);
    font-size: 2rem;
    margin-bottom: 2.5rem;
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $color-subtitle;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }
  .form-container {
    ::v-deep(.q-field--error) {
      margin-bottom: 1rem;
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $color-white-text;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
    }
  }
  .forgot-container {
    color: $color-subtitle;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .q-btn {
      @apply font-bold;
      color: #6288d2;
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
    }
  }
}
.h5 {
  .form-title {
    @apply uppercase text-center font-bold;
    color: rgba(#141414, 0.4);
    font-size: 2rem;
    margin-bottom: 2.5rem;
  }
  .form-subtitle {
    font-family: HelveticaLight;
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: $color-title-h5;
    text-align: center;
    min-height: 1.375rem;
  }
  .form-container {
    margin: 0.6875rem auto;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 24, 30, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(221, 232, 255);
    padding-bottom: 0.625rem;
    ::v-deep(.q-field--error) {
      padding-bottom: 2.75rem;
      height: 6rem;
    }
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
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
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    color: $color-subtitle;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .q-btn {
      @apply ml-2;
      color: #6288d2;
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
}
</style>
