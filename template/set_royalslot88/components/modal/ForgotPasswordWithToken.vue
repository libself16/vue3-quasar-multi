<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" @close="closeDialog">
    <q-form @submit.prevent="resetPassword">
      <!-- 帳號 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.forgotPassword.username") }}</label>
        <q-input
          v-model="formData.account"
          class="form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          :rules="[(val) => Rules.account(val)]"
        />
      </div>
      <!-- 新密碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.forgotPassword.newPassword") }}</label>
        <q-input
          v-model="formData.password"
          class="form-control"
          dense
          borderless
          type="password"
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterPassword')"
          :rules="[(val) => Rules.password(val,$t('placeholder.passwordValidationShort') )]"
        />
      </div>
      <!-- 確認密碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</label>
        <q-input
          v-model="formData.confirm_password"
          class="form-control"
          dense
          borderless
          type="password"
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
          :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
        />
      </div>
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useI18n } from "vue-i18n"

import ModalBase from "./modalBase.vue"

const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isLogin, isLoading, handleResetPassword } = useAuth()
const Rules = useRule()

const token = computed<string>(() => route.params.token as string)

const checkToken = computed(() => {
  return !!token.value
})

const modalShow = ref(true)

const formData = reactive({
  account: "",
  password: "",
  confirm_password: ""
})

async function resetPassword() {
  const { status } = await handleResetPassword({
    token: token.value,
    account: formData.account,
    password: formData.password,
    confirm_password: formData.confirm_password
  })

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  router.push({ name: "home" })
}

function closeDialog() {
  if (window.history.state.back) {
    router.back()
    return
  }

  router.push({ name: "home" })
}

onMounted(() => {
  if (!checkToken.value || isLogin.value) {
    router.push({ name: "home" })
  }
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
