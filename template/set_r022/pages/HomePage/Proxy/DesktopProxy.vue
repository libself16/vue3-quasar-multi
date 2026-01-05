<template>
  <div class="desktop-proxy-wrapper">
    <div class="top-area">
      <div class="agent-details">
        <span class="agent">{{ $t("menu.agent") }}</span>
        <span class="details">{{ $t("menu.collaborationStrategy") }}</span>
      </div>

      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="agent" :label="$t('menu.agentProgram')" />
          <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" />
        </q-tabs>
      </div>
    </div>

    <q-tab-panels v-model="activeTab" class="proxy-tab-panels" :class="activeTab">
      <q-tab-panel name="agent">
        <DesktopAgent />
      </q-tab-panel>

      <q-tab-panel name="domain">
        <DesktopDomainTable />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import DesktopAgent from "./Components/DesktopAgent.vue"
import DesktopDomainTable from "./Components/DesktopDomainTable.vue"

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.desktop-proxy-wrapper {
  width: 100%;
  max-width: 87.5rem;
  margin: 1.525rem auto 3.9375rem;

  @include pad-large-width {
    display: none;
  }

  .top-area {
    background: var(--neutral-01);
    font-weight: 400;
    padding: 1.3125rem 1.25rem;
    border-radius: 0.5rem;

    .agent-details {
      @apply text-[1.75rem];
      color: var(--secondary-01);
      font-size: 1.75rem;
      font-weight: bold;
      margin-bottom: 1.0625rem;
    }

    .proxy-tabs {
      background: var(--primary-07);
      display: inline-flex;
      border-radius: 2rem;
      padding: 0.25rem 0.3125rem;

      :deep(.q-tab) {
        height: 2.25rem;
        min-height: unset;
        padding: 0 2.90625rem;
        border-radius: 1.875rem;
        color: var(--primary-02);
      }

      :deep(.q-tab--active) {
        background: var(--primary-01);
        color: var(--text-01);
      }

      :deep(.q-tab__indicator) {
        display: none;
      }
    }
  }

  .proxy-tab-panels {
    margin-top: 2rem;
    background: transparent;

    &.domain {
      margin-top: 2.625rem;
    }

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
