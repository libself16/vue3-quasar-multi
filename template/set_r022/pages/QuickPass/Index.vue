<template>
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label" />
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="forget-password-form">
        <q-form @submit.prevent="resetPassword">
          <div class="form-content">
            <div class="input-area form-item">
              <div class="field-label">{{ $t("member.forgotPassword.newPassword") }}</div>
              <div class="field-input">
                <q-input
                  outlined
                  v-model="formData.password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <div class="field-label">{{ $t("member.forgotPassword.confirmPassword") }}</div>
              <div class="field-input">
                <q-input
                  outlined
                  v-model="formData.confirm_password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
                />
              </div>
            </div>

            <div class="action-btns row justify-center">
              <q-btn class="submit-btn" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </div>

  <FooterArea v-if="!isLargeTablet" class="footer-area" />
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, reactive } from "vue"
import type * as Request from "src/api/request.type"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import FooterArea from "app/template/set_r022/components/Footer/Index.vue"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isLargeTablet } = useMediaQuery()
const { isLoading, handleResetPassword } = useAuth()

const token = computed<string>(() => route.params.token as string)
const account = computed<string>(() => route.params.account as string)

const checkToken = computed(() => {
  return !!token.value
})

const checkAccount = computed(() => {
  return !!account.value
})

const formData = reactive({
  password: "",
  confirm_password: ""
})
async function resetPassword() {
  const payload: Request.resetPassword = {
    token: token.value,
    password: formData.password,
    confirm_password: formData.confirm_password
  }
  if (checkAccount.value) {
    payload.account = account.value
  }

  const { status } = await handleResetPassword(payload)

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  router.push({ name: "home" })
}

onMounted(() => {
  if (!checkToken.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/form.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.forget-password-layout {
  width: 56.25rem;
  margin: 1.5rem auto 9.1875rem;
  border-radius: 0.75rem;
  background: var(--neutral-01);
  padding: 1.25rem;

  @include pad-large-width {
    width: 100%;
    padding-top: 1.5rem;
    padding-bottom: 13.765rem;
    margin-top: 0;
    border-radius: 0;
  }

  .forget-password-content {
    color: var(--neutral-10);
    overflow: hidden;

    .forget-password-title-content {
      border-bottom: 1px solid var(--neutral-03);
      padding-bottom: 1.0625rem;
      margin-bottom: 1.5rem;

      @include pad-large-width {
        border-bottom: none;
        margin: 0;
        padding-bottom: 1.25rem;
      }

      .color-label {
        width: 0.25rem;
        height: 1.125rem;
        border-radius: 0.25rem;
        background: var(--primary-01);

        @include pad-large-width {
          display: none;
        }
      }

      .title {
        color: var(--secondary-01);
        font-size: 0.875rem;
      }
    }

    .forget-password-form {
      width: 100%;

      .form-content {
        .form-item {
          margin: 0;

          .field-label {
            font-size: 0.75rem;
            font-weight: 400;
            color: var(--neutral-10);
            margin-bottom: 0.25rem;

            &::before {
              content: "＊";
              color: var(--emotional-danger-01);
            }
          }

          .input-content {
            margin-top: 0.5rem;
            padding: 0;

            :deep(.q-field--disabled) {
              .q-field__control {
                div {
                  opacity: 1 !important;
                }
              }
            }
          }

          .field-input {
            :deep(.q-field__control) {
              width: 28.4375rem;
              height: 2.75rem;
              border-radius: 0.5rem;

              &::before {
                border-color: var(--neutral-03);
                border-radius: 0.5rem;
              }
            }

            @include pad-large-width {
              width: 100%;
            }
          }
        }

        .action-btns {
          margin-top: 0.25rem;

          @include pad-large-width {
            margin-bottom: 0;
          }

          .submit-btn {
            background: var(--primary-01);
            color: var(--text-01);
            border-radius: 0.5rem;
            padding: 0;
            width: 18.625rem;
            height: 2.75rem;

            @include pad-large-width {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
