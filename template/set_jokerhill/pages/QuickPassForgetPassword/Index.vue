<template>
  <div class="forget-password-layout">
    <div class="forget-password-content">
      <div class="form-title-content forget-password-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="forget-password-form">
        <q-form @submit.prevent="resetPassword">
          <div class="form-content">
            <div class="input-area form-item">
              <div class="label">{{ $t("member.forgotPassword.newPassword") }}</div>
              <div class="input-content w-full md:w-4/5">
                <q-input
                  standout
                  rounded
                  bg-color="white"
                  outlined
                  dense
                  v-model="formData.password"
                  :placeholder="$t('member.forgotPassword.newPassword')"
                  type="password"
                  lazy-rules
                  :rules="[(val) => Rules.password(val)]"
                />
              </div>
            </div>
            <div class="input-area form-item">
              <div class="label">{{ $t("member.forgotPassword.confirmPassword") }}</div>
              <div class="input-content w-full md:w-4/5">
                <q-input
                  standout
                  rounded
                  bg-color="white"
                  outlined
                  dense
                  v-model="formData.confirm_password"
                  :placeholder="$t('member.forgotPassword.confirmPassword')"
                  type="password"
                  lazy-rules
                  :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
                />
              </div>
            </div>
          </div>

          <div class="action-btns row justify-center">
            <q-btn class="submit-btn" type="submit" text-color="white" :loading="isLoading">
              {{ $t("common.btn.submit") }}</q-btn
            >
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, onMounted, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const { svgIcon } = useSiteImg()

const { isLoading, handleResetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const token = computed<string>(() => route.params.token as string)
const account = computed<string>(() => route.params.account as string)

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

  router.push({ name: "Login" })
}

onMounted(() => {
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "HomePage" })
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

.forget-password-layout
  padding-top: 6rem
  +iphone-width
    padding: 0 2rem
    padding-top: 0
  .forget-password-content
    color: rgba(20, 20, 20, 0.60)
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    +iphone-width
      margin-top: 0
      padding: 0
    .forget-password-title-content
      +iphone-width
        padding: 0
        margin: 2rem 0
    .forget-password-form
      border-radius: 8px
      background: #fff
      padding: 3rem
      +iphone-width
        padding: 0
        margin-top: 0
        padding-bottom: 2rem
        margin-bottom: 2rem
      .form-content
        +iphone-width
          width: 80%
          margin: 0rem auto
          padding: 2rem 0rem
          background: #fff
          border-radius: .5rem
        .form-item
          &:first-child
            // margin-top: 4rem
            +iphone-width
              margin-top: 0rem
          .input-content
            margin-top: .5rem
            padding: 0
      .action-btns
        @apply mx-auto
        width: 80%
        margin-top: 5rem
        margin-bottom: 4rem
        +iphone-width
          margin-top: 0rem
          margin-bottom: 0rem
</style>
