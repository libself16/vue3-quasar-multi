<template>
  <main v-if="isReady">
    <!-- <q-btn @click="eventbus.emit('openForgotPassword', true)">forgot password</q-btn> -->
    <q-layout view="lHh lpr lFf" container style="height: 100vh">
      <HeaderComponent />
      <q-page-container :class="{ 'md:!pt-0': !route.meta.hideFooter, 'pb-[120px]': route.meta.hideFooter }">
        <q-page class="mainWrapper" :class="{ 'mt-[60px]': route.meta.hideFooter }">
          <div class="mx-auto items-center text-white">
            <router-view />
            <router-view name="modal" />
          </div>
        </q-page>
      </q-page-container>
      <FooterComponent v-if="!route.meta.hideFooter || isMobile" />
    </q-layout>
    <GS1MiniGame />
  </main>
  <LoginModal />
  <RegisterModal />
  <ForgotPasswordrModal />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <InboxModal />
  <HistoryModal />
  <BalanceModal />
  <WebInformationModal />
  <DepositWithdrawalOrderModal />
  <AddBankCardModal />
  <ChangePasswordModal />
  <ProfileModal />
  <SwitchLanguageModal />
  <WithdrawalPasswordModal />
  <FullScreenModal />
  <Vip />
  <Download />
  <Contact />
  <Promotion />
  <Announcement />
  <LiveChat />
  <FloatIconCMS />
</template>

<script lang="ts" setup>
import { onMounted, watchEffect, nextTick } from "vue"
import { useInit } from "src/common/composables/useInit"
import { useRouter, useRoute } from "vue-router"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import HeaderComponent from "app/template/set_royalslot88/components/Header/Index.vue"
import FooterComponent from "app/template/set_royalslot88/components/Footer/index.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import LoginModal from "app/template/set_royalslot88/components/modal/Login.vue"
import RegisterModal from "app/template/set_royalslot88/components/modal/Register.vue"
import ForgotPasswordrModal from "app/template/set_royalslot88/components/modal/ForgotPassword.vue"
import InboxModal from "app/template/set_royalslot88/components/modal/Inbox.vue"
import HistoryModal from "app/template/set_royalslot88/components/modal/History.vue"
import BalanceModal from "app/template/set_royalslot88/components/modal/Balance.vue"
import WebInformationModal from "app/template/set_royalslot88/components/modal/WebInformation/index.vue"
import DepositWithdrawalOrderModal from "app/template/set_royalslot88/components/modal/DepositWithdrawalOrder/index.vue"
import AddBankCardModal from "app/template/set_royalslot88/components/modal/AddBankCard.vue"
import ChangePasswordModal from "app/template/set_royalslot88/components/modal/ChangePassword.vue"
import ProfileModal from "app/template/set_royalslot88/components/modal/Profile/index.vue"
import SwitchLanguageModal from "app/template/set_royalslot88/components/modal/SwitchLanguage.vue"
import WithdrawalPasswordModal from "app/template/set_royalslot88/components/modal/WithdrawalPassword.vue"
import FullScreenModal from "app/template/set_royalslot88/components/modal/FullScreen.vue"
import Vip from "app/template/set_royalslot88/components/modal/Vip.vue"
import Download from "app/template/set_royalslot88/components/modal/Download.vue"
import Contact from "app/template/set_royalslot88/components/modal/Contact.vue"
import Promotion from "app/template/set_royalslot88/components/modal/Promotion.vue"
import Announcement from "app/template/set_royalslot88/components/modal/Announcement.vue"
import FloatIconCMS from "app/template/set_royalslot88/components/FloatIconCMS/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isMobile } = useMediaQuery()
const { isReady, initialize } = useInit()
const router = useRouter()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)

onMounted(async () => {
  await initialize()

  if (route.query.routerName) {
    await nextTick()
    eventbus.emit(route.query.routerName as any, true)

    const query = { ...route.query }
    delete query.routerName
    router.replace({ query })
  }
})
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_royalslot88/assets/css/style.css";

.modal_share {
  .q-dialog__inner {
    margin: 0.5rem;
    @include pad-landscape {
      margin: 1.75rem 1.25rem;
    }
  }
}

.remove-dialog {
  background-color: #081c4c;
}

.inbox-detail-dialog {
  .msg-item {
    @apply grid-cols-2;
    .msg-l {
      word-wrap: break-word;
    }
  }
}
</style>
