<template>
  <div class="game-container">
    <h2 class="title">{{ $t("home.popularGames") }}</h2>
    <q-separator />
    <div class="game-row">
      <div
        v-for="game in gameState.allGameList.POPULAR"
        :key="game.game_code"
        class="game-item"
        @click="
          openGame(
            game.product_code,
            game.game_code,
            gameTypeState.map[game.game_type as number].game_type,
            false,
            null,
            LANGUAGE_CODE.Enums.en
          )
        "
      >
        <img
          :src="getGametImg( game.game_type as number,game.product_code,game.game_code)"
          :alt="game.game_code"
          class="w-full h-auto rounded-lg cursor-pointer"
          @error="setDefaultGameImg"
        />
        <p class="game-name">{{ game.game_name }}</p>
        <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
        <q-btn
          v-if="gameState.favoriteMap[game.game_id]"
          class="btn-favorite hide-hover"
          round
          flat
          @click.stop="removefavoriteGame(game, true)"
        >
          <img :src="iconHeart('heart-btn-active')" alt="" />
        </q-btn>
        <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addfavoriteGame(game, true)">
          <img :src="iconHeart('heart-btn')" alt="" />
        </q-btn>
      </div>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>
<script lang="ts">
export default {
  name: "PopularLobby"
}
</script>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { LANGUAGE_CODE } from "src/common/utils/constants"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"

const { gameTypeState, gameState, openGame, getAllGames, removefavoriteGame, addfavoriteGame, getFavoriteGames } =
  useGame()
const { iconHeart } = useSiteImg()
const { getGametImg, setDefaultGameImg } = useCommonImg()

onMounted(async () => {
  if (!gameState.allGameList.POPULAR.length) {
    await getAllGames()
  }
  getFavoriteGames()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.game-container
  @apply px-10 pt-5 mx-auto box-border
  max-width: 95rem
  padding-bottom: 7rem
  +iphone-width
    padding-bottom: 5rem
  +pad-width
    @apply px-5
  .title
    @apply mt-6 text-center
    font-size: 2.25rem
    +pad-width
      font-size: 2.25rem
    +phone-width
      @apply mt-2
  .q-separator
    @apply mt-5 mb-10
    background: #5b5b5c
    +phone-width
      @apply mt-2 mb-4
  .game-row
    @apply grid grid-cols-8 gap-4
    +pc-width
      @apply grid-cols-6
    +pad-width
      @apply grid-cols-4
    +phone-width
      @apply grid-cols-3

.game-item
  .btn-favorite
    position: absolute
    top: 0.4rem
    right: 0.4rem
    display: block
    +iphone-width
      display: block
  &:hover
    .btn-favorite
      :deep(.q-focus-helper)
        opacity: 0
        background: transparent
</style>
