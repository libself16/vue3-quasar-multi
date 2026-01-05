<template>
  <div
    v-drag-scroll="isVertical ? 'vertical' : 'horizontal'"
    class="providers-scroll-area"
    :class="{ vertical: isVertical }"
  >
    <div class="providers-container" :class="{ vertical: isVertical }">
      <div
        v-for="(product, key) in productState.list"
        :key="key"
        :name="product.product_code"
        class="tab-item"
        :class="{ active: productCode === product.product_code }"
        @click="handleTabClick(integrationId, product.product_code)"
      >
        <img
          :src="getProductTabImage({ ...product, siteKey: 'set_r022' })"
          class="tab-image"
          :alt="product.product_name"
          @error="setDefaultProductTabImg"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { SearchGameKey } from "app/template/set_r022/utils/constants/symbols"
import { vDragScroll } from "src/common/directives/dragScroll"

const { productState, getProductTabImage } = useGame()
const { setDefaultProductTabImg } = useSiteImg()
const searchGame = inject(SearchGameKey)

defineProps({
  isVertical: {
    type: Boolean,
    default: false
  }
})

if (!searchGame) {
  throw new Error("searchGame is not provided")
}
const { integrationId, productCode, handleTabClick } = searchGame
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.providers-scroll-area {
  @apply w-full overflow-x-auto overflow-y-hidden;
  height: auto;

  &.vertical {
    @apply w-[3.75rem] flex-shrink-0 overflow-x-hidden overflow-y-auto;
    height: 100%;
  }

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.providers-container {
  @apply flex flex-nowrap items-center gap-[.375rem];

  &.vertical {
    @apply flex-col w-[3.75rem] flex-shrink-0;

    .tab-item {
      background: var(--neutral-01);

      &.active {
        border-radius: 0.5rem;
        background: var(--primary-01);
      }
    }

    .tab-image {
      @apply min-w-[3.125rem] max-h-[1.75rem] object-cover;
    }
  }

  .tab-item {
    @apply flex items-center justify-center px-[.3125rem] py-[.625rem];
    @apply cursor-pointer;
    transition: all 0.3s ease;
    border: 1.28px solid transparent;

    &.active {
      @apply rounded-full;
      border-color: var(--primary-01);
      background: linear-gradient(180deg, var(--primary-07) 0%, var(--primary-06) 100%);
    }
  }

  .tab-image {
    @apply min-w-[5rem] max-h-[1.75rem] object-cover;
  }
}
</style>
