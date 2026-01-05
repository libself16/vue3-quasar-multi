<template>
  <div class="home">
    <div class="home_container">
      <HomeBanner v-if="bannerList.length > 0" />
      <div class="home-banner" v-else>
        <div class="banner-text">
          <div class="title">vip credit program</div>
          <div class="subtitle">play first settle later</div>
        </div>
        <div class="banner-img">
          <img :src="getSquareLogo()" alt="logo" class="w-full h-auto" :class="{ invisible: !getSquareLogo() }" />
        </div>
      </div>
      <div v-if="marqueeAnnouncements.length" class="home-marquee-wrapper">
        <div class="home-marquee">
          <Vue3Marquee>
            <div
              v-for="marquee in marqueeAnnouncements"
              :key="marquee.id"
              class="home-marquee-item"
              @click="handleShowSingleAnnouncement(marquee.id)"
            >
              {{ marquee.langDetail?.title }}
            </div>
          </Vue3Marquee>
        </div>
      </div>

      <div class="game-list">
        <div class="inc-item-all">
          <div class="inc-item">
            <!-- 熱門遊戲 -->
            <div v-if="gameState.allGameList.POPULAR?.length" class="mb-16">
              <div class="ttl-inx">
                <div class="ttl-inx-l">
                  {{ $t("home.popularGames") }}
                </div>
                <q-btn :to="{ name: 'PopularLobby' }" flat>
                  <span class="mr-2">
                    {{ $t("common.btn.viewAll") }}
                  </span>
                  <img :src="iconSvg('view-all')" alt="view-all" />
                </q-btn>
              </div>
              <q-separator />
              <Carousel :breakpoints="breakPoints" ap-around="true">
                <Slide v-for="(game, key) in gameState.allGameList.POPULAR" :key="key">
                  <div class="carousel-cell">
                    <div class="game-item" @click="handleOpenGame(game)">
                      <img
                        :src="getGameImage(game)"
                        :alt="game.game_code"
                        class="game-img"
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
                      <q-btn
                        v-else
                        class="btn-favorite hide-hover"
                        round
                        flat
                        @click.stop="addfavoriteGame(game, true)"
                      >
                        <img :src="iconHeart('heart-btn')" alt="" />
                      </q-btn>
                    </div>
                  </div>
                </Slide>
              </Carousel>
            </div>
            <!-- SLOT -->
            <div v-if="gameState.allGameList.SLOT?.length" class="mb-16">
              <div class="ttl-inx">
                <div class="ttl-inx-l">
                  {{ $t("home.slotGames") }}
                </div>
                <q-btn
                  :to="{
                    name: 'GameLobby',
                    params: {
                      gameType: GAME_TYPE.Enums.SLOT
                    }
                  }"
                  flat
                >
                  <span class="mr-2">
                    {{ $t("common.btn.viewAll") }}
                  </span>
                  <img :src="iconSvg('view-all')" alt="view-all" />
                </q-btn>
              </div>
              <q-separator />
              <div class="indx-7">
                <ul>
                  <li
                    v-for="game in isMobile ? gameState.allGameList.SLOT.slice(0, 12) : gameState.allGameList.SLOT"
                    :key="game.game_code"
                    class="game-item"
                    @click="handleOpenGame(game)"
                  >
                    <img :src="getGameImage(game)" :alt="game.game_code" @error="setDefaultGameImg" />

                    <p class="game-name">{{ game.game_name }}</p>
                    <q-btn class="btn-play slot-btn-play">{{ $t("game.play_now") }}</q-btn>
                    <q-btn
                      v-if="gameState.favoriteMap[game.game_id]"
                      class="btn-favorite hide-hover"
                      round
                      flat
                      @click.stop="removefavoriteGame(game, true)"
                    >
                      <img class="icon-heart" :src="iconHeart('heart-btn-active')" alt="" />
                    </q-btn>
                    <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addfavoriteGame(game, true)">
                      <img class="icon-heart" :src="iconHeart('heart-btn')" alt="" />
                    </q-btn>
                  </li>
                </ul>
              </div>
            </div>
            <!-- LIVE -->
            <div v-if="gameState.allGameList.LIVE_CASINO?.length" class="mb-16">
              <div class="ttl-inx">
                <div class="ttl-inx-l">
                  {{ $t("home.liveCasino") }}
                </div>
                <q-btn
                  :to="{
                    name: 'ProductLobby',
                    params: {
                      gameType: GAME_TYPE.Enums.LIVECASINO
                    }
                  }"
                  flat
                >
                  <span class="mr-2">
                    {{ $t("common.btn.viewAll") }}
                  </span>
                  <img :src="iconSvg('view-all')" alt="view-all" />
                </q-btn>
              </div>
              <q-separator />
              <div class="indx-3">
                <ul>
                  <li
                    v-for="game in productState.list"
                    :key="game.product_name"
                    class="game-item product"
                    @click="handleOpenGame(game)"
                  >
                    <img
                      :src="getProductSquareImage({ ...game, siteKey: 'set_amuse' })"
                      :alt="game.product_name"
                      class="live-img"
                      @error="setDefaultProductImg"
                    />

                    <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>
<script lang="ts" setup>
import { onMounted, computed, ref, watchEffect } from "vue"
import { useQuasar } from "quasar"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useAnnouncement } from "src/common/composables/useAnnonucement"
import HomeBanner from "app/template/set_amuse/pages/HomePage/Components/banner.vue"
import { BANNER_POSITION, GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { Carousel, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"
import * as Response from "src/api/response.type"
import { Vue3Marquee } from "vue3-marquee"

const $q = useQuasar()
const { bannerList, handleBannerList } = useBanner()
const { setGameTypeUsing } = useGameTypeStore()
const {
  gameTypeState,
  gameState,
  getAllGames,
  openGame,
  removefavoriteGame,
  addfavoriteGame,
  getFavoriteGames,
  getGameImage,
  getProductSquareImage,
  productState,
  getProducts
} = useGame()
const { setDefaultGameImg, setDefaultProductImg } = useCommonImg()
const { iconSvg, iconHeart } = useSiteImg()
const { getSquareLogo } = useLogo()
const { marqueeAnnouncements, handleShowSingleAnnouncement } = useAnnouncement()

function handleOpenGame(game: (typeof gameState.allGameList)[keyof Response.AllGameList][number]) {
  setGameTypeUsing(game.game_type || game.game_type_id)
  openGame(
    game.integration_id,
    game.product_code,
    game.game_code || "",
    game.game_type || game.game_type_id,
    false,
    null,
    LANGUAGE_CODE.Enums.en
  )
}

const isMobile = computed(() => {
  return $q.screen.width < 768
})
const breakPoints = {
  300: {
    itemsToShow: 2.5,
    snapAlign: "center"
  },
  700: {
    itemsToShow: 2.5,
    snapAlign: "start"
  },
  1024: {
    itemsToShow: 7.5,
    snapAlign: "start"
  }
}

watchEffect(() => {
  if (gameTypeState.list.length) {
    getProducts(2)
  }
})

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await getAllGames()
  await getFavoriteGames()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/_variable.sass"
@import "../../assets/css/game.sass"

.home
  line-height: 1.4
  font-size: 14px
  margin: 0 auto
  color: #fff
  :deep(.carousel)
    .banner-item
      width: 100vw
  :deep(.carousel__prev),
  :deep(.carousel__next)
    @apply text-gray-500
  .home_container
    max-width: 95rem
    padding: 0
    margin: 0 auto
    +pc-lg-width
      max-width: 71.25rem
    +pc-width
      max-width: 60rem
    +pad-width
      max-width: 47.5rem
    +phone-width
      max-width: 100%
    +iphone-width
      width: 100%
    .home-banner
      @apply flex justify-center items-center
      width: 100%
      height: 16rem
      +phone-width
        @apply flex-col
        background:  url("app/template/set_amuse/assets/images/bg.png")  center top
        background-size: cover
        padding-top: 1rem
      .banner-text
        width: 51.45%
        order: 1
        +phone-width
          width: 90%
          order: 2
          margin-top: 1.25rem
          text-align: center
        .title
          font-size: 48px
          text-transform: uppercase
          +pc-width
            font-size: 48px
          +phone-width
            font-size: 24px
        .subtitle
          text-transform: uppercase
          color: $primary-color
          font-size: 40px
          +pc-width
            font-size: 40px
          +phone-width
            font-size: 20px
      .banner-img
        width: 25%
        order: 2
        mix-blend-mode: overlay
        +phone-width
          width: 55%
          order: 1

    .home-marquee-wrapper
      padding: 0 2.5rem
      +pad-width
        padding: 0
      .home-marquee
        padding: .6563rem 0 .6563rem 1.25rem
        background: #FFFFFF33
        border-radius: 10px
        .home-marquee-item
          font-size: .875rem
          line-height: 1.1875rem
          color: #FFFFFF
          margin-left: 1.25rem
          cursor: pointer
    .game-list
      padding: 0 2.5rem
      +pad-width
        padding: 0
      .inc-item-all
        padding: 1.25rem 0 0
        +iphone-width
          padding: .9375rem
        .inc-item
          padding-bottom: 3rem
          +iphone-width
            padding-bottom: 0
          .ttl-inx
            display: flex
            justify-content: space-between
            align-items: flex-end
            margin: .625rem 0
            .ttl-inx-l
              display: flex
              font-size: 2.25rem
              color: #fff
              +pad-width
                font-size: 1.5625rem
          .game-item
            img
              width: 100%
              height: auto
              object-fit: cover
              border-radius: 10%
          .indx-3
            ul
              @apply grid grid-cols-5 gap-4 mt-5
              +pad-width
                @apply gap-10
              +phone-width
                @apply grid-cols-2 gap-4
          .indx-7
            ul
              @apply grid grid-cols-10 gap-4
              +pad-width
                @apply grid-cols-5
              +phone-width
                @apply grid-cols-3
          .q-separator
            background: #5b5b5c
            margin-bottom: 1.25rem
          .casino
            img
              object-fit: contain

.carousel__slide
  padding: 0 .625rem
  .carousel-cell
    width: 100%
    min-width: 90px
    margin: 5px 0
    border-radius: 5px
    counter-increment: carousel-cell
    .game-item
      img
        border-radius: 10%
        vertical-align: top

.game-item
  .btn-favorite
    position: absolute
    top: 0.4rem
    right: 0.4rem
    display: block
    :deep(.q-btn__content img)
      width: 32px !important
      height: 32px !important
  &:hover
    .btn-favorite
      width: 32px
      height: 32px
      :deep(.q-focus-helper)
        opacity: 0
        background: transparent
</style>
