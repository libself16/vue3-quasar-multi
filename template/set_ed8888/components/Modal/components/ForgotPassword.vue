<template>
  <div class="forgot-password-wrapper">
    <div class="forgot-password-container">
      <div class="forgot-password-content">
        <p class="forgot-password-title">{{ $t("member.forgotPassword.forgotPassword") }}</p>
        <div v-if="isPhoneRegisterMode" class="change-tab">
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
        <ForgotPasswordEmail v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Email" />
        <ForgotPasswordPhone v-else />
      </div>
      <div class="back-btn" @click="$emit('back')">
        <i class="fa-solid fa-angles-left mr-1"></i>
        <span>{{ $t("common.btn.back") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import ForgotPasswordEmail from "./ForgotPasswordEmail.vue"
import ForgotPasswordPhone from "./ForgotPasswordPhone.vue"
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"

const { isPhoneRegisterMode } = useEnv()
const forgetMethod = ref(FORGOT_PASS_METHOD.Enums.Email)
const emit = defineEmits(["back"])

const changeTabStatus = (method: FORGOT_PASS_METHOD.Enums) => {
  forgetMethod.value = method
}
</script>

<style scoped lang="scss">
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.forgot-password-title {
  @apply text-[.875rem] text-white py-[.3125rem] px-[.625rem] rounded-[3rem] max-w-[8rem] font-semibold;
  @apply mb-4;
  background-color: $secondary-color;
}

.back-btn {
  @apply text-center cursor-pointer;
  color: $secondary-color;
}

.change-tab {
  @apply flex gap-2 mb-2;

  .tab-item {
    @apply text-[.875rem] px-2 py-1 rounded-[3rem] max-w-[8rem] font-semibold cursor-pointer;
    background: $white-color;
    color: $secondary-color;

    &.active {
      @apply text-white;
      background: $secondary-color;
    }
  }
}
</style>
