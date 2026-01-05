<template>
  <div class="home-container">
    <HomeBanner />
    <Navigator />
    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms" v-if="cmsListState[CMS_TYPE.Enums.HOME].length">
        <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
          <div v-if="shouldDisplayDevice(cmsItem)">
            <div class="home-title-container" v-if="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] != ''">
              <div class="home-title">
                <q-img
                  v-if="cmsItem.Setting.icon_path"
                  :src="cmsItem.Setting.icon_path"
                  class="home-title-icon"
                  @error="setDefaultProductImg"
                />
                <p class="title-label">
                  {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
                </p>
              </div>
              <div class="all">
                <q-btn
                  class="all-entrance"
                  unelevated
                  v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
                  :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
                >
                  {{ $t("common.more") }}
                </q-btn>
                <q-btn
                  v-if="isCarousel(cmsItem)"
                  @click="handleCarouselArrow(cmsIndex, 'prev')"
                  class="arrow all-prev"
                  dense
                  unelevated
                  outline
                  rounded
                >
                  <q-icon size="xs" name="fas fa-chevron-left"></q-icon>
                </q-btn>
                <q-btn
                  v-if="isCarousel(cmsItem)"
                  @click="handleCarouselArrow(cmsIndex, 'next')"
                  class="arrow all-next"
                  dense
                  unelevated
                  outline
                  rounded
                >
                  <q-icon size="xs" name="fas fa-chevron-right"></q-icon>
                </q-btn>
              </div>
            </div>
            <template v-if="isCarousel(cmsItem)">
              <ul class="game-list game-list-carousel long">
                <div class="game-carousel">
                  <Carousel ref="carouselRef" class="carousel" :breakpoints="getBreakpoints(cmsItem)" :gap="20">
                    <Slide class="slide" v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                      <CmsGameItem class="item" :entrance="entrance" />
                    </Slide>
                  </Carousel>
                </div>
              </ul>
            </template>
            <template v-else>
              <ul class="game-list long">
                <div class="game-grid" :style="getGridStyle(cmsItem)">
                  <div class="item" v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </ul>
            </template>
          </div>
        </div>

        <div class="home-title mt-12">
          <p class="title-label font-bold" v-html="$t('common.latestBetAndBigWins')"></p>
        </div>
        <RankBoard class="rank-board" />

        <div class="home-title mt-12 provider-title">
          <p class="title-label font-bold" v-html="$t('home.providers')"></p>
        </div>
        <ProviderList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeBanner from "app/template/set_paisa24/pages/Home/components/HomeBanner.vue"
import Navigator from "app/template/set_paisa24/pages/Home/components/Navigator.vue"
import RankBoard from "app/template/set_paisa24/pages/Home/components/RankBoard.vue"
import ProviderList from "app/template/set_paisa24/pages/Home/components/ProviderList.vue"

import { useSiteImg } from "app/template/set_paisa24/hooks/useSiteImg"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE, CMS_VIEW_ALL } from "src/common/utils/constants"
import { computed, onMounted, ref } from "vue"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import CmsGameItem from "./Cms/CmsGameItem.vue"

const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()
const $q = useQuasar()

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const innerScrollTop: any = ref(0)

const handleInnerScroll = () => {
  const element = document.getElementById("scrollDom")
  innerScrollTop.value = element?.scrollTop
}

const providerList = ["evolution", "ag", "pp", "pg", "hababero", "micro", "spade", "jili", "bbin", "jdb"]

const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useSiteImg()
const { companyName } = useEnv()

const carouselRef = ref()
const handleCarouselArrow = (cmsIndex: number, direction: "prev" | "next") => {
  const cmsList = cmsListState.value[CMS_TYPE.Enums.HOME]
  // 找出 cmsIndex 對應的 carouselRef
  const carouselList: number[] = []

  cmsList.forEach((item, index) => {
    const isCarousel = item.Setting.payload.arrangement === 0

    if (isCarousel) {
      carouselList.push(index)
    }
  })

  const carouselIndex: number = carouselList.findIndex((index) => index === cmsIndex)

  if (carouselIndex !== -1) {
    if (direction === "prev") {
      carouselRef.value[carouselIndex].prev()
    } else if (direction === "next") {
      carouselRef.value[carouselIndex].next()
    }
  }
}

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await handleCmsList(CMS_TYPE.Enums.HOME)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

.home-container {
  @apply w-full min-h-screen px-[15px] pb-[15px];

  .home-content {
    .home-content-cms {
      @apply px-4;
      @include phone-width {
        @apply px-0;
      }
      .game-show-area {
        .home-title-container {
          @apply flex justify-between;
          @apply text-[15px] font-bold uppercase;
          @apply py-[10px];

          .all {
            @apply grow my-[10px];
            @apply flex items-center justify-end gap-2;
            .all-entrance {
              @apply text-[12px] text-white capitalize;
              @apply px-[20px] py-[10px] font-bold rounded-full;
              background-color: $secondary-color;
            }
            .arrow {
              @apply aspect-square border-black/100 h-full;
            }
          }
        }
        .game-list {
          @apply mt-[10px] mb-8;
          &:last-child {
            @apply mb-0;
          }
          .game-carousel {
            .carousel {
              .slide {
                @apply rounded-xl overflow-hidden;

                ::v-deep(.game-item) {
                  @apply w-full;
                  .game-img {
                    @apply w-full;
                  }
                }
              }
            }
            ::v-deep(button) {
              @apply rounded-full w-[25px] h-[25px];
              @apply m-0;
              background-color: $primary-color;
              svg {
                @apply text-white;
              }
            }
          }
          .game-grid {
            @apply grid;
            @apply gap-[20px];
            grid-template-columns: repeat(var(--grid-columns), 1fr);

            @include phone-width {
              @apply gap-[4px];
            }

            .item {
              .game-item {
                ::v-deep(.game-img) {
                  @apply w-full;
                }
              }
            }
          }
        }
      }
    }

    .home-title {
      @apply flex items-center;
      color: $home-title-color;
      .home-title-icon {
        @apply aspect-square w-6 mr-2;
      }
      .title-label {
        @apply uppercase;
      }

      &.provider-title {
        color: $pink-color;
      }
    }
  }
}
</style>
