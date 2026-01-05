<template>
  <q-form @submit.prevent="register">
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.account"
        :label="$t('placeholder.pleaseEnterUsername')"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-user" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.fullname"
        :label="$t('placeholder.pleaseEnterFullname')"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-id-card" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.phone"
        :label="$t('placeholder.pleaseEnterContactNo')"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[Rules.required()]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-phone" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.password"
        :label="$t('placeholder.pleaseEnterPassword')"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
        :type="isPasswordVisible ? 'text' : 'password'"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="text-black ml-2" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer text-black mr-2"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.confirm_password"
        :label="$t('placeholder.pleaseEnterConfirmPassword')"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
        :type="isConfirmPasswordVisible ? 'text' : 'password'"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="text-black ml-2" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer text-black mr-2"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.contacts.contact1"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fab fa-skype" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.contacts.contact2"
        bg-color="white"
        color="black"
        lazy-rules
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fab fa-line" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.email"
        bg-color="white"
        color="black"
        :label="$t('placeholder.pleaseEnterEmail')"
        lazy-rules
        :rules="[Rules.required(), Rules.email]"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-envelope" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        rounded
        outlined
        v-model="formData.ref_account"
        bg-color="white"
        color="black"
        :label="$t('member.register.affiliate')"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-user-plus" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div class="register-tip my-2">
      <span>{{ $t("common.tip.reg_tip") }}</span>
    </div>
    <div>
      <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleRegister, handleLogin } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const formData = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: undefined,
  email: "",
  phone: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})

const register = async () => {
  const { status } = await handleRegister({
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password,
    fullname: formData.fullname,
    ref_account: formData.ref_account,
    email: formData.email,
    phone: formData.phone,
    contacts: formData.contacts
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

  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formData.account,
    password: formData.password
  }
  await login(payload)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await getUserWalletList()
  await getUserInfo()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000
  })
  router.push({ name: "Home" })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.register-tip {
  color: $primary;
}

.skip-enter {
  color: $primary;
  font-size: 0.875rem;
}

.field-input {
  ::v-deep(.q-field--error) {
    @media screen and (max-width: 600px) {
      margin-bottom: 1.25rem;
    }
  }

  ::v-deep(.q-field__messages) {
    color: #ed4014;
  }
}
</style>
