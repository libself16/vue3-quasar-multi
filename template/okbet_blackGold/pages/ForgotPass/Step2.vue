<template>
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label"></div>
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="forget-password-form">
        <q-form @submit.prevent="resetPassword" autocomplete="new-password">
          <div class="form-content">
            <div class="input-area form-item">
              <label class="field-label" for="">
                {{ $t("member.forgotPassword.username") }}
              </label>
              <div class="field-input w-3/5">
                <q-input
                  bg-color="white"
                  v-model="formData.account"
                  outlined
                  class="form-style"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="">{{ $t("member.forgotPassword.newPassword") }}</label>
              <div class="field-input w-3/5">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[Rules.required()]"
                  autocomplete="new-password"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="">{{ $t("member.forgotPassword.confirmPassword") }}</label>
              <div class="field-input w-3/5">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.confirm_password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[(val) => val === formData.password || $t('common.validate.confimrPasswordValidation')]"
                  autocomplete="new-password"
                />
              </div>
            </div>

            <div class="action-btns row justify-center">
              <q-btn class="btn-submit forgot-password-btn" type="submit" :loading="isLoading">
                {{ $t("common.btn.submit") }}
              </q-btn>
            </div>
          </div>
        </q-form>
      </div>
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

const token = computed<string>(() => route.params.token as string)
const checkToken = computed(() => {
  return !!token.value
})
const formData = reactive({
  account: "",
  password: "",
  confirm_password: ""
})
async function resetPassword() {
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

  router.push({ name: "home" })
}

onMounted(() => {
  if (!checkToken.value || isLogin.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import "app/template/okbet_blackGold/assets/css/_variable.sass"
@import "app/template/okbet_blackGold/assets/css/button.scss"

.forget-password-layout
  padding-top: 6rem
  +iphone-width
    padding-top: 1.25rem
  .forget-password-content
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    border-radius: .5rem
    background: $primary-black-color
    +iphone-width
      margin-top: 0
      padding: 0
    .forget-password-title-content
      margin-top: 2.5rem
      padding: 0 2.5rem
      +iphone-width
        margin-bottom: 1rem
        padding: 0 1.5rem
      .color-label
        background: $primary-gradient-color
    .forget-password-form
      width: 100%
      border-radius: .5rem
      padding: 2rem 2.5rem
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        +iphone-width
          width: 80%
          margin: 0 auto 1rem
          padding: 1rem 1.5rem
          border-radius: .5rem
        .form-item
          margin-top: 1.25rem
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          +iphone-width
            .field-input
              width: 100%
</style>
