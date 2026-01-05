<template>
  <div class="desktop-proxy-wrapper">
    <div class="desktop-proxy-content">
      <h2 class="proxy-title">{{ $t("menu.agentCollaborationStrategy") }}</h2>

      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="agent" :label="$t('menu.agentProgram')" />
          <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" />
        </q-tabs>
      </div>

      <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
        <q-tab-panel name="agent">
          <Agents />
        </q-tab-panel>

        <q-tab-panel name="domain">
          <Domain />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Agents from "./Components/Agents.vue"
import Domain from "./Components/Domain.vue"

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.desktop-proxy-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .desktop-proxy-content {
    padding: 3.75rem;
    background-color: $primary07;
    border-radius: 0.625rem;

    @include phone-width {
      padding: 1.25rem;
    }

    .proxy-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .proxy-tabs {
      @apply flex justify-between mt-10;

      @include phone-width {
        margin-top: 1.25rem;
      }

      :deep(.q-tab) {
        @apply w-auto capitalize;
        min-height: 2.25rem;
        padding: 0.625rem;
        margin-right: 0.625rem;
        background: $secondary02;
        border-radius: 0.625rem;
        color: $neutral01;

        @include phone-width {
          white-space: normal;
          word-break: break-word;
          max-width: 50%;
        }

        .q-tab__content {
          padding: 0;

          .q-tab__label {
            @include fontStyle();
          }
        }
      }

      :deep(.q-tab--active) {
        background: $neutral01;
        color: $primary04;
      }

      :deep(.q-tab__indicator) {
        display: none;
      }
    }

    .proxy-tab-panels {
      @apply mt-10 bg-transparent;

      @include phone-width {
        margin-top: 1.25rem;
      }

      :deep(.q-tab-panel) {
        @apply p-0;
      }
    }
  }
}
</style>
