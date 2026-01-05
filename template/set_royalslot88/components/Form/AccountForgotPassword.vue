<template>
  <q-form @submit="forgetPassword">
    <!-- 帳號 -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.username") }}</label>
      <q-input
        v-model="formAccount.account"
        class="form-control"
        dense
        borderless
        lazy-rules
        :placeholder="$t('placeholder.pleaseEnterUsername')"
        :rules="[(val) => Rules.account(val)]"
      />
    </div>
    <!-- email -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.email") }}</label>
      <q-input
        v-model="formAccount.email"
        class="form-control"
        dense
        borderless
        lazy-rules
        :rules="[Rules.email]"
        :placeholder="$t('placeholder.pleaseEnterEmail')"
      />
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
import { useAuth } from "src/common/hooks/useAuth"
import * as Request from "src/api/request.type"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleForgetPassword } = useAuth()
const eventbus = injectStrict(EventBusKey)

const formAccount = reactive<Request.forgetPassword>({
  account: "",
  email: ""
})

function initForm() {
  formAccount.account = ""
  formAccount.email = ""
}

function closeDialog() {
  eventbus.emit("openForgotPassword", false)
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

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
