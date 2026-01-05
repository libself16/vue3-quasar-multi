<template>
  <div class="home-layout">
    <div class="mb-3">
      <HomeBanner />
    </div>

    <div class="mb-3">
      <MarqueeList />
    </div>

    <div class="game-tab scrollX">
      <GameTab />
    </div>
    <!-- <MobileNav v-if="$q.platform.is.mobile" /> -->
    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms" v-if="cmsListState[CMS_TYPE.Enums.HOME].length">
        <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
          <div v-if="shouldDisplayDevice(cmsItem)">
            <div class="home-title" v-if="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] != ''">
              <q-img
                v-if="cmsItem.Setting.icon_path"
                :src="cmsItem.Setting.icon_path"
                class="home-title-icon"
                @error="setDefaultProductImg"
              />
              <div class="flex items-center justify-between w-full">
                <p class="title-label">
                  {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
                </p>
                <!-- <q-btn
                  v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
                  :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
                  flat
                  :label="$t('common.btn.viewAll')"
                  class="view-all"
                /> -->
              </div>
            </div>
            <template v-if="isCarousel(cmsItem)">
              <ul class="game-list game-list-carousel long">
                <div class="game-carousel">
                  <Carousel :breakpoints="getBreakpoints(cmsItem)" :transition="500">
                    <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                      <CmsGameItem :entrance="entrance" />
                    </Slide>
                    <template #addons>
                      <Navigation>
                        <template #prev>
                          <button class="custom-arrow left">
                            <img :src="svgIcon('game-arrow-left')" />
                          </button>
                        </template>
                        <template #next>
                          <button class="custom-arrow right">
                            <img :src="svgIcon('game-arrow-right')" />
                          </button>
                        </template>
                      </Navigation>
                    </template>
                  </Carousel>
                </div>
              </ul>
            </template>
            <template v-else>
              <ul class="game-list long">
                <div class="game-grid" :style="getGridStyle(cmsItem)">
                  <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <!-- download -->
      <!-- <div class="download-area">
        <div class="download-main">
          <div class="article">
            <h1>{{ $t("slogan.title1") }}</h1>
            <h5>{{ $t("slogan.subtitle1") }}</h5>
            <p>{{ $t("slogan.content1") }}</p>
          </div>
        </div>
      </div> -->

      <!-- 最新得獎跑馬燈 -->
      <RankBoard class="rank-board" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MarqueeList from "app/template/set_r017/components/MarqueeList.vue"
import HomeBanner from "app/template/set_r017/components/Banner/HomeBanner.vue"
import RankBoard from "app/template/set_r017/components/Carousel/RankBoard.vue"
import GameTab from "app/template/set_r017/components/Tab/GameTab.vue"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { AI_HELPER_EVENT_ROUTES, BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref } from "vue"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import CmsGameItem from "./Cms/CmsGameItem.vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"

const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()
const $q = useQuasar()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { svgIcon } = useSiteImg()

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const innerScrollTop: any = ref(0)

const handleInnerScroll = () => {
  const element = document.getElementById("scrollDom")
  innerScrollTop.value = element?.scrollTop
}

const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useCommonImg()

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.HOME)
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await handleCmsList(CMS_TYPE.Enums.HOME)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r017/assets/css/_variable.scss"
@import "app/template/set_r017/assets/css/common.scss"

.home-layout
  width: 100%
  max-width: 75rem
  height: auto
  position: relative
  padding: 0 0 1.875rem
  margin: 0 auto
  +phone-width
    padding: 0 0.875rem

.game-list
  .carousel
    width: 100%
    @include iphone-width
      min-width: 100%
  ::v-deep(.carousel__prev)
    width: 40px
    height: 40px
    color: $neutral01
    backdrop-filter: blur(2px)
    border-radius: 4px
    text-indent: -100px
    overflow: hidden
    margin: 0 !important
    left: unset
    top: 2rem
    right: 3rem
    +pc-width
      top: 1.5rem
    +iphone-width
      top: 1.3rem
      left: unset

    &:hover
      background: $secondary01
  ::v-deep(.carousel__next)
    width: 40px
    height: 40px
    color: $neutral01
    border-radius: 4px
    margin: 0 !important
    top: 2rem
    &:hover
      background: $secondary01
    +pc-width
      top: 1.5rem
    +iphone-width
      top: 1.3rem
.game-list.game-list-carousel
  position: relative
  display: flex
  align-items: center
  @apply w-screen overflow-hidden
  +iphone-width
    padding-right: 0 !important
    ::v-deep(.carousel__viewport)
      @apply overflow-visible
  // layout style
.home-content
  +setFlex
  flex-direction: column
  .home-content-cms
    width: 100%
  .game-show-area
    +setFlex
    flex-direction: column
    // margin-top: 2rem
    width: 100%
    +phone-width
      padding: 0
    &.provider
      padding-left: 0
      padding-right: 0
    .game-title
      width: 90%
      margin: 0 auto
      height: 4vw
      display: flex
      justify-content: flex-start
      align-items: center
      +pad-width
        height: 40px
      +iphone-width
        height: 8vw
        width: 100%
        padding: 0 5.5vw
      .title-icon
        width: 0.5vw
        height: 1.5vw
        background: $yellow-active
        +pad-width
          width: 5px
          height: 15px
        +iphone-width
          width: 1.2vw
          height: 3.4vw
    .game-list
      +setFlex
      list-style: none
      margin: 0 auto
      padding: 0
      width: 100%
      max-width: 87.5rem
      // min-height: 215px
      position: relative
      // border-radius: 24px
      // background: $background-light-color
      +iphone-width
        display: inline-flex
        background: transparent
        width: 98vw
        min-height: 100px
        border-radius: 0px
        min-width: 0
      &.product
        width: 90%
        margin: 0 auto
        @apply grid grid-cols-2 gap-2
        +iphone-width
          width: 100%
          @apply grid-cols-1
        li
          width: 100%
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            padding: 0
            width: 100%
            cursor: pointer
            border-radius: 23px
            +iphone-width
              margin: 0
              width: 91vw
              border-radius: 12px
            .play-now
              position: absolute
              top: 8vw
              left: 2vw
              +iphone-width
                top: 24vw
                left: 6vw
            :deep(.q-focus-helper)
              opacity: 0 !important
      &.long
        width: 100%
        margin-bottom: 1.25rem
        +pc-width
          width: 100%
        +iphone-width
          width: 100%
          padding-bottom: 0
        img
          +iphone-width
            width: 25vw
          border-radius: 0
      &.join
          @apply grid grid-cols-3 gap-3
          li
            margin-right: 1vw
            img
              border-radius: .625rem
            &:last-child
              margin-right: 0
          +iphone-width
            width: 98vw
      img
        width: 100%
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 91vw
    .provider-list
      @apply w-full bg-black flex overflow-auto gap-3
      color: $neutral01
      padding-left: 4.5vw
      padding-right: 4.5vw
      padding-top: .75rem
      padding-bottom: .75rem
      max-width: 100vw
      scrollbar-width: none
      -ms-overflow-style: none
      .provider-img
        width: 8.5rem
        height: 3rem
        max-width: 8.5rem
  .download-area
    +setFlex
    flex-direction: column
    width: 90%
    max-width: 87.5rem
    +pc-width
      width: 100%
    +iphone-width
      width: 100%
      display: none
    .download-main
      width: 100%
      height: auto
      margin: 50px 0
      background-size: 100%
      background-repeat: no-repeat
      background-image: url('../../assets/images/home/download.png')
      .article
        display: flex
        align-items: flex-start
        -webkit-box-pack: center
        justify-content: center
        flex-flow: column
        font-family: "OpenSans"
        @apply py-10
        h1
          font-family: "OpenSans"
          font-weight: 890
          font-size: 3vw
          line-height: 3vw
          letter-spacing: 0
          color: $neutral01
          margin-bottom: 10px
        h5
          font-family: "OpenSans"
          font-weight: 510
          font-size: 1.2vw
          line-height: 1.5vw
          color: $neutral01
          text-transform: capitalize
        p
          font-weight: 400
          font-size: 1vw
          line-height: 1.5vw
          width: 50%
          letter-spacing: 0.14px
          color: $neutral01
          text-transform: capitalize
          margin-top: 13px

// cms custom style
.game-show-area
  > div
    @apply w-full
  .home-title
    width: 100%
    max-width: 75rem
    position: absolute
    margin: 1rem auto
    @apply flex items-center gap-1 justify-start
    +pc-width
      width: 100%
      max-width: 75rem
    +iphone-width
      margin: 0.5rem auto
      max-width: fit-content
  .home-title-icon
    @apply w-[1.5vw] h-[1.5vw]
    // 仿okbet 初始樣式
    min-width: 25px
    min-height: 25px
    @include iphone-width
      @apply w-[1rem] h-[1rem] min-w-[1rem] min-h-[1rem]
  .title-label
    font-size: 20px
    font-style: normal
    color: $neutral01
    font-weight: 700
    line-height: normal
    height: 2.5vw
    line-height: 2.5vw
    padding-right: 0 0.5vw
    margin-right: 0.5vw
    +iphone-width
      color: $neutral01
      font-weight: 700
      font-family: Helvetica
.game-carousel
  width: 100%
  .carousel
    padding-top: 4rem
    position: inherit
    ::v-deep(.carousel__track)
      .carousel__slide
        justify-content: flex-start
  .custom-arrow
    width: 2.5rem
    height: 2.5rem
    display: flex
    align-items: center
    justify-content: center
    border-radius: 0.25rem
    img
      width: 0.6875rem !important
    &.right
      background: $secondary01
  +iphone-width
    .carousel
      padding-top: 3rem
    ::v-deep(.carousel__track)
      .carousel__slide
        justify-content: flex-start
        @apply pr-2
.game-grid
  @apply grid gap-3
  padding-top: 4rem
  grid-template-columns: repeat(var(--grid-columns), 1fr)
  +iphone-width
    @apply grid gap-4
    padding-top: 2rem
</style>
