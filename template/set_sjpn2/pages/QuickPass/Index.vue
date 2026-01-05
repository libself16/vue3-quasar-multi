<template>
  <div class="reg-area">
    <div class="con-info">
      <div class="con">
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
        <div class="form-validation">
          <q-form class="modal-form px-4" @submit.prevent="resetPassword">
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
                  :placeholder="$t('placeholder.pleaseEnterNewPassword')"
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
                  :rules="[
                    (val) => !!val || $t('common.validate.requiredField'),
                    (val) => val === formData.password || $t('common.validate.consistentPassword')
                  ]"
                  :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
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
import * as Request from "src/api/request.type"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLocalCommon } from "app/template/set_sjpn2/hooks/useLocalCommon"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { afterLogin } = useLocalCommon()
const { isLoading, handleResetPassword, handleLogin, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
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
  const { status } = await handleResetPassword({
    token: token.value,
    account: account.value,
    password: formData.password,
    confirm_password: formData.confirm_password
  })

  if (!status) {
    return
  }

  await tryLogin()
}

const tryLogin = async () => {
  try {
    const payload: Request.login = {
      login_method: LOGIN_METHOD.Enums.Password,
      username: account.value,
      password: formData.password
    }

    const { status, data } = await handleLogin(payload)

    if (!status) {
      $q.notify({
        type: "negative",
        message: "login failed",
        position: "top",
        timeout: 1000
      })
      return
    }

    if (auth.value.access_token) {
      await getUserWalletList()
      await getUserInfo()

      $q.notify({
        type: "positive",
        message: t("common.alarm.loginSuccess"),
        position: "top",
        timeout: 1000
      })

      afterLogin()
    }
  } catch (error) {}
}

onMounted(() => {
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
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
