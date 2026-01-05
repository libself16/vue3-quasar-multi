<template>
  <q-form @submit.prevent="register" class="register-form-wrapper">
    <div class="field-input">
      <q-input
        v-model="formData.account"
        :label="$t('placeholder.pleaseEnterUsername')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
        autocomplete="username"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-user" class="field-icon" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        v-model="formData.email"
        :label="$t('placeholder.pleaseEnterEmail')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[Rules.required(), Rules.email]"
        autocomplete="email"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-envelope" class="field-icon" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        v-model="formData.password"
        :label="$t('placeholder.pleaseEnterPassword')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="field-icon" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer field-icon"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        v-model="formData.confirm_password"
        :label="$t('placeholder.pleaseEnterConfirmPassword')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
        :type="isConfirmPasswordVisible ? 'text' : 'password'"
        autocomplete="new-password"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="field-icon" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer field-icon"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        v-model="formData.fullname"
        :label="$t('placeholder.pleaseEnterFullname')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
        autocomplete="name"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-id-card" class="field-icon" />
        </template>
      </q-input>
    </div>
    <div class="field-input">
      <q-input
        v-model="formData.phone"
        :label="$t('placeholder.pleaseEnterContactNo')"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :rules="[Rules.required()]"
        autocomplete="phone"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-phone" class="field-icon" />
        </template>
      </q-input>
    </div>
    <div class="field-input affiliate-input">
      <q-input
        v-model="formData.ref_account"
        class="form-control"
        dense
        borderless
        lazy-rules
        color="black"
        :label="$t('member.register.affiliate')"
        autocomplete="username"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-user-plus" class="field-icon" />
        </template>
      </q-input>
    </div>
    <div class="btn-wrapper">
      <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import * as Request from "src/api/request.type"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleRegister, handleLogin } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const eventbus = injectStrict(EventBusKey)
const errorSpacing = ref(false)

const formData = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: undefined,
  email: "",
  phone: ""
})

const register = async () => {
  const { status } = await handleRegister({
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password,
    fullname: formData.fullname,
    ref_account: formData.ref_account,
    email: formData.email,
    phone: formData.phone
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
  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";
@import "app/template/set_paisa24/assets/css/form.scss";

.field-input {
  @apply mb-7;

  ::v-deep(.q-field__messages) {
    color: #ed4014;
  }
}

.affiliate-input {
  @apply mb-0;
}

.register-form-wrapper {
  .btn-wrapper {
    @apply flex;
  }
}
</style>
