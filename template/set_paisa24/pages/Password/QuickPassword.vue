<template>
  <div class="quick-password-wrapper">
    <q-form @submit="resetPassword">
      <div class="form-content">
        <h3 class="form-title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</h3>
        <div class="form-item">
          <div class="form-label">{{ $t("member.forgotPassword.newPassword") }}</div>
          <div class="field-input">
            <q-input
              v-model="formData.password"
              borderless
              dense
              color="black"
              class="quick-password-input"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              :input-class="['text-black', 'placeholder-black']"
              :type="isPasswordVisible ? 'text' : 'password'"
              :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
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
        </div>
        <div class="form-item">
          <div class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</div>
          <div class="field-input">
            <q-input
              v-model="formData.confirm_password"
              borderless
              dense
              lazy-rules
              color="black"
              :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
              :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
              :input-class="['text-black', 'placeholder-black']"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              autocomplete="confirm-password"
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
          <div>
            <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const { isLoading, handleResetPassword } = useAuth()

const router = useRouter()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)
const token = computed<string>(() => route.params.token as string)
const account = computed<string>(() => route.params.account as string)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const checkToken = computed(() => {
  return !!token.value
})

const checkAccount = computed(() => {
  return !!account.value
})

const formData = reactive({
  password: "",
  confirm_password: ""
})

async function resetPassword() {
  const { status } = await handleResetPassword({
    token: token.value,
    account: account.value,
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

  router.push({ name: "Home" })
  eventbus.emit("openLoginWithRegister", true)
}

onMounted(() => {
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "Home" })
  }
})
</script>

<style lang="scss" scoped>
@import "app/template/set_paisa24/assets/css/_variable.scss";
@import "app/template/set_paisa24/assets/css/form.scss";

.quick-password-wrapper {
  @apply px-[.9375rem] my-4;

  .form-title {
    @apply text-[1.5rem] font-black text-center;
    color: $input-text-color;
  }

  .form-label {
    @apply font-bold mb-2;
    color: $primary-color;
  }
}
</style>
