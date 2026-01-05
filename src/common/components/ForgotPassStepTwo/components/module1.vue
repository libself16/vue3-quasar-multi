<template>
  <div
    class="forget-password w-full h-full max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]"
  >
    <div class="forget-password-title">
      {{ $t("member.forgotPassword.resetPassword") }}
    </div>

    <div class="forget-password-form">
      <q-form>
        <div class="form-area">
          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.forgotPassword.username") }}
            </div>
            <q-input
              v-model="formData.account"
              class="form-input"
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              hide-bottom-space
              :rules="[(val) => Rules.account(val)]"
              :placeholder="$t('placeholder.pleaseEnterUsername')"
            />
          </div>

          <div class="form-item">
            <div class="field-label form-title required">{{ $t("member.forgotPassword.newPassword") }}</div>
            <q-input
              v-model="formData.password"
              class="form-input"
              :type="showPassword.oldPassword ? 'text' : 'password'"
              standout
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              hide-bottom-space
              :placeholder="$t('placeholder.pleaseEnterNewPassword')"
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

          <div class="form-item">
            <div class="field-label form-title required">{{ $t("member.forgotPassword.confirmPassword") }}</div>
            <q-input
              v-model="formData.confirm_password"
              class="form-input"
              :type="showPassword.confirmPassword ? 'text' : 'password'"
              standout
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              hide-bottom-space
              :placeholder="$t('placeholder.pleaseEnterNewPassword')"
              :rules="[(val) => Rules.confirmPassword(formData.password, val)]"
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
      </q-form>

      <q-btn class="btn-submit" type="submit" :loading="isLoading" @click="resetPassword">
        {{ $t("common.btn.submit") }}
      </q-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const { isLogin, isLoading, handleResetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const formData = reactive({
  account: "",
  password: "",
  confirm_password: ""
})
const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})

const token = computed<string>(() => route.params.token as string)
const checkToken = computed(() => {
  return !!token.value
})

const resetPassword = async () => {
  const { status } = await handleResetPassword({
    token: token.value,
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password
  })

  if (!status) return

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  router.push({ name: "home" })
}

onMounted(() => {
  if (!checkToken.value || isLogin.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.forget-password {
  min-height: 39.5rem;
  border-radius: 0.5rem;
  background: var(--bg-11);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto 1.25rem;

  @include phone-width() {
    height: calc(100dvh - 10rem);
    min-height: auto;
    margin-bottom: 0;
    padding: 0 1rem;
    background: transparent;
  }

  .forget-password-title {
    color: var(--text-01);
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.625rem;
  }

  .forget-password-form {
    width: 100%;
    flex: 1;
    margin-top: 0.625rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .form-area {
      @apply flex flex-col items-center justify-center;

      .form-item {
        width: 100%;
        max-width: 35rem;
        margin-bottom: 0.6225rem;

        @include phone-width() {
          @apply w-full;
        }

        .field-label {
          color: var(--text-03);
          position: relative;
          display: inline-block;
          margin-bottom: 0.375rem;

          &.required {
            &:after {
              content: "";
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: -0.75rem;
              width: 0.375rem;
              height: 0.375rem;
              background-color: var(--bg-10);
              border-radius: 50%;
            }
          }
        }

        .form-input {
          :deep(.q-field__control) {
            color: var(--primany-01);

            &::before {
              border: 2px solid var(--input-dropdown-text-03);
              border-radius: 0.25rem;
              background: var(--input-dropdown-bg-01);
            }

            .q-field__native {
              color: var(--text-01);
              &::placeholder {
                color: var(--input-dropdown-text-01);
              }
            }

            .q-field__append {
              color: var(--primany-01);
            }
          }
        }
      }
    }

    .btn-submit {
      @apply flex items-center justify-center mx-auto;
      border-radius: 0.25rem;
      background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
      color: var(--btn-text-01);
      width: 35rem;
      height: 2.9375rem;
      font-size: 0.875rem;
      font-weight: 700;

      @include phone-width() {
        width: 100%;
        margin-top: 1.25rem;
      }
    }
  }
}
</style>
