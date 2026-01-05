<template>
  <GameBanner />
  <div class="product-lobby-wrapper">
    <div class="game-tab scrollX">
      <GameTab />
    </div>
    <ul class="product-list">
      <li
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <q-img
            :src="getProductSquareImage({ ...product, siteKey: 'set_r017' })"
            :error-src="productDefaultImg"
            :alt="product.product_name"
            class="product-img"
          />
          <div v-if="isDesktop" class="play-btn-container" @click.stop="">
            <q-btn class="btn-play" @click="handleProductClick(product.integration_id, product.product_code)">
              {{ $t("game.play_now") }}
            </q-btn>
          </div>
        </div>
      </li>
    </ul>
    <!-- 最新得獎跑馬燈 -->
    <RankBoard class="rank-board" />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import GameBanner from "app/template/set_r017/components/Banner/GameBanner.vue"
import GameTab from "app/template/set_r017/components/Tab/GameTab.vue"
import RankBoard from "app/template/set_r017/components/Carousel/RankBoard.vue"

const route = useRoute()
const router = useRouter()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { productDefaultImg } = useCommonImg()
const { isDesktop } = useMediaQuery()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

let gameTypeId = computed(() => {
  return Number(route.params.gameType)
})

watchEffect(() => {
  if (gameTypeState.list.length && gameTypeId.value) {
    getProducts(gameTypeId.value)
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
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/product.scss";
@import "app/template/set_r017/assets/css/common.scss";

.product-lobby-wrapper {
  width: 70vw;
  height: auto;
  max-width: 75rem;
  margin: 1.5rem auto 1.5rem;
  @include phone-width {
    width: 90%;
  }
  // display: flex;
  // flex-direction: column;
  .game-tab {
    margin: 0 auto;
  }

  .product-list {
    @apply grid grid-cols-5 gap-2 my-6;

    @include phone-width {
      @apply grid-cols-3 gap-3 px-[.875rem];
      margin-bottom: 2.5625rem;
    }

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .rank-board {
    padding: 1.5rem auto 1.5rem;
  }
}
</style>
