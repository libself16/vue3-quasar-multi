<template>
  <div class="lobby_wrap lobby_wrap_slot">
    <div class="lobby_body_wrap">
      <div class="slots_inner_lobby_wrap_scroll">
        <div class="slots_inner_lobby_wrap">
          <div v-for="game in gameState.list" :key="game.game_id" class="game_wrap">
            <a
              @click="openGame(game.integration_id, game.product_code, game.game_code, game.game_type_id, true)"
              class="cursor-pointer"
            >
              <img :src="getGameImage(game)" :alt="game.game_code" class="rounded-[5px]" @error="setDefaultGameImg" />
              <div class="game-preview__hover">
                <div class="game-preview__btn-play">{{ $t("game.play_now") }}</div>
              </div>
            </a>
            <div class="slots_lobbyname overflow-hidden whitespace-nowrap text-ellipsis">{{ game.game_name }}</div>
          </div>
        </div>
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
import { BANNER_POSITION } from "src/common/utils/constants"

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

onMounted(() => {
  getBanner()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.lobby_wrap {
  .slots_inner_lobby_wrap {
    @apply grid-cols-7;

    @include pad-portrait {
      @apply grid-cols-3;
    }
  }
}
</style>
