<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form v-if="isLoginMode" @submit="showVerifyModal([login])">
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
        <q-btn flat class="hide-hover" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div>
      <q-btn class="btn-submit mt-5 hide-hover" type="submit" :disable="!agreeTerms" :loading="isLoading">
        {{ $t("common.btn.login") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn flat class="btn-password hide-hover" @click="changeLoginMode(false)" :disable="isLoading">
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
    </q-form>
    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
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
          class="form-input"
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
          class="form-input"
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
      <q-btn class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <div class="btn-password-container mt-2">
        <q-btn flat class="btn-password hide-hover" @click="changeLoginMode(true)" :disable="isLoading">
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import * as Request from "src/api/request.type"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, getUserInfo, getUserInfo2 } = useUserInfo()
const { getFavoriteGames } = useGame()
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const eventbus = injectStrict(EventBusKey)

const isLoginMode = ref(true)
const agreeTerms = ref(true)
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
  eventbus.on("openLogin", (show: boolean) => {
    changeLoginMode(true)
  })

  eventbus.on("changeRegisterForm", () => {
    changeLoginMode(false)
  })

  eventbus.emit("registerFormReady")
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/form.scss";
@import "app/template/okbet_purple/assets/css/button.scss";

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
  .btn-submit {
    @apply border-none text-base font-normal relative w-full;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $text-light-secondary;
    background: $bg-secondary;
    height: 2.5rem;
  }
  .btn-password-container {
    @apply flex justify-center items-center;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
      color: $bg-secondary;
    }
  }
  .forgot-container {
    @apply flex justify-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      color: $bg-secondary;
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
    font-size: 1rem;
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
    padding-bottom: 0.625rem;
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    background: $bg-secondary;
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
.form-container {
  :deep(.q-field__native) {
    color: $text-light-secondary;
  }
  :deep(.q-field__inner) {
    border: 1px solid $border-dark !important;
  }
}
.h5 .form-container {
  :deep(.q-field__inner) {
    border: none !important;
  }
}
</style>
