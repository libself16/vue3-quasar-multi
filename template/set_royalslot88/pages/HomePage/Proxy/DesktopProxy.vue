<template>
  <div class="desktop-proxy-wrapper">
    <!-- <div class="proxy-banner">
      <q-img class="proxy-banner-image" fit="fill" loading="lazy" :src="proxyImg('banner.png')" />
    </div> -->

    <div class="proxy-main">
      <div class="content-title">
        <div class="agent-details text-white">
          <span>{{ $t("menu.agent") }}{{ $t("menu.collaborationStrategy") }}</span>
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
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import DesktopAgent from "./Components/DesktopAgent.vue"
import DesktopDomainTable from "./Components/DesktopDomainTable.vue"

const { proxyImg } = useSiteImg()

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.desktop-proxy-wrapper {
  @apply block w-[71.4375rem];
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
      color: #fff;
    }

    .agent-details {
      @apply text-[1.75rem];
      color: #fff;
    }

    .details {
      @apply font-semibold ml-1;
      color: #fff;
    }
  }

  .proxy-tabs {
    @apply flex justify-between mt-[2.0625rem];

    :deep(.q-tabs__content) {
      gap: 10px;

      .q-tab {
        font-weight: 700;
        min-height: 0;
        padding: 0.5rem 2rem;
        border-radius: 2rem;
        background: #148DA2;
        color: #fff;
        box-shadow: 0px -4px 4px 0px #00000066 inset;
        box-shadow: 0px 4px 4px 0px #FFFFFF4D inset;


        .q-tab__content {
          padding: 0;
        }
        .q-tab__label {
          @apply font-bold leading-none;
        }
      }

      .q-tab--active {
        background: #AA1E74;
        border: 1px solid #5831D7;

        color: #fff;

        .q-tab__indicator {
          @apply h-0;
        }
      }
    }

    // :deep(.q-tab) {
    //   @apply rounded-[1.5rem] mr-[1.25rem];
    //   @apply w-auto h-[3.125rem] px-[1.5rem] capitalize;
    //   border: 1px solid #fff;
    //   background: #fff;
    // }
  }

  .proxy-tab-panels {
    @apply bg-transparent mt-10;

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
