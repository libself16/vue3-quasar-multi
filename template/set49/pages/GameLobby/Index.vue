<template>
  <CarouselBanner />
  <!-- <MarqueeList /> -->
  <div class="game-container game-top">
    <div class="game-row">
      <div
        v-for="game in gameState.list"
        :key="game.game_id"
        class="game-item"
        @click="openGame(game.integration_id, game.product_code, game.game_code, '', true)"
      >
        <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
        <q-btn class="btn-play">
          <img :src="playBtnImg" alt="" />
        </q-btn>
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
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { BANNER_POSITION } from "src/common/utils/constants"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"

const route = useRoute()
const { handleBannerList } = useBanner()
const { gameTypeState, getGames, gameState, openGame, getGameImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { playBtnImg } = useSiteImg()

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
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.game-container
  @apply py-5 mx-auto box-border
  max-width: 85.375rem
  padding-top: 6rem
  +phone-width
    padding-top: 1.25rem
  .game-row
    @apply grid grid-cols-5 gap-5
    padding: .625rem
    +pad-width
      @apply grid-cols-5
    +phone-width
      @apply grid-cols-4
    +iphone-width
      @apply grid-cols-2
</style>
