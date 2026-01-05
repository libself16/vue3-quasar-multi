<template>
  <div class="desktop-proxy-wrapper">
    <div class="proxy-content">
      <div class="content-title">
        <span class="agent">{{ $t("menu.agent") }}</span>
        <span class="ml-1">{{ $t("menu.collaborationStrategy") }}</span>
      </div>

      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="agent" :label="$t('menu.agentProgram')" />
          <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" />
        </q-tabs>
      </div>

      <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
        <q-tab-panel name="agent">
          <MobileAgent />
        </q-tab-panel>

        <q-tab-panel name="domain">
          <MobileDomainList />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import MobileAgent from "./Components/MobileAgent.vue"
import MobileDomainList from "./Components/MobileDomainList.vue"

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/button.scss";

.desktop-proxy-wrapper {
  @apply w-full px-3 pb-12;

  .proxy-banner {
    @apply flex justify-center items-center w-full;
  }

  .proxy-content {
    @apply mt-4;

    .content-title {
      @apply font-semibold text-base ml-1;
      font-size: 1.5rem;
      color: #fff;

      .agent {
        color: #fff;
      }
    }
  }

  .proxy-tabs {
    @apply flex mt-2;

    :deep(.q-tabs__content) {
      @apply flex-wrap gap-3;
    }

    :deep(.q-tab) {
      @apply rounded-[0.5rem];
      @apply w-auto h-auto min-h-0 px-[2.32rem] py-[.4688rem] capitalize;
      background: #083E31;
      color: #fff;

      .q-tab__label {
        @apply text-xs font-normal;
      }
    }

    :deep(.q-tab--active) {
      background: linear-gradient(to left, #1fc88f 0%, #f4ee70 100%);
      color: #0b5544;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }
  }

  .proxy-tab-panels {
    @apply bg-transparent mt-[1.375rem];

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
