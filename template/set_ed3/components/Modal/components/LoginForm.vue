<template>
  <div class="login-form-wrapper">
    <q-form @submit.prevent="login" autocomplete="new-password">
      <div v-if="isPhoneRegisterMode" class="phone-login">
        <div class="mb-[10px]">
          <q-btn-toggle
            v-model="loginData.login_method"
            flat
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
              :label="$t('placeholder.phoneNumber')"
              class="form-control"
              dense
              borderless
              lazy-rules
              :rules="[Rules.noRule]"
              unmasked-value
              color="black"
              autocomplete="phone-number"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="field-input">
          <q-input
            v-model="loginData.username"
            :label="$t('placeholder.pleaseEnterUsername')"
            class="form-control"
            dense
            borderless
            lazy-rules
            color="black"
            :rules="[(val) => Rules.account(val)]"
            autocomplete="username"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-envelope" class="field-icon" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- Password -->
      <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password">
        <div class="field-input">
          <q-input
            v-model="loginData.password"
            :label="$t('placeholder.pleaseEnterPassword')"
            :type="isPasswordVisible ? 'text' : 'password'"
            class="form-control"
            dense
            borderless
            lazy-rules
            color="black"
            :rules="[(val) => Rules.password(val)]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" class="field-icon" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                class="cursor-pointer field-icon"
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
            <q-input
              type="password"
              v-model="loginData.sms_otp"
              :label="$t('placeholder.enterOTP')"
              dense
              borderless
              lazy-rules
              autocomplete="otp-password"
              color="black"
              :rules="[Rules.required()]"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="opt-btn" :disable="!loginData.username || counting" @click="getOtpCode">
            <span>{{ $t("common.btn.otp") }}</span>
          </button>
          <vue-countdown
            @end="counting = false"
            v-if="counting"
            :time="180000"
            v-slot="{ totalSeconds }"
            class="counting-text"
            >{{ `${totalSeconds}s` }}</vue-countdown
          >
        </div>
      </div>
      <!-- Forgot Password -->
      <div class="btn-forgot-password">
        <span class="forgot-text" @click="emit('switchView', 'forgotPassword')">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </span>
      </div>
      <!-- Submit -->
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.login") }}</q-btn>
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
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
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
const eventbus = injectStrict(EventBusKey)
const loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: ""
})
const emit = defineEmits<{
  (e: "switchView", view: string): void
}>()

const getOtpCode = async () => {
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

const login = async () => {
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
    closeDialog()
  }
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
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

<style scoped lang="scss">
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/form.scss";

.btn-forgot-password {
  .forgot-text {
    @apply text-[.875rem] cursor-pointer;
    border-bottom: 1px solid $text01;
    color: $input-text-color;
  }
}

.phone-login {
  :deep(.text-primary) {
    color: $secondary-color !important;
  }
}

.opt-btn {
  @apply rounded-[.625rem] p-1 px-2 text-white;
  background: $secondary-color;
}
</style>
