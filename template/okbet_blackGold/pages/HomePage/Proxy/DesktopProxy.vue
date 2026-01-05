<template>
  <div class="desktop-proxy-wrapper">
    <!-- <div class="proxy-banner">
      <q-img class="proxy-banner-image" fit="fill" loading="lazy" :src="proxyImg('banner.png')" />
    </div> -->

    <div class="proxy-main">
      <div class="content-title">
        <div class="interesting">{{ $t("menu.interesting") }}</div>
        <div class="agent-details">
          <span class="agent">{{ $t("menu.agent") }}</span>
          <span class="details">{{ $t("menu.collaborationStrategy") }}</span>
        </div>
      </div>

      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="agent" :label="$t('menu.agentProgram')" />
          <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" />
        </q-tabs>
      </div>

      <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
        <q-tab-panel name="agent">
          <DesktopAgent />
        </q-tab-panel>

        <q-tab-panel name="domain">
          <DesktopDomainTable />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import DesktopAgent from "./Components/DesktopAgent.vue"
import DesktopDomainTable from "./Components/DesktopDomainTable.vue"

const { proxyImg } = useSiteImg()

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

.desktop-proxy-wrapper {
  @apply block max-w-[71.4375rem];
  margin: 1.25rem auto 2.5rem auto;

  @include phone-width {
    display: none;
  }

  .proxy-banner {
    @apply flex justify-center items-center w-full pt-[3.75rem];
  }

  .proxy-main {
    @apply mt-5;

    .content-title {
      @apply font-extrabold;
    }

    .interesting {
      @apply text-[.75rem] uppercase;
      color: $secondary-gold-color;
    }

    .agent-details {
      @apply text-[1.75rem];
      color: $secondary-gold-color;
    }

    .details {
      @apply font-semibold ml-1;
      color: $primary-white-color;
    }
  }

  .proxy-tabs {
    @apply flex justify-between mt-[2.0625rem];

    :deep(.q-tab) {
      @apply rounded-[1.5rem] mr-[1.25rem];
      @apply w-auto h-[3.125rem] px-[1.5rem] capitalize;
      background: $primary-black-color;
      color: $primary-white-color;
    }

    :deep(.q-tab--active) {
      background: $primary-gradient-color;
      color: $primary-text-black;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }
  }

  .proxy-tab-panels {
    @apply bg-transparent mt-10;

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
