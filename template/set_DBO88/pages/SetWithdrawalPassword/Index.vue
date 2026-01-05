<template>
  <div class="password-container common-page-wrapper">
    <div class="page-title">{{ $t("member.changePassword.setWithdrawalPassword") }}</div>
    <q-form @submit="handleSubmit" @reset="resetWithdrawalPasswordForm" class="common-page-container">
      <q-card-section class="password-content">
        <!-- old password -->
        <div v-if="userInfo2.has_withdrawal_password" class="form-row">
          <label for="password" class="form-title">
            {{ $t("member.forgotPassword.currentPassword") }}
          </label>
          <q-input
            v-model="withdrawalPasswordForm.old_password"
            class="password-form-input"
            :placeholder="$t('placeholder.currenctPassword')"
            :type="showPassword.oldPassword ? 'text' : 'password'"
            name="password"
            bg-color="white"
            color="black"
            outlined
            lazy-rules
            :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
            :no-error-icon="true"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.oldPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.oldPassword = !showPassword.oldPassword"
              />
            </template>
          </q-input>
        </div>
        <!-- new password -->
        <div class="form-row">
          <label for="password" class="form-title">
            {{ $t("member.forgotPassword.newPassword") }}
          </label>
          <q-input
            v-model="withdrawalPasswordForm.new_password"
            class="password-form-input"
            :placeholder="$t('placeholder.pleaseEnterNewPassword')"
            :type="showPassword.newPassword ? 'text' : 'password'"
            name="password"
            bg-color="white"
            color="black"
            outlined
            lazy-rules
            :rules="[
              (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
              (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
            ]"
            :no-error-icon="true"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.newPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.newPassword = !showPassword.newPassword"
              />
            </template>
          </q-input>
        </div>
        <!-- confirm password -->
        <div class="form-row">
          <label for="password" class="form-title">
            {{ $t("member.forgotPassword.confirmPassword") }}
          </label>
          <q-input
            v-model="withdrawalPasswordForm.confirm_password"
            class="password-form-input"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            name="password"
            bg-color="white"
            color="black"
            outlined
            lazy-rules
            :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
            :no-error-icon="true"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.confirmPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.confirmPassword = !showPassword.confirmPassword"
              />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section class="password-submit">
        <q-btn type="reset" class="btn btn-reset">{{ $t("common.btn.reset") }}</q-btn>
        <q-btn type="submit" class="btn btn-submit">{{ $t("common.btn.submit") }}</q-btn>
      </q-card-section>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { userInfo2, getUserInfo2, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()
const Rules = useRule()
const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})

const handleSubmit = async () => {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    await getUserInfo2()
  }
}

onMounted(() => {
  resetWithdrawalPasswordForm()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/common.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.form-row {
  .form-title {
    @apply text-base font-bold;
    color: $primary-color;
  }
}

.password-content {
  @apply pb-2;
}

.password-submit {
  @apply flex justify-center gap-3 pt-0;

  .btn {
    @apply text-base font-bold w-1/2 text-white;
    background: $primary-color;
  }
}
</style>
