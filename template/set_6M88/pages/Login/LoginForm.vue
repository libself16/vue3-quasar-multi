<template>
  <q-form @submit="login" autocomplete="new-password">
    <!-- Phone Register Allow toggle -->
    <div v-if="isPhoneRegisterMode" class="phone-login">
      <span class="login-method">{{ $t("member.login.loginType") }}</span>
      <div class="my-4">
        <q-btn-toggle
          class="login-method-btn"
          v-model="loginData.login_method"
          flat
          :options="[
            { label: $t('common.btn.password'), value: LOGIN_METHOD.Enums.Password },
            { label: $t('common.btn.smsOtp'), value: LOGIN_METHOD.Enums.Sms }
          ]"
        />
      </div>
      <!-- Phone Account -->

      <div class="login-form-box">
        <q-input
          ref="phoneRef"
          v-model="loginData.username"
          rounded
          outlined
          :label="$t('placeholder.phoneNumber')"
          class="custom-input"
          lazy-rules
          :rules="[Rules.noRule]"
          unmasked-value
          autocomplete="new-password"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-mobile" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="login-form-box" v-else>
      <q-input
        :disable="isLoading"
        class="custom-input"
        v-model="loginData.username"
        rounded
        outlined
        :label="$t('placeholder.pleaseEnterUsername')"
        lazy-rules
        :rules="[(val) => Rules.account(val)]"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-user" />
        </template>
      </q-input>
    </div>
    <div class="login-form-box" v-if="loginData.login_method === LOGIN_METHOD.Enums.Password">
      <q-input
        :disable="isLoading"
        class="custom-input"
        v-model="loginData.password"
        rounded
        outlined
        :label="$t('placeholder.pleaseEnterPassword')"
        :type="isPasswordVisible ? 'text' : 'password'"
        lazy-rules
        :rules="[(val) => Rules.password(val)]"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="mr-2"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="flex items-center justify-between w-full mb-4" v-else>
      <div class="login-form-box !w-[190px]">
        <q-input
          class="custom-input !mb-0"
          rounded
          outlined
          type="password"
          v-model="loginData.sms_otp"
          :label="$t('placeholder.enterOTP')"
          lazy-rules
          :rules="[Rules.required()]"
          autocomplete="new-password"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-key" />
          </template>
        </q-input>
      </div>

      <div class="login-btn-wrap w-24 -mb-1">
        <q-btn
          :loading="isLoading"
          unelevated
          no-caps
          class="login-btn !mb-0"
          size=".75rem"
          padding=".5rem 0"
          :disable="!loginData.username || counting"
          @click="getOtpCode"
        >
          <span>{{ $t("common.btn.otp") }}</span>
        </q-btn>
      </div>
    </div>
    <div class="text-center mt-8">
      <vue-countdown
        v-if="counting"
        @end="counting = false"
        :time="180000"
        v-slot="{ totalSeconds }"
        class="counting-text"
        >{{ `${totalSeconds}s` }}</vue-countdown
      >
    </div>
    <div class="login-row">
      <q-btn :to="{ name: 'ForgotPassword' }" class="text-[#005f79]" size=".75rem" padding=".5rem 0" unelevated no-caps>
        {{ $t("member.login.forgotPassword") }}
      </q-btn>
    </div>
    <div class="login-btn-wrap">
      <q-btn
        :loading="isLoading"
        type="submit"
        @click="login"
        class="login-btn mt-3"
        size=".75rem"
        padding=".5rem 0"
        unelevated
        no-caps
      >
        {{ $t("common.btn.login") }}
      </q-btn>
      <div class="login-btn-btm">
        <q-btn
          class="text-[#005f79]"
          @click="router.push({ name: 'Home' })"
          size=".75rem"
          padding=".5rem 0"
          unelevated
          no-caps
        >
          {{ $t("common.btn.skipAndEnter") }}
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"
import * as Request from "src/api/request.type"
import VueCountdown from "@chenfengyuan/vue-countdown"

const { isPhoneRegisterMode } = useEnv()
const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const router = useRouter()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const isPasswordVisible = ref(false)
const counting = ref(false)
const phoneRef = ref()

const loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: ""
})

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

  const { status } = await handleLogin(payload)

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
    router.push({ name: "Home" })
  }
}

async function getOtpCode() {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top"
    })
  }
  const { status } = await handleGetOTP({ phone: loginData.username })
  if (status) {
    counting.value = true
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

watch(
  () => loginData.login_method,
  () => {
    loginData.password = ""
    loginData.sms_otp = ""
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/custom.scss";

.phone-login {
  .login-method {
    @apply font-bold text-xs;
    color: $primary !important;
  }
  ::v-deep(.login-method-btn) {
    .q-btn {
      @apply text-xs;
      color: $primary !important;
    }
    .text-primary {
      @apply rounded-full text-xs;
      color: #fff !important;
      background: linear-gradient(to bottom, #3fecff 0%, #2597ff 100%);
    }
  }
}
</style>
