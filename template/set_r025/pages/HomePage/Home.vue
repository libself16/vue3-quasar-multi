<template>
  <div class="w-full" :class="{ 'px-6': !$q.platform.is.mobile }">
    <HomeBanner />
  </div>

  <div class="home-layout">
    <div class="px-4 phone:px-2">
      <MobileNav />
    </div>

    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms px-6 phone:px-4" v-if="cmsListState[CMS_TYPE.Enums.HOME].length">
        <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
          <template v-if="shouldDisplayDevice(cmsItem)">
            <div class="home-title" v-if="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] != ''">
              <q-img
                v-if="cmsItem.Setting.icon_path"
                :src="cmsItem.Setting.icon_path"
                class="home-title-icon"
                @error="setDefaultProductImg"
              />
              <div class="title-label-area">
                <p class="title-label">
                  {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
                </p>
                <q-btn
                  v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
                  :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
                  flat
                  :label="$t('common.btn.viewAll')"
                  class="view-all"
                />
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
                      <Navigation />
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
          </template>
        </div>
      </div>

      <!-- download -->
      <div class="download-area px-6 phone:px-4 relative">
        <div class="download-main">
          <!-- <img :src="downloadImg" alt="" /> -->
          <div class="article">
            <h1>{{ $t("slogan.title1") }}</h1>
            <h5>{{ $t("slogan.subtitle1") }}</h5>
            <p>{{ $t("slogan.content1") }}</p>
          </div>
        </div>
      </div>

      <!-- 最新得獎跑馬燈 -->
      <div :class="cx('w-[90%] pc:w-full', FLEX_JUSTIFY_CENTER, 'px-4 phone:px-2')">
        <RankBoard class="rank-board" />
      </div>
    </div>
  </div>
  <FooterArea />
</template>

<script lang="ts" setup>
import HomeBanner from "app/template/set_r025/components/Banner/HomeBanner.vue"
import RankBoard from "app/template/set_r025/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/set_r025/components/Footer/Index.vue"
import MobileNav from "app/template/set_r025/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import {
  BANNER_POSITION,
  CMS_TYPE,
  LANGUAGE_TYPE,
  CMS_VIEW_ALL,
  AI_HELPER_EVENT_ROUTES
} from "src/common/utils/constants"
import { computed, onMounted, ref } from "vue"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import CmsGameItem from "./Cms/CmsGameItem.vue"
import { cx } from "src/common/utils/cx"
import { FLEX_JUSTIFY_CENTER } from "src/common/utils/constants/styles"

const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

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
@import "app/template/set_r025/assets/css/_variable.sass"
@import "app/template/set_r025/assets/css/button.scss"

.home-layout
  width: 100%
  height: auto
  padding-top: 2rem
  position: relative
  +phone-width
    padding-top: 0

.game-list
  .carousel
    width: 100%
    @include iphone-width
      min-width: 100%
  ::v-deep(.carousel__prev)
    color: $text-light-color
    backdrop-filter: blur(2px)
    border-radius: 50%
    text-indent: -100px
    overflow: hidden
    background: rgba($secondary-card-light, 0.6)
    position: absolute !important
    left: -1vw
    +iphone-width
      left: -4.6vw
    &:hover
      background: $primany-01
  ::v-deep(.carousel__next)
    color: $functional-btn-text-primany
    border-radius: 50%
    background: rgba($secondary-card-light, 0.6)
    position: absolute !important
    right: -1vw
    &:hover
      background: $primany-01
.game-list.game-list-carousel
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
    width: 100%
    +phone-width
      padding: 0
      margin-top: 0.5rem
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
      padding: 1.5vw 1vw
      width: 90%
      max-width: 87.5rem
      min-height: 205px
      position: relative
      border-radius: 24px
      background: $secondary-card
      +pc-width
        width: 100%
      +iphone-width
        display: inline-block
        background: transparent
        width: 98vw
        min-height: auto
        padding: 0 0.5rem
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
        width: 90%
        margin-bottom: 1.25rem
        +pc-width
          width: 100%
        +iphone-width
          width: 100%
          padding-bottom: 0
          margin-bottom: 0.25rem
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
      color: $text-light-color
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
      @apply w-full h-auto mx-0 my-[3.125rem]
      @apply bg-center bg-[size:100%_auto] bg-no-repeat
      background-image: url('../../assets/images/home/download.png')

      .article
        @apply py-10 w-1/2
        display: flex
        align-items: flex-start
        -webkit-box-pack: center
        justify-content: center
        flex-flow: column
        font-family: "OpenSans"
        h1
          @apply text-[2.5rem] phone:text-2xl iphone:text-xl leading-none font-black
          font-family: "OpenSans"
          letter-spacing: 0
          color: $neutral-01
          margin-bottom: 10px
        h5
          @apply text-lg phone:text-base iphone:text-sm leading-[1.2] font-medium capitalize
          font-family: "OpenSans"
          color: $neutral-01
        p
          @apply text-base phone:text-sm iphone:text-xs leading-[1.5] font-normal
          letter-spacing: 0.14px
          color: $neutral-02
          text-transform: capitalize
          margin-top: 13px

// cms custom style
.game-show-area
  > div
    @apply w-full
  .home-title
    width: 90%
    max-width: 87.5rem
    margin: 1rem auto
    @apply flex items-center gap-1 justify-start
    +pc-width
      width: 100%
      max-width: 87.5rem
    +iphone-width
      margin: 0 auto
  .home-title-icon
    @apply w-[1.5vw] h-[1.5vw]
    // 仿okbet 初始樣式
    min-width: 25px
    min-height: 25px
    @include iphone-width
      @apply w-[1rem] h-[1rem] min-w-[1rem] min-h-[1rem]
  .title-label-area
    @apply flex items-center justify-between w-full
    +iphone-width
      margin: 0.5rem 0.5rem 0.4rem

    .title-label
      @apply text-2xl phone:text-lg iphone:text-base
      font-style: normal
      color: $neutral-01
      font-weight: 700
      line-height: normal
      height: 2.5vw
      line-height: 2.5vw
      padding-right: 0 0.5vw
      margin: 0 .5vw
      +iphone-width
        color: $neutral-01
        font-weight: 700
        font-family: Helvetica
        margin: 0
        height: auto
        line-height: 1rem
  .view-all
    @apply capitalize font-normal
    :deep(.block)
      @apply text-lg phone:text-base iphone:text-sm
      font-family: "NotoSansTC"
      color: $neutral-01
    +iphone-width
      padding-top: 0
      padding-bottom: 0
      min-height: auto
      line-height: 1rem
.game-carousel
  +iphone-width
    ::v-deep(.carousel__track)
      .carousel__slide
        @apply pr-2
.game-grid
  @apply grid gap-3
  grid-template-columns: repeat(var(--grid-columns), 1fr)
  +iphone-width
    @apply grid gap-2
</style>
