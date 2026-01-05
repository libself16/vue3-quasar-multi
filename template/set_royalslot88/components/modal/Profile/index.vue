<template>
  <ModalBase v-model="modalShow" max-width="56.25rem" height="calc(100vh - 100px)">
    <div class="profile-wrapper">
      <ul class="profile-tab">
        <li
          v-for="profile in profileTab"
          :key="profile.label"
          :class="{ active: activeTab === profile.link }"
          @click="changeTab(profile.link as TabLink)"
          class="nav-link"
        >
          {{ $t(profile.label) }}
        </li>
      </ul>
      <transition name="fade" mode="out-in">
        <div :key="activeTab">
          <component :is="tabComponents[activeTab]" />
        </div>
      </transition>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModalBase from "../modalBase.vue"
import ProfileForm from "../../Form/ProfileForm.vue"
import BankDetail from "./BankDetail.vue"

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

type TabLink = "profile" | "bankDetail"

const activeTab = ref<TabLink>("profile")

const profileTab = ref([
  {
    label: "menu.profile",
    link: "profile"
  },
  {
    label: "menu.bankDetail",
    link: "bankDetail"
  }
])

const tabComponents: Record<TabLink, typeof ProfileForm> = {
  profile: ProfileForm,
  bankDetail: BankDetail
}

const changeTab = (newTab: TabLink) => {
  activeTab.value = newTab
}

onMounted(() => {
  eventbus.on("openProfile", (show: boolean) => {
    modalShow.value = show
    activeTab.value = "profile"
  })
  eventbus.on("openBankDetail", (show: boolean) => {
    modalShow.value = show
    activeTab.value = "bankDetail"
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../../assets/css/btn.scss";

.profile-wrapper {
  @apply grid gap-[1.25rem];
  grid-template-columns: 22% auto;

  @include pad-portrait {
    grid-template-columns: auto;
  }
}

.profile-tab {
  @apply flex flex-col gap-[.625rem];

  @include pad-portrait {
    @apply grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
