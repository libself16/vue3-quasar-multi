<template>
  <div class="product-lobby-layout">
    <div class="product-lobby-content">
      <CarouselItems v-if="slides.length" :itemToShow="5" :slides="slides" />
    </div>
  </div>
</template>
<script setup>
import { computed, watchEffect } from "vue"
import { useRoute } from "vue-router"

import { useGame } from "src/common/composables/useGame"
import CarouselItems from "app/template/set_royalslot88/components/CarouselItems.vue"

const route = useRoute()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()

let gameTypeId = computed(() => {
  return Number(route.params.gameType)
})

const slides = computed(() => {
  return productState.list.map((product) => {
    return {
      img: getProductSquareImage({ ...product, siteKey: "set_royalslot88", imgType: "gif" }),
      onSlideClick: () => {
        handleProductClick(product.integration_id, product.product_code, true)
      }
    }
  })
})

watchEffect(() => {
  if (gameTypeState.list.length && gameTypeId.value) {
    getProducts(gameTypeId.value)
  }
})
</script>

<style lang="scss" scoped>
.product-lobby-layout {
  @apply w-full h-[100dvh];
  @apply flex flex-col items-center justify-center;
  .product-lobby-content {
    @apply w-full;
  }
}
</style>
