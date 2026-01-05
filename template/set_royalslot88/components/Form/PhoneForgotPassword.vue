<template>
  <!-- sms -->
  <q-form v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Sms" @submit="forgetPasswordSms">
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
    <!-- 切換email驗證 -->
    <div class="flex justify-end">
      <q-btn
        flat
        text-color="white"
        class="hide-hover capitalize"
        @click="changeForgotMethod(FORGOT_PASS_METHOD.Enums.Email)"
        :disable="isLoading"
      >
        {{ $t("common.btn.emailVerification") }}
      </q-btn>
    </div>
    <div class="btn-modal-big btn_for-big">
      <q-btn class="btn_for hide-hover normal-case text-base font-normal" @click="closeDialog" :loading="isLoading">
        {{ $t("common.btn.cancel") }}
      </q-btn>
      <q-btn
        class="btn_for btn_for_sub hide-hover normal-case text-base font-normal"
        type="submit"
        :loading="isLoading"
      >
        {{ $t("common.btn.submit") }}
      </q-btn>
    </div>
  </q-form>
  <!-- account -->
  <q-form v-else @submit="forgetPassword">
    <!-- 帳號 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.username") }}</label>
      <q-input
        v-model="formAccount.account"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.account(val)]"
      />
    </div>
    <!-- email -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.email") }}</label>
      <q-input v-model="formAccount.email" class="form-control" dense borderless lazy-rules :rules="[Rules.email]" />
    </div>
    <!-- 切換phone驗證 -->
    <div class="flex justify-end">
      <q-btn
        flat
        text-color="white"
        class="hide-hover capitalize"
        @click="changeForgotMethod(FORGOT_PASS_METHOD.Enums.Sms)"
        :disable="isLoading"
      >
        {{ $t("common.btn.smsVerification") }}
      </q-btn>
    </div>
    <div class="btn-modal-big btn_for-big">
      <q-btn class="btn_for hide-hover normal-case text-base font-normal" @click="closeDialog" :loading="isLoading">
        {{ $t("common.btn.cancel") }}
      </q-btn>
      <q-btn
        class="btn_for btn_for_sub hide-hover normal-case text-base font-normal"
        type="submit"
        :loading="isLoading"
      >
        {{ $t("common.btn.submit") }}
      </q-btn>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import * as Request from "src/api/request.type"
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const router = useRouter()
const { isLoading, handleForgetPassword, handleForgetPasswordSms, handleGetOTP } = useAuth()
const eventbus = injectStrict(EventBusKey)

const phoneRef = ref()
const counting = ref(false)
const forgetMethod = ref(FORGOT_PASS_METHOD.Enums.Sms)

const formAccount = reactive<Request.forgetPassword>({
  account: "",
  email: ""
})
const formSms = reactive<Request.forgetPasswordSms>({
  phone: "",
  sms_otp: ""
})

function changeForgotMethod(type: FORGOT_PASS_METHOD.Enums) {
  forgetMethod.value = type
  formSms.phone = ""
  formSms.sms_otp = ""
  formAccount.account = ""
  formAccount.email = ""
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

async function forgetPasswordSms() {
  const { status, data } = await handleForgetPasswordSms(formSms)

  if (!status || !data || !data.token) return
  // TODO:
  router.push({
    name: "QuickPass",
    params: {
      account: formSms.phone,
      token: data.token
    }
  })
}

async function forgetPassword() {
  const { status } = await handleForgetPassword(formAccount)
  if (!status) {
    return
  }
  $q.notify({
    type: "positive",
    message: t("common.validate.LetterHasBeenSent"),
    position: "top",
    timeout: 1000
  })
  closeDialog()
}

function closeDialog() {
  eventbus.emit("openForgotPassword", false)
}

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    changeForgotMethod(FORGOT_PASS_METHOD.Enums.Sms)
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
