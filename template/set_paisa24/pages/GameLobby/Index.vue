<template>
  <div class="game-lobby">
    <div class="game-lobby-title" v-if="!$q.platform.is.mobile">
      <div class="title-icon">
        <img :src="gameTitleIcon(gameType)" alt="" srcset="" />
      </div>
      <div class="title-label">{{ $t(GAME_TYPE.I18nKeys[gameType as GAME_TYPE.Enums]) }}</div>
    </div>

    <div class="swiper-container">
      <Swiper
        :modules="[Navigation]"
        @swiper="onSwiper"
        @slide-change="updateNavigationState"
        class="product-row"
        :breakpoints="{
          300: { slidesPerView: 3, spaceBetween: 10 },
          500: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 }
        }"
        ref="productSwiperRef"
      >
        <SwiperSlide
          v-for="product in productState.list"
          :key="product.product_name"
          class="product-item cursor-pointer"
          @click="handleTabClick(product.integration_id, product.product_code)"
        >
          <div class="img-container">
            <img
              :src="getProductSquareImage({ ...product, siteKey: 'set_paisa24' })"
              :alt="product.product_name"
              class="product-img"
              @error="setDefaultProductImg"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="navigation" v-if="productState.list.length > 0">
        <q-btn flat dense rounded icon="fas fa-chevron-left" @click="productSwiper.slidePrev()"> </q-btn>
        <q-btn flat dense rounded icon="fas fa-chevron-right" @click="productSwiper.slideNext()"> </q-btn>
      </div>
    </div>

    <div class="game-bar">
      <div class="left">
        <a
          class="bar-btn"
          v-for="tag in gameTagList_"
          :key="`tag-${tag.value}`"
          :name="tag.value"
          :class="{ active: searchState.tag === tag.value }"
          @click="handleTagClick(tag.value as GAME_TAG_TYPE.Enums, true)"
        >
          {{ tag.label }}
        </a>
      </div>
      <div class="right" v-if="!$q.platform.is.mobile">
        <q-input
          v-model.trim="searchState.keyword"
          borderless
          dense
          class="search-input"
          :placeholder="$t('common.btn.search')"
        >
          <template #prepend> <q-icon name="search" /> </template
        ></q-input>
      </div>
    </div>

    <ul v-if="filterGameList.length > 0" class="game-row">
      <li v-for="game in filterGameList" :key="game.game_id" class="game-item">
        <div class="img-container">
          <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
          <div class="play-btn-container">
            <q-btn
              unelevated
              no-caps
              class="btn-play"
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
          </div>
          <!-- Hot tag -->
          <div class="tag-img">
            <img v-if="game.hot" :src="hotTagImg" />
            <img v-if="game.newly" :src="newTagImg" />
          </div>
        </div>
        <div class="title-container">
          <span class="game-name">{{ game.game_name }}</span>
        </div>
      </li>
    </ul>
    <div v-else class="no-data-container no-data">
      <img class="w-16" v-if="getWideLogo" :src="getWideLogo()" alt="" />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { useSiteImg } from "app/template/set_paisa24/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useSearchGame } from "src/common/composables/useSearchGame"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { GAME_TAG_TYPE, GAME_TYPE } from "src/common/utils/constants"
import "swiper/css"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { computed, onMounted, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const {
  gameTypeState,
  productState,
  gameState,
  getProducts,
  getGames,
  openGame,
  addfavoriteGame,
  removefavoriteGame,
  getFavoriteGames,
  getGameImage,
  getProductTabImage,
  getProductSquareImage,
  handleProductClick,
  getAllProviderGames
} = useGame()
const { gameTagList, searchState, filterGameList, handleTagClick } = useSearchGame()
const { setDefaultGameImg } = useCommonImg()
const { gameTitleIcon, hotTagImg, newTagImg, setDefaultProductImg } = useSiteImg()
const { formatNumberKM } = useCommon()
const { getWideLogo } = useLogo()

const gameTagList_ = computed(() => {
  // 隱藏Fav
  return gameTagList.value.filter((item) => item.value != 1)
})

const gameType = computed(() => {
  return Number(route.params.gameType)
})
const integrationId = ref(1)
const productCode = ref(0)

const productSwiper = ref()
const canGoNext = ref(true)
const canGoPrev = ref(true)

const onSwiper = (swiper: any) => {
  productSwiper.value = swiper
  updateNavigationState()
}
const updateNavigationState = () => {
  canGoPrev.value = !productSwiper.value.isBeginning
  canGoNext.value = !productSwiper.value.isEnd
}

function handleTabClick(integration_id: number, product_id: number) {
  productCode.value = product_id
  integrationId.value = integration_id
  router.replace({ params: { gameType: gameType.value, productCode: product_id } })

  handleTagClick(GAME_TAG_TYPE.Enums.All)
}

watchEffect(() => {
  if (gameTypeState.list.length && integrationId.value && gameType.value && productCode.value) {
    getGames(integrationId.value, gameType.value, productCode.value)
  }
})

onMounted(async () => {
  console.log(route.params.gameType)

  await getFavoriteGames()
  await getProducts(gameType.value)

  if (productState.list.length) {
    integrationId.value = productState.list[0].integration_id
    productCode.value = productState.list[0].product_code

    router.replace({ params: { gameType: gameType.value, productCode: productCode.value } })
    // 初始化時，先取得所有遊戲, 搜尋遊戲時用
    await getAllProviderGames(integrationId.value, gameType.value)

    // 取得產品清單後, 取產品清單第一個product_code的產品包遊戲
    handleTabClick(integrationId.value, productCode.value)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

.game-lobby {
  @apply px-[15px] py-[40px];
  .game-lobby-title {
    @apply inline-flex;
    background-color: $primary-color;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    align-items: center;
    text-transform: uppercase;
    color: $game-label-title-color;
    font-size: 17px;
    margin-bottom: 30px;
    .title-icon {
      img {
        @apply max-h-[40px] mr-[10px];
      }
    }
    .title-label {
    }
  }
  .swiper-container {
    @apply relative;
    @include phone-width {
      @apply px-[10px];
    }
    .navigation {
      @apply absolute w-full;
      @apply flex justify-between items-center;
      @apply top-1/2 transform -translate-y-1/2;
      @apply z-10 pointer-events-none;
      ::v-deep(.q-btn) {
        background: $navigation-active-bg;
        @apply w-[30px] h-[30px];
        @apply text-white pointer-events-auto;
        .q-icon {
          @apply text-[20px];
        }
      }
      @include phone-width {
        @apply -ml-[10px];
      }
    }
  }
  .game-row {
    @apply grid grid-cols-7 gap-[15px] my-4;
    @include pad-width {
      @apply grid-cols-4;
    }
    @include phone-width {
      @apply grid-cols-3;
    }
    .game-item {
      @apply border border-black rounded-[8px];
      background-color: $game-item-bg-color;
      .img-container {
        @apply relative px-[15px];
        @include phone-width {
          @apply px-[5px];
        }
        .game-img {
        }
        .play-btn-container {
          @apply absolute rounded-[8px] w-full h-full;
          @apply top-0 left-0 cursor-pointer;
          @apply transition-all duration-300 hover:bg-black/50;
          @apply hidden items-center justify-center;

          .btn-play {
            @apply rounded-full font-bold text-white;
            background-color: $secondary-color;
          }
        }
        .tag-img {
          @apply absolute w-16 left-2 top-2;
        }
        &:hover {
          .play-btn-container {
            @apply flex;
          }
        }
      }
      .title-container {
        @apply py-[10px] text-[15px] text-center;
        color: $game-item-title-color;
        @include phone-width {
          @apply py-1 text-[12px];
        }
      }
    }
  }
  .game-bar {
    @apply rounded-full my-[40px] p-[10px];
    @apply flex justify-between items-center;
    background-color: $primary-color;
    @include phone-width {
      @apply my-[15px];
    }
    .left {
      @apply flex pl-4 gap-[20px];
      .bar-btn {
        @apply text-white text-[14px] font-semibold;
        @apply cursor-pointer transition-all;

        &:hover {
          color: $pink-color;
        }
        &.active {
          color: $pink-color;
        }
      }
    }
    .right {
      .search-input {
        @apply rounded-full px-2 py-1;
        background-color: $secondary-color;
        ::v-deep(.q-icon) {
          color: $pink-color;
        }

        ::v-deep(input) {
          @apply placeholder:text-white text-white;
        }
      }
    }
  }
  .no-data-container {
    @apply h-[200px] w-full flex gap-4 flex-col items-center justify-center;
    color: $input-text-color;
  }
}
</style>
