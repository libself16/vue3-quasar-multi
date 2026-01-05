<template>
  <div class="quickpass-layout">
    <img class="logo" :src="logoSrc" alt="" srcset="" />
    <div class="body">
      <q-form @submit="resetPassword">
        <div class="form-content">
          <h3 class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</h3>
          <div class="form-item">
            <div class="label">{{ $t("member.forgotPassword.newPassword") }}</div>
            <q-input
              standout
              v-model="formData.password"
              rounded
              outlined
              dense
              borderless
              lazy-rules
              :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
              bg-color="white"
              color="black"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              :input-class="['text-black', 'placeholder-black']"
              :type="isPasswordVisible ? 'text' : 'password'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  class="cursor-pointer text-black mr-2"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>
          </div>
          <div class="form-item">
            <div class="label">{{ $t("member.forgotPassword.confirmPassword") }}</div>
            <q-input
              :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
              standout
              v-model="formData.confirm_password"
              type="password"
              rounded
              outlined
              dense
              borderless
              lazy-rules
              bg-color="white"
              color="black"
              :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
            >
            </q-input>
          </div>
          <!--end--->
          <q-btn class="submit" type="submit">SUBMIT</q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useLogo } from "src/common/composables/useLogo"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { handleResetPassword } = useAuth()
const { getWideLogo, handleLogoList } = useLogo()
const router = useRouter()
const route = useRoute()

const token = computed<string>(() => route.params.token as string)
const account = computed<string>(() => route.params.account as string)

const isPasswordVisible = ref(false)

const checkToken = computed(() => {
  return !!token.value
})

const checkAccount = computed(() => {
  return !!account.value
})

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
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

  router.push({ name: "Login" })
}

onMounted(async () => {
  await handleLogoList()
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="scss" scoped>
.quickpass-layout {
  @apply bg-black text-white;
  @apply w-full h-[100dvh];
  @apply flex flex-col items-center justify-start md:justify-center;
  @apply px-[1rem] pt-[15%] md:pt-0;
  gap: 1rem;

  .logo {
    @apply w-full max-h-[40px] max-w-[200px] object-contain object-center;
  }

  .body {
    @apply bg-[#2b2b2b];
    @apply max-w-[991px] w-full;
    @apply p-[1.25rem];
    box-shadow: #f0e47f 0.125rem 0.125rem 0.5rem -0.25rem;
    border-radius: 0.625rem;
    .form-content {
      @apply flex flex-col;
      gap: 0.5rem;
      .title {
        @apply uppercase font-bold text-center;
      }
      .form-item {
        @apply flex flex-col;
        gap: 0.5rem;
        .label {
          @apply uppercase;
        }
        .input {
        }
      }
      .submit {
        @apply flex w-full items-center justify-center;
        @apply text-black/80;
        background: linear-gradient(to bottom, rgb(240, 228, 127) 0%, rgb(200, 166, 68) 100%);
        border-radius: 1.25rem;
        box-shadow: #f0e47f 0.125rem 0.125rem 0.5rem -0.125rem;
      }
    }
  }
}
</style>
