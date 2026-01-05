<template>
  <div v-if="isReady" class="home-page">
    <!--  <div id="slide_right">
      <img :src="liveChatImg()" alt="" />
    </div> -->
    <div class="layout-main wide" id="layout-main">
      <div class="hm-content">
        <Transition>
          <AsideMenu
            v-if="isAsideShow"
            v-model="isAsideShow"
            @changeLogin="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Login)"
            @changeRegister="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Register)"
          />
        </Transition>
        <div class="inner-content" :class="{ mobile: isMobile }">
          <HeaderArea
            v-model="isAsideShow"
            @changeLogin="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Login)"
          ></HeaderArea>
          <div class="page-layout">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
      <Footer> </Footer>
    </div>
    <GS1MiniGame />
  </div>
  <Transition>
    <Modal v-if="isLoginShow" v-model="isLoginShow">
      <template v-slot:title>
        <img class="title" :src="loginTitleImg" />
      </template>

      <template v-slot:form>
        <q-form @submit="login">
          <div class="form-item">
            <p>{{ $t("member.login.username") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formLogin.username"
              :placeholder="$t('placeholder.pleaseEnterUsername')"
              dense
              lazy-rules
              :rules="[(val) => Rules.account(val)]"
            />
          </div>
          <div class="form-item">
            <p>{{ $t("member.login.password") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formLogin.password"
              type="password"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              dense
              lazy-rules
              :rules="[(val) => Rules.password(val)]"
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn login !bg-[#802827]" :loading="isLoading" type="submit">
              {{ $t("common.btn.login") }}
            </q-btn>
            <q-btn
              v-if="isCash"
              class="form-btn join"
              :loading="isLoading"
              @click="getStatus(true, MODAL_TYPE.Enums.Register)"
            >
              {{ $t("common.btn.register") }}
            </q-btn>
          </div>
          <div v-if="isCash" class="forgot-area">
            <span>{{ $t("member.login.forgotPassword") }}</span>
            <q-btn class="reset-btn px-1" flat @click="forgotPass">{{ $t("common.btn.reset") }}</q-btn>
          </div>
        </q-form>
      </template>

      <!-- <template v-if="isMobile" v-slot:copyright>
        <div class="login-copyright">
          <p>Copyright ©{{ currentYear }} {{ companyName }}. All rights reserved.</p>
          <p>版權所有© {{ currentYear }} {{ companyName }}.</p>
        </div>
      </template> -->
    </Modal>
  </Transition>
  <Transition>
    <Modal v-if="isRegistShow" v-model="isRegistShow">
      <template v-slot:title>
        <img class="title" :src="registerTitleImg" />
      </template>

      <template v-slot:form>
        <q-form @submit="register">
          <div class="form-item modal-content">
            <p>{{ $t("member.register.username") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.account"
              :placeholder="$t('placeholder.pleaseEnterUsername')"
              dense
              lazy-rules
              :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.fullName") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.fullname"
              :placeholder="$t('placeholder.pleaseEnterFullNameShort')"
              dense
              lazy-rules
              :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.contactNo") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.phone"
              :placeholder="$t('placeholder.pleaseEnterContactNo')"
              dense
              lazy-rules
              :rules="[Rules.required()]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.password") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.password"
              type="password"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              dense
              lazy-rules
              :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.confirmPassword") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.confirm_password"
              type="password"
              :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
              dense
              lazy-rules
              :rules="[(val) => val === formRegister.password || $t('common.validate.consistentPassword')]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.email") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.email"
              :placeholder="$t('placeholder.pleaseEnterEmail')"
              dense
              lazy-rules
              :rules="[Rules.required(), Rules.email]"
            />
          </div>
          <div v-if="!inviteCode" class="form-item modal-content">
            <p>{{ $t("member.profile.referralCode") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.invite_code"
              :placeholder="$t('placeholder.pleaseEnterReferralCode')"
              dense
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn register" :loading="isLoading" type="submit">{{ $t("common.btn.register") }}</q-btn>
          </div>
        </q-form>
        <!-- <div class="faster-register-area">
          <ul>
            <li>
              <img src="app/template/set49/assets/images/svg/facebook.svg" alt="" />
            </li>
            <li>
              <img src="app/template/set49/assets/images/svg/telegram.svg" alt="" />
            </li>
            <li>
              <img src="app/template/set49/assets/images/svg/whatsapp.svg" alt="" />
            </li>
          </ul>
          <p>Connect to register</p>
        </div> -->
      </template>
    </Modal>
  </Transition>
  <Transition>
    <Modal v-if="isUpdatedPasswordShow" v-model="isUpdatedPasswordShow">
      <template v-slot:title>
        <img class="title" :src="loginTitleImg" />
        <div class="title-tip">{{ $t("member.forgotPassword.updatePasswordDetailsUpperCase") }}</div>
      </template>
      <template v-slot:form>
        <q-form @submit="resetPassword">
          <div class="form-item">
            <p>{{ $t("member.forgotPassword.newPassword") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formResetPassword.password"
              :placeholder="$t('member.forgotPassword.newPassword')"
              dense
              lazy-rules
              type="password"
              :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
            />
          </div>
          <div class="form-item">
            <p>{{ $t("member.forgotPassword.confirmPassword") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formResetPassword.confirm_password"
              type="password"
              :placeholder="$t('member.forgotPassword.confirmPassword')"
              dense
              lazy-rules
              :rules="[(val) => val === formResetPassword.password || $t('common.validate.consistentPassword')]"
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn join" :loading="isLoading" @click="resetPassword">{{
              $t("common.btn.submit")
            }}</q-btn>
          </div>
        </q-form>
      </template>
    </Modal>
  </Transition>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <LiveChat />
  <FloatIconCMS />
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useInit } from "src/common/composables/useInit"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, MODAL_TYPE, PIXEL_CODE_TYPE } from "src/common/utils/constants"
import { onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useSiteRedirect } from "app/template/set49/composables/useSiteRedirect"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useBank } from "src/common/composables/useBank"
import HeaderArea from "app/template/set49/components/Header/Index.vue"
import Modal from "app/template/set49/components/modal/modalBase.vue"
import AsideMenu from "app/template/set49/layouts/AsideMenu.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useRouter } from "vue-router"
import Footer from "app/template/set49/components/Footer/Index.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import FloatIconCMS from "app/template/set49/components/FloatIconCMS/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import dayjs from "dayjs"
import "vue3-carousel/dist/carousel.css"

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const { isLoading, handleLogin, handleRegister, isLogin, handleResetPassword, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isReady, initialize } = useInit()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
const currentYear = dayjs().year()
const { visitWebsite, inviteCode, isCash } = useEnv()
const { getAgentSetting } = useLanguage()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const { handleSiteRedirect } = useSiteRedirect()
const { handleGetPixelCodes, handleTriggerPixelCode } = usePixelCodes()

const { loginTitleImg, registerTitleImg } = useSiteImg()

let isAsideShow = ref(true)
let isLoginShow = ref(false)
let isRegistShow = ref(false)
let isUpdatedPasswordShow = ref(false)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: ""
})

let formRegister = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  is_customize: false,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  invite_code: undefined,
  email: "",
  phone: "",
  contacts: {
    contact1: "",
    contact2: ""
  }
})

const formResetPassword = reactive<Request.resetPassword>({
  token: "",
  account: "",
  password: "",
  confirm_password: ""
})

const { width } = useWindowSize()

let isMobile = ref(false)

function initFormData() {
  formLogin.login_method = LOGIN_METHOD.Enums.Password
  formLogin.username = ""
  formLogin.password = ""
  formRegister.login_method = LOGIN_METHOD.Enums.Password
  formRegister.account = ""
  formRegister.username = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.invite_code = inviteCode.value || undefined
  formRegister.email = ""
  formRegister.phone = ""
  formRegister.contacts.contact1 = ""
  formRegister.contacts.contact2 = ""
}

let getStatus = (status: boolean, modalType: MODAL_TYPE.Enums) => {
  switch (modalType) {
    case MODAL_TYPE.Enums.Login:
      isLoginShow.value = status
      isRegistShow.value = false
      initFormData()
      break
    case MODAL_TYPE.Enums.Register:
      isRegistShow.value = status
      isLoginShow.value = false
      initFormData()
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
      break
  }
}

async function login() {
  const { status, data } = await handleLogin({
    login_method: formLogin.login_method,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }

  if (auth.value.access_token) {
    await getUserWalletList()
    await getUserInfo()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
    getStatus(false, MODAL_TYPE.Enums.Login)
  } else {
    isLoginShow.value = false
    isUpdatedPasswordShow.value = true
    formResetPassword.token = data?.access_token || ""
    formResetPassword.account = formLogin.username
  }
}

async function resetPassword() {
  const { status } = await handleResetPassword({
    token: formResetPassword.token,
    account: formResetPassword.account,
    password: formResetPassword.password,
    confirm_password: formResetPassword.confirm_password
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

  await getUserWalletList()
  await getUserInfo()

  // 修改密碼後自動登入
  isLoginShow.value = true
  isUpdatedPasswordShow.value = false
  formLogin.password = formResetPassword.password
  login()
}

async function register() {
  const { status } = await handleRegister({
    account: formRegister.account,
    password: formRegister.password,
    confirm_password: formRegister.confirm_password,
    fullname: formRegister.fullname,
    invite_code: formRegister.invite_code,
    email: formRegister.email,
    phone: formRegister.phone,
    contacts: formRegister.contacts,
    is_customize: false
  })
  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })
  formLogin.username = formRegister.account
  formLogin.password = formRegister.password
  await login()
  getStatus(false, MODAL_TYPE.Enums.Register)
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isAsideShow.value = true // 電腦版: 當在resize 時  就先初始化打開
      isMobile.value = false
    } else {
      isAsideShow.value = false //手機版:  當在resize 時  就先初始化關掉
      isMobile.value = true
    }
  },
  { immediate: true }
)
const forgotPass = () => {
  isLoginShow.value = false
  router.push({ name: "ForgotPass" })
}

onMounted(() => {
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserInfo,
      getUserWalletList,
      getAvailCurrencyList,
      handleGetPixelCodes
    ],
    siteRedirect: handleSiteRedirect
  })
  eventbus.on("openLogin", (show: boolean) => {
    getStatus(show, MODAL_TYPE.Enums.Login)
  })
  eventbus.on("openRegister", (show: boolean) => {
    getStatus(show, MODAL_TYPE.Enums.Register)
  })
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set49/assets/css/_variable.scss"

// fadeIn
.v-enter-active,
.v-leave-active
  transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
  opacity: 0

// modal slot
.form-item
  margin: 10px 0
  p
    margin-bottom: 5px
    color: rgba(255, 255, 255, 0.70)
    font-family: "Century Gothic"
    font-size: 14px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase !important
  ::v-deep(.q-field__messages)
    color: #ed4014

// layout style
.home-page
  position: relative
#slide_right
  position: fixed
  bottom: 5vw
  right: 1vw
  z-index: 9
  +iphone-width
    bottom: 25vw
  img
    width: 5rem
    cursor: pointer
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba(255, 255, 255, 0.70)
  font-family: "Century Gothic"
  font-size: 1.2vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-family: "Century Gothic"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  position: relative
  height: auto
  +iphone-width
    height: auto
  .hm-content
    width: 100%
    height: 100%
    position: relative
    background: $primary-bg
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    +iphone-width
      display: block
    .inner-content
      width: 83vw
      height: 100%
      position: relative
      &.mobile
        width: 100%
      .page-layout
        padding-bottom: 5vw
      +pad-width
        width: 100%
      +iphone-width
        .page-layout
          padding-bottom: 0
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: #fff
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.logo-area
  .title-tip
    @apply px-10
    color: #EB5757
    margin-top: 1.25rem
    font-size: 1.5rem
</style>

<style lang="scss" scoped>
.login-copyright {
  @apply text-[.75rem] font-medium mt-[2rem];
  color: rgba(255, 255, 255, 0.4);

  p {
    &:last-child {
      @apply text-center;
    }
  }
}
</style>
