<template>
  <div class="change-password">
    <BackBtn />

    <div class="change-password-form">
      <div class="change-password-content">
        {{ $t("member.changePassword.setWithdrawalPassword") }}
      </div>

      <q-form class="form-content" @submit="handleSubmit">
        <!-- old password -->
        <div v-if="accountInfo.has_withdrawal_password" class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.currentPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.old_password"
            class="form-input"
            :placeholder="$t('placeholder.currenctPassword')"
            :type="showPassword.oldPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
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
        <div class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.newPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.new_password"
            class="form-input"
            :type="showPassword.newPassword ? 'text' : 'password'"
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :rules="[
              (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
              (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
            ]"
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
        <div class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.confirmPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.confirm_password"
            class="form-input"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
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

        <q-btn class="btn-submit" type="submit">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { useRouter } from "vue-router"

const Rules = useRule()
const router = useRouter()
const { accountInfo, getAccountInfo, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()

const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})

const handleSubmit = async () => {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    await getAccountInfo()
    router.push({ name: "MemberWithdrawal" })
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.change-password {
  max-width: 75rem;
  margin: 1.25rem auto 0;

  &-form {
    margin-top: 1.25rem;
    border-radius: 0.5rem;
    background: $primary07;
    padding: 3.75rem;

    @include phone-width() {
      padding: 1.25rem;
    }

    .change-password-content {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .form-content {
      @apply flex flex-col items-center justify-center;
      margin-top: 1.25rem;

      .form-item {
        @apply m-0;
        width: 100%;
        max-width: 37.5rem;
        margin-top: 1.25rem;

        .form-label {
          color: $neutral01;
        }
      }
    }

    .btn-submit {
      @apply flex items-center justify-center mx-auto;
      @include fontStyle(0.875rem, 400);

      border-radius: 0.5rem;
      background: $gradient01;
      color: $neutral01;
      width: 18.75rem;
      height: 2.25rem;
      margin-top: 1.25rem;

      @include phone-width() {
        width: 100%;
        margin-top: 0.25rem;
      }
    }
  }
}
</style>
