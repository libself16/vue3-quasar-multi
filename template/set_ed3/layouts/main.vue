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
    </q-layout>
    <GS1MiniGame />
  </main>
  <LoginModal />
  <ChangePasswordModal />
  <ProfileModal />
  <InboxModal />
  <HistoryModal />
  <PendingTransactionModal />
  <BankDetailsModal />
  <DepositWithWithdrawalModal />
  <WithdrawalPasswordModal />
  <H5BottomMenu v-if="width <= 1000" />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <LiveChat />
  <FloatIconCMS />
  <AnnouncementDialog id="announcement-dialog-wrapper" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import HeaderArea from "app/template/set_ed3/components/Header/Index.vue"
import SideMenu from "app/template/set_ed3/components/SideMenu/Index.vue"
import LoginModal from "app/template/set_ed3/components/Modal/LoginWithRegister.vue"
import ChangePasswordModal from "app/template/set_ed3/components/Modal/ChangePassword.vue"
import ProfileModal from "app/template/set_ed3/components/Modal/Profile.vue"
import InboxModal from "app/template/set_ed3/components/Modal/Inbox/Index.vue"
import HistoryModal from "app/template/set_ed3/components/Modal/History/Index.vue"
import PendingTransactionModal from "app/template/set_ed3/components/Modal/PendingTransaction/Index.vue"
import BankDetailsModal from "app/template/set_ed3/components/Modal/BankDetails/Index.vue"
import DepositWithWithdrawalModal from "app/template/set_ed3/components/Modal/DepositWithWithdrawal/Index.vue"
import WithdrawalPasswordModal from "app/template/set_ed3/components/Modal/WithdrawalPassword/Index.vue"
import H5BottomMenu from "app/template/set_ed3/components/H5BottomMenu/index.vue"
import FooterArea from "app/template/set_ed3/components/Footer/Index.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import FloatIconCMS from "app/template/set_ed3/components/FloatIconCMS/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useWindowSize } from "@vueuse/core"
import { useInit } from "src/common/composables/useInit"
import { useEnv } from "src/common/hooks/useEnv"
import { useLogo } from "src/common/composables/useLogo"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteRedirect } from "app/template/set_ed3/composables/useSiteRedirect"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import AnnouncementDialog from "src/common/components/dialog/Announcement/Index.vue"

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
const { getUserInfo, getUserWalletList } = useUserInfo()
const { handleGetPixelCodes } = usePixelCodes()

onMounted(() => {
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserInfo,
      getUserWalletList,
      handleGetPixelCodes
    ],
    siteRedirect: handleSiteRedirect
  })
})
</script>

<style>
@import "app/template/set_ed3/assets/css/scrollbar.css";
@import "app/template/set_ed3/assets/css/font.css";

.select-announcement-type-popup {
  --ann-select-popup-bg: #0c614b;
  --ann-select-popup-shadow: 0px 0px 10px 0px #ffffff99;
  --ann-select-option-text: #ffffff;
  --ann-select-option-text-active: #ffe001;
  --ann-select-option-bg-active: #084b3a;
}
</style>

<style scoped lang="scss">
@import "app/template/set_ed3/assets/css/_variable.scss";

.app-layout {
  font-family: "Montserrat", sans-serif;
  background: $gradient01;
}

#announcement-dialog-wrapper {
  --ann-overlay: #00000099;
  --ann-header: #086a51;
  --ann-header-text: #ffffff;
  --ann-header-close: #ffffff;
  --ann-sidebar-bg: #086a51;
  --ann-sidebar-text: #ffffff;
  --ann-sidebar-active-bg: linear-gradient(90deg, #1fc88f 0%, #f4ee70 100%);
  --ann-sidebar-active-text: #0b5544;
  --ann-sidebar-nav-arrow: #0b5544;
  --ann-detail-bg: #0b5544;
  --ann-detail-text: #ffffff;
  --ann-checkbox-wrapper-bg: #083b2f;
  --ann-checkbox-bg: #dcdfe6;
  --ann-checkbox-bg-active: #409eff;
  --ann-checkbox-icon: #ffffff;
  --ann-checkbox-text: #ffffff;
  --ann-select-bg: #0fa37d;
  --ann-select-text: #ffffff;
  --ann-select-icon: #ffffff;
}
</style>
