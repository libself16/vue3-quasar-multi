<template>
  <div class="phone-wrapper">
    <q-form @submit.prevent="forgetPasswordSms">
      <div class="field-input flex">
        <q-input
          v-model="smsData.phone"
          ref="phoneRef"
          :label="$t('placeholder.phoneNumber')"
          dense
          borderless
          lazy-rules
          bg-color="white"
          color="black"
          class="input-style"
          :rules="[Rules.noRule]"
          unmasked-value
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-phone" class="field-icon" />
          </template>
        </q-input>
        <q-btn class="otp-btn" :disable="!smsData.phone || counting" @click="getOtpCode">
          {{ $t("common.btn.otp") }}</q-btn
        >
      </div>
      <div class="field-input flex items-center">
        <q-input
          v-model="smsData.sms_otp"
          :label="$t('placeholder.enterOTP')"
          dense
          borderless
          lazy-rules
          bg-color="white"
          color="black"
          class="input-style"
          :rules="[Rules.required()]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-shield-alt" class="field-icon" />
          </template>
        </q-input>
        <vue-countdown
          @end="counting = false"
          v-if="counting"
          :time="180000"
          v-slot="{ totalSeconds }"
          class="counting-text"
          >{{ `${totalSeconds}s` }}</vue-countdown
        >
      </div>
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import VueCountdown from "@chenfengyuan/vue-countdown"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleForgetPasswordSms, handleGetOTP } = useAuth()
const eventbus = injectStrict(EventBusKey)
const smsData = reactive({
  phone: "",
  sms_otp: ""
})
const phoneRef = ref()
const counting = ref(false)

const getOtpCode = async () => {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top"
    })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: smsData.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

const forgetPasswordSms = async () => {
  const { status, data } = await handleForgetPasswordSms(smsData)

  if (!status || !data || !data.token) return

  router.push({
    name: "QuickPass",
    params: {
      account: smsData.phone,
      token: data.token
    }
  })

  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}
</script>

<style lang="scss" scoped>
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/form.scss";

.phone-wrapper {
  .btn-submit {
    @apply my-2;
  }
}
</style>
