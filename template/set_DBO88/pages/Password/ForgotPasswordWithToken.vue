<template>
  <section class="forgot-password-wrapper">
    <div class="forgot-password-container">
      <div class="forgot-password-content">
        <q-form @submit.prevent="resetPassword">
          <div class="form-title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
          <!-- User Name -->
          <div class="form-label">
            {{ $t("member.forgotPassword.username") }}
          </div>
          <div class="field-input">
            <q-input
              v-model="formData.account"
              :label="$t('member.forgotPassword.username')"
              autocomplete="new-password"
              borderless
              dense
              lazy-rules
              color="black"
              :rules="[(val) => Rules.account(val)]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-user" class="field-icon" />
              </template>
            </q-input>
          </div>
          <!-- New Password -->
          <div class="form-label">
            {{ $t("member.forgotPassword.newPassword") }}
          </div>
          <div class="field-input">
            <q-input
              v-model="formData.password"
              :label="$t('member.forgotPassword.newPassword')"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="new-password"
              borderless
              dense
              lazy-rules
              color="black"
              :rules="[(val) => Rules.password(val)]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-lock" class="field-icon" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  class="cursor-pointer field-icon"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>
          </div>
          <!-- Confirm Password -->
          <div class="form-label">
            {{ $t("member.forgotPassword.confirmPassword") }}
          </div>
          <div class="field-input">
            <q-input
              v-model="formData.confirm_password"
              :label="$t('member.forgotPassword.confirmPassword')"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              auto-complete="off"
              borderless
              dense
              lazy-rules
              color="black"
              :rules="[(val) => val === formData.password || $t('common.validate.confimrPasswordValidation')]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-lock" class="field-icon" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  class="cursor-pointer field-icon"
                  @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { isLoading, handleResetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const token = computed<string>(() => route.params.token as string)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const formData = reactive({
  account: "",
  password: "",
  confirm_password: ""
})

const resetPassword = async () => {
  const { status } = await handleResetPassword({
    token: token.value,
    account: formData.account,
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

  router.push({ name: "Home" })
}
</script>

<style lang="scss" scoped>
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/form.scss";

.forgot-password-wrapper {
  @apply px-[.9375rem] my-4;

  .form-title {
    @apply text-[1.5rem] font-black text-center;
    color: $primary-color;
  }

  .form-label {
    @apply font-bold mb-2;
    color: $primary-color;
  }
}
</style>
