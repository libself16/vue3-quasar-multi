<template>
  <div class="game-container">
    <h2 class="title">{{ $t("home.favourite") }}</h2>
    <div class="search-area">
      <GameKeywordSearch
        v-model="searchState.keyword"
        v-model:is-focus="searchState.isFocus"
        class="search-container"
      />
    </div>
    <q-separator />
    <div class="game-row">
      <div
        v-for="(game, index) in filterGameList"
        :key="`${game.game_code}-${index}`"
        class="game-item"
        @click="openGame(game.product_code, game.game_code)"
      >
        <img
          :src="getGametImg(getEnumValue(game.game_type.toString()), game.product_code, game.game_code)"
          :alt="game.game_code"
          class="w-full h-auto rounded-lg cursor-pointer"
          loading="lazy"
          @error="setDefaultGameImg"
        />
        <p class="game-name">{{ game.game_name }}</p>
        <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
        <q-btn class="btn-favorite hide-hover" round flat @click.stop="handleRemoveFavouriteGame(game)">
          <img :src="iconHeart('heart-btn-active')" alt="" />
        </q-btn>
      </div>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGame } from "src/common/composables/useGame"
import { useSearchGame } from "src/common/composables/useSearchGame"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GameKeywordSearch from "./components/GameKeywordSearch.vue"
import { LANGUAGE_CODE } from "src/common/utils/constants"
import * as GameType from "src/common/utils/constants/gameType"
import type * as Response from "src/api/response.type"

const router = useRouter()
const { getFavouriteGamesList, openGame, removefavoriteGame, gameState } = useGame()
const { iconHeart } = useSiteImg()
const { getGametImg, setDefaultGameImg } = useCommonImg()
const { searchState, filterGameList } = useSearchGame()

function getEnumValue(type: string): number {
  return GameType.Enums[type as keyof typeof GameType.Enums]
}

const handleRemoveFavouriteGame = async (game: Response.GameItem) => {
  await removefavoriteGame(game, true)
  await getFavouriteGamesList()
}

onMounted(async () => {
  await getFavouriteGamesList()

  router.replace({
    query: { keyword: searchState.keyword }
  })
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
  .search-area
    +iphone-width
      width: 100%
      position: relative
    .search-container
      position: absolute
      right: 3.5rem
      top: 3rem
      +iphone-width
        right: 0
        width: 100%
        margin: 0 auto
        top: 0
        margin-top: 2rem
      @media (min-width: 1600px)
        right: 6.5rem
      @media (min-width: 1700px)
        right: 8.5rem
      @media (min-width: 1800px)
        right: 11.5rem
      @media (min-width: 1900px)
        right: 15.5rem
      @media (min-width: 2560px)
        right: 35.5rem
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
      margin-top: 6rem

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
