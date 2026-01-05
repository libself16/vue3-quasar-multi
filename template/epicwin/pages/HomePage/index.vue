<template>
  <div v-if="isReady" class="home-page">
    <div id="slide_right">
      <img :src="floatImg('download')" alt="" />
      <img :src="floatImg('freeplay')" alt="" />
      <img :src="floatImg('livechat')" alt="" />
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
          <div
            v-if="
              bannerType !== BANNER_TYPE.Enums.Member &&
              bannerType !== BANNER_TYPE.Enums.Payment &&
              bannerType !== BANNER_TYPE.Enums.History
            "
            class="marquee-area"
          >
            <img :src="marqueeIcon" alt="" />
            <Vue3Marquee> welcome to gamingsoft bonus 100% sign up & get reward! </Vue3Marquee>
          </div>
          <div class="banner" v-if="isBannerShow">
            <Carousel
              v-if="
                bannerType !== BANNER_TYPE.Enums.Member &&
                bannerType !== BANNER_TYPE.Enums.Payment &&
                bannerType !== BANNER_TYPE.Enums.History
              "
              :wrap-around="true"
            >
              <!-- TODO: rebase error -->
              <Slide v-for="(banner, index) in bannerList" :key="index">
                <div class="carousel__item">
                  <img :src="banner" class="banner-item" />
                </div>
              </Slide>

              <template #addons>
                <Navigation />
              </template>
            </Carousel>
          </div>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>

  <!-- 登入彈窗 -->
  <Modal v-model="isLoginShow">
    <template v-slot:title>
      <div class="logo-area">
        <img class="title" :src="logoImg" />
        <p class="label">Login</p>
      </div>
    </template>

    <template v-slot:form>
      <q-form class="modal-form px-4" @submit.prevent="login">
        <div class="mb-4">
          <q-input
            v-model="form.username"
            bg-color="white"
            outlined
            :label="$t('member.login.username')"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            v-model="form.password"
            bg-color="white"
            outlined
            :label="$t('member.login.password')"
            type="password"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
          />
        </div>
        <div class="form-bottom">
          <q-btn class="form-btn login" type="submit" :loading="isLoading">LOGIN</q-btn>
        </div>
        <div class="forgot-area center">
          <q-btn class="reset-btn" @click="getStatus(true, MODAL_TYPE.Enums.ForgetPassword)">
            Forget the password?
          </q-btn>
        </div>
      </q-form>
    </template>
  </Modal>

  <!-- 註冊彈窗 -->
  <Modal v-model="isRegistShow">
    <template v-slot:title>
      <div class="logo-area">
        <img class="title" :src="logoImg" />
        <p class="label">Register</p>
      </div>
    </template>

    <template v-slot:form>
      <q-form class="modal-form px-4" @submit.prevent="register">
        <div class="mb-4">
          <q-input
            v-model="form.account"
            bg-color="white"
            outlined
            :label="$t('member.register.username')"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.fullname"
            :label="$t('member.register.fullName')"
            lazy-rules
            :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.password"
            :label="$t('member.register.password')"
            type="password"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.confirm_password"
            :label="$t('member.register.confirmPassword')"
            type="password"
            lazy-rules
            :rules="[(val) => val === form.password || $t('common.validate.consistentPassword')]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.contacts.contact1"
            :label="$t('member.register.contact1')"
            lazy-rules
            :rules="[Rules.noRule]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.contacts.contact2"
            :label="$t('member.register.contact2')"
            lazy-rules
            :rules="[Rules.noRule]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.email"
            :label="$t('member.register.email')"
            lazy-rules
            :rules="[Rules.required(), Rules.email]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.phone"
            :label="$t('member.register.phone')"
            lazy-rules
            :rules="[Rules.required()]"
          />
        </div>
        <div class="form-bottom">
          <q-btn class="form-btn register" type="submit" :loading="isLoading">REGISTER</q-btn>
        </div>
        <div class="forgot-area">
          <span class="reset-btn-forgot">Already have an account?</span>
          <q-btn flat :ripple="false" :glossy="false" class="go-login" @click="getStatus(true, MODAL_TYPE.Enums.Login)">
            Login
          </q-btn>
        </div>
      </q-form>
    </template>
  </Modal>

  <!-- 忘記密碼彈窗 -->
  <Modal v-model="forgetPasswordShow">
    <template v-slot:title>
      <div class="logo-area">
        <img class="title" :src="logoImg" />
        <p class="label">Forget Password</p>
      </div>
    </template>

    <template v-slot:form>
      <q-form class="modal-form px-4" @submit.prevent="forgetPassword">
        <div class="mb-4">
          <q-input
            v-model="form.account"
            bg-color="white"
            outlined
            :label="$t('member.login.username')"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.email"
            :label="$t('member.register.email')"
            lazy-rules
            :rules="[Rules.required(), Rules.email]"
          />
        </div>
        <div class="form-bottom">
          <q-btn class="form-btn login" type="submit" :loading="isLoading">SEND</q-btn>
        </div>
      </q-form>
    </template>
  </Modal>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>

<script lang="ts">
import { useWindowSize } from "@vueuse/core"
import AsideMenu from "app/template/epicwin/layouts/AsideMenu.vue"
import HeaderArea from "app/template/epicwin/layouts/HeaderArea.vue"
import Modal from "app/template/epicwin/layouts/modal/modalBase.vue"
import { useQuasar } from "quasar"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { useRule } from "src/common/hooks/useRule"
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import { Vue3Marquee } from "vue3-marquee"

import * as Request from "src/api/request.type"
import { BANNER_TYPE, MODAL_TYPE, BANNER_POSITION, LOGIN_METHOD } from "src/common/utils/constants"
import "vue3-carousel/dist/carousel.css"
import { useBanner } from "src/common/composables/useBanner"
import { useInit } from "src/common/composables/useInit"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"

export default defineComponent({
  name: "HomePage",
  components: {
    Vue3Marquee,
    Modal,
    HeaderArea,
    AsideMenu,
    Carousel,
    Navigation,
    Slide,
    CurrencySupportDialog,
    LaunchGameDialog
  },
  setup() {
    const { t } = useI18n()
    const { initGameTypeList } = useGame()
    const { auth, isLogin, isLoading, handleLogin, handleRegister, handleForgetPassword } = useAuth()
    const { getUserWalletList, getUserInfo, resetUserInfoForm } = useUserInfo()
    const Rules = useRule()
    const $q = useQuasar()
    const { marqueeIcon, demoBannerImg, floatImg, logoImg } = useSiteImg()
    const { bannerList, handleBannerList } = useBanner()
    const { isReady, initialize } = useInit()

    let isAsideShow = ref(true)
    let isLoginShow = ref(false)
    let isRegistShow = ref(false)
    let forgetPasswordShow = ref(false)
    let form = reactive<Request.login & Request.register>({
      login_method: LOGIN_METHOD.Enums.Password,
      account: "",
      username: "",
      password: "",
      confirm_password: "",
      fullname: "",
      ref_account: "",
      email: "",
      phone: "",
      contacts: {
        contact1: "",
        contact2: ""
      }
    })
    const { width } = useWindowSize()
    const route = useRoute()
    const isBannerShow = computed(() => {
      if (bannerType.value !== BANNER_TYPE.Enums.Member) {
      }
      switch (route.name) {
        case "follow":
          return false
        default:
          return true
      }
    })

    let isMobile = ref(false)

    function resetForm() {
      form.account = ""
      form.username = ""
      form.password = ""
      form.confirm_password = ""
      form.fullname = ""
      form.ref_account = ""
      form.email = ""
      form.phone = ""
      if (form.contacts) {
        form.contacts.contact1 = ""
        form.contacts.contact2 = ""
      }
    }

    function resetModal() {
      isLoginShow.value = false
      isRegistShow.value = false
      forgetPasswordShow.value = false
    }

    let getStatus = (status: boolean, modalType: number) => {
      resetForm()
      resetModal()
      switch (modalType) {
        case MODAL_TYPE.Enums.Login:
          isLoginShow.value = status
          break
        case MODAL_TYPE.Enums.Register:
          isRegistShow.value = status
          break
        case MODAL_TYPE.Enums.ForgetPassword:
          forgetPasswordShow.value = status
          break
      }
    }

    const bannerType = computed(() => {
      if (typeof route?.name === "string" && route?.name?.includes("member")) {
        return BANNER_TYPE.Enums.Member
      } else if (typeof route?.name === "string" && route?.name?.includes("payment")) {
        return BANNER_TYPE.Enums.Payment
      } else if (typeof route?.name === "string" && route?.name?.includes("history")) {
        return BANNER_TYPE.Enums.History
      } else if (typeof route?.name === "string" && route?.name?.includes("order")) {
        return BANNER_TYPE.Enums.History
      } else {
        return BANNER_TYPE.Enums.Home
      }
    })

    // onMounted(async () => {
    //   trafficView({ agent_code: "NGSI" })
    // })
    onMounted(async () => {
      initialize()
      await handleBannerList(BANNER_POSITION.Enums.Home)
    })

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

    async function login() {
      const { status } = await handleLogin({
        login_method: form.login_method,
        username: form.username,
        password: form.password
      })

      if (!status) {
        return
      }

      await getUserWalletList()
      await getUserInfo()

      $q.notify({
        type: "positive",
        message: t("common.alarm.loginSuccess"),
        position: "top",
        timeout: 1000
      })
      isLoginShow.value = false
    }

    async function register() {
      const { status } = await handleRegister({
        account: form.account,
        password: form.password,
        confirm_password: form.confirm_password,
        fullname: form.fullname,
        ref_account: form.ref_account,
        email: form.email,
        phone: form.phone,
        contacts: form.contacts
      })

      if (!status) {
        return
      }

      $q.notify({
        type: "positive",
        message: "register success",
        position: "top",
        timeout: 1000
      })

      isRegistShow.value = false
      form.username = form.account
      await login()
    }

    async function forgetPassword() {
      const { status } = await handleForgetPassword({
        account: form.account,
        email: form.email
      })

      if (!status) {
        return
      }

      $q.notify({
        type: "positive",
        message: t("common.validate.LetterHasBeenSent"),
        position: "top",
        timeout: 1000
      })
      getStatus(true, MODAL_TYPE.Enums.Login)
    }
    // TODO: rebase
    return {
      MODAL_TYPE,
      isBannerShow, // banner 是否顯示
      isAsideShow, // 手機板左側選單
      isLoginShow, //modal login
      isRegistShow, //modal regist
      forgetPasswordShow,
      form, //modal form
      getStatus,
      // 圖片類
      demoBannerImg,
      marqueeIcon,
      floatImg,
      logoImg,
      //---------
      isMobile,
      bannerType,
      BANNER_TYPE,
      // api
      login,
      auth,
      isLogin,
      isLoading,
      register,
      Rules,
      forgetPassword,
      bannerList,
      isReady
    }
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/modal.sass"
.home-page
  position: relative
  #slide_right
    position: fixed
    z-index: 99
    bottom: 10vw
    right: 1vw
    img
      width: 5vw
      cursor: pointer
      +iphone-width
        width: 8vw
.footer-wrapper
  position: absolute
  bottom: 0
  width: 100%
  height: 18vw
  background: #0F0F10
  padding: 0 14%
  +setFlex
  img
    margin: 0 2vw
    &:nth-child(1)
      width: 20%
    &:nth-child(2)
      width: 50vw
  +iphone-width
    padding: 0 8%
    height: 110vw
    flex-direction: column
    img
      margin: 4vw 0
      &:nth-child(1)
        width: 80%
      &:nth-child(2)
        width: 100%
// common style
.btn-common
  margin: 0vw
  img
    width: 2vw
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
    height: 100vh
    overflow-y: auto
    // min-height: 100vh
    position: relative
    // background-color: #000
    background-image: url('../../assets/images/d-bg.jpg')
    background-repeat: no-repeat
    background-size: cover
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    .inner-content
      flex: 1
      height: 100%
      overflow-y: auto
      // padding-bottom: 4.375rem
      &.mobile
        width: 100vw
      .marquee-area
        @apply mb-4 mx-2
        padding: 3px 0px 3px 50px
        background-color: #2a054b
        color: #ad6abc
        // margin: 0px 20px
        border-radius: 20px
        height: 2.5vw
        line-height: 2.5vw
        // padding-left: 6vw
        // background: #1C1E22
        position: relative
        +iphone-width
          line-height: 8vw
          height: 8vw
        marquee
          color: rgba(255, 255, 255, 0.70)
          line-height: 2vw
          margin: 0 2vw
          width: 94%
          height: 2vw
          font-size: 1rem
          +iphone-width
            line-height: 8vw
            height: 8vw
            font-size: 3vw
        img
          width: 2vw
          position: absolute
          left: 1vw
          top: 0.2vw
          +iphone-width
            width: 5vw
            top: 2vw
            left: 2vw
</style>
