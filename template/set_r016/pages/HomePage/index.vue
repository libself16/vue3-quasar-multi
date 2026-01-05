<template>
  <div v-if="isReady" class="home-page" :class="{ 'footer-bottom': route.name === 'home' }">
    <!--  <div id="slide_right">
      <img :src="liveChatImg()" alt="" />
    </div> -->
    <div class="layout-main wide" id="layout-main">
      <Transition>
        <AsideMenu
          v-if="isAsideShow"
          v-model="isAsideShow"
          @changeLogin="() => getStatus(MODAL_TYPE.Enums.Login)"
          @changeRegister="() => getStatus(MODAL_TYPE.Enums.Register)"
        />
      </Transition>

      <div class="hm-content">
        <div class="inner-content" :class="{ mobile: isMobile }" v-scroll="scrollHandler">
          <HeaderArea
            class="header-area"
            ref="headerRef"
            v-model="isAsideShow"
            @changeLogin="() => getStatus(MODAL_TYPE.Enums.Login)"
          />
          <div class="page-layout">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
          <q-btn v-show="scrollPosition > 0" flat class="btn-back-to-top" :class="route.name" @click="scrollToTop">
            <q-img :src="svgIcon('btn-back-to-top')"></q-img>
          </q-btn>
        </div>
      </div>
      <Footer></Footer>
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
    <RouletteGameDialog />
    <FirstDepositDialog />
    <GS1MiniGame />
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <ClaimGift />
  <LiveChat />
  <RouletteWinningDialog />
  <FloatIconCMS />
</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from "@vueuse/core"
import ClaimGift from "app/template/set_r016/components/Dialog/ClaimGift.vue"
import Footer from "app/template/set_r016/components/Footer/Index.vue"
import HeaderArea from "app/template/set_r016/components/Header/Index.vue"
import { useSiteRedirect } from "app/template/set_r016/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import AsideMenu from "app/template/set_r016/layouts/AsideMenu.vue"
import dayjs from "dayjs"
import { useQuasar } from "quasar"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { useBank } from "src/common/composables/useBank"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useEnv } from "src/common/hooks/useEnv"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import { useRule } from "src/common/hooks/useRule"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useScroll } from "src/common/hooks/useScroll"
import { MODAL_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import "vue3-carousel/dist/carousel.css"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import RouletteGameDialog from "src/common/components/rouletteGame/Dialog.vue"
import RouletteWinningDialog from "app/template/set_r016/components/Dialog/RouletteWinning.vue"
import FirstDepositDialog from "app/template/set_r016/components/Dialog/FirstDepositDialog.vue"
import FloatIconCMS from "app/template/set_r016/components/FloatIconCMS/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const headerRef = ref<HTMLElement | null>(null)
const { scrollTop } = useScroll(headerRef.value)
const { isLoading, handleLogin, handleRegister, isLogin, handleResetPassword, auth } = useAuth()
const { getUserWalletList, getAccountInfo } = useUserInfo()
const { isReady, initialize } = useInit()
const router = useRouter()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)
const currentYear = dayjs().year()
const { visitWebsite, inviteCode } = useEnv()
const { getAgentSetting } = useLanguage()
const { initGameTypeList, gameTypeState } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const { handleReferralWheelStatus } = useReferralWheel()
const { handleSiteRedirect } = useSiteRedirect()
const { getGiftsList, giftState } = useClaimGift()
const { width, height } = useWindowSize()
const { handleGetPixelCodes } = usePixelCodes()

const { svgIcon, claimGiftImg } = useSiteImg()

const ClaimGiftButton = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(ClaimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140
  }
})

const isDragging = ref(false)

const scrollPosition = ref(0)
function scrollHandler(position: number) {
  scrollPosition.value = position
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

watch(x, () => {
  isDragging.value = true
})

const handleClick = () => {
  if (!isDragging.value) {
    eventbus.emit("openClaimGiftDialog", true)
  }
  isDragging.value = false
}
let isAsideShow = ref(true)

let isMobile = ref(false)

const getStatus = (modalType: MODAL_TYPE.Enums) => {
  console.log("modalType :>> ", modalType)
  switch (modalType) {
    case MODAL_TYPE.Enums.Login:
      router.push({ name: "Login" })
      break
    case MODAL_TYPE.Enums.Register:
      router.push({ name: "Register" })
      break
  }
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
watch(x, (val) => {
  x.value = width.value > 768 ? width.value - 150 : width.value - 70
  console.log(val)
})

watch([() => isReady.value, () => route.fullPath], ([isReadyVal, fullPath], [oldIsReadyVal, oldFullPath]) => {
  if (
    isReadyVal &&
    (fullPath !== oldFullPath || !oldIsReadyVal) &&
    route.name === "HomePage" &&
    gameTypeState.list?.length
  ) {
    // 優先使用 query 參數中的 gameType，否則使用預設值
    const queryGameType = Number(route.query.gameType)
    const targetGameType =
      queryGameType && !isNaN(queryGameType) && gameTypeState.list.some((item) => item.id === queryGameType)
        ? queryGameType
        : gameTypeState.list[0]?.id || 1

    if (route.query.gameType) {
      router.replace({ name: "home", params: { gameType: targetGameType }, query: {} })
    } else {
      router.push({ name: "home", params: { gameType: targetGameType } })
    }
  }
})

onMounted(() => {
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getAccountInfo,
      getUserWalletList,
      getAvailCurrencyList,
      getGiftsList,
      handleReferralWheelStatus,
      handleGetPixelCodes
    ],
    siteRedirect: handleSiteRedirect
  })
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set_r016/assets/css/_variable.scss"

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
//PC 背景
.home-page
  position: relative
  font-family: Helvetica, Arial, sans-serif
  font-size: 0.875rem
  line-height: 100%
  font-weight: 600
  &.footer-bottom
    position: relative
    z-index: 1

    &::before
      content: ""
      position: absolute
      top: calc(100vw - 60vw)
      left: 0
      right: 0
      bottom: 0
      background: linear-gradient(180deg, $primary04 0%, $primary07 100%)
      border-radius: 0px 100px 0px 0px
      z-index: -1


    +iphone-width
      &::before
        border-radius: 0px 40px 0px 0px
        top: 20rem
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
  .header-area
    position: relative
    background: rgba(255, 255, 255, 0.6)
    &.fix
      position: sticky
      top: 0
      z-index: 3
  .hm-content
    width: 100%
    padding-left: 15vw
    height: 100%
    position: relative
    // background-attachment: fixed
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    &.home-background
      background-image: url("app/template/set_r016/assets/images/background.png")
      background-size: 100% 100%
      +pad-width
        background-image: url("app/template/set_r016/assets/images/m-background.png")
        background-size: 100% 100%
    +phone-width
      display: block
      padding-left: 0
    .inner-content
      width: 100%
      max-width: 75rem
      margin: 0 auto
      height: 100%
      position: relative
      &.mobile
        width: 100%
      .page-layout
        padding-bottom: 5vw
        +phone-width
          margin: 0.625rem
          padding-bottom: .625rem
      +phone-width
        width: 100%
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: #fff
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.btn-back-to-top
  @apply flex justify-center items-center z-30 p-0 min-h-0
  position: sticky
  bottom: 5rem
  left: 0
  +iphone-width
    left: .625rem
    &.memberChat
      bottom: 10.5rem
  .q-img
    width: 6.25rem
    height: 6.25rem
    +iphone-width
      width: 3rem
      height: 3rem

.logo-area
  .title-tip
    @apply px-10
    color: #EB5757
    margin-top: 1.25rem
    font-size: 1.5rem
</style>
