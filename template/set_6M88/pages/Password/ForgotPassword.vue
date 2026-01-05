<template>
  <div class="forgot-password-wrapper">
    <div class="forgot-password-container">
      <div class="logo mb-[20px]">
        <img :src="logoSrc" alt="logo" />
      </div>
      <div v-if="isPhoneRegisterMode" class="change-tab w-full h-[36px]">
        <div
          class="tab-item"
          :class="{ active: forgetMethod === FORGOT_PASS_METHOD.Enums.Email }"
          @click="changeTabStatus(FORGOT_PASS_METHOD.Enums.Email)"
        >
          {{ $t("common.btn.emailVerification") }}
        </div>
        <div
          class="tab-item"
          :class="{ active: forgetMethod === FORGOT_PASS_METHOD.Enums.Sms }"
          @click="changeTabStatus(FORGOT_PASS_METHOD.Enums.Sms)"
        >
          {{ $t("common.btn.smsVerification") }}
        </div>
      </div>
      <div class="forgot-password-content">
        <p class="text-center font-bold pb-[10px]">{{ $t("member.forgotPassword.forgotPassword") }}</p>
        <ForgotPasswordEmail v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" />
        <ForgotPasswordPhone v-else />
      </div>
      <div class="back-btn" @click="$router.go(-1)">
        <i class="fa-solid fa-angles-left mr-1"></i>
        <span>{{ $t("common.btn.back") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import ForgotPasswordEmail from "./ForgotPasswordEmail.vue"
import ForgotPasswordPhone from "./ForgotPasswordPhone.vue"
import { useLogo } from "src/common/composables/useLogo"
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"

const { isPhoneRegisterMode } = useEnv()
const { getWideLogo, handleLogoList } = useLogo()
const forgetMethod = ref(FORGOT_PASS_METHOD.Enums.Email)

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})

const changeTabStatus = (method: FORGOT_PASS_METHOD.Enums) => {
  forgetMethod.value = method
}

onMounted(async () => {
  await handleLogoList()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";
@import "../../assets/css/password.scss";

.forgot-password-wrapper {
  background-color: #f8fafc !important;
}

.forgot-password-content {
  background-color: #fff !important;
}

.back-btn {
  @apply flex w-full justify-center items-center mt-4 cursor-pointer;
  color: $primary;

  &:hover {
    color: #fff;
  }
}
</style>
