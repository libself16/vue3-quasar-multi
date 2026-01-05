<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    titleI18n="member.changePassword.setWithdrawalPassword"
    variant="blackGold"
  >
    <template #left>
      <q-btn icon="arrow_back_ios" class="btn-back hide-hover" size="md" flat round dense @click="handleBackBtn" />
    </template>
    <q-form @submit="handleSubmit" class="password-container h5">
      <div class="form-container">
        <!-- old password -->
        <div v-if="userInfo2.has_withdrawal_password" class="form-row">
          <label for="password" class="form-title">
            {{ $t("member.forgotPassword.currentPassword") }}
          </label>
          <q-input
            v-model="withdrawalPasswordForm.old_password"
            class="password-form-input form-bottom-line"
            :placeholder="$t('placeholder.currenctPassword')"
            :type="showPassword.oldPassword ? 'text' : 'password'"
            name="password"
            dense
            lazy-rules
            hide-bottom-space
            :rules="[(val) => Rules.password(val, $t('placeholder.characters8-20'))]"
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
            class="password-form-input form-bottom-line"
            :placeholder="$t('placeholder.pleaseEnterNewPassword')"
            :type="showPassword.newPassword ? 'text' : 'password'"
            name="password"
            dense
            lazy-rules
            hide-bottom-space
            :rules="[
              (val) => Rules.password(val, $t('placeholder.characters8-20')),
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
            class="password-form-input form-bottom-line"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            name="password"
            dense
            lazy-rules
            hide-bottom-space
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
      </div>
      <div class="submit-container">
        <q-btn unelevated color="submit" type="submit" class="btn-submit">{{ $t("common.btn.confirm") }}</q-btn>
      </div>
    </q-form>
  </HeaderTitleBack>
  <q-dialog v-else v-model="isShow" transition-show="fade" transition-hide="fade" persistent>
    <q-card class="password-container pc">
      <q-form @submit="handleSubmit" @reset="resetWithdrawalPasswordForm">
        <q-card-section class="password-header">
          <h2 class="title">{{ $t("member.changePassword.setWithdrawalPassword") }}</h2>
          <q-btn icon="close" flat class="btn-close" :to="{ name: 'memberProfile' }"></q-btn>
        </q-card-section>
        <q-card-section class="password-body">
          <!-- old password -->
          <div v-if="userInfo2.has_withdrawal_password" class="form-row">
            <label for="password" class="form-title">
              {{ $t("member.forgotPassword.currentPassword") }}
            </label>
            <q-input
              v-model="withdrawalPasswordForm.old_password"
              class="password-form-input form-bottom-line"
              :placeholder="$t('placeholder.currenctPassword')"
              :type="showPassword.oldPassword ? 'text' : 'password'"
              name="password"
              dense
              lazy-rules
              :rules="[(val) => Rules.password(val, $t('placeholder.characters8-20'))]"
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
              class="password-form-input form-bottom-line"
              :placeholder="$t('placeholder.pleaseEnterNewPassword')"
              :type="showPassword.newPassword ? 'text' : 'password'"
              name="password"
              dense
              lazy-rules
              :rules="[
                (val) => Rules.password(val, $t('placeholder.characters8-20')),
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
              class="password-form-input form-bottom-line"
              :type="showPassword.confirmPassword ? 'text' : 'password'"
              :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
              name="password"
              dense
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
        <q-card-section class="password-footer">
          <q-btn unelevated type="submit" class="btn-submit">{{ $t("common.btn.submit") }}</q-btn>
          <q-btn outline type="reset" class="btn-reset">{{ $t("common.btn.reset") }}</q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useBank } from "src/common/composables/useBank"

const router = useRouter()
const $q = useQuasar()
const { userInfo2, getUserInfo2, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()
const Rules = useRule()
const { needWithdrawalPassword } = useBank()

const isShow = ref(true)
const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})

async function handleSubmit() {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    await getUserInfo2()
    router.push({ name: "memberProfile" })
  }
}

function handleBackBtn() {
  if (needWithdrawalPassword.value && !userInfo2.value.has_withdrawal_password) {
    router.push({ name: "memberProfile" })
    return
  }

  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push("/")
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/form.scss";
@import "app/template/okbet_blackGold/assets/css/button.scss";

.password-container {
  &.pc {
    min-width: 640px;
    padding: 20px 30px;
    border-radius: 8px;
    background: $primary-black-color;
    .password-header {
      @apply flex justify-between items-center mb-2 p-0;
      .title {
        font-family: "Segoe UI";
        display: flex;
        font-size: 28px;
        color: $primary-white-color;
        font-weight: 590;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .btn-close {
        padding: 0;
        min-width: auto;
        :deep(.q-icon) {
          color: $primary-white-color;
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }
    .password-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 14px;
      font-size: 14px;
      border: 1px solid $gray-border-color;
      .form-row {
        display: flex;
        flex-direction: row;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        height: 50px;
        margin-bottom: 1.25rem;
        color: $primary-white-color;
        .form-title {
          width: 130px;
          padding-right: 10px;
          line-height: 60px;
        }
        .password-form-input {
          width: 270px;
          padding-bottom: 0px;
        }
      }
      :deep(.q-field--standard .q-field__control:before) {
        border-bottom: 1px solid $gray-border-color;
      }
      :deep(.q-field__marginal) {
        color: $primary-white-color;
      }
    }
    .password-footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 0;
      .q-btn {
        font-family: Arial;
        text-transform: capitalize;
        width: 270px;
        height: 50px;
        font-size: 20px;
        border-radius: 8px;
      }
    }
  }
  &.h5 {
    box-sizing: border-box;
    flex-direction: row;
    position: relative;
    width: 100%;

    .form-container {
      padding: 0px 4px;
      .form-row {
        font-family: serif;
        width: 100%;
        padding: 20px;
        height: 134px;
        margin-bottom: 1rem;

        :deep(.q-field__control) {
          color: #e5e7eb !important;
        }

        :deep(.q-field__bottom) {
          padding-top: 0;
          height: auto;
        }

        .form-title {
          font-weight: 400;
          line-height: 2.87;
          letter-spacing: 0.00938em;
          position: relative;
          display: block;
          transform-origin: left top;
          text-overflow: ellipsis;
          max-width: 100%;
          font-family: "PingFang SC";
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.75rem;
          padding: 0px;
          white-space: nowrap;
          overflow: hidden;
          transition: color 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1),
            max-width 200ms cubic-bezier(0, 0, 0.2, 1);
        }
        .password-form-input {
          font-size: 1.75rem;
          font-weight: 400;
          :deep(.q-icon) {
            font-size: 1.875rem !important;
          }
          :deep(.q-field__messages) {
            font-size: 14px;
            font-weight: 400;
            line-height: 1.66;
            letter-spacing: 0.03333em;
            text-align: left;
            margin: 3px 0px 0px;
            font-family: "PingFang SC";
            font-size: 16px;
          }
          :deep(.q-field__control) {
            &::before {
              border-color: rgba(146, 146, 146, 0.57);
            }
          }
        }
        @include phone-width {
          height: auto;
          padding: 0 0.625rem;
          .form-title {
            font-size: 0.875rem;
          }
          .password-form-input {
            font-size: 0.875rem;
            padding-bottom: 0;

            :deep(.q-icon) {
              font-size: 1.125rem !important;
            }
            :deep(.q-field__messages) {
              font-size: 12px;
            }
          }
        }
      }
    }
    .submit-container {
      padding: 32px 15px;
      width: 100%;
      row-gap: 10px;
      display: inline-grid;
      .q-btn {
        width: 100%;
        font-weight: 500;
        line-height: 1.75;
        letter-spacing: 0.02857em;
        min-width: 64px;
        text-transform: none;
        font-family: "PingFang SC";
        height: 80px;
        font-size: 28px;
        width: 100%;
        color: white;
        border-radius: 8px;
        @include phone-width {
          height: 50px;
          font-size: 16px;
        }
      }
    }
  }
}

.btn-back {
  :deep(.q-icon) {
    font-size: 3rem;
    color: #ffffffe5;
  }

  @include iphone-width {
    :deep(.q-icon) {
      font-size: 1.25rem;
    }
  }
}
</style>
