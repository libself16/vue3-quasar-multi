<template>
  <GameBanner />

  <div v-if="isMobile" class="product-container h5">
    <MobileNav :isNeedPaddingX="false" />

    <ul class="product-row">
      <li
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_green' })"
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
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_green' })"
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

  <FooterArea v-if="!isMobile" />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import GameBanner from "app/template/okbet_green/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet_green/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet_green/components/Footer/Index.vue"
import MobileNav from "app/template/okbet_green/components/MobileNav.vue"
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
const isMobile = $q.platform.is.mobile
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
@import "app/template/okbet_green/assets/css/button.scss";
@import "app/template/okbet_green/assets/css/product.scss";

.product-container {
  // @include setFlex;
  @apply px-6 py-5;

  @include phone-width {
    @apply p-4;
  }

  .product-row {
    @apply grid grid-cols-6 padXl:grid-cols-5 phone:grid-cols-3 gap-5 iphone:gap-2.5;
  }

  &.pc {
    margin: 2rem 2rem 8rem 5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .product-row {
      .title-container {
        @apply flex justify-center items-start;
        @apply px-2 pt-1.5 pb-4;
      }

      .product-item {
        @apply w-full;
      }

      .product-name {
        @apply text-base font-bold;
      }
    }
  }
  &.h5 {
    @apply pt-0;
    .product-row {
      @include pc-lg-width {
        margin: 0 0.2rem;
      }

      .product-item {
        @apply w-full flex flex-col items-center justify-between;

        .img-container {
          @apply w-full h-auto;
        }

        .product-name {
          @apply w-full h-auto flex items-center justify-start;
          @apply px-2 pt-1.5 pb-4 iphone:px-3 iphone:py-1.5 iphone:px-1 iphone:pt-0.5 iphone:pb-2;
          @apply font-bold text-base iphone:text-sm iphone:leading-[19px];
        }
      }
    }
  }
}
</style>
