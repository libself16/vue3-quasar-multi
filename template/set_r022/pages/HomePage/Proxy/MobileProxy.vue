<template>
  <HeaderTitleBack variant="setR022" :title-i18n="titleText">
    <div class="desktop-proxy-wrapper">
      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="agent" :label="$t('menu.agentProgram')" />
          <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" />
        </q-tabs>
      </div>

      <q-tab-panels v-model="activeTab" class="proxy-tab-panels" :class="{ activeTab }">
        <q-tab-panel name="agent">
          <MobileAgent />
        </q-tab-panel>

        <q-tab-panel name="domain">
          <MobileDomainList />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { ref, computed } from "vue"
import MobileAgent from "./Components/MobileAgent.vue"
import MobileDomainList from "./Components/MobileDomainList.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { t } = useI18n()

const activeTab = ref("agent")

const titleText = computed(() => {
  return `${t("menu.agent")} ${t("menu.collaborationStrategy")}`
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.desktop-proxy-wrapper {
  width: 100%;

  .proxy-banner {
    @apply flex justify-center items-center w-full;
  }

  .proxy-tabs {
    background: var(--neutral-01);
    padding: 0.625rem 0.75rem;

    :deep(.q-tabs) {
      background: var(--primary-07);
      border-radius: 2rem;
      padding: 0.25rem 0.3125rem;
    }

    :deep(.q-tabs__content) {
      @apply flex-nowrap gap-3;
    }

    :deep(.q-tab) {
      height: 2.25rem;
      min-height: unset;
      padding: 0 2.90625rem;
      border-radius: 1.875rem;
      color: var(--primary-02);

      .q-tab__label {
        @apply text-xs font-normal;
      }
    }

    :deep(.q-tab--active) {
      background: var(--primary-01);
      color: var(--text-01);
    }

    :deep(.q-tab__indicator) {
      display: none;
    }
  }

  .proxy-tab-panels {
    padding: 0 0.75rem;
    margin-top: 1.375rem;
    background: transparent;

    &.domain {
      margin-top: 1.25rem;
    }

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
