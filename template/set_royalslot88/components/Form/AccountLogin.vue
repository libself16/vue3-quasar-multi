<template>
  <q-form @submit="login" class="login_form" autocomplete="new-password">
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.username") }}</label>
      <q-input
        v-model="formLogin.username"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.account(val)]"
        autocomplete="new-password"
      />
    </div>
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.password") }}</label>
      <q-input
        v-model="formLogin.password"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val)]"
        type="password"
        autocomplete="new-password"
      />
    </div>
    <div class="btn-modal-big">
      <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
        {{ $t("home.signIn") }}
      </q-btn>
    </div>
    <div class="btn-modal-group">
      <q-btn
        class="btn-modal-forgot hide-hover normal-case text-base font-normal"
        :loading="isLoading"
        @click="goForgotPassword"
      >
        {{ $t("member.forgotPassword.forgotPassword") }}
      </q-btn>
      <q-btn
        class="btn-modal-reg hide-hover normal-case text-base font-normal"
        :loading="isLoading"
        @click="openRegister"
      >
        {{ $t("home.signup") }}
      </q-btn>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import * as Request from "src/api/request.type"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const eventbus = injectStrict(EventBusKey)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: ""
})

function initFormLogin() {
  formLogin.username = ""
  formLogin.password = ""
}

async function login() {
  const { status } = await handleLogin({
    login_method: formLogin.login_method,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
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
  }
  eventbus.emit("openLogin", false)
}

function goForgotPassword() {
  eventbus.emit("openLogin", false)
  eventbus.emit("openForgotPassword", true)
}

function openRegister() {
  eventbus.emit("openRegister", true)
}

onMounted(() => {
  eventbus.on("openLogin", (show: boolean) => {
    initFormLogin()
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
