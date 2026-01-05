<template>
  <main v-if="isReady" class="app-layout">
    <q-layout>
      <Header @toggle-drawer="toggleDrawer" />
      <AsideMenu v-model="drawer" />
      <q-page-container>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <FooterArea />
      </q-page-container>
    </q-layout>
    <div ref="ClaimGiftButton" :style="style" style="position: fixed" class="z-[998]">
      <div class="flex flex-col gap-4">
        <div
          class="relative w-fit cursor-pointer"
          v-if="isLogin && giftState.list.length > 0"
          @click="handleClick"
          @mousedown="isDragging = false"
        >
          <div class="bg-red w-[15px] h-[15px] rounded-full ml-auto"></div>
          <q-img class="w-[60px] lg:w-[120px]" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        </div>
        <FloatingIconBtn />
      </div>
    </div>
    <GS1MiniGame />
  </main>

  <ClaimGift />
  <FloatIconCMS />
  <LoginRegisterDialog />
  <ForgotPasswordDialog />
  <DepositWithWithdrawalModal />
  <CurrencySupportDialog />
  <BankDetailsModal />
  <LiveChat />
  <SlideVerify />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <LaunchGameDialog />
  <KycDialog v-if="showKycDialog" v-model="showKycDialog" />
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch, defineAsyncComponent, watchEffect } from "vue"
import { useDraggable, useWindowSize } from "@vueuse/core"
import { useEnv } from "src/common/hooks/useEnv"
import { useInit } from "src/common/composables/useInit"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useLogo } from "src/common/composables/useLogo"
import { useGame } from "src/common/composables/useGame"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import Header from "app/template/set_r023/components/Header/index.vue"
import { useSiteRedirect } from "app/template/set_r023/composables/useSiteRedirect"
import BankDetailsModal from "app/template/set_r023/components/Dialog/BankDetails/Index.vue"
import DepositWithWithdrawalModal from "app/template/set_r023/components/Dialog/DepositWithWithdrawal/Index.vue"
import LoginRegisterDialog from "app/template/set_r023/components/Dialog/LoginRegister.vue"
import ForgotPasswordDialog from "app/template/set_r023/components/Dialog/ForgotPassword.vue"
import ClaimGift from "app/template/set_r023/components/Dialog/ClaimGift.vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/set_r023/hooks/useSiteImg"
import AsideMenu from "app/template/set_r023/components/AsideMenu/Index.vue"
import FooterArea from "app/template/set_r023/components/Footer/Index.vue"
import FloatIconCMS from "app/template/set_r023/components/FloatIconCMS/Index.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import { useEnvInfoStore } from "src/stores/envStore"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import KycDialog from "../MemberCenter/components/KycDialog.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { useLiveChat } from "src/common/hooks/useLiveChat"

// 動態引入 AgeWarningDialog
const AgeWarningDialog = defineAsyncComponent(
  () => import("app/template/set_r023/components/Dialog/AgeWarningDialog.vue")
)

const { handleLogoList } = useLogo()
const { initGameTypeList } = useGame()
const { isReady, initialize } = useInit()
const { handleGetPixelCodes } = usePixelCodes()
const { getAgentSetting } = useLanguage()
const { getAvailCurrencyList } = useBank()
const { visitWebsite } = useEnv()
const { handleSiteRedirect } = useSiteRedirect()
const { getAccountInfo, getUserWalletList } = useUserInfo()
const { getGiftsList, giftState } = useClaimGift()
const { svgIcon, claimGiftImg } = useSiteImg()
const { width, height } = useWindowSize()
const { isLogin } = useAuth()
const { envInfo } = useEnvInfoStore()
const showKycDialog = ref(false)
const { enableConfig, injectHtml } = useLiveChat()

const eventbus = injectStrict(EventBusKey)
const ClaimGiftButton = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(ClaimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140
  }
})

const isDragging = ref(false)

// 取得 age_confirmation 決定是否顯示 AgeWarningDialog
const showAgeWarningDialog = computed(() => envInfo.age_confirmation)

watch(x, () => {
  isDragging.value = true
})

const handleClick = () => {
  if (!isDragging.value) {
    eventbus.emit("openClaimGiftDialog", true)
  }
  isDragging.value = false
}

watch(x, (val) => {
  x.value = width.value > 768 ? width.value - 150 : width.value - 70
  console.log(val)
})

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const findWidgetElement = () => {
  const widgetElement = document.querySelector(".widget-visible")
  if (widgetElement) {
    console.log("找到 widget-visible 元件:", widgetElement)
    return widgetElement
  }
  return null
}

// 安全地設定樣式的函數
const setWidgetStyle = (style) => {
  const widget = findWidgetElement()
  if (widget) {
    console.log("設定樣式前:", widget.style.cssText)
    widget.style.cssText = style
    console.log("設定樣式後:", widget.style.cssText)
    return true
  } else {
    console.log("找不到 widget-visible 元件")
    return false
  }
}

// 重試機制
const retrySetStyle = (style, maxRetries = 10, delay = 500) => {
  let retries = 0
  const trySet = () => {
    if (setWidgetStyle(style)) {
      return true
    }
    if (retries < maxRetries) {
      retries++
      console.log(`重試設定樣式 (${retries}/${maxRetries})`)
      setTimeout(trySet, delay)
    } else {
      console.log("達到最大重試次數，無法設定樣式")
    }
  }
  trySet()
}

watchEffect(async () => {
  if (enableConfig.value) {
    await injectHtml()

    // 使用重試機制設定初始樣式
    retrySetStyle("transform: translateY(-60px) !important;")

    window.Tawk_API.onLoad = function () {
      console.log("Tawk_API onLoad 觸發")
      retrySetStyle("transform: translateY(-60px) !important;")
    }

    window.Tawk_API.onChatMaximized = function () {
      console.log("Tawk_API onChatMaximized 觸發")
      setWidgetStyle("")
    }

    window.Tawk_API.onChatMinimized = function () {
      console.log("Tawk_API onChatMinimized 觸發")
      setWidgetStyle("transform: translateY(-60px) !important;")
    }

    const observer = new MutationObserver((mutations) => {
      const widget = findWidgetElement()
      if (widget) {
        console.log("widget-visible 元件已載入")
        // 確保樣式被正確設定
        retrySetStyle("transform: translateY(-60px) !important;")
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
      getAccountInfo,
      getUserWalletList,
      getAvailCurrencyList,
      getGiftsList,
      handleGetPixelCodes
    ],
    siteRedirect: handleSiteRedirect
  })

  eventbus.on("openKycDialog", (show: boolean) => {
    showKycDialog.value = show
  })
})
</script>

<style lang="scss">
@import "app/template/set_r023/assets/css/_variable.scss";

.app-layout {
  @apply w-full;
}

body {
  background: var(--bg-main-bg) !important;

  &.body--light {
    @include theme-vars(light);
  }

  &.body--dark {
    @include theme-vars(dark);
  }
}
</style>
