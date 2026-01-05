<template>
  <ModalBase v-model="modalShow" max-width="56.25rem" height="calc(100vh - 100px)">
    <section class="dep_wrap">
      <ul class="nav nav-tabs deposit-tab flex">
        <li v-for="tab in tabList" :key="tab.label" class="nav-item" @click="changeTab(tab.link as TabLink)">
          <button class="nav-link whitespace-nowrap" :class="{ active: activeTab === tab.link }">
            {{ $t(tab.label) }}
          </button>
        </li>
      </ul>
      <transition name="fade" mode="out-in">
        <div :key="activeTab">
          <component :is="tabComponents[activeTab]" />
        </div>
      </transition>
    </section>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModalBase from "../modalBase.vue"
import Deposit from "./Deposit.vue"
import Withdrawal from "./Withdrawal.vue"
import Order from "./Order.vue"

type TabLink = "Deposit" | "Withdrawal" | "Order"

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const activeTab = ref<TabLink>("Deposit")

const tabList = ref([
  {
    label: "menu.deposit",
    link: "Deposit"
  },
  {
    label: "menu.withdrawal",
    link: "Withdrawal"
  },
  {
    label: "menu.pendingTransaction",
    link: "Order"
  }
])

const tabComponents: Record<TabLink, typeof Deposit> = {
  Deposit,
  Withdrawal,
  Order
}

const changeTab = (newTab: TabLink) => {
  activeTab.value = newTab
}

onMounted(() => {
  eventbus.on("openDeposit", (show: boolean) => {
    modalShow.value = show
    if (show) {
      activeTab.value = "Deposit"
    }
  })
  eventbus.on("openWithdraw", (show: boolean) => {
    modalShow.value = show
    if (show) {
      activeTab.value = "Withdrawal"
    }
  })
  eventbus.on("openOrder", (show: boolean) => {
    modalShow.value = show
    if (show) {
      activeTab.value = "Order"
    }
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/set_royalslot88/assets/css/deposit.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
