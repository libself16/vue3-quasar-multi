<template>
  <div v-if="isReady" class="home-page">
    <!-- <div id="slide_right">
      <img :src="liveChatImg()" alt="" />
    </div> -->
    <q-icon
      v-if="isMobile"
      name="north"
      class="btn-live-chat"
      :class="{ hide: scrollPosition === 0 }"
      @click="scrollToTop"
    />
    <div class="layout-main wide" id="layout-main">
      <div class="hm-content">
        <div class="aside-layout">
          <template v-if="!isMobile">
            <Transition>
              <AsideMenu v-model="isAsideShow" />
            </Transition>
            <div class="menu-toggle" :class="{ isClose: !isAsideShow }" @click="isAsideShow = !isAsideShow">
              <img :src="svgIcon('menu-arrow')" alt="" />
            </div>
          </template>
          <template v-else>
            <Transition>
              <AsideMobileMenu v-model="isAsideShow" />
            </Transition>
          </template>
        </div>
        <div class="inner-content scroll" :class="{ mobile: isMobile }" v-scroll="scrollHandler" ref="scrollRef">
          <HeaderArea v-model="isAsideShow"></HeaderArea>
          <div class="page-layout" :class="`${String(route.name)} ${route.meta.className}`">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    </div>
    <GS1MiniGame />
  </div>
  <LoginRegisterDialog />
  <ForgotPasswordDialog />
  <SlideVerify />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <BetDetailDialog />
  <DepositDialog />
  <WithdrawalDialog />
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script lang="ts" setup>
// import AgeWarningDialog from "app/template/okbet_purple/components/Dialog/AgeWarningDialog.vue"
import ForgotPasswordDialog from "app/template/okbet_purple/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/okbet_purple/components/Dialog/LoginRegister.vue"
import BetDetailDialog from "app/template/okbet_purple/components/Dialog/BetDetail.vue"
import DepositDialog from "app/template/okbet_purple/components/Dialog/DepositDialog.vue"
import WithdrawalDialog from "app/template/okbet_purple/components/Dialog/WithdrawalDialog.vue"
import HeaderArea from "app/template/okbet_purple/components/Header/Index.vue"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import AsideMenu from "app/template/okbet_purple/layouts/AsideMenu.vue"
import AsideMobileMenu from "app/template/okbet_purple/layouts/AsideMobileMenu.vue"
import { useQuasar } from "quasar"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { useInit } from "src/common/composables/useInit"
import { useSiteRedirect } from "app/template/okbet_purple/composables/useSiteRedirect"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { onMounted, ref, watchEffect, watch, defineAsyncComponent, computed } from "vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRoute } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import "vue3-carousel/dist/carousel.css"
// 引入 store
import { useEnvInfoStore } from "src/stores/envStore"

import { useMayaMiniApp } from "src/common/composables/useMayaMiniApp"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isReady, initialize } = useInit()
const route = useRoute()
const $q = useQuasar()
const { svgIcon, liveChatImg } = useSiteImg()
const { htmlContent, htmlContainer, enableConfig, injectHtml } = useLiveChat()
const { width } = useWindowSize()
// 動態引入 AgeWarningDialog
const AgeWarningDialog = defineAsyncComponent(
  () => import("app/template/okbet_purple/components/Dialog/AgeWarningDialog.vue")
)

const { handleSiteRedirect } = useSiteRedirect()
const { isLogin } = useAuth()
const { userInfo } = useUserInfo()
let isAsideShow = ref(true)
let isMobile = ref(false)
const scrollRef = ref()
const scrollPosition = ref(0)
// 取得 age_confirmation 決定是否顯示 AgeWarningDialog
const { envInfo } = useEnvInfoStore()
const showAgeWarningDialog = computed(() => envInfo.age_confirmation)
const { loginBySessionID } = useMayaMiniApp()
const { isXLargeTablet } = useMediaQuery()

function scrollHandler(position: number) {
  scrollPosition.value = position
}

function scrollToTop() {
  scrollRef.value.scrollTo({ top: 0, behavior: "smooth" })
}

watchEffect(() => {
  if (enableConfig.value && isLogin.value) {
    injectHtml({ name: userInfo.value.username || userInfo.value.real_name, email: userInfo.value.email })
  }
})

watchEffect(() => {
  if (!isLogin.value) {
    window.LiveChatWidget?.call("destroy")
  }
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 769) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (isXLargeTablet.value) {
    isAsideShow.value = false
  }

  initialize({ siteRedirect: handleSiteRedirect })
  loginBySessionID()
})
</script>

<style>
@import "app/template/okbet_purple/assets/fonts/index.css";
h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
div,
li,
a {
  @apply font-['OpenSans'];
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/okbet_purple/assets/css/_variable.sass"

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
    text-transform: capitalize

// layout style
.home-page
  position: relative
  overflow-x: hidden
.menu-toggle
  @apply flex justify-center items-center fixed cursor-pointer
  left: 11.5625rem
  top: 1.275rem
  width: 1.6875rem
  height: 2.25rem
  z-index: 999
  background: $bg-secondary
  border-radius: 1.25rem
  transition: left 0.2s ease 0s
  &.isClose
    left: -200px
.btn-common
  margin: 0vw
  img
    width: 1.2vw
    +iphone-width
      width: 3vw
#slide_right
  +setFlex
  bottom: 208px
  width: 68px
  height: 56px
  border-radius: 50% 0px 0px 50%
  backdrop-filter: blur(10px)
  background: rgba(255, 255, 255, 0.698)
  border: 1px solid rgb(255, 255, 255)
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 8px 0px
  position: fixed
  top: 15vw
  right: 0vw
  z-index: 9
  +iphone-width
    top: unset
    bottom: 25vw
    backdrop-filter: none
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 10px
    width: 40px
    height: 40px
  img
    width: 3rem
    margin-right: 0.5rem
    cursor: pointer
.footer-wrapper
  width: 100%
  background: $bg-footer
  padding: 0 14%
  padding-top: 1vw
  padding-bottom: 1vw
  +setFlex
  .footer_left
    width: 20%
    margin: 0 2vw
    .logo-row
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 2px
      .logo
        width: 45%
      .small-img
        margin-left: 0.5vw
        width: 14%
    .contact-us
      color: #FFC002
      font-size: 1vw
      justify-content: center
      display: flex
      font-weight: bolder
    .contact-info
      display: flex
      align-items: center
      margin-top: 0.8vw
      color: #fff
      font-size: 0.8vw
      padding-left: 1.5vw
      opacity: 0.7
      .icon
        margin-right: 10px
    .social-media
      display: flex
      justify-content: center
      gap: 1.2vw
      margin-bottom: 1vw
      margin-top:0.8vw
      .social-icon
        width: 15%
    .footer-text
      color: #fff
      font-size: 0.8vw
      text-align: center
      margin-top: 1vw


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
    margin-top: 5vw
    height: auto
    flex-direction: column
    position: relative
    .footer_left
      margin: 0 0
      width: 100%
      .logo-row
        .logo
          width: 55%
        .small-img
          display: none
      .contact-us
        font-size: 6.2vw
        margin-top: -10vw
      .contact-info
        margin-top: 3vw
        margin-bottom: 1.5vw
        font-size: 3.8vw
        padding-left: 20.5vw
      .social-media
        margin-top: 6vw
      .footer-text
        font-size: 3.8vw
        margin-top: 4vw

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
  +phone-width
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
    background: #FFC002
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    img
      opacity: 0.7
      filter: brightness(255) invert(1)
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    .menuft
      color: $text-light-secondary
      font-size: 2.5vw
      text-transform: uppercase
      font-weight: 600
      padding: 0 0
      :deep(.q-btn__content)
        display: block
      :deep(.q-focus-helper)
        opacity: 0
      img
        max-width: 31%
        display: block
        margin: auto auto 2px

      &.active
        overflow: hidden
        img
          position: relative
          left: -100px
          filter: drop-shadow(100px 0px 0px #FFC002)



//footer End
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
  height: 100vh
  .hm-content
    @apply h-full relative
    width: 100%
    background-color: $bg-dark
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    transition: all 0.2s ease 0s
    .inner-content
      width: 100%
      height: 100%
      overflow-y: auto
      &::-webkit-scrollbar
        display: none
      &.mobile
        width: 100%
      .page-layout
        @apply relative
        padding: 5rem 0 0
        &.AboutUs
          padding: 0
        &.PrivacyPolicy, &.TermAndCondition, &.ResponsibleGaming
          padding: 0
          +phone-width
          padding: 0.5rem 0 0
      +pad-width
        width: 100vw
      +iphone-width
        .page-layout
          padding: 4rem 0 0
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: #fff
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.btn-live-chat
  @apply flex justify-center items-center fixed z-30 text-white transform-none
  width: 2.25rem
  height: 2.25rem
  bottom: 4.75rem
  right: .375rem
  font-weight: 580
  font-size: 1.25rem
  background-size: 100% 100%
  background-color: $bg-secondary
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 10px
  border-radius: 50%
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) , visibility 0.3s ease
  &.hide
    transform: translateY(112px)
    visibility: hidden
</style>
