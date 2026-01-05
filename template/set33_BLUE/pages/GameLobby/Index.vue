<template>
  <CarouselBanner />
  <div class="game-container">
    <div class="game-row">
      <div
        v-for="game in gameState.list"
        :key="game.game_id"
        class="game-item"
        @click="openGame(game.integration_id, game.product_code, game.game_code)"
      >
        <img
          :src="getGameImage(game)"
          :alt="game.game_code"
          class="w-full h-auto cursor-pointer rounded-lg"
          @error="setDefaultGameImg"
        />
        <q-btn class="btn-play">Play Now</q-btn>
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
import { useCommonImg } from "src/common/hooks/useCommonImg"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION } from "src/common/utils/constants"
import { watch, watchEffect, computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { handleBannerList } = useBanner()
const { gameTypeState, getGames, gameState, openGame, getGameImage } = useGame()
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

watchEffect(() => {
  if (gameTypeState.list.length && gameType.value) {
    getBanner()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.game-container
  @apply py-5 mx-auto box-border
  max-width: 85.375rem
  :deep(.carousel)
    .banner-item
      width: 100vw
  .game-row
    @apply grid grid-cols-7 gap-1
    background: linear-gradient(to right,#01233c 0%,#014b78 50%,#01233c 100%)
    border-radius: .9375rem
    border: 1px solid #046fa5
    padding: .625rem
    +pad-width
      @apply grid-cols-5
    +phone-width
      @apply grid-cols-4
    +iphone-width
      @apply grid-cols-2
    .game-item
      @apply w-full h-full relative cursor-pointer
      aspect-ratio: 1/1
      background: linear-gradient(to bottom, #014b78 0%, #01233c 100%)
      border-radius: .9375rem
      border: 1px solid #046fa5
      padding: .625rem
      &:before
        position: absolute
        bottom: 0
        left: 0
        right: 0
        top: 100%
        content: ''
        background-color: rgba(0, 0, 0, 0.8)
        -webkit-transition: all 0.25s ease
        transition: all 0.25s ease
        -webkit-transition-delay: 0.25s
        transition-delay: 0.25s
        border-radius: 1.875rem
      &:hover:before
        top:0
        transition-delay: inherit
        border-radius: 15px
        background-color: #0009
      &:hover
        .btn-play
          opacity: 1
          top: 50%
          transition-delay: 0.3s
      *
        -webkit-box-sizing: border-box
        box-sizing: border-box
        -webkit-transition: all 0.25s ease
        transition: all 0.25s ease
      .btn-play
        width: 7.5rem
        color: #fff
        padding: .625rem 0
        font-size: .875rem
        font-weight: 700
        text-transform: uppercase
        background: linear-gradient(to bottom, rgb(169, 211, 32) 0%, rgb(56, 131, 18) 100%)
        box-shadow: inset 0 0 .3125rem #fff
        border: none
        border-radius: 1.25rem
        position: absolute
        left:50%
        transform: translate(-50%, -50%)
        top: 30%
        opacity: 0
        transition-delay: inherit
</style>
