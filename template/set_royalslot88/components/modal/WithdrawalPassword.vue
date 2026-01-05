<template>
  <ModalBase v-model="modalShow" use-title :title="$t('member.profile.withdrawalPassword')" max-width="56.25rem">
    <q-form @submit="handleSubmit">
      <div class="changepass_wrap">
        <div class="changepass_wrap_left">
          <!-- old password -->
          <div v-if="userInfo.has_withdrawal_password" class="form-wrapper">
            <label class="form-label"> {{ $t("member.forgotPassword.currentPassword") }}</label>
            <q-input
              v-model="withdrawalPasswordForm.old_password"
              class="form-control"
              dense
              borderless
              lazy-rules
              :rules="[(val) => Rules.password(val)]"
              :placeholder="$t('placeholder.currenctPassword')"
              type="password"
            />
          </div>
          <!-- new password -->
          <div class="form-wrapper">
            <label class="form-label"> {{ $t("member.forgotPassword.newPassword") }}</label>
            <q-input
              v-model="withdrawalPasswordForm.new_password"
              class="form-control"
              dense
              borderless
              lazy-rules
              :rules="[
                (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
                (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
              ]"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              type="password"
            />
          </div>
          <!-- confirm password -->
          <div class="form-wrapper">
            <label class="form-label"> {{ $t("member.forgotPassword.confirmPassword") }}</label>
            <q-input
              v-model="withdrawalPasswordForm.confirm_password"
              :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
              class="form-control"
              dense
              borderless
              lazy-rules
              :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
              type="password"
            />
          </div>
        </div>
        <div class="changepass_wrap_right">
          <div class="password-rule-title">{{ $t("common.validate.rulesForCreatingPasswords") }}</div>
          <ul>
            <li v-for="(item, index) in validateList" :key="index" class="password-rule-text">
              {{ $t(item) }}
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-modal-big btn_for-big">
        <button class="btn_for" data-dismiss="modal" @click="modalShow = false">
          <span> {{ $t("common.btn.cancel") }}</span>
        </button>
        <button class="btn_for btn_for_sub" type="submit">
          <span>{{ $t("common.btn.submit") }}</span>
        </button>
      </div>
    </q-form>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

import ModalBase from "./modalBase.vue"

const { userInfo, getUserInfo, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()
const Rules = useRule()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

const validateList = ref([
  "common.validate.mustNotBeEmpty",
  "placeholder.passwordValidationShort",
  "common.validate.newPasswordValidation",
  "common.validate.confimrPasswordValidation"
])

async function handleSubmit() {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    await getUserInfo()
    eventbus.emit("openSetWithdrawalPassword", false)
    eventbus.emit("openWithdraw", true)
  }
}

onMounted(() => {
  eventbus.on("openSetWithdrawalPassword", (show: boolean) => {
    modalShow.value = show
    resetWithdrawalPasswordForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.password-rule-text {
  list-style: disc;
  font-weight: bold;
}
</style>
