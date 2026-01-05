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
      <div class="game-list">
        <div class="inc-item-all">
          <div class="inc-item">
            <!-- LIVE -->
            <div class="mb-16">
              <div class="ttl-inx">
                <div class="ttl-inx-l">
                  {{ $t("home.liveCasino") }}
                </div>
              </div>
              <q-separator />
              <div class="indx-3">
                <ul>
                  <li
                    v-for="game in productState.list"
                    :key="game.product_name"
                    class="game-item product"
                    @click="openGame(game.integration_id, game.product_code, '', game.game_type)"
                  >
                    <img
                      :src="getProductSquareImage({ ...game, siteKey: 'set_sjpn2' })"
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
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import HomeBanner from "app/template/set_sjpn2/pages/HomePage/Components/banner.vue"
import { BANNER_POSITION, GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { Carousel, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

const $q = useQuasar()
const { bannerList, handleBannerList } = useBanner()
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
const { setDefaultProductImg } = useCommonImg()
const { getSquareLogo } = useLogo()

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
        background:  url("app/template/set_sjpn2/assets/images/bg.png")  center top
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
        img
          @apply w-full h-full object-contain object-center max-h-[250px]
        +phone-width
          width: 55%
          order: 1
          img
            @apply max-h-[120px]

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
