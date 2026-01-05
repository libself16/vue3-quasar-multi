<template>
  <!-- 手機OTP -->
  <RegisterFormPhone v-if="isPhoneRegisterMode" />
  <!-- 一般註冊登入 -->
  <template v-else>
    <div class="reg-list">
      <ul>
        <li v-for="i in stepsCount" :key="i">
          <a @click="toStep(i)" class="btn-reg" :class="{ active: currentStep === i }">
            <template v-if="i == stepsCount">
              <i class="fa-solid fa-check"></i>
            </template>
            <template v-else>
              {{ i }}
            </template>
          </a>
        </li>
      </ul>
    </div>
    <q-form ref="formRef" autocomplete="new-password">
      <template v-if="currentStep === 1">
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.account"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user" />
            </template>
          </q-input>
        </div>
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.password"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                class="ml-2 mr-2"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>
        </div>
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.confirm_password"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterConfirmPassword')"
            lazy-rules
            :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" class="text-[#005f79]" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                class="ml-2 mr-2"
                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              />
            </template>
          </q-input>
        </div>
      </template>
      <template v-else-if="currentStep === 2">
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.fullname"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterFullname')"
            lazy-rules
            :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user" />
            </template>
          </q-input>
        </div>
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.email"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterEmail')"
            lazy-rules
            :rules="[Rules.required(), Rules.email]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-envelope" />
            </template>
          </q-input>
        </div>
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.phone"
            rounded
            outlined
            :label="$t('placeholder.pleaseEnterContactNo')"
            lazy-rules
            :rules="[Rules.required()]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-mobile" />
            </template>
          </q-input>
        </div>
        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.ref_account"
            rounded
            outlined
            :label="$t('member.register.affiliate')"
            lazy-rules
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-users" />
            </template>
          </q-input>
        </div>

        <div class="login-form-box">
          <q-input
            :disable="isLoading"
            class="custom-input"
            v-model="formData.invite_code"
            rounded
            outlined
            :label="$t('member.register.invite_code')"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-users" />
            </template>
          </q-input>
        </div>
      </template>
      <template v-else-if="currentStep === 3">
        <div class="col-12 mb-4 text-center">
          <div class="congrazt-title">CONGRATULATIONS!</div>
          <div class="tick-success">
            <i class="far fa-check-circle"></i>
          </div>
          <div class="congrazt-title-2">Your account has been activated!</div>
        </div>
      </template>

      <div class="login-btn-wrap">
        <div class="login-btn-btm">
          <q-btn
            :loading="isLoading"
            class="login-btn"
            size=".75rem"
            padding=".5rem 0"
            unelevated
            no-caps
            @click="nextStep"
          >
            {{ getNextBtnLabel() }}
          </q-btn>
          <q-btn
            class="text-[#005f79]"
            v-if="currentStep < stepsCount"
            @click="router.push({ name: 'Home' })"
            size=".75rem"
            padding=".5rem 0"
            unelevated
            no-caps
          >
            Skip & Enter
          </q-btn>
        </div>
      </div>
    </q-form>
  </template>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { reactive, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { LOGIN_METHOD, PIXEL_CODE_TYPE } from "src/common/utils/constants"
import RegisterFormPhone from "./RegisterFormPhone.vue"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleRegister, handleLogin } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const { handleTriggerPixelCode } = usePixelCodes()

const { isPhoneRegisterMode } = useEnv()

const currentStep = ref(1)
const stepsCount = 3 // step 步數
const toStep = (stepVal: number) => {
  if (stepVal > currentStep.value) return
  currentStep.value = stepVal
}
const nextStep = async () => {
  if (isLoading.value) return
  const isValid = await formRef.value.validate()

  if (!isValid) return

  if (currentStep.value === 1) {
    currentStep.value++
  } else if (currentStep.value === 2) {
    const { status } = await register()
    if (status) {
      currentStep.value++
    }
  } else if (currentStep.value === 3) {
    await login({
      login_method: LOGIN_METHOD.Enums.Password,
      username: formData.account,
      password: formData.password
    })
  }
}
const getNextBtnLabel = () => {
  switch (currentStep.value) {
    case 1:
      return t("common.pagination.next")
    case 2:
      return t("common.btn.submit")
    case 3:
      return t("member.deposit.done")
    default:
      return t("common.pagination.next")
  }
}

const formRef = ref()
const formData = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: undefined,
  invite_code: undefined,
  email: "",
  phone: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})

const register = async () => {
  const { status } = await handleRegister({
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password,
    fullname: formData.fullname,
    ref_account: formData.ref_account,
    invite_code: formData.invite_code,
    email: formData.email,
    phone: formData.phone,
    contacts: formData.contacts
  })

  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.registerSuccess"),
      position: "top",
      timeout: 1000
    })
  }

  return {
    status
  }
}

const login = async (payload: Request.login) => {
  isLoading.value = true
  const { status } = await handleLogin(payload)
  if (!status) {
    isLoading.value = false
    return
  }
  await getUserWalletList()
  await getUserInfo()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "Home" })
  isLoading.value = false
}

onMounted(() => {
  handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/custom.scss";
</style>
