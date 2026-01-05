<template>
  <q-form @submit.prevent="register" class="register-form-wrapper">
    <PhoneInput v-model:phone="formRegister.phone" v-model:country="formRegister.country"></PhoneInput>
    <template v-for="(column, key) in customInputList" :key="key">
      <!-- 文字輸入框 -->
      <!-- <SmsOtpInput
            v-if="column.column_name === 'sms_otp'"
            :field="column"
            :phone="formRegister?.phone"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></SmsOtpInput> -->
      <div v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input" class="field-input">
        <ExtraInput
          :field="column"
          :class="'form-control'"
          v-model="(formRegister as Request.register)[column?.column_name]"
        ></ExtraInput>
      </div>

      <div v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select" class="field-input">
        <ExtraSelect
          v-model="(formRegister as Request.register)[column?.column_name]"
          :field="column"
          :class="'form-control'"
        ></ExtraSelect>
      </div>
      <div class="field-input" v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date">
        <DateInput
          :field="column"
          :class="'form-control'"
          v-model="(formRegister as Request.register)[column?.column_name]"
        ></DateInput>
      </div>
    </template>
    <div class="btn-wrapper">
      <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, FIELD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import DateInput from "../../ExtraInput/Date.vue"
import ExtraInput from "../../ExtraInput/Index.vue"
import PhoneInput from "../../ExtraInput/Phone.vue"
import ExtraSelect from "../../ExtraInput/Select.vue"
import SmsOtpInput from "../../ExtraInput/SmsOtpInput.vue"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const {
  isLoading,
  handleGetOTP,
  hiddenColumn,
  handleRegisterCustomInput,
  handleLogin,
  handleRegister,
  auth,
  handleCheckPhone
} = useAuth()
const { getUserWalletList, getAccountInfo } = useUserInfo()

const eventbus = injectStrict(EventBusKey)
const errorSpacing = ref(false)
const customInputList = ref<Response.RegistInputCustomList>([])

const formRegister = ref<Request.register>({
  is_customize: true
})

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
    case "sms_otp":
      return false

    default:
      return true
  }
}

const register = async () => {
  const { status } = await handleRegister(formRegister.value)

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })

  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formRegister.value.account,
    password: formRegister.value.password
  }
  await login(payload)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await getUserWalletList()
  await getAccountInfo()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []

  const { referral_code } = route.query
  if (referral_code) {
    formRegister.value.ref_account = referral_code as string
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.field-input {
  @apply mb-8;

  ::v-deep(.q-field__messages) {
    color: #ed4014;
  }
}

.register-form-wrapper {
  .btn-wrapper {
    @apply flex;
    .btn-submit {
      @apply my-0;
    }
  }
}
</style>
