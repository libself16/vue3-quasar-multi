<template>
  <div class="proxy-wrapper">
    <img :src="proxyImg('banner.png')" class="w-full mb-5" />

    <h2 class="proxy-title">{{ $t("menu.agentCollaborationStrategy") }}</h2>

    <div class="proxy-tabs">
      <q-tabs v-model="activeTab" align="left">
        <q-tab name="agent" :label="$t('menu.agentProgram')" />
        <q-tab name="domain" :label="$t('menu.domainPromotionManagement')" disable />
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
  <FooterArea />
</template>

<script setup lang="ts">
import { ref } from "vue"
import Agents from "./Components/Agents.vue"
import Domain from "./Components/Domain.vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import FooterArea from "app/template/set_r017/components/Footer/Index.vue"

const { proxyImg } = useSiteImg()

const activeTab = ref("agent")
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.proxy-wrapper {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2.25rem 0 9.4375rem;

  @include phone-width {
    margin: 0;
    padding: 0.875rem;
  }

  .proxy-title {
    font-family: OpenSans;
    font-weight: 600;
    font-size: 1.75rem;
    line-height: 2.375rem;
    color: $neutral01;
  }

  .proxy-tabs {
    @apply mt-5 inline-block;
    border-radius: 3.125rem;
    padding: 0.375rem;
    background-color: $secondary06;

    :deep(.q-tab) {
      @apply w-auto capitalize;
      padding: 0.9375rem 1.25rem;
      border-radius: 3.125rem;
      color: $neutral01;

      &:first-child {
        margin-right: 0.75rem;
      }

      @include phone-width {
        white-space: normal;
        word-break: break-word;
      }

      .q-tab__content {
        padding: 0;

        .q-tab__label {
          font-family: NotoSans;
          font-weight: 700;
          font-size: 0.9375rem;
          line-height: 1.25rem;
        }
      }
    }

    :deep(.q-tab--active) {
      background: $gradient01;
      color: #f2f2f2;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }
  }

  .proxy-tab-panels {
    @apply mt-4 bg-transparent;

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
