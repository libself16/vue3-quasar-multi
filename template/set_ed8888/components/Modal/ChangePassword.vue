<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="t('menu.password')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="change-password-wrapper">
      <q-form class="change-password-form column pt-4" @submit="handleSubmit" ref="passwordFromRef">
        <!-- current password -->
        <div class="form-label">{{ $t("member.forgotPassword.currentPassword") }} :</div>
        <q-input
          v-if="!accountInfo.empty_password"
          standout
          v-model="passwordForm.old_password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :label="$t('placeholder.currenctPassword')"
          outlined
          dense
          lazy-rules
          :rules="[(val) => Rules.password(val)]"
          class="form-input"
          bg-color="white"
          color="black"
          autocomplete="off"
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
        <!-- new password -->
        <div class="form-label">{{ $t("member.forgotPassword.newPassword") }} :</div>
        <q-input
          standout
          v-model="passwordForm.new_password"
          :type="isNewPasswordVisible ? 'text' : 'password'"
          :label="$t('placeholder.passwordValidation')"
          outlined
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.password(val), (val) => Rules.newPassword(passwordForm.old_password, val)]"
          class="form-input"
          bg-color="white"
          color="black"
          autocomplete="off"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-lock" class="field-icon" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isNewPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
              class="cursor-pointer field-icon"
              @click="isNewPasswordVisible = !isNewPasswordVisible"
            />
          </template>
        </q-input>
        <!-- confirm password -->
        <div class="form-label">{{ $t("member.forgotPassword.confirmPassword") }} :</div>
        <q-input
          standout
          v-model="passwordForm.confirm_password"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          outlined
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.password(val), (val) => Rules.confirmPassword(passwordForm.new_password, val)]"
          class="form-input"
          bg-color="white"
          color="black"
          autocomplete="off"
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
        <div class="form-btn-wrapper">
          <q-btn label="submit" class="form-btn-submit" type="submit" />
        </div>
      </q-form>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import ModalBase from "./ModalBase.vue"

const { t } = useI18n()
const eventbus = injectStrict(EventBusKey)
const { accountInfo, passwordForm, setUserPassword, resetPasswordForm } = useUserInfo()
const Rules = useRule()
const passwordFromRef = ref()
const isPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const modalShow = ref(false)

const handleSubmit = async () => {
  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
  modalShow.value = false
}

onMounted(() => {
  eventbus.on("openChangePassword", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.change-password-wrapper {
  .field-icon {
    color: $primary-color;
  }

  :deep(.form-label) {
    @apply uppercase text-base font-bold;
  }
}
</style>
