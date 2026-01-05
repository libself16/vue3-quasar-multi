<template>
  <div class="reg-area">
    <div class="con-info">
      <div class="con">
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
        <div class="form-validation">
          <q-form class="modal-form px-4" @submit.prevent="resetPassword">
            <div class="input-area">
              <label class="field-label" for="">
                {{ $t("member.forgotPassword.username") }}
              </label>
              <div class="field-input">
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
            <div class="input-area">
              <label class="field-label" for="">{{ $t("member.forgotPassword.newPassword") }}</label>
              <div class="field-input">
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
            <div class="input-area">
              <label class="field-label" for="">{{ $t("member.forgotPassword.confirmPassword") }}</label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="formData.confirm_password"
                  class="form-style"
                  type="password"
                  lazy-rules
                  :rules="[(val) => val === formData.password || $t('common.validate.confimrPasswordValidation')]"
                />
              </div>
            </div>

            <div class="input-area q-pt-md">
              <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
            </div>
          </q-form>
        </div>
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

  router.push({ name: "Login" })
}

onMounted(() => {
  if (!checkToken.value || isLogin.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/main.sass"

::v-deep(.q-field__messages)
  color: #ed4014
  font-size: 0.9vw
  +pad-width
    font-size: 2vw
  +iphone-width
    font-size: 3.2vw
::v-deep(.q-field__marginal)
  height:30px
::v-deep(.q-field__control)
  background-color: #fff
  padding: 15px
  border-radius: 5px
  border: none
  .q-field__native
    font-weight: 500
    height:30px
    &:focus
      color: rgba(28, 30, 34, 0.70)
    +iphone-width
      font-size: 4vw

.area-title
  font-weight: 700
  font-size: 18px
  margin: 10px 0
.area-description
  margin: 10px 0

.form-validation
  margin-top: 25px
  min-width: 950px
  +pad-width
    min-width: 100%
  +iphone-width
    min-width: 100%
</style>
