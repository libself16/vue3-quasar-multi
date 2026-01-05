<template>
  <div v-if="isReady" class="home-page">
    <div id="slide_right">
      <img :src="liveChatImg()" alt="" />
    </div>
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
            @changeRegister="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Register)"
          ></HeaderArea>
          <MenuBar v-if="!$q.platform.is.mobile"></MenuBar>
          <div class="page-layout">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
      <div class="footer-wrapper">
        <!-- Footer CMS -->
        <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
          <ul class="flex flex-row justify-center provider-list">
            <li
              class="flex justify-center flex-initial px-0 py-2 sm:px-4 provider-item"
              v-for="item in cmsFooterLogos"
              :key="item"
            >
              <img :src="item" :alt="item.toString()" @error="setDefaultProductTabImg" />
            </li>
          </ul>
        </div>
        <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
          <div class="content" v-html="cmsFooterTextContent?.content"></div>
        </div>
        <!-- Mobile Bottom CMS -->
        <div class="m-footer-bottom">
          <section class="menu-btm">
            <div class="menu-wrapper">
              <template v-for="(cmsItem, cmsIndex) in h5BottomMenuList" :key="cmsIndex">
                <q-btn
                  v-if="cmsIndex !== 2"
                  flat
                  fab-mini
                  class="menuft"
                  @click="
                    handleEntranceClick({
                      entrance: cmsItem.Entrance[0],
                      opening_method: cmsItem.Setting.payload.opening_method
                    })
                  "
                >
                  <img
                    :src="
                      isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
                    "
                  />
                  <p>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
                </q-btn>
                <template v-else>
                  <div></div>
                  <div
                    class="aff-qr"
                    @click="
                      handleEntranceClick({
                        entrance: cmsItem.Entrance[0],
                        opening_method: cmsItem.Setting.payload.opening_method
                      })
                    "
                  >
                    <img
                      :src="
                        isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
                      "
                    />
                  </div>
                </template>
              </template>
            </div>
          </section>
        </div>
      </div>
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
            <q-btn class="form-btn login" :loading="isLoading" type="submit">{{ $t("common.btn.login") }}</q-btn>
            <q-btn class="form-btn join" :loading="isLoading" @click="getStatus(true, MODAL_TYPE.Enums.Register)">{{
              $t("home.joinUs")
            }}</q-btn>
          </div>
          <div class="forgot-area">
            <span>{{ $t("member.login.forgotPassword") }}</span>
            <q-btn class="reset-btn px-1" flat @click="forgotPass">{{ $t("common.btn.reset") }}</q-btn>
          </div>
        </q-form>
      </template>
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
              :placeholder="$t('placeholder.usernameValidation')"
              dense
              lazy-rules
              :rules="[(val) => Rules.account(val)]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.fullName") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.fullname"
              :placeholder="$t('placeholder.pleaseEnterFullName')"
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
              :placeholder="$t('placeholder.passwordValidationShort')"
              dense
              lazy-rules
              :rules="[(val) => Rules.password(val)]"
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
            <p>{{ $t("member.register.contact1") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.contacts.contact1"
              :placeholder="$t('placeholder.pleaseEnterPhone')"
              dense
              lazy-rules
              :rules="[Rules.noRule]"
            />
          </div>
          <div class="form-item modal-content">
            <p>{{ $t("member.register.contact2") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.contacts.contact2"
              :placeholder="$t('placeholder.pleaseEnterPhone1')"
              dense
              lazy-rules
              :rules="[Rules.noRule]"
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
          <div class="form-item modal-content">
            <p>{{ $t("member.register.affiliate") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formRegister.ref_account"
              :placeholder="$t('member.register.affiliate')"
              dense
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn register" :loading="isLoading" type="submit">{{ $t("common.btn.register") }}</q-btn>
          </div>
        </q-form>
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
              :rules="[(val) => Rules.account(val)]"
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
  <LoginRegisterDialog />
  <SlideVerify />
  <ForgotPasswordDialog />
  <LiveChat />
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useInit } from "src/common/composables/useInit"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, MODAL_TYPE } from "src/common/utils/constants"
import { onMounted, reactive, ref, watch, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import ForgotPasswordDialog from "app/template/set_jokerhill/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/set_jokerhill/components/Dialog/LoginRegister.vue"
import HeaderArea from "app/template/set_jokerhill/components/Header/Index.vue"
import MenuBar from "app/template/set_jokerhill/components/MenuBar/Index.vue"
import AsideMenu from "app/template/set_jokerhill/layouts/AsideMenu.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import Modal from "src/common/components/modal/modalBase.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { MENU } from "app/template/set_jokerhill/utils/constants"
import "vue3-carousel/dist/carousel.css"
import type * as Response from "src/api/response.type"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const { isLoading, handleLogin, handleRegister, handleResetPassword, auth } = useAuth()
const { getUserWalletList, getUserInfo } = useUserInfo()
const { isReady, initialize } = useInit()
const router = useRouter()
const route = useRoute()
const { nowLang } = useLanguage()
const { enableConfig, injectHtml } = useLiveChat()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList, h5BottomMenuList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const { liveChatImg, loginTitleImg, registerTitleImg, setDefaultProductTabImg } = useSiteImg()

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
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: undefined,
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
  formRegister.ref_account = undefined
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
      break
  }
}

async function login() {
  const { status } = await handleLogin({
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

  isLoginShow.value = true
  isUpdatedPasswordShow.value = false
  await getUserWalletList()
  await getUserInfo()
}

async function register() {
  const { status } = await handleRegister({
    account: formRegister.account,
    password: formRegister.password,
    confirm_password: formRegister.confirm_password,
    fullname: formRegister.fullname,
    ref_account: formRegister.ref_account,
    email: formRegister.email,
    phone: formRegister.phone,
    contacts: formRegister.contacts
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

watchEffect(() => {
  if (enableConfig.value) {
    injectHtml()
  }
})

const getRouterInfo = (did?: string) => {
  if (!did) return ""
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: Response.CmsEntranceItem) => {
  if (entrance.payload.game_type) {
    const routeGameType = parseInt(route.params.gameType as string)
    return routeGameType === entrance.payload.game_type
  }
  return route.name === getRouterInfo(entrance.payload.did)
}

onMounted(async () => {
  initialize()
  await handleCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
  await handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_jokerhill/assets/css/main.sass"
@import "src/css/modal.sass"

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
    font-family: "NotoSansTC"
    font-size: 14px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: capitalize

// layout style
.home-page
  position: relative
  background-color: #F5F5F5
#slide_right
  position: fixed
  bottom: 5vw
  right: 1vw
  z-index: 9
  +iphone-width
    bottom: 25vw
  img
    width: 3rem
    cursor: pointer
.footer-wrapper
  width: 100%
  background: #4B5D7F
  padding: 0 14%
  padding-bottom: 1vw
  .footer_right
    width: 55vw
    margin: 0 0 0 2vw
    font-size: 0.9vw
    .footer-top
      flex-direction: row
      flex-wrap: wrap
      display: flex
      color:#fff
      .payment-methods
        flex-direction: row
        order: 0
        display: flex
        align-items: center
        align-self: flex-start
        margin-bottom: 0.6vw
        justify-content: flex-start
        width: 90%
        padding-top:1vw
        .title
          margin-right: 16px
          margin-bottom: 0
          display: flex
          justify-content: center
        .methods
          display: flex
          flex-wrap: wrap
          justify-content: space-around
          gap: 10px
          align-items: center
      .navigation-menu
        border-radius: 5px
        display: flex
        flex-wrap: wrap
        align-items: center
        justify-content: start
        line-height: 24px
        margin-bottom: 8px
        .q-size
          font-size: 1vw
          padding: 0.3vw
        .link-seperator
          height: 25px
          margin: 0px 5px
    .footer-bottom
      color: #fff
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        .be-support-content
          display: flex
          color: #fff
          font-size: 1.1vw
          .support_pc
            display: block
          .support_m
            display: none
          #footer-responsible-gaming
            text-decoration: underline
            cursor: context-menu
      .terms-info
        padding-top: 2vw
  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    padding: 5% 8% 30%
    height: auto
    flex-direction: column
    position: relative

    .footer_right
      margin: 4vw 0
      width: 100%
      font-size: 3.8vw
      .footer-top
        .navigation-menu
          display: none
        .payment-methods
          flex-direction: column
          .title
            margin-right:0px
            margin-bottom: 2vw
      .footer-bottom
        margin-top: 5vw
        .footer-content-bottom
          display: block
          .be-support-content
            font-size: 4.1vw
            display: block
            text-align: center
            .support_pc
              display: none
            .support_m
              display: block
        .terms-info
          text-align: center
          padding-top: 10vw
//H5 底下MENU BAR
.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +iphone-width
    display: block
  .menu-btm
    position: fixed
    margin: auto
    width: 100%
    height: 18vw
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    +setFlex
    background: #6288D2
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    a
      +setFlex
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    .menuft
      color: #fff
      font-size: 2.5vw
      text-transform: uppercase
      +setFlex
      flex-direction: row
      font-weight: 600
      padding: 0 0
      .q-btn__content
        display: flex !important
        flex-direction: column !important
      .q-focus-helper
        opacity: 0
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
//footer End
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba(255, 255, 255, 0.70)
  font-family: "NotoSansTC"
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-family: "NotoSansTC"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  @apply flex flex-col min-h-[100vh]
  position: relative
  height: auto
  .hm-content
    @apply w-full
    flex-grow: 1
    .inner-content
      @apply w-full h-full
      &.mobile
        width: 100%
      .page-layout
        @apply mb-[2rem]
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: #fff
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.logo-area
  .title-tip
    color: #EB5757
    margin-top: 1.25rem
    font-size: 1.5rem
</style>
