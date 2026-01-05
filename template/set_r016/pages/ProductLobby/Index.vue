<template>
  <CarouselBanner />
  <!-- <MarqueeList /> -->
  <div class="p-5 flex justify-between items-center text-white product_top">
    <div class="text-lg cursor-pointer" @click="router.push({ name: 'home' })">
      <q-icon name="chevron_left" />
      {{ $t("menu.home") }}
    </div>
    <div v-if="isLogin">
      <WalletDropdown />
    </div>
  </div>
  <div class="product-container">
    <ul class="product-row">
      <li
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code, true)"
      >
        <img
          :src="getProductSquareImage({ ...product, siteKey: 'set_r016' })"
          :alt="product.product_name"
          class="product-img"
          @error="setDefaultProductImg"
        />
        <q-btn class="btn-play">{{ $t("game.play_now") }} ></q-btn>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import WalletDropdown from "app/template/set_r016/components/WalletDropdown.vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { BANNER_POSITION } from "src/common/utils/constants"
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useSiteImg()
const { isLogin } = useAuth()

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
@import 'app/template/set_r016/assets/css/menu.sass'
@import 'app/template/set_r016/assets/css/style.sass'
@import 'app/template/set_r016/assets/css/_variable.scss'
.product_top
  padding-top: 6rem
  +phone-width
    padding-top: 1.25rem
.product-container
  @apply p-5 mx-auto box-border
  max-width: 85.375rem
  .product-row
    @apply grid grid-cols-3 gap-4
    +phone-width
      @apply grid-cols-1
    .product-item
      @apply list-none box-border relative
      aspect-ratio: 500/215
      .product-img
        @apply w-full h-auto cursor-pointer
        transition: all .6s ease-in-out
        &:hover
          // transform: scale(1.1)
      .btn-play
        color: #fff
        position: absolute
        bottom: 13%
        left: 10%
        padding: .3125rem 1.25rem
        border-radius: .9375rem
        font-weight: 700
        text-transform: none
        -webkit-transition: all .6s ease-in-out
        background: $primary-btn-bg
        font-size: .75rem
        transition: all .6s ease-in-out
        letter-spacing: .04rem
        +iphone-width
          padding: .3125rem .9rem
          font-size: .7rem
        &:hover
          // transform: scale(1.1)
</style>
