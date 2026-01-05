<template>
  <CmsCustomPage
    id="cms-custom-page"
    class="w-full mx-auto min-h-[39.9375rem] phone:min-h-0 max-w-[77.5rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw] px-5 phone:px-4"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import CmsCustomPage from "src/common/components/CmsCustomPage/Index.vue"
import { useGlobalStore } from "src/stores/globalStore"

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.setBackRouteName("home")
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r017/assets/css/_variable.scss";

#cms-custom-page {
  :deep(#cms-custom-page-wrapper) {
    --slider-pagination-active: #{$primany01};
    --slider-carousel-bg: transparent;
    --slider-pagination-mobile-active: #{$primany01};
    --text-content: #{$neutral01};
    --game-entrance-item-bg: transparent;
    --game-entrance-img-bg: transparent;
    --game-entrance-text-color: #{$neutral01};

    .q-carousel {
      box-shadow: 0px 0px 30px 0px $secondary15;

      &.desktop,
      &.mobile {
        @apply rounded-[.25rem];
      }
    }

    .game-item,
    .product-item {
      @apply shadow-none;
    }
  }
}
</style>
