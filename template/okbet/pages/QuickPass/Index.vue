<template>
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label"></div>
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="forget-password-form">
        <q-form @submit.prevent="resetPassword">
          <div class="form-content">
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
                  :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
                />
              </div>
            </div>

            <div class="action-btns row justify-center">
              <q-btn class="submit-btn" type="submit" color="primary" :loading="isLoading">
                {{ $t("common.btn.submit") }}</q-btn
              >
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
import type * as Request from "src/api/request.type"

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

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import "app/template/okbet/assets/css/_variable.sass"
@import "app/template/okbet/assets/css/button.scss"

.forget-password-layout
  padding-top: 6rem
  +iphone-width
    padding-top: 1.25rem
  .forget-password-content
    color: $text-light-color
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    border-radius: .5rem
    background: $background-light-color
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
        background: $primary-color
      .title
        color: $text-dark-color
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
          background: $background-light-color
          border-radius: .5rem
        .form-item
          margin-top: 1.25rem
          .field-label
            color: $text-dark-color
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
