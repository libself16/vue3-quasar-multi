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
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_blue' })"
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
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_blue' })"
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
import GameBanner from "app/template/okbet_blue/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet_blue/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet_blue/components/Footer/Index.vue"
import MobileNav from "app/template/okbet_blue/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useQuasar } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const isMobile = $q.platform.is.mobile
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

watchEffect(() => {
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.GameOpen) {
    router.push({ name: "GameLobby", params: { gameType: gameTypeId.value } })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/button.scss";
@import "app/template/okbet_blue/assets/css/product.scss";

.product-container {
  // @include setFlex;
  @apply px-6 py-5;

  @include phone-width {
    @apply px-4 py-5;
  }

  &.pc {
    margin: 2rem 2rem 8rem 5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .product-row {
      @apply grid grid-cols-6 gap-4;

      @include pc-2xl-width {
        @apply grid-cols-5;
      }

      @include pc-xl-width {
        @apply grid-cols-4;
      }

      .title-container {
        @apply flex justify-center items-center;
      }

      .product-item {
        @apply w-full;
      }
    }
  }
  &.h5 {
    @apply pt-0;

    .product-row {
      @apply grid grid-cols-4 gap-4;
      @apply phone:grid-cols-3;
      @apply iphone:grid-cols-2;

      @include pc-lg-width {
        margin: 0 0.2rem;
      }

      @include phone-width {
        @apply grid-cols-3 gap-2 px-3;
      }

      .product-item {
        @apply w-full flex flex-col items-center justify-between;

        .img-container {
          @apply w-full h-auto pad:w-[14.125rem];
        }

        .product-name {
          @apply flex items-center justify-center;
          @apply w-full h-12 leading-[1];
          @apply p-4 pb-0 iphone:p-0 iphone:py-2;
          @apply padLg:text-xl iphone:text-base;
        }
      }
    }
  }
}
</style>
