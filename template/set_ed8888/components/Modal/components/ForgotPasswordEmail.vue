<template>
  <div class="email-wrapper">
    <q-form @submit.prevent="forgetPassword">
      <div class="field-input">
        <q-input
          v-model="formData.account"
          :label="$t('member.forgotPassword.registeredAccount')"
          dense
          borderless
          lazy-rules
          bg-color="white"
          color="black"
          :rules="[(val) => Rules.account(val)]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-user" class="field-icon" />
          </template>
        </q-input>
      </div>
      <div class="field-input">
        <q-input
          v-model="formData.email"
          :label="$t('member.forgotPassword.registeredEmail')"
          dense
          borderless
          lazy-rules
          bg-color="white"
          color="black"
          :rules="[Rules.email]"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-envelope" class="field-icon" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const { isLoading, handleForgetPassword } = useAuth()

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

<style scoped lang="scss">
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.email-wrapper {
  .btn-submit {
    @apply my-2;
  }
}
</style>
