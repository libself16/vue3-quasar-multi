<template>
  <div class="login-form-wrapper">
    <q-form @submit.prevent="login">
      <!-- Phone Register Allow toggle -->
      <div v-if="isPhoneRegisterMode" class="phone-login">
        <span class="login-method px-4 font-semibold">{{ $t("member.login.loginType") }}</span>
        <div class="mb-[10px]">
          <q-btn-toggle
            v-model="loginData.login_method"
            flat
            color="white"
            :options="[
              { label: $t('common.btn.password'), value: LOGIN_METHOD.Enums.Password },
              { label: $t('common.btn.smsOtp'), value: LOGIN_METHOD.Enums.Sms }
            ]"
          />
        </div>
        <!-- Phone Account -->
        <div class="phone-account">
          <div class="field-input">
            <q-input
              ref="phoneRef"
              v-model="loginData.username"
              rounded
              outlined
              :label="$t('placeholder.phoneNumber')"
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.noRule]"
              unmasked-value
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="field-input">
          <q-input
            v-model="loginData.username"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterUsername')"
            bg-color="white"
            color="black"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-user" class="text-black ml-2" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- Password -->
      <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password">
        <div class="field-input">
          <q-input
            v-model="loginData.password"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterPassword')"
            bg-color="white"
            color="black"
            :type="isPasswordVisible ? 'text' : 'password'"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" class="text-black ml-2" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                class="cursor-pointer text-black mr-2"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>
        </div>
      </div>
      <!-- OTP -->
      <div v-else class="input-area">
        <div class="field-input">
          <div class="flex w-full">
            <div class="w-10/12 h-[50px]">
              <q-input
                rounded
                outlined
                type="password"
                v-model="loginData.sms_otp"
                :label="$t('placeholder.enterOTP')"
                bg-color="white"
                color="black"
                lazy-rules
                :rules="[Rules.required()]"
              />
            </div>
            <div>
              <vue-countdown
                v-if="counting"
                @end="counting = false"
                :time="180000"
                v-slot="{ totalSeconds }"
                class="counting-text"
                >{{ `${totalSeconds}s` }}</vue-countdown
              >
            </div>
            <button class="opt-btn" :disable="!loginData.username || counting" @click="getOtpCode">
              <span>{{ $t("common.btn.otp") }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Forgot Password -->
      <div class="btn-forgot-password flex justify-end">
        <span class="forgot-text">
          <router-link :to="{ name: 'ForgotPassword' }">
            {{ $t("member.login.forgotPassword") }}
          </router-link>
        </span>
      </div>
      <!-- Submit -->
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.login") }}</q-btn>
      </div>
      <div class="skip-enter text-center mt-[10px]">
        <router-link :to="{ name: 'Home' }"> Skip & Enter </router-link>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"
import * as Request from "src/api/request.type"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isPhoneRegisterMode } = useEnv()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const phoneRef = ref()
const counting = ref(false)
const isPasswordVisible = ref(false)

const loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: ""
})

async function getOtpCode() {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top"
    })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: loginData.username })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

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
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.btn-forgot-password {
  color: $primary;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}

.skip-enter {
  color: $primary;
  font-size: 0.875rem;
}

.login-method {
  color: $primary;
}

.opt-btn {
  @apply flex justify-center items-center h-auto text-black p-[12px] ml-2;
  background: $gradient-to-bottom;
  border-radius: 1.75rem;

  &:hover {
    @apply text-white;
  }
}

.phone-login {
  ::v-deep(.q-btn-group) {
    .text-primary {
      color: $primary !important;
    }
  }
}
</style>
