<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- sms -->
    <q-form v-if="forgetMethod === FORGOT_PASS_METHOD.Enums.Sms" @submit="showVerifyModal([forgetPasswordSms])">
      <!-- 手機號碼 -->
      <div class="form-container">
        <q-input
          v-model="formSms.phone"
          ref="phoneRef"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.login.phone')"
          lazy-rules
          :rules="[Rules.noRule]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('phone')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <!-- SMS -->
        <div class="sms-container">
          <q-input
            v-model="formSms.sms_otp"
            class="form-input"
            dense
            borderless
            :placeholder="$t('member.login.verifyCode')"
            lazy-rules
            :rules="[Rules.otp]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('shield')" alt="verify-code" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <!-- 倒數秒數 -->
          <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
            <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
              {{ `${totalSeconds}S` }}
            </vue-countdown>
          </q-btn>
          <q-btn
            v-else
            class="btn-send hide-hover"
            :label="$t('common.btn.send')"
            @click="getOtpCode"
            :disable="isLoading || !formSms.phone"
          />
        </div>
      </div>
      <q-btn class="btn-submit hide-hover mt-5" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn
          flat
          class="btn-password hide-hover"
          @click="changeForgotMethod(FORGOT_PASS_METHOD.Enums.Email)"
          :disable="isLoading"
        >
          {{ $t("common.btn.emailVerification") }}
        </q-btn>
      </div>
    </q-form>
    <!-- account -->
    <q-form v-else @submit="showVerifyModal([forgetPassword])">
      <div class="form-container">
        <q-input
          v-model="formAccount.account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredAccount')"
          lazy-rules
          :rules="[(val) => Rules.account(val)]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <q-input
          v-model="formAccount.email"
          class="form-input"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredEmail')"
          lazy-rules
          :rules="[Rules.email]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('mail')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
      </div>

      <q-btn class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn
          flat
          class="btn-password hide-hover"
          @click="changeForgotMethod(FORGOT_PASS_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("common.btn.smsVerification") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
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
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
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
}

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    changeForgotMethod(FORGOT_PASS_METHOD.Enums.Sms)
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/form.scss";
@import "app/template/okbet_purple/assets/css/button.scss";

.pc {
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .form-input {
      width: 18.875rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
      text-transform: none;
      background: $bg-secondary;
      color: $text-light-primary;

      &.counting {
        background: $bg-secondary;
        color: $text-light-secondary;
        opacity: 1 !important;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $text-light-primary;
    background: $bg-secondary;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
      color: $text-light-primary;
    }
  }
}
.h5 {
  .form-container {
    margin: 0.6875rem auto;
    background: $bg-dark-secondary;
    border: 1px solid $border-dark;
    border-radius: 0.5rem;
  }
  .sms-container {
    width: 100%;
    position: relative;
    .btn-send {
      position: absolute;
      width: 8.9375rem;
      height: 3rem;
      top: 0.5rem;
      right: 0.75rem;
      overflow: inherit;
      background: $bg-secondary;
      color: $text-light-primary;
      line-height: 2.1875rem;
      font-size: 0.9647rem;
      border-radius: 0.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: capitalize;
      &.counting {
        background: $bg-dark-secondary !important;
        color: $text-light-secondary !important;
        &.disabled {
          opacity: 1 !important;
        }
      }
      &.disabled {
        opacity: 0.5 !important;
      }
    }
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    background: $bg-secondary;
    color: $text-light-primary;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.0625rem;
    .btn-password {
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
}
.form-container {
  :deep(.q-field__native) {
    color: $text-light-secondary;
  }
  :deep(.q-field__inner) {
    border: 1px solid $border-dark !important;
  }
}
</style>
