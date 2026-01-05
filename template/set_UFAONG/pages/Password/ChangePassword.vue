<template>
  <div class="change-password-wrapper">
    <q-form class="change-password-form column pt-4" @submit="handleSubmit" ref="passwordFromRef">
      <!-- current password -->
      <div class="form-label">{{ $t("member.forgotPassword.currentPassword") }} :</div>
      <q-input
        v-if="!userInfo.empty_password"
        standout
        v-model="passwordForm.old_password"
        :type="isPasswordVisible ? 'text' : 'password'"
        :label="$t('placeholder.currenctPassword')"
        outlined
        dense
        lazy-rules
        :rules="[(val) => Rules.password(val)]"
        class="form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="text-black" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer text-black"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
      <!-- new password -->
      <div class="form-label">{{ $t("member.forgotPassword.newPassword") }} :</div>
      <q-input
        standout
        v-model="passwordForm.new_password"
        :type="isNewPasswordVisible ? 'text' : 'password'"
        :label="$t('placeholder.passwordValidation')"
        outlined
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val), (val) => Rules.newPassword(passwordForm.old_password, val)]"
        class="form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="text-black" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isNewPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer text-black"
            @click="isNewPasswordVisible = !isNewPasswordVisible"
          />
        </template>
      </q-input>
      <!-- confirm password -->
      <div class="form-label">{{ $t("member.forgotPassword.confirmPassword") }} :</div>
      <q-input
        standout
        v-model="passwordForm.confirm_password"
        :type="isConfirmPasswordVisible ? 'text' : 'password'"
        outlined
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val), (val) => Rules.confirmPassword(passwordForm.new_password, val)]"
        class="form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="text-black" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer text-black"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          />
        </template>
      </q-input>
      <div class="mt-3">
        <q-btn label="submit" class="btn-submit" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { userInfo, passwordForm, setUserPassword, resetPasswordForm, getUserInfo } = useUserInfo()
const Rules = useRule()
const passwordFromRef = ref()
const isPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

async function handleSubmit() {
  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
  await getUserInfo()
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.change-password-wrapper {
  @apply px-[10px];
}

.change-password-form {
  .form-label {
    @apply text-base font-semibold py-[10px];
    color: $primary;
  }

  .form-input {
    height: 2.5rem;
    line-height: 1.5;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    font-weight: 400;

    &.q-field--error {
      height: 3.75rem;
    }
  }
}
</style>
