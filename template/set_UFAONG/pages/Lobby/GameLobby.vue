<template>
  <div class="game-lobby-container">
    <div v-if="gameState.list.length > 0" class="game-lobby-wrapper">
      <div
        v-for="game in gameState.list"
        :key="game.game_id"
        class="game-item"
        @click="openGame(game.integration_id, game.product_code, game.game_code)"
      >
        <q-img
          :src="getGameImage(game)"
          :alt="game.game_code"
          class="w-full h-auto cursor-pointer rounded-lg"
          :error-src="gameDefaultImg"
          loading="lazy"
          fit="contain"
          position="50% 50%"
        />
        <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
      </div>
    </div>
    <div v-else class="flex w-full justify-center items-center pt-[20px] px-[10px]">
      <span class="no-data">{{ $t("tableHeader.noContent") }}</span>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect, computed, nextTick } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION } from "src/common/utils/constants"
import { useRoute } from "vue-router"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"

const route = useRoute()
const { handleBannerList } = useBanner()
const { initGameTypeList, gameTypeState, getGames, gameState, openGame, getGameImage } = useGame()
const { gameDefaultImg } = useCommonImg()

const gameType = computed(() => Number(route.params.gameType))
const productCode = computed(() => Number(route.params.productCode))
const integrationId = computed(() => Number(route.params.integrationId))

const getBanner = async () => {
  await handleBannerList(BANNER_POSITION.Enums.GameLobby, gameType.value)
}

const fetchGames = async (integrationValue: number, gameTypeValue: number, productCodeValue: number) => {
  await getGames(integrationValue, gameTypeValue, productCodeValue)
  await nextTick()
}

watch(
  () => route.params.gameType,
  () => {
    if (gameTypeState.list.length && integrationId.value && gameType.value && productCode.value) {
      fetchGames(integrationId.value, gameType.value, productCode.value)
    }
  }
)

watchEffect(() => {
  if (gameTypeState.list.length && integrationId.value && gameType.value && productCode.value) {
    fetchGames(integrationId.value, gameType.value, productCode.value)
  }
})

watchEffect(() => {
  if (gameTypeState.list.length && gameType.value) {
    getBanner()
  }
})

onMounted(() => {
  initGameTypeList()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "src/common/css/_variable.sass";

.game-lobby-container {
  @apply relative min-h-[100vh];
}

.game-lobby-wrapper {
  @apply grid grid-cols-4 gap-2 px-[10px] pt-[20px] pb-[90px];

  @include iphone-width {
    grid-template-columns: repeat(2, 1fr);
  }

  .game-item {
    @apply relative;
    border: 1px solid $primary;
    border-radius: 0.625rem;

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 100%;
      content: "";
      background-color: rgba(0, 0, 0, 0.8);
      -webkit-transition: all 0.25s ease;
      transition: all 0.25s ease;
      -webkit-transition-delay: 0.25s;
      transition-delay: 0.25s;
      border-radius: 1.875rem;
    }

    &:hover {
      &::before {
        top: 0;
        transition-delay: inherit;
        border-radius: 0.9375rem;
        background-color: #0009;
      }

      .btn-play {
        opacity: 1;
        top: 50%;
        transition-delay: 0.3s;
      }
    }

    .btn-play {
      @apply text-black opacity-0;
      width: 7.5rem;
      padding: 0.625rem 0;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      background: $gradient-to-bottom;
      box-shadow: inset 0 0 0.3125rem #fff;
      border: none;
      border-radius: 1.25rem;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      top: 30%;
      transition-delay: inherit;
    }
  }
}

.no-data {
  @apply w-full text-base p-4 text-center;
  border: 1px solid $primary;
  border-radius: 0.625rem;
}
</style>
