<template>
  <GameBanner />
  <div v-if="$q.platform.is.mobile" class="product-container h5">
    <MobileNav />
    <ul class="product-row">
      <li
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'bmm_set_obtd' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
        </div>
        <div class="product-name">{{ product.product_name }}</div>
      </li>
    </ul>
    <FooterNav />
  </div>
  <div v-else class="product-container pc">
    <ul class="product-row">
      <li v-for="product in productState.list" :key="product.product_name" class="product-item">
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'bmm_set_obtd' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
          <div class="play-btn-container">
            <q-btn
              class="btn-play hide-hover"
              @click="handleProductClick(product.integration_id, product.product_code)"
            >
              {{ $t("game.play_now") }}
            </q-btn>
          </div>
        </div>
        <div class="title-container">
          <span class="product-name">{{ product.product_name }}</span>
        </div>
      </li>
    </ul>
    <!-- 最新得獎跑馬燈 -->
    <RankBoard class="mx-auto my-8 rank-board" />
    <!-- 先隱藏 -->
    <!-- <FeatureSlot /> -->
  </div>
  <FooterArea v-if="!$q.platform.is.mobile" />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import GameBanner from "app/template/bmm_set_obtd/components/Banner/GameBanner.vue"
import RankBoard from "app/template/bmm_set_obtd/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/bmm_set_obtd/components/Footer/Index.vue"
import MobileNav from "app/template/bmm_set_obtd/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useQuasar } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { BANNER_POSITION, GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { computed, watchEffect, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { handleBannerList } = useBanner()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

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

watchEffect(() => {
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.GameOpen) {
    router.push({ name: "GameLobby", params: { gameType: gameTypeId.value } })
  }
})

onMounted(() => {
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.LobbyOpen) {
    handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.PRODUCT_LOBBY)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";
@import "app/template/bmm_set_obtd/assets/css/product.scss";

.product-container {
  // @include setFlex;
  &.pc {
    margin: 2rem 2rem 8rem 5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .product-row {
      @apply grid grid-cols-5 gap-5;
      @include pc-xl-width {
        @apply grid-cols-4;
      }
    }
  }
  &.h5 {
    .product-row {
      @apply flex flex-wrap pb-24;
      @include iphone-width {
        @apply grid grid-cols-3 gap-2 px-3;
        margin: 0 0.2rem;
        // padding: 0.3125rem 0.75rem;
        // gap: 1rem 1rem;
      }
    }
  }
}
</style>
