<template>
  <div class="forget-password">
    <div class="forget-password-title">
      {{ $t("member.forgotPassword.resetPassword") }}
    </div>

    <div class="forget-password-form">
      <q-form @submit.prevent="resetPassword">
        <div class="form-area">
          <div class="form-item">
            <div class="field-label form-title required">
              {{ $t("member.forgotPassword.newPassword") }}
            </div>

            <q-input
              v-model="formData.password"
              class="form-input"
              :type="showPassword.newPassword ? 'text' : 'password'"
              standout
              rounded
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
              :placeholder="$t('placeholder.pleaseEnterNewPassword')"
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
            <div class="field-label form-title required">
              {{ $t("member.forgotPassword.confirmPassword") }}
            </div>

            <q-input
              v-model="formData.confirm_password"
              class="form-input"
              :type="showPassword.confirmPassword ? 'text' : 'password'"
              standout
              rounded
              outlined
              dense
              borderless
              lazy-rules
              no-error-icon
              :rules="[(val) => Rules.confirmPassword(formData.password, val)]"
              :placeholder="$t('placeholder.pleaseEnterNewPassword')"
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

        <q-btn class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
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
const { isLoading, handleResetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

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
const showPassword = reactive({
  newPassword: false,
  confirmPassword: false
})
async function resetPassword() {
  const { status } = await handleResetPassword({
    token: token.value,
    account: account.value,
    password: formData.password,
    confirm_password: formData.confirm_password
  })

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  router.push({ name: "Login" })
}

onMounted(() => {
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.forget-password {
  max-width: 75rem;
  margin: 1.25rem auto 0;
  border-radius: 0.5rem;
  background: $primary07;
  padding: 3.75rem;

  @include phone-width() {
    margin-top: 0;
    padding: 1.25rem;
  }

  .forget-password-title {
    @include fontStyle(1.625rem);
    color: $secondary03;
    margin-bottom: 1.25rem;
  }

  .forget-password-form {
    width: 100%;

    .form-area {
      @apply flex flex-col items-center justify-center;

      .form-item {
        width: 100%;
        max-width: 37.5rem;
        margin-top: 1.25rem;

        @include phone-width() {
          @apply w-full;
          margin-top: 1.25rem;
        }

        .field-label {
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
      margin-top: 2.5rem;

      @include phone-width() {
        width: 100%;
        margin-top: 1.25rem;
      }
    }
  }
}
</style>
