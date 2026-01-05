<template>
  <div class="product-lobby">
    <CarouselBanner />
    <MenuTab :tabName="GAME_TYPE.FrontendKey[gameTypeId as GAME_TYPE.Enums]"></MenuTab>
    <div class="product-container">
      <ul class="product-row">
        <li
          v-for="product in productState.list"
          :key="product.product_name"
          class="product-item"
          @click="handleProductClick(product.integration_id, product.product_code)"
        >
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'set33_GREEN' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
          <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import MenuTab from "app/template/set33_GREEN/components/MenuTab/Index.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { watchEffect, computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { handleBannerList } = useBanner()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()

let gameTypeId = computed(() => {
  return Number(route.params.gameType)
})
async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameTypeId.value)
}

watchEffect(() => {
  if (gameTypeState.list.length && gameTypeId.value) {
    getProducts(gameTypeId.value)
    getBanner()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.product-container
  @apply pb-5 mx-auto box-border
  max-width: 85.375rem
  .product-row
    @apply grid grid-cols-3 gap-4
    +phone-width
      @apply grid-cols-2
    .product-item
      @apply list-none box-border relative
      aspect-ratio: 500/424
      .product-img
        @apply w-full h-auto cursor-pointer
        transition: all .6s ease-in-out
        &:hover
          transform: scale(1.1)
      .btn-play
        color: #fff
        position: absolute
        bottom: 13%
        left: 10%
        padding: .3125rem 1.25rem
        border-radius: .9375rem
        font-weight: 700
        text-transform: uppercase
        -webkit-transition: all .6s ease-in-out
        background: #de151a
        font-size: .75rem
        transition: all .6s ease-in-out
        +phone-width

          font-size: .5rem
        &:hover
          transform: scale(1.1)
</style>

<style lang="sass">
// 因 CarouselBanner.vue 為共用元件，故暫以跨層級樣式來調整跑版問題
.product-lobby
  .banner-container
    max-height: 31.25rem
</style>
