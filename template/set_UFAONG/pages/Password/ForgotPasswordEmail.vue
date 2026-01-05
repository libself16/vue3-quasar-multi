<template>
  <div class="email-wrapper">
    <q-form @submit.prevent="forgetPassword">
      <div class="font-bold">{{ $t("member.forgotPassword.resetPassword") }}</div>
      <div class="mb-[10px]">
        {{ $t("common.tip.forgotPasswordTitle") }}
      </div>
      <div class="field-input">
        <q-input
          rounded
          outlined
          v-model="formData.account"
          :label="$t('member.forgotPassword.registeredAccount')"
          bg-color="white"
          color="black"
          lazy-rules
          :rules="[(val) => Rules.account(val)]"
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
          v-model="formData.email"
          bg-color="white"
          color="black"
          :label="$t('member.forgotPassword.registeredEmail')"
          lazy-rules
          :rules="[Rules.email]"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-envelope" class="text-black ml-2" />
          </template>
        </q-input>
      </div>
      <div class="mb-[10px]">
        {{ $t("common.tip.forgotPasswordTip2") }}
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
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isLoading, handleForgetPassword } = useAuth()

const forgetMethod = ref(FORGOT_PASS_METHOD.Enums.Email)
const formData = reactive<{ account: string; email: string }>({
  account: "",
  email: ""
})

const forgetPassword = async () => {
  const { status } = await handleForgetPassword({
    account: formData.account,
    email: formData.email
  })
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
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";
</style>
