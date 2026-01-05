<template>
  <div class="change-password-wrapper">
    <BackBtn />
    <div class="change-password-content">
      <h2 class="change-password-title">{{ $t("menu.password") }}</h2>
      <q-form class="change-password-form" ref="formRef" @submit="setUserPassword">
        <div class="form-item">
          <div class="form-title required">{{ $t("member.forgotPassword.currentPassword") }}</div>
          <q-input
            standout
            v-model="passwordForm.old_password"
            :placeholder="$t('placeholder.currenctPassword')"
            :type="showPassword.oldPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
            class="form-input"
            no-error-icon
            hide-bottom-space
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
        <div class="form-item">
          <div class="form-title required">{{ $t("member.forgotPassword.newPassword") }}</div>
          <q-input
            standout
            v-model="passwordForm.new_password"
            :type="showPassword.newPassword ? 'text' : 'password'"
            :placeholder="$t('placeholder.pleaseEnterNewPassword')"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            :rules="[
              (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
              (val) => Rules.newPassword(passwordForm.old_password, val)
            ]"
            class="form-input"
            no-error-icon
            hide-bottom-space
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
        <div class="form-item">
          <div class="form-title required">{{ $t("member.forgotPassword.confirmPassword") }}</div>
          <q-input
            standout
            v-model="passwordForm.confirm_password"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
            class="form-input"
            no-error-icon
            hide-bottom-space
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
        <q-btn :label="$t('common.btn.submit')" class="btn-submit hide-hover" type="submit" />
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"

const { passwordForm, setUserPassword } = useUserInfo()
const Rules = useRule()

const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.change-password-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 1rem 1.875rem;
  }

  .change-password-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
    }

    .change-password-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .change-password-form {
      @apply flex flex-col justify-center items-center gap-10;
      margin: 2.5rem auto 0;
      max-width: 37.5rem;

      @include phone-width {
        @apply mt-5 gap-5;
      }

      .form-item {
        width: 100%;
      }

      .btn-submit {
        @include fontStyle();
        max-width: 100%;
        width: 18.75rem;
        height: 2.25rem;
        background: $gradient01;
        border-radius: 0.625rem;
        text-transform: capitalize;

        @include phone-width() {
          width: 100%;
        }
      }
    }
  }
}
</style>
