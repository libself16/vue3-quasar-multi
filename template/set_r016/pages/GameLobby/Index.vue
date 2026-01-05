<template>
  <CarouselBanner />
  <div class="game-container">
    <BackBtn />
    <div class="game-row">
      <div v-for="game in gameState.list" :key="game.game_id" class="text-center">
        <div class="game-item" @click="openGame(game.integration_id, game.product_code, game.game_code, '', true)">
          <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
          <!-- <q-btn class="btn-play">
            <img :src="playBtnImg" alt="" />
          </q-btn> -->
          <q-btn
            v-if="gameState.favoriteMap[game.game_id]"
            class="btn-favorite hide-hover"
            round
            flat
            @click.stop="removefavoriteGame(game, true)"
          >
            <img :src="svgIcon('heart-btn-active')" alt="" />
          </q-btn>
          <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addfavoriteGame(game, true)">
            <img :src="svgIcon('heart-btn')" alt="" />
          </q-btn>
          <img
            v-if="(game.hot === 1 && game.newly === 1) || (game.hot === 1 && game.newly === 0)"
            :src="hotTagImg"
            class="hot-tag"
          />
          <img v-else-if="game.hot === 0 && game.newly === 1" :src="newTagImg" class="hot-tag" />
        </div>
        <div class="mt-1.5">{{ game.game_name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { onMounted, watch, watchEffect, computed } from "vue"
import { useRoute } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { BANNER_POSITION } from "src/common/utils/constants"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"

const route = useRoute()
const { handleBannerList } = useBanner()
const {
  gameTypeState,
  getGames,
  gameState,
  openGame,
  getGameImage,
  addfavoriteGame,
  removefavoriteGame,
  getFavoriteGames
} = useGame()
const { playBtnImg, svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { setDefaultGameImg } = useCommonImg()

const gameType = computed(() => {
  return Number(route.params.gameType)
})
const productCode = computed(() => {
  return Number(route.params.productCode)
})
const integrationId = computed(() => {
  return Number(route.params.integrationId)
})

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.GameLobby, gameType.value)
}

watch(
  () => route.params.gameType,
  () => {
    if (gameTypeState.list.length && integrationId.value && gameType.value && productCode.value) {
      getGames(integrationId.value, gameType.value, productCode.value)
    }
  }
)

watchEffect(() => {
  if (gameTypeState.list.length && integrationId.value && gameType.value && productCode.value) {
    getGames(integrationId.value, gameType.value, productCode.value)
  }
})

onMounted(() => {
  getBanner()
  getFavoriteGames()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../assets/css/game.sass";

.game-container {
  @apply my-5 mx-auto box-border;
  max-width: 85.375rem;

  .game-row {
    @apply grid grid-cols-5 gap-5 mt-10;
    @include pad-width {
      @apply grid-cols-5;
    }
    @include phone-width {
      @apply grid-cols-4;
    }
    @include iphone-width {
      @apply grid-cols-2;
      margin-top: 1.25rem;
    }

    .game-item {
      height: auto;
      cursor: pointer;
    }
  }
}

.hot-tag {
  position: absolute;
  left: -2%;
  top: 5%;
  z-index: 1000;
  width: 71px;
  height: 50px;
  @media (max-width: 767px) {
    width: 50px;
    height: 35px;
    top: 3%;
  }
}
</style>
