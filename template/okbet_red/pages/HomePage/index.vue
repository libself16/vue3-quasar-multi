<template>
  <div v-if="isReady" class="home-page">
    <q-icon
      v-if="isMobile"
      name="north"
      class="btn-live-chat"
      :class="{ hide: scrollPosition === 0, 'tg-mini-app': isTelegramMiniApp }"
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

        <HeaderArea v-model="isAsideShow"></HeaderArea>

        <div
          class="inner-content scroll"
          :class="{ mobile: isMobile, 'aside-open': isAsideShow }"
          v-scroll="scrollHandler"
          ref="scrollRef"
        >
          <div class="page-layout" :class="`${String(route.name)} ${route.meta.className}`">
            <Transition name="fade" mode="out-in">
              <router-view />
            </Transition>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="ClaimGiftButton"
      :style="style"
      style="position: fixed"
      v-if="isLogin && giftState.list.length > 0"
      class="z-[1000]"
    >
      <div class="relative w-fit cursor-pointer" @click="handleClick" @mousedown="isDragging = false">
        <div v-if="giftState.list.length > 0" class="bg-red w-[15px] h-[15px] rounded-full ml-auto"></div>
        <q-img class="w-[60px] lg:w-[120px]" :src="claimGiftImg('giftBox.png')" loading="lazy" />
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
  <MemberInfoDialog v-if="showMemberInfoDialog" />
  <ClaimGift />
  <LiveChat />
  <FloatIconCMS v-draggable="{ storeKey: ELEMENT_KEYS.FLOATICONCMS }" />
</template>

<script lang="ts" setup>
import ClaimGift from "app/template/okbet_red/components/Dialog/ClaimGift.vue"
import ForgotPasswordDialog from "app/template/okbet_red/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/okbet_red/components/Dialog/LoginRegister.vue"
import BetDetailDialog from "app/template/okbet_red/components/Dialog/BetDetail.vue"
import HeaderArea from "app/template/okbet_red/components/Header/Index.vue"
import FloatIconCMS from "app/template/okbet_red/components/FloatIconCMS/Index.vue"
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import AsideMenu from "app/template/okbet_red/layouts/AsideMenu.vue"
import AsideMobileMenu from "app/template/okbet_red/layouts/AsideMobileMenu.vue"
import { useQuasar } from "quasar"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { useInit } from "src/common/composables/useInit"
import { useSiteRedirect } from "app/template/okbet_red/composables/useSiteRedirect"
import { onMounted, ref, watch, defineAsyncComponent, computed } from "vue"
import { useRoute } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { useBank } from "src/common/composables/useBank"
import { injectStrict } from "src/common/utils/injectTyped"
import { useDraggable, useWindowSize } from "@vueuse/core"
import { EventBusKey } from "src/symbols"
// 引入 store
import { useEnvInfoStore } from "src/stores/envStore"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import "vue3-carousel/dist/carousel.css"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { ELEMENT_KEYS } from "src/common/utils/constants/draggableElementKeyName"

// 動態引入 AgeWarningDialog
const AgeWarningDialog = defineAsyncComponent(
  () => import("app/template/okbet_red/components/Dialog/AgeWarningDialog.vue")
)
const MemberInfoDialog = defineAsyncComponent(
  () => import("app/template/okbet_red/components/Dialog/MemberInfoDialog.vue")
)

const eventbus = injectStrict(EventBusKey)
const { isReady, initialize } = useInit()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { getUserInfo2, getUserWalletList } = useUserInfo()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const route = useRoute()
const $q = useQuasar()
const { svgIcon, claimGiftImg } = useSiteImg()
const { width, height } = useWindowSize()
const { handleSiteRedirect } = useSiteRedirect()
const { isTelegramMiniApp } = useTelegram()
const { getGiftsList, giftState } = useClaimGift()
const { isLogin } = useAuth()
const { isXLargeTablet } = useMediaQuery()
const { handleGetPixelCodes } = usePixelCodes()

const ClaimGiftButton = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(ClaimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140
  }
})

const isDragging = ref(false)

watch(x, () => {
  isDragging.value = true
})

const handleClick = () => {
  if (!isDragging.value) {
    eventbus.emit("openClaimGiftDialog", true)
  }
  isDragging.value = false
}

// 取得 age_confirmation 決定是否顯示 AgeWarningDialog
const showAgeWarningDialog = computed(() => envInfo.age_confirmation)
const showMemberInfoDialog = computed(() => true)
const { envInfo } = useEnvInfoStore()
let isAsideShow = ref(true)
let isMobile = ref(false)
const scrollRef = ref()
const scrollPosition = ref(0)
function scrollHandler(position: number) {
  scrollPosition.value = position
}

function scrollToTop() {
  scrollRef.value.scrollTo({ top: 0, behavior: "smooth" })
}

// watchEffect(() => {
//   if (isLogin.value) {
//     getGiftsList()
//   }
// })

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

watch(x, (val) => {
  x.value = width.value > 768 ? width.value - 150 : width.value - 70
  console.log(val)
})

onMounted(() => {
  if (isXLargeTablet.value) {
    isAsideShow.value = false
  }

  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserInfo2,
      getUserWalletList,
      getAvailCurrencyList,
      getGiftsList,
      handleGetPixelCodes
    ],
    siteRedirect: handleSiteRedirect
  })
})
</script>

<style>
@import "app/template/okbet_red/assets/fonts/index.css";

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
@import "app/template/okbet_red/assets/css/_variable.sass"

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
    color: rgba($text-light-color, 0.70)
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
  display: flex
  -webkit-box-pack: center
  justify-content: center
  -webkit-box-align: center
  align-items: center
  position: fixed
  cursor: pointer
  left: 185px
  top: 25px
  width: 27px
  height: 36px
  z-index: 999
  background: $primary-color
  border-radius: 20px
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
  background: rgba($box-shadow-light-color, 0.7)
  border: 1px solid $border-light-color
  box-shadow: rgba($box-shadow-dark-color, 0.05) 0px 4px 8px 0px
  position: fixed
  top: 15vw
  right: 0vw
  z-index: 9
  +iphone-width
    top: unset
    bottom: 25vw
    backdrop-filter: none
    box-shadow: rgba($box-shadow-dark-color, 0.4) 0px 2px 10px
    width: 40px
    height: 40px
  img
    width: 3rem
    margin-right: 0.5rem
    cursor: pointer
.footer-wrapper
  width: 100%
  background: $background-dark-gray-color
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
      color: $text-bright-yellow-color
      font-size: 1vw
      justify-content: center
      display: flex
      font-weight: bolder
    .contact-info
      display: flex
      align-items: center
      margin-top: 0.8vw
      color: $text-light-color
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
      color: $text-light-color
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
      color: $text-light-color
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
      color: $text-light-color
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        .be-support-content
          display: flex
          color: $text-light-color
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
    background: $background-bright-yellow-color
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
      color: $text-light-color
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
          filter: drop-shadow(100px 0px 0px $background-bright-yellow-color)

// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba($text-light-color, 0.70)
  font-family: "Century Gothic"
  font-size: 1.2vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba($text-light-color, 0.70)
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
    width: 100%
    height: 100%
    position: relative
    background-color: $background-pale-silver-color
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    transition: all 0.2s ease 0s
    .inner-content
      width: 100%
      height: 100%
      overflow-y: auto
      transition: margin-left 0.2s ease 0s, width 0.2s ease 0s
      &::-webkit-scrollbar
        display: none
      &.aside-open
        margin-left: 200px
        width: calc(100% - 200px)
        +pad-width
          margin-left: 0
          width: 100%
        +iphone-width
          margin-left: 0
          width: 100%
      &.mobile
      .page-layout
        @apply relative overflow-x-hidden
        @apply pt-20 phone:pt-[3.5625rem]
        &.AboutUs
          padding: 0
        &.PrivacyPolicy, &.TermAndCondition, &.ResponsibleGaming
          padding: 0
          +phone-width
            padding: 0
      +pad-width
        width: 100vw
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: $text-light-color
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.btn-live-chat
  @apply flex justify-center items-center fixed z-30 transform-none
  width: 2.25rem
  height: 2.25rem
  bottom: 4.75rem
  right: .375rem
  font-weight: 580
  font-size: 1.25rem
  background-size: 100% 100%
  background-color: $primary-color
  box-shadow: rgba($box-shadow-dark-color, 0.4) 0px 2px 10px
  color: $text-light-color
  border-radius: 50%
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) , visibility 0.3s ease
  &.tg-mini-app
    bottom: 5.75rem
  &.hide
    transform: translateY(112px)
    visibility: hidden

// .ReferralRebate, .ReferralRebateEvent
//   background: #F5F5F7
</style>
