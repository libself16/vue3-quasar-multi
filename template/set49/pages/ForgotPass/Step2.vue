<template>
  <BannerMember />
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <div class="color-label"></div>
        <div class="title">{{ $t("member.forgotPassword.resetPassword") }}</div>
      </div>
      <div class="forget-password-form">
        <q-form @submit.prevent="resetPassword">
          <div class="form-content">
            <div class="input-area form-item">
              <label class="field-label" for="account">
                {{ $t("member.forgotPassword.username") }}
              </label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  v-model="formData.account"
                  outlined
                  class="form-style"
                  lazy-rules
                  :rules="[(val) => Rules.account(val)]"
                  :placeholder="$t('placeholder.pleaseEnterUsername')"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="">{{ $t("member.forgotPassword.newPassword") }}</label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :placeholder="$t('placeholder.pleaseEnterNewPassword')"
                  :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <label class="field-label" for="">{{ $t("member.forgotPassword.confirmPassword") }}</label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.confirm_password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :placeholder="$t('placeholder.pleaseEnterNewPassword')"
                  :rules="[(val) => Rules.confirmPassword(formData.password, val)]"
                />
              </div>
            </div>

            <div class="btns row justify-center">
              <q-btn class="submit-btn" text-color="black" type="submit" :loading="isLoading">
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
import BannerMember from "app/template/set49/components/BannerMember.vue"

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
@import 'app/template/set49/assets/css/_variable.scss'

.forget-password-layout
  padding-top: 3rem
  +iphone-width
    padding-top: 0
  .forget-password-content
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    border-radius: .5rem
    background: $primary-modal-bg
    +iphone-width
      margin-top: 0
      padding: 0
      background: $secondary-gradient-bg
    .forget-password-title-content
      margin-top: 2.5rem
      padding: 0 2.5rem
      +iphone-width
        margin-top: 1rem
        padding: 0
    .forget-password-form
      width: 100%
      border-radius: .5rem
      padding: 0rem 2.5rem 4rem
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        +iphone-width
          width: 90%
          margin: 1rem auto 3rem
          padding: .1rem 1.5rem 2.25rem
          background: $primary-modal-bg
          border-radius: .5rem
        .form-item
          margin-top: 2rem
          +iphone-width
            margin-top: 1rem
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .field-label
            text-transform: uppercase
            color:  rgba(255, 255, 255, 0.7)
            margin-left: 1.25rem
            display: block
            font-family: "Century Gothic"
            font-weight: 700
          .field-input
            @apply w-[75%] mt-2
            margin-left: .75rem
            +iphone-width
              width: 90%

.btns
  gap: .75rem
  margin-top: 4rem
  .submit-btn
    border-radius: 8px
    background: $yellow-active
    font-size: 1.25rem
    padding: .4688rem 3.625rem
    min-height: auto
    :deep(.q-btn__content)
      height: 1.5325rem
      line-height: 1.5325rem
      min-height: 1.5325rem
    &:hover
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), $yellow-active
    +iphone-width
      padding: .5rem 2.25rem
      min-height: auto
      font-size: 1rem
      :deep(.q-btn__content)
        height: 1.25rem
        line-height: 1.25rem
        min-height: 1.25rem

.form-style
  padding-bottom: 0
  :deep(.q-field__control)
    height: 3rem
    border-radius: .5rem
    +iphone-width
      height: 2.25rem
  :deep(.q-field__append)
    height: 3rem
  &.q-field--error
    padding-bottom: 1.25rem
  &.sms-style
    :deep(.q-field__control)
      height: 3rem
  &.otp-style
    @apply relative
    width: 70%
    +iphone-width
      width: 100%
</style>
