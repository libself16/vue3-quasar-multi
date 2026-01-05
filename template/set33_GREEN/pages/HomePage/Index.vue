<template>
  <div v-if="isReady">
    <q-layout view="hHh lpr fff" container style="height: 100vh" class="bg-grey-1">
      <HeaderComp :key="headerKey" />
      <ContactUsComp />
      <q-page-container class="page-container">
        <q-page class="mainWrapper">
          <div class="mx-auto items-center text-white">
            <router-view :key="route.params.gameType" />
          </div>
        </q-page>
      </q-page-container>
      <FooterComp />
    </q-layout>
    <FooterNav />
    <CurrencySupportDialog />
    <LaunchGameDialog />
    <GS1MiniGame />
  </div>
  <LiveChat />
  <FloatIconCMS />
</template>

<script lang="ts" setup>
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import ContactUsComp from "app/template/set33_GREEN/components/ContactUs/Index.vue"
import FooterNav from "app/template/set33_GREEN/components/Footer/FooterNav.vue"
import FooterComp from "app/template/set33_GREEN/components/Footer/Index.vue"
import HeaderComp from "app/template/set33_GREEN/components/Header/Index.vue"
import { useQuasar } from "quasar"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import FloatIconCMS from "app/template/set33_GREEN/components/FloatIconCMS/Index.vue"
import { useInit } from "src/common/composables/useInit"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useAuth } from "src/common/hooks/useAuth"
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import "vue3-carousel/dist/carousel.css"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

const $q = useQuasar()
const route: any = useRoute()
const { isReady, initialize } = useInit()
const { handleGetPixelCodes } = usePixelCodes()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { getUserInfo2, getUserWalletList } = useUserInfo()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { isLogin } = useAuth()
const headerKey = ref(0)

watch(isLogin, (newValue) => {
  if (newValue) {
    headerKey.value++
  }
})

onMounted(() => {
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserInfo2,
      getUserWalletList,
      handleGetPixelCodes
    ]
  })
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/main.sass"
body
  // +hideScrollBar
  -ms-overflow-style: block
  scrollbar-width: block

  ::-webkit-scrollbar
    height: 6px
    width: 8px

  ::-webkit-scrollbar-track
    background: #00794E

  ::-webkit-scrollbar-thumb
    cursor: pointer
    background: #4caf50
    /* 滾動條滑塊顏色 */
    border-radius: 10px
.t-footer
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    max-width: 991px
    margin: auto
    width: 100%
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #016E48
    padding: 3.5%
    width: 15%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 26px
    margin: auto
    z-index: 9
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    a
      color: #fff
      font-size: 9px
      text-transform: uppercase
      font-weight: 600
      padding: 5px 0
    .menuft
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
        filter: brightness(0) invert(1)
.page-container
  padding-top: 160px !important
  +pc-width
    padding-top: 14vw !important
  .mainWrapper
    min-height: 32.1rem !important
</style>
