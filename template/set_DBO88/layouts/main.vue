<template>
  <main class="app-layout" v-if="isReady">
    <q-layout>
      <HeaderArea @toggle-drawer="toggleDrawer" />

      <q-drawer :width="232" show-if-above v-model="drawer" side="left" class="drawer-wrapper">
        <SideMenu />
      </q-drawer>

      <q-page-container>
        <router-view />
        <FooterArea />
      </q-page-container>

      <FloatIconCMS />
    </q-layout>
    <GS1MiniGamße />
  </main>
  <LoginModal />
  <BankDetailsModal />
  <H5BottomMenu v-if="width <= 1000" />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue"
import HeaderArea from "app/template/set_DBO88/components/Header/Index.vue"
import SideMenu from "app/template/set_DBO88/components/SideMenu/Index.vue"
import LoginModal from "app/template/set_DBO88/components/Modal/LoginWithRegister.vue"
import BankDetailsModal from "app/template/set_DBO88/pages/BankDetails/Index.vue"
import H5BottomMenu from "app/template/set_DBO88/components/H5BottomMenu/index.vue"
import FooterArea from "app/template/set_DBO88/components/Footer/Index.vue"
import FloatIconCMS from "app/template/set_DBO88/components/FloatIconCMS/Index.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

import { useWindowSize } from "@vueuse/core"
import { useInit } from "src/common/composables/useInit"
import { useEnv } from "src/common/hooks/useEnv"
import { useLogo } from "src/common/composables/useLogo"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteRedirect } from "app/template/set_DBO88/composables/useSiteRedirect"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"

const { width } = useWindowSize()
const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const { isReady, initialize } = useInit()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { handleLogoList } = useLogo()
const { initGameTypeList } = useGame()
const { handleSiteRedirect } = useSiteRedirect()
const { getUserInfo2, getUserWalletList } = useUserInfo()
const { htmlContent, htmlContainer, enableConfig, injectHtml } = useLiveChat()
const { handleGetPixelCodes } = usePixelCodes()

const findWidgetElement = () => {
  const widgetElement = document.querySelector(".widget-visible")
  if (widgetElement) {
    console.log("找到 widget-visible 元件:", widgetElement)
    // widgetElement.style.cssText += "transform: translateY(-60px) !important;"

    return widgetElement
  }
  return null
}

watchEffect(async () => {
  if (enableConfig.value) {
    await injectHtml()
    window.Tawk_API.onLoad = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = "transform: translateY(-60px) !important;"
    }
    window.Tawk_API.onChatMaximized = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = ""
      console.log(findWidgetElement().style.cssText)
    }
    window.Tawk_API.onChatMinimized = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = "transform: translateY(-60px) !important;"
      console.log(findWidgetElement().style.cssText)
    }
    const observer = new MutationObserver((mutations) => {
      const widget = findWidgetElement()
      if (widget) {
        console.log("widget-visible 元件已載入並設定樣式")
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
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
    ],
    siteRedirect: handleSiteRedirect
  })
})
</script>

<style>
@import "app/template/set_DBO88/assets/css/scrollbar.css";
@import "app/template/set_DBO88/assets/css/font.css";
</style>

<style scoped lang="scss">
@import "app/template/set_DBO88/assets/css/_variable.scss";

.app-layout {
  font-family: "Montserrat", sans-serif;
  background: #191b1e;

  .drawer-wrapper {
    :deep(q-drawer) {
      @apply w-[14.5rem];
    }
  }

  .q-page-container {
    padding-top: 1.5rem !important;
  }
}
</style>
