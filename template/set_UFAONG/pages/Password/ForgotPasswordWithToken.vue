<template>
  <section class="forgot-password-wrapper">
    <div class="forgot-password-container">
      <div class="logo mb-[20px]">
        <img :src="logoSrc" alt="logo" />
      </div>
      <div class="forgot-password-content">
        <q-form @submit.prevent="resetPassword">
          <div class="font-bold text-center">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
          <!-- User Name -->
          <div class="mb-[10px] font-bold">
            {{ $t("member.forgotPassword.username") }}
          </div>
          <div class="field-input">
            <q-input
              rounded
              outlined
              v-model="formData.account"
              :label="$t('member.forgotPassword.username')"
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[(val) => Rules.account(val)]"
            />
          </div>
          <!-- New Password -->
          <div class="mb-[10px] font-bold">
            {{ $t("member.forgotPassword.newPassword") }}
          </div>
          <div class="field-input">
            <q-input
              rounded
              outlined
              v-model="formData.password"
              :label="$t('member.forgotPassword.newPassword')"
              :type="isPasswordVisible ? 'text' : 'password'"
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[(val) => Rules.password(val)]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-lock" class="text-black" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  class="cursor-pointer text-black"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>
          </div>
          <!-- Confirm Password -->
          <div class="mb-[10px] font-bold">
            {{ $t("member.forgotPassword.confirmPassword") }}
          </div>
          <div class="field-input">
            <q-input
              rounded
              outlined
              v-model="formData.confirm_password"
              :label="$t('member.forgotPassword.confirmPassword')"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[(val) => val === formData.password || $t('common.validate.confimrPasswordValidation')]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-lock" class="text-black" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  class="cursor-pointer text-black"
                  @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.submit") }}</q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useLogo } from "src/common/composables/useLogo"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { isLoading, handleResetPassword } = useAuth()
const router = useRouter()
const route = useRoute()
const { getWideLogo, handleLogoList } = useLogo()

const token = computed<string>(() => route.params.token as string)
const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const checkToken = computed(() => {
  return !!token.value
})
const formData = reactive({
  account: "",
  password: "",
  confirm_password: ""
})

const resetPassword = async () => {
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

  router.push({ name: "Home" })
}

onMounted(async () => {
  await handleLogoList()
  // if (!checkToken.value || isLogin.value) {
  //   router.push({ name: "Home" })
  // }
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";
@import "../../assets/css/password.scss";
</style>
