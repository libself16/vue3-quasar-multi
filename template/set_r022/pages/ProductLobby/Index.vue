<template>
  <section class="product-lobby-wrapper">
    <MobileNavCMS v-if="isLargeTablet" />
    <GameBanner />
    <div class="lobby-container">
      <ul class="product-row">
        <li
          v-for="product in productState.list"
          :key="product.product_name"
          class="product-item"
          @click="checkProductClick(product)"
        >
          <div class="img-container">
            <img
              :src="getProductSquareImage({ ...product, siteKey: 'set_r022' })"
              :alt="product.product_name"
              class="product-img"
              @error="setDefaultProductImg"
            />
            <!-- PC版顯示 play button -->
            <div v-if="isDesk" class="play-btn-container">
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
    </div>
    <HomeRankBoard />
  </section>
</template>

<script lang="ts" setup>
import { computed, watchEffect, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { BANNER_POSITION, GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import GameBanner from "app/template/set_r022/components/Banner/GameBanner.vue"
import HomeRankBoard from "app/template/set_r022/pages/HomePage/Components/HomeRankBoard.vue"
import MobileNavCMS from "app/template/set_r022/components/MobileNavCMS/Index.vue"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { isLargeTablet, isDesk } = useMediaQuery()

function checkProductClick(product: (typeof productState.list)[number]) {
  handleProductClick(product.integration_id, product.product_code)
}

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

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.product-lobby-wrapper {
  @apply w-full mx-auto flex flex-col gap-[1.25rem];
  @apply max-w-[87.5rem] py-[1.875rem] px-[.625rem];

  @include pad-large-width {
    @apply py-4 gap-[.625rem];
  }

  .product-row {
    @apply grid grid-cols-8 padXl:grid-cols-5 phone:grid-cols-3;
    @apply gap-4 phone:gap-5 iphone:gap-2.5;
  }
}

.product-item {
  @apply relative cursor-pointer rounded-xl;
  background: var(--neutral-01);

  .img-container {
    @apply rounded-xl overflow-hidden relative;
  }

  &:hover {
    .play-btn-container {
      @apply opacity-100;
    }

    .product-img {
      transform: scale(1.1);
    }
  }
  .product-img {
    @apply w-full rounded-lg;
    aspect-ratio: 1/1;
    transition: all 0.3s ease;
    object-fit: contain;
    object-position: center;
  }

  .play-btn-container {
    @apply absolute w-full h-full top-0 left-0 flex justify-center items-center;
    @apply opacity-0;
    background: rgba(var(--black-01-rgb), 0.5);
    transition: all 0.3s ease;
  }
  .hide-hover {
    background: var(--primary-01);
  }
  .btn-play {
    color: var(--neutral-01);
  }
}

.title-container {
  @apply w-full;
  @apply flex justify-between items-center;
  @apply pb-3 px-2;
}

.product-name {
  @apply text-[13px] md:text-lg font-bold;
  @apply w-full text-left overflow-hidden whitespace-nowrap text-ellipsis;
  color: var(--secondary-01);
}
</style>
