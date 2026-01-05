<template>
  <q-dialog
    v-model="showDialog"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isLargeTablet ? '0' : '300'"
    :maximized="isLargeTablet"
  >
    <q-card class="password-edit-dialog">
      <q-card-section class="password-edit-container">
        <div class="header-area">
          <q-btn
            v-if="isLargeTablet"
            icon="arrow_back_ios"
            class="hide-hover"
            flat
            round
            dense
            @click="showDialog = false"
          />
          <div class="header-text">{{ $t("member.changePassword.setWithdrawalPassword") }}</div>
          <q-btn v-if="!isLargeTablet" icon="close" class="hide-hover" flat round dense @click="showDialog = false" />
        </div>

        <div class="container">
          <div class="edit-area">
            <div v-if="accountInfo.has_withdrawal_password" class="password-item">
              <div class="text">{{ $t("member.forgotPassword.currentPassword") }}</div>
              <q-input
                v-model="withdrawalPasswordForm.old_password"
                class="input-style"
                name="password"
                :placeholder="$t('placeholder.currenctPassword')"
                :type="showPassword.oldPassword ? 'text' : 'password'"
                :rules="[(val) => Rules.password(val, $t('placeholder.characters8-20'))]"
                :no-error-icon="true"
                dense
                lazy-rules
                borderless
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

            <div class="password-item">
              <div class="text">{{ $t("member.forgotPassword.newPassword") }}</div>
              <q-input
                v-model="withdrawalPasswordForm.new_password"
                class="input-style"
                name="password"
                :placeholder="$t('placeholder.pleaseEnterNewPassword')"
                :type="showPassword.newPassword ? 'text' : 'password'"
                :rules="[
                  (val) => Rules.password(val, $t('placeholder.characters8-20')),
                  (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
                ]"
                :no-error-icon="true"
                dense
                lazy-rules
                borderless
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

            <div class="password-item">
              <div class="text">{{ $t("member.forgotPassword.confirmPassword") }}</div>
              <q-input
                v-model="withdrawalPasswordForm.confirm_password"
                class="input-style"
                name="password"
                :type="showPassword.confirmPassword ? 'text' : 'password'"
                :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
                :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
                :no-error-icon="true"
                dense
                lazy-rules
                borderless
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

          <div class="btn-area">
            <q-btn unelevated class="btn-style confirm" @click="handleSubmit()">{{ $t("common.btn.submit") }}</q-btn>
            <q-btn outline class="btn-style cancel" @click="resetWithdrawalPasswordForm()">{{
              $t("common.btn.reset")
            }}</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean
})

const Rules = useRule()
const { isLargeTablet } = useMediaQuery()
const { accountInfo, getAccountInfo, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()
const showDialog = ref(props.modelValue)
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
    showDialog.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    showDialog.value = val
  }
)
watch(showDialog, (val) => {
  emit("update:modelValue", val)
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/form.scss";
@import "app/template/set_r022/assets/css/button.scss";

.password-edit-dialog {
  width: 31.4375rem;
  background: var(--neutral-01);
  box-shadow: none;

  @include pad-large-width {
    background: var(--bg-main-bg);
  }

  .password-edit-container {
    padding: 1.25rem 1.5rem;
    border-radius: 0.5rem !important;

    @include pad-large-width {
      padding: 0;
      background: var(--neutral-01);
    }

    .header-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--neutral-10);
      font-size: 1.5rem;
      margin-bottom: 3rem;
      position: relative;

      @include pad-large-width {
        justify-content: flex-start;
        font-size: 1.125rem;
        padding: 0.71875rem 0.5rem;
        background: var(--bg-headerbottom);
        margin-bottom: 0;
      }

      .header-text {
        @include pad-large-width {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .container {
      @include pad-large-width {
        padding: 0.9375rem;
      }

      .edit-area {
        width: 100%;

        .password-item {
          .text {
            color: var(--neutral-10);
            font-size: 0.75rem;
            margin-bottom: 0.50875rem;
          }

          .input-style {
            :deep(.q-field__inner) {
              height: 2.75rem;
              border: 1px solid var(--neutral-03);
              border-radius: 0.375rem;

              .q-field__prepend {
                padding: 0;

                .form-icon {
                  cursor: auto;
                  margin: 0.75rem;

                  @include pad-large-width {
                    margin: unset;
                  }

                  img {
                    width: 1rem;
                    height: 1rem;

                    @include pad-large-width {
                      width: 1.625rem;
                      height: 1.625rem;
                    }
                  }
                }
              }

              .q-field__append {
                .eye-icon {
                  font-size: 0.9375rem;
                  margin: 0.375rem 0.75rem;
                  color: var(--primary-02);
                  cursor: pointer;

                  @include pad-large-width {
                    font-size: 1.1rem;
                    margin: 0 0.5rem 0 0.25rem;
                  }
                }
              }

              .q-field__control {
                height: 2.75rem;
                padding: 0 0.75rem;
              }

              .q-field__control-container {
                width: 100%;
                border: none;
                font-size: 14px;
                font-weight: 400;
                background: transparent;
                overflow-wrap: break-word;

                @include pad-large-width {
                  font-size: 0.9647rem;
                }

                .q-field__native {
                  height: 2.75rem;
                  color: var(--secondary-01);
                  padding: 0.6875rem 0;
                }
              }
            }
          }
        }
      }

      .btn-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0 0.75rem;

        .btn-style {
          width: calc(50% - 0.625rem);
          border-radius: 0.5rem;
          padding: 0.84375rem 0;
          font-size: 1rem;
          font-weight: 600;

          &.confirm {
            background: var(--primary-01);
            color: var(--text-01);
          }

          &.cancel {
            color: var(--primary-01);

            &::before {
              border: 0.125rem solid var(--primary-01);
            }
          }

          :deep(.q-btn__content) {
            line-height: normal;
          }
        }
      }
    }
  }
}
</style>
