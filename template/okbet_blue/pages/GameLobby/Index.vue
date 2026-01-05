<template>
  <div :class="cx('w-full', PAGE_X_SPACING, FLEX_CENTER)">
    <GameBanner />
  </div>

  <MobileNav v-if="$q.platform.is.mobile" />
  <div class="w-full px-6 phone:px-4">
    <div class="provider-container" :class="`${isMobile ? 'h5' : 'pc'}`">
      <div class="provider-title">
        <p class="item-desc">{{ $t("home.entertaining") }}</p>
        <h3 class="title">
          <span> {{ $t("home.game") }} </span> {{ $t("home.providers") }}
        </h3>
      </div>
      <swiper :slides-per-view="isMobile ? 2.5 : 4.3" :space-between="10">
        <swiper-slide
          v-for="(product, key) in productState.list"
          :key="key"
          :name="product.product_code"
          @click="handleTabClick(product.integration_id, product.product_code)"
        >
          <img
            :src="getProductTabImage({ ...product, siteKey: 'okbet_blue' })"
            class="tab-img"
            :alt="product.product_name"
            @error="setDefaultProductTabImg"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>

  <div class="w-full px-6 phone:px-4">
    <div v-if="isMobile" class="game-container h5">
      <div class="search-container">
        <div class="tabs">
          <q-btn
            v-for="tag in gameTagList"
            :key="`tag-${tag.value}`"
            flat
            class="hide-hover btn-tag"
            :class="{ active: gameSearchType === tag.value }"
            @click="handleGameSearchTypeClick({ tagValue: tag.value, pup: true, gameTypeId: gameType, productCode })"
            :disable="gameSearchType === tag.value"
          >
            <q-icon :name="tag.icon" class="mr-2"></q-icon>
            <!-- <q-img :src="svgIcon(tag.iconName)" loading="lazy" class="pixel7:hidden"></q-img> -->
            <span>{{ tag.label }}</span>
          </q-btn>
        </div>
        <q-input
          v-model.trim="searchState.keyword"
          borderless
          clearable
          clear-icon="close"
          class="search-input"
          :placeholder="$t('placeholder.gameName')"
        >
          <template #append> <q-icon name="search" /> </template
        ></q-input>
      </div>
      <ul v-if="showGameList.length > 0" class="game-row">
        <li
          v-for="game in showGameList"
          :key="game.game_id"
          class="game-item"
          @click="
            openGame(
              game.integration_id,
              game.product_code,
              game.game_code,
              gameTypeState.map[gameType].game_type,
              true
            )
          "
        >
          <div class="img-container">
            <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
            <q-btn
              v-if="game.is_favorite"
              class="btn-favorite hide-hover"
              round
              flat
              @click.stop="removefavoriteGame(game, true)"
            >
              <img :src="svgIcon('heart-btn-active')" alt="" />
            </q-btn>
            <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addfavoriteGame(game, true)">
              <img :src="svgIcon('heart-btn')" alt="" />
            </q-btn>
          </div>

          <div class="hot-tag">
            <img v-if="game.hot" :src="hotTagImg" />
            <img v-if="game.newly" :src="newTagImg" />
          </div>

          <div class="game-name">{{ game.game_name }}</div>
          <div class="game-favorites">
            <img :src="svgIcon('heart-collet')" alt="" />
            <span> {{ formatNumberKM(game.favorite_count) }} </span>
          </div>
        </li>
      </ul>
      <div v-else class="no-data-container no-data">
        <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
      <FooterNav />
    </div>

    <div v-else class="game-container pc">
      <div class="search-container">
        <div class="tabs">
          <swiper :slides-per-view="4" :space-between="16">
            <swiper-slide v-for="tag in gameTagList" :key="`tag-${tag.value}`" :name="tag.value">
              <q-btn
                flat
                class="hide-hover btn-tag"
                :class="{ active: gameSearchType === tag.value }"
                @click="
                  handleGameSearchTypeClick({ tagValue: tag.value, pup: true, gameTypeId: gameType, productCode })
                "
                :disable="gameSearchType === tag.value"
              >
                {{ tag.label }}
              </q-btn>
            </swiper-slide>
          </swiper>
        </div>
        <q-input v-model.trim="searchState.keyword" borderless class="search-input">
          <template #append> <q-icon name="search" /> </template
        ></q-input>
      </div>
      <ul v-if="showGameList.length > 0" class="game-row">
        <li v-for="game in showGameList" :key="game.game_id" class="game-item">
          <div class="img-container">
            <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
            <!-- 已經收藏平常就要顯示 -->
            <q-btn
              v-if="game.is_favorite"
              class="btn-favorite hide-hover"
              round
              flat
              @click="removefavoriteGame(game, true)"
            >
              <img :src="svgIcon('heart-btn-active')" alt="" />
            </q-btn>
            <div class="play-btn-container">
              <q-btn
                class="btn-play hide-hover"
                @click="
                  openGame(
                    game.integration_id,
                    game.product_code,
                    game.game_code,
                    gameTypeState.map[gameType].game_type,
                    true
                  )
                "
              >
                {{ $t("game.play_now") }}
              </q-btn>
              <!-- 還沒收藏，hover才顯示 -->
              <q-btn
                v-if="!game.is_favorite"
                class="btn-favorite hide-hover"
                round
                flat
                @click="addfavoriteGame(game, true)"
              >
                <img :src="svgIcon('heart-btn')" alt="" />
              </q-btn>
            </div>
          </div>

          <div class="hot-tag">
            <img v-if="game.hot" :src="hotTagImg" />
            <img v-if="game.newly" :src="newTagImg" />
          </div>

          <div class="title-container">
            <span class="game-name">{{ game.game_name }}</span>
            <span class="game-favorites">
              <img :src="svgIcon('heart-collet')" alt="" />
              {{ formatNumberKM(game.favorite_count) }}
            </span>
          </div>
        </li>
      </ul>
      <div v-else class="no-data-container no-data">
        <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
      <div class="w-full px-4 md:p-x6">
        <RankBoard class="rank-board my-8 w-full" />
      </div>
    </div>
  </div>

  <FooterArea v-if="!isMobile" />
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from "vue"
import GameBanner from "app/template/okbet_blue/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet_blue/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet_blue/components/Footer/Index.vue"
import MobileNav from "app/template/okbet_blue/components/MobileNav.vue"
import { useSiteImg } from "app/template/okbet_blue/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useGameKeyword } from "src/common/composables/useGameKeyword"
import { useCommon } from "src/common/hooks/useCommon"
import { BANNER_POSITION, GAME_TAG_TYPE } from "src/common/utils/constants"
import "swiper/css"
import { Swiper, SwiperSlide } from "swiper/vue"
import { useRoute, useRouter } from "vue-router"
import { useLogo } from "src/common/composables/useLogo"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { useQuasar } from "quasar"
import { cx } from "src/common/utils/cx"
import { FLEX_CENTER, PAGE_X_SPACING } from "src/common/utils/constants/styles"
// import { useMediaQuery } from "src/common/hooks/useMediaQuery"

// const { width } = useMediaQuery()
// const isNeedMaxWidth = computed(() => width.value >= 1200)
const $q = useQuasar()
const isMobile = $q.platform.is.mobile
const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const {
  gameTypeState,
  gameTagList,
  productState,
  gameState,
  integrationId,
  gameSearchType,
  getProducts,
  handleGameSearchTypeClick,
  openGame,
  addfavoriteGame,
  removefavoriteGame,
  getFavoriteGames,
  getGameImage,
  getAllProviderGames,
  getProductTabImage
} = useGame()
const { searchState, filterGameList } = useGameKeyword()
const { setDefaultGameImg } = useCommonImg()
const { setDefaultProductTabImg, svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { formatNumberKM } = useCommon()
const { getWideLogo } = useLogo()

const gameType = computed(() => {
  return Number(route.params.gameType)
})

const productCode = ref(0)

const showGameList = computed(() => {
  if (filterGameList.value.length) {
    return filterGameList.value
  }
  if (gameState.gamesMap[gameSearchType.value].length) {
    return gameState.gamesMap[gameSearchType.value]
  }
  return []
})

async function handleTabClick(integration_id: number, product_id: number) {
  productCode.value = product_id
  integrationId.value = integration_id
  searchState.keyword = ""

  router.replace({ params: { gameType: gameType.value, productCode: product_id } })

  await handleGameSearchTypeClick({
    tagValue: GAME_TAG_TYPE.Enums.All,
    pup: true,
    gameTypeId: gameType.value,
    productCode: product_id
  })
}

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameType.value)
}

const mobileNavIcon = (iconName: string) => {
  return svgIcon(iconName)
}

onMounted(async () => {
  await getBanner()
  await getProducts(gameType.value)

  if (productState.list.length) {
    integrationId.value = productState.list[0].integration_id
    productCode.value = productState.list[0].product_code

    router.replace({ params: { gameType: gameType.value, productCode: productCode.value } })

    // 取得產品清單後, 取產品清單第一個product_code的產品包遊戲
    if (gameType.value && productCode.value) {
      await handleTabClick(integrationId.value, productCode.value)
    }

    // 初始化時，先取得所有遊戲, 搜尋遊戲時用
    await getAllProviderGames(integrationId.value, gameType.value, false)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/game.scss";
@import "app/template/okbet_blue/assets/css/button.scss";
@import "app/template/okbet_blue/assets/css/data.scss";

.provider-container {
  @include setFlex;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;

  &.pc {
    @apply w-full mb-8;

    .provider-title {
      width: 100%;
    }

    .item-desc {
      font-family: OpenSans;
      font-style: normal;
      font-weight: 860;
      font-size: 0.75rem;
      line-height: 0.875rem;
      color: $bg-light;
      text-transform: uppercase;
    }

    .title {
      @apply relative mb-5;
      font-size: 1.75rem;
      line-height: 2.0625rem;
      font-weight: 500;
      color: $text-light-secondary;

      span {
        color: $bg-light;
        font-weight: 860;
      }
    }

    .swiper {
      width: 100%;

      .swiper-slide {
        @apply flex justify-center items-center w-[16.25rem] h-[6.25rem] cursor-pointer;
        background-color: $bg-dark-secondary;
        border-radius: 12px;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
      }

      .tab-img {
        width: 70%;
      }
    }
  }

  &.h5 {
    @apply pt-0 pb-0 mt-2 mb-5;

    .item-desc {
      display: none;
    }

    .title {
      display: none;
    }

    .swiper {
      width: 100vw;
      @include iphone-width {
        max-width: 92vw;
      }

      .swiper-slide {
        @apply w-auto h-[6.25rem] phone:h-20;
        @apply flex w-auto justify-center items-center;
        background-color: $bg-dark-secondary;
        border-radius: 5px;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
      }

      .tab-img {
        width: 200px;
      }
    }
  }
}

.hot-tag {
  position: absolute;
  left: -5%;
  top: 5%;
  z-index: 10;

  width: 71px;
  height: 50px;

  @media (max-width: 767px) {
    // Adjustments for iPhone width or similar small screens
    width: 50px;
    height: 35px;
    left: -7%;
    top: 3%;
  }
}

.game-container {
  @include setFlex;
  flex-direction: column;

  &.pc {
    margin: 2rem 2rem 8rem 2rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;

    .search-container {
      @apply flex w-full justify-end pr-5;

      .tabs {
        width: 100%;
        display: flex;
        flex: 1 1 0%;
        margin-bottom: 20px;
        margin-right: 20px;
        overflow-x: auto;
        border-radius: 16px;
        padding-bottom: 4px;

        .swiper {
          margin: 0;

          .swiper-slide {
            width: auto !important;

            .btn-tag {
              padding: 10px 20px;
              border-radius: 100px;
              font-style: normal;
              font-weight: 400;
              font-size: 16px;
              line-height: 19px;
              margin-left: 0px;
              background-color: $bg-dark-secondary;
              color: $text-gray;
              white-space: nowrap;
              flex: 0 0 auto;
              text-transform: none;

              &.active {
                font-weight: 510;
                color: $bg-dark-secondary;
                background-color: $bg-light;
              }

              &.disabled {
                opacity: 1 !important;
              }
            }
          }
        }
      }

      .search-input {
        width: 13.75rem;
        height: 2.5rem;
        border-radius: 2.125rem;
        background: $bg-dark-secondary;

        :deep(.q-field__control) {
          height: 2.5rem;
          font-weight: 400;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          position: relative;
          border-radius: 4px;
          padding-right: 0.875rem;

          input {
            color: $text-light-secondary;
            font-style: normal;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.1875rem;
            padding-left: 1.25rem;
          }

          .q-icon {
            color: $text-gray-tertiary;
          }
        }
      }
    }

    .game-row {
      width: 100%;
      @apply grid grid-cols-6 gap-4;
      @apply pb-5;

      .hot-tag {
        position: absolute;
        left: -5%;
        top: 9%;
        z-index: 10;
        width: 71px;
        height: 50px;
      }

      @include pc-2xl-width {
        @apply grid-cols-5;
      }

      @include pc-xl-width {
        @apply grid-cols-4;
      }
    }
  }

  &.h5 {
    padding-bottom: 7rem;

    .search-container {
      @apply w-full;
      @apply flex justify-center items-center flex-wrap gap-5 iphone:gap-4;
      @apply rounded-lg overflow-hidden;

      .tabs {
        width: 100%;
        display: flex;
        overflow-x: auto;
        border-radius: 0.5rem;
        justify-content: space-between;

        .btn-tag {
          @apply flex justify-center items-center flex-row rounded-lg;
          width: 23.5%;
          padding: 5px 0;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 19px;
          margin-left: 0px;
          background: $bg-dark-secondary;
          color: $text-tertiary;
          white-space: nowrap;
          text-transform: none;

          &.active {
            font-weight: 510;
            background: $bg-light;
            color: $bg-dark-secondary;
          }

          &.disabled {
            opacity: 1 !important;
          }

          :deep(.q-img) {
            width: 1.5rem;
            // height: 1.5rem;
            margin-right: 0.5rem;
          }
        }
      }

      .search-input {
        @apply w-full h-9 bg-white px-2 rounded-lg;
        background: $bg-dark-secondary;

        :deep(.q-field__control) {
          @apply h-9;

          input {
            color: $text-light-secondary;
          }

          .q-icon {
            color: $text-gray-tertiary;
          }
        }

        :deep(.q-field__marginal) {
          @apply h-9;

          .q-field__focusable-action {
            font-size: 14px;
            font-weight: bold;
            margin-right: 6px;
            color: $text-light-secondary;
            opacity: 1;
          }
        }
      }
    }

    .game-row {
      @apply w-full;
      @apply pt-4 pb-6 phone:py-4;
      @apply flex flex-wrap;
      @apply grid grid-cols-4 gap-4;
      @apply phone:grid-cols-4 phone:gap-2;

      .hot-tag {
        width: 50px;
        height: 35px;
        left: -7%;
        top: 9%;
        position: absolute;
        z-index: 10;
      }

      .game-item {
        @apply w-full h-auto pb-3 rounded-lg;

        .img-container {
          @apply h-auto rounded-lg;

          img {
            @apply rounded-lg;
          }
        }

        .game-name {
          @apply mt-2;
        }

        .game-favorites {
          img {
            @apply w-5 h-5;
          }
        }
      }

      @include iphone-width {
        @apply grid grid-cols-3 gap-2;
      }
    }
  }
}
</style>
