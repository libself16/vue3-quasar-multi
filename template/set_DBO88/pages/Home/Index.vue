<template>
  <div class="home-container">
    <HomeBanner />
    <ShareLink />
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

        <div class="home-title mt-12">
          <p class="title-label font-bold" v-html="$t('home.providers')"></p>
        </div>
        <ProviderList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useSiteImg } from "app/template/set_DBO88/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE, CMS_VIEW_ALL } from "src/common/utils/constants"
import { Carousel, Slide } from "vue3-carousel"
import CmsGameItem from "./Cms/CmsGameItem.vue"
import HomeBanner from "app/template/set_DBO88/pages/Home/components/HomeBanner.vue"
import Navigator from "app/template/set_DBO88/pages/Home/components/Navigator.vue"
import RankBoard from "app/template/set_DBO88/pages/Home/components/RankBoard.vue"
import ProviderList from "app/template/set_DBO88/pages/Home/components/ProviderList.vue"
import ShareLink from "app/template/set_DBO88/pages/Home/components/ShareLink.vue"

const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const innerScrollTop: any = ref(0)

const handleInnerScroll = () => {
  const element = document.getElementById("scrollDom")
  innerScrollTop.value = element?.scrollTop
}

const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useSiteImg()

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
@import "app/template/set_DBO88/assets/css/_variable.scss";

.home-container {
  @apply max-w-[65rem] w-full mx-auto min-h-screen px-[15px] pb-[15px];

  .home-content {
    .home-content-cms {
      .game-show-area {
        .home-title-container {
          @apply flex justify-between;
          @apply text-[15px] font-bold uppercase;

          .all {
            @apply grow my-[10px];
            @apply flex items-center justify-end gap-2;
            color: $text-sky-blue;

            .all-entrance {
              @apply text-[.875rem] capitalize;
              @apply px-[.5rem] py-[.3125rem] font-bold rounded-[.5rem];
              background: $midnight-blue-bg;
            }
            .arrow {
              @apply aspect-square h-full;

              &::before {
                border: none !important;
                background: $midnight-blue-bg;
              }
            }
          }
        }
        .game-list {
          @apply mb-8;
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
              @apply rounded-full py-[0.5rem] w-[7.5rem];
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
                ::v-deep(button) {
                  @apply w-[7.5rem];
                }
              }
            }
          }
        }
      }
    }

    .home-title {
      @apply flex items-center;
      color: $text-sky-blue;
      .home-title-icon {
        @apply aspect-square w-6 mr-2;
      }
      .title-label {
        @apply uppercase;
      }
    }
  }
}
</style>
