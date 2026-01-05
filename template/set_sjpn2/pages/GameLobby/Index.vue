<template>
  <div class="game-container">
    <h2 class="title">{{ $t(GAME_TYPE.I18nKeys[gameType as GAME_TYPE.Enums]) }}</h2>
    <q-separator />
    <div class="sub-menu-bar">
      <q-tabs v-model="productCode" inline-label outside-arrows @update:model-value="handleTabClick">
        <q-tab v-for="(product, key) in productState.list" :key="key" :name="product.product_code">
          <img
            :src="getProductTabImage({ ...product, siteKey: 'set_sjpn2' })"
            class="tab-img"
            :alt="product.product_name"
            @error="setDefaultProductTabImg"
          />
        </q-tab>
      </q-tabs>
      <game-keyword-search
        v-model="searchState.keyword"
        v-model:is-focus="searchState.isFocus"
        class="search-container"
      />
    </div>
    <div class="game-row">
      <div
        v-for="(game, index) in filterGameList"
        :key="`${game.game_code}-${index}`"
        class="game-item"
        @click="openGame(game.product_code, game.game_code)"
      >
        <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
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
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { onMounted, watchEffect, computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGame } from "src/common/composables/useGame"
import { useSearchGame } from "src/common/composables/useSearchGame"
import { GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GameKeywordSearch from "app/template/set_sjpn2/components/GameKeywordSearch.vue"

const route = useRoute()
const router = useRouter()
const {
  gameTypeState,
  getGames,
  productState,
  getProducts,
  openGame,
  removefavoriteGame,
  gameState,
  addfavoriteGame,
  getFavoriteGames,
  getGameImage,
  getProductTabImage
} = useGame()
const { setDefaultGameImg } = useCommonImg()
const { setDefaultProductTabImg, iconHeart } = useSiteImg()
const { searchState, filterGameList } = useSearchGame()

const gameType = computed(() => {
  return Number(route.params.gameType)
})

const productCode = ref(0)

function handleTabClick(productId: number) {
  productCode.value = productId
  router.replace({
    params: { gameType: gameType.value, productCode: productId },
    query: { keyword: searchState.keyword }
  })
}

function handleTabsMouse() {
  const tabsContent = document.querySelector(".q-tabs__content") as HTMLElement
  let isMouseDown = false
  let startX = 0

  if (tabsContent) {
    tabsContent.addEventListener("mousedown", (e) => {
      e.preventDefault()
      isMouseDown = true
      startX = e.clientX
    })

    tabsContent.addEventListener("mouseup", (e) => {
      e.preventDefault()
      isMouseDown = false
    })

    tabsContent.addEventListener("mousemove", (e) => {
      if (isMouseDown) {
        if (tabsContent) {
          if (startX > e.clientX) {
            tabsContent.scrollLeft += 20
          } else {
            tabsContent.scrollLeft -= 20
          }
          startX = e.clientX
        }
      }
    })

    tabsContent.addEventListener("mouseleave", () => {
      isMouseDown = false
    })
  }
}

watchEffect(() => {
  if (gameTypeState.list.length && gameType.value && productCode.value) {
    getGames(gameType.value, productCode.value)
  }
})

onMounted(async () => {
  await getProducts(gameType.value)
  await getFavoriteGames()
  handleTabsMouse()

  const routeProductCode = Number(route.params.productCode)
  if (routeProductCode) {
    productCode.value = routeProductCode
    return
  }

  if (productState.list.length) {
    handleTabClick(productState.list[0].product_code)
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.sub-menu-bar
  @apply flex justify-between items-center relative
  margin-bottom: 4.125rem
  +phone-width
    margin-bottom: 1.125rem
  :deep(.q-tabs)
    @apply bg-transparent px-16
    width: 70%
    +phone-width
      width: 83%
      padding:0
    .q-tabs__content
      overflow: scroll
    .q-tab
      @apply p-0 mr-3
      background:  url("app/template/set_sjpn2/assets/images/tabs/bg.png")
      background-size: cover
      min-width: 9rem
      width: 9rem
      height: 4.1875rem
      border-radius: 0.8125rem
      border: 1px solid rgba(255, 255, 255, 0.5)
      overflow:hidden
      &:before
        content: ''
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: rgba(0, 0, 0, 0.8)
        pointer-events: none
        border-radius: 0.8125rem
      +phone-width
        min-width: 4.8rem
        width: 4.8rem
        height: 2rem

      &.q-tab--active
        border: 1px solid #EDEDED
        border-radius: .8125rem
        &:before
          background: rgba(0, 0, 0, 0)
      .q-tab__content
        padding: .5rem
        +phone-width
          padding: 0
        .tab-img
          width: 100%
          height: auto
      .q-focus-helper
        opacity: 0.3
        background: #000
        border-radius: .8125rem
      .q-tab__indicator
        display: none
    .q-tabs__arrow
      width: 3.3125rem
      height: 3.3125rem
      border: 1px solid #fff
      border-radius: 50%
      top: .4375rem
      +phone-width
        display: none
  .search-container
    width: 24%
    +phone-width
      width: 3rem
      height: 3rem

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
