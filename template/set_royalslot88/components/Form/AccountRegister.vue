<template>
  <q-form @submit="register" autocomplete="new-password">
    <!-- 帳號 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.username") }}</label>
      <q-input
        v-model="formRegister.account"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterUsername')"
        :rules="[(val) => Rules.account(val)]"
        autocomplete="new-password"
      />
    </div>
    <!-- email -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.email") }}</label>
      <q-input
        v-model="formRegister.email"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterEmail')"
        :rules="[Rules.required(), Rules.email]"
      />
    </div>
    <!-- 密碼 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("common.btn.password") }}</label>
      <q-input
        v-model="formRegister.password"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterPassword')"
        :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
        type="password"
        autocomplete="new-password"
      />
    </div>
    <!-- 確認密碼 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.register.confirmPassword") }}</label>
      <q-input
        v-model="formRegister.confirm_password"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
        :rules="[(val) => val === formRegister.password || $t('common.validate.consistentPassword')]"
        type="password"
        autocomplete="off"
      />
    </div>
    <!-- 全名 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.fullName") }}</label>
      <q-input
        v-model="formRegister.fullname"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterFullname')"
        :rules="[(val) => Rules.fullname(val)]"
      />
    </div>
    <!-- 電話號碼 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.register.contactNumber") }}</label>
      <q-input
        :placeholder="$t('placeholder.pleaseEnterContactNo')"
        v-model="formRegister.phone"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[Rules.noRule]"
      />
    </div>
    <!-- ref_account -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("menu.referral") }}</label>
      <q-input
        v-model="formRegister.ref_account"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[Rules.noRule]"
      />
    </div>
    <div class="btn-modal-big">
      <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
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
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import * as Request from "src/api/request.type"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { getFavoriteGames } = useGame()
const eventbus = injectStrict(EventBusKey)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: ""
})

const formRegister = reactive<Request.register>({
  account: "",
  password: "",
  confirm_password: "",
  fullname: "",
  email: "",
  phone: "",
  ref_account: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})

function initForm() {
  formLogin.username = ""
  formLogin.password = ""
  formRegister.account = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.email = ""
  formRegister.phone = ""
  formRegister.ref_account = ""
  formRegister.contacts.contact1 = ""
  formRegister.contacts.contact2 = ""
}

async function register() {
  const { status } = await handleRegister({
    account: formRegister.account,
    password: formRegister.password,
    confirm_password: formRegister.confirm_password,
    fullname: formRegister.fullname,
    ref_account: formRegister.ref_account,
    email: formRegister.email,
    phone: formRegister.phone,
    contacts: formRegister.contacts
  })
  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })
  formLogin.username = formRegister.account
  formLogin.password = formRegister.password
  await login()
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
    await getFavoriteGames()
    await getUserWalletList()
    await getUserInfo()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
  }
  eventbus.emit("openRegister", false)
  eventbus.emit("openLogin", false)
}

onMounted(() => {
  eventbus.on("openRegister", (show: boolean) => {
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
