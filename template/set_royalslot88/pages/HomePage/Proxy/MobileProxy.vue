<template>
  <div class="desktop-proxy-wrapper">
    <!-- <div class="proxy-banner">
      <q-img class="proxy-banner-image" fit="fill" loading="lazy" :src="proxyImg('banner.png')" />
    </div> -->

    <div class="proxy-content">
      <div class="content-title">
        <span class="text-white text-xl">{{ $t("menu.agent") }}{{ $t("menu.collaborationStrategy") }}</span>
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
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import MobileAgent from "./Components/MobileAgent.vue"
import MobileDomainList from "./Components/MobileDomainList.vue"

const { proxyImg } = useSiteImg()

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.desktop-proxy-wrapper {
  @apply w-full px-3 pb-12;

  .proxy-banner {
    @apply flex justify-center items-center w-full;
  }

  .proxy-content {
    @apply mt-1;

    .content-title {
      @apply font-semibold text-base ml-1;
      color: #fff;
    }
  }


  .proxy-tabs {
    @apply flex justify-between mt-4;

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
  }

  .proxy-tab-panels {
    @apply bg-transparent mt-[1.375rem];

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
