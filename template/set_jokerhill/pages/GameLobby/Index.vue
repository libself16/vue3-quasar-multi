<template>
  <CommonCarouselBanner v-if="isMobile" />
  <CarouselBanner v-else />
  <!-- <MarqueeList /> -->
  <div class="game-container game-top">
    <div class="game-row" v-if="filterGameList.length > 0">
      <div
        v-for="game in filterGameList"
        :key="game.game_id"
        class="game-item"
        @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
      >
        <img
          :src="getGameImage(game)"
          :alt="game.game_code"
          class="game-img"
          loading="lazy"
          @error="setDefaultGameImg"
        />
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
import { useWindowSize } from "@vueuse/core"
import CarouselBanner from "app/template/set_jokerhill/components/CarouselBanner.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import CommonCarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useSearchGame } from "src/common/composables/useSearchGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { BANNER_POSITION } from "src/common/utils/constants"
import { computed, onMounted, ref, watch, watchEffect } from "vue"
import { useRoute } from "vue-router"

let isMobile = ref(false)
const { width } = useWindowSize()
const route = useRoute()
const { handleBannerList } = useBanner()
const { gameTypeState, getGames, gameState, openGame, getGameImage } = useGame()
const { filterGameList } = useSearchGame()
const { playBtnImg } = useSiteImg()
const { getGametImg, setDefaultGameImg } = useCommonImg()

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

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
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
  padding-top: 1.25rem
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
