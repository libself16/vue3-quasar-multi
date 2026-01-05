<template>
  <div>
    <!-- sms -->
    <q-form v-if="formSms.login_method === LOGIN_METHOD.Enums.Sms" @submit="loginSms">
      <!-- 手機號碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.phone") }}</label>
        <q-input
          v-model="formSms.phone"
          ref="phoneRef"
          class="form-control"
          dense
          borderless
          lazy-rules
          :rules="[Rules.noRule]"
        />
      </div>
      <!-- SMS -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.verifyCode") }}</label>
        <div class="forgot_wrap">
          <q-input v-model="formSms.sms_otp" class="form-control" dense borderless lazy-rules :rules="[Rules.otp]" />
          <q-btn v-if="counting" class="vcode_img hide-hover btn-modal-reg btn-counting" flat borderless disable>
            <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
              {{ `${totalSeconds}S` }}
            </vue-countdown>
          </q-btn>
          <q-btn
            v-else
            class="vcode_img hide-hover btn-modal-reg btn-counting"
            :label="$t('common.btn.send')"
            @click="getOtpCode"
            :disable="isLoading || !formSms.phone"
          />
        </div>
      </div>
      <!-- 切換密碼登入 -->
      <div class="flex justify-end">
        <q-btn
          flat
          text-color="white"
          class="hide-hover capitalize"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.password") }} {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <!-- 登入 -->
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("home.signIn") }}
        </q-btn>
      </div>
      <!-- 忘記密碼 / 註冊 -->
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
    <!-- password -->
    <q-form v-else @submit="loginPassword">
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.phone") }}</label>
        <q-input v-model="formSms.username" class="form-control" dense borderless lazy-rules :rules="[Rules.noRule]" />
      </div>
      <div class="form-wrapper">
        <label class="form-label">{{ $t("common.btn.password") }}</label>
        <q-input
          v-model="formSms.password"
          class="form-control"
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.password(val)]"
          type="password"
          autocomplete
        />
      </div>
      <!-- 切換簡訊登入 -->
      <div class="flex justify-end">
        <q-btn
          flat
          text-color="white"
          class="hide-hover capitalize"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("member.login.verifyCode") }} {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <!-- 登入 -->
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("home.signIn") }}
        </q-btn>
      </div>
      <!-- 忘記密碼 / 註冊 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { getFavoriteGames } = useGame()
const eventbus = injectStrict(EventBusKey)

const phoneRef = ref()
const counting = ref(false)

let formSms = reactive<Request.RegisterSms & Request.login>({
  login_method: LOGIN_METHOD.Enums.Sms,
  register_method: REGISTER_METHOD.Enums.Phone,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "" // 手機用
})

function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formSms.login_method = type
  formSms.username = ""
  formSms.password = ""
  formSms.phone = ""
  formSms.sms_otp = ""
}

async function getOtpCode() {
  phoneRef.value.validate()
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top"
    })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: formSms.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

async function loginPassword() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formSms.username,
    password: formSms.password
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await loginAfter()
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formSms.phone,
    sms_otp: formSms.sms_otp
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await loginAfter()
}

async function loginAfter() {
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
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
