<template>
  <HomeBanner />
  <div class="home-layout">
    <MobileNav v-if="$q.platform.is.mobile" />
    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms" v-if="cmsListState[CMS_TYPE.Enums.HOME].length">
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
      <div class="download-area">
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
      <RankBoard class="rank-board" />
    </div>
  </div>
  <FooterArea />
</template>

<script lang="ts" setup>
import HomeBanner from "app/template/okbet_purple/components/Banner/HomeBanner.vue"
import RankBoard from "app/template/okbet_purple/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet_purple/components/Footer/Index.vue"
import MobileNav from "app/template/okbet_purple/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
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
const { setDefaultProductImg } = useCommonImg()
const { companyName } = useEnv()

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await handleCmsList(CMS_TYPE.Enums.HOME)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/button.scss"

.home-layout
  @apply w-full h-auto pt-8 relative
  background: $bg-dark
  +phone-width
    padding-top: 0

.game-list
  .carousel
    width: 100%
    @include iphone-width
      min-width: 100%
  ::v-deep(.carousel__prev)
    color: #fff
    backdrop-filter: blur(2px)
    border-radius: 50%
    text-indent: -100px
    overflow: hidden
    background: rgba(191, 201, 235, 0.6)
    position: absolute !important
    left: -1vw
    +iphone-width
      left: -4.6vw
  ::v-deep(.carousel__next)
    color: #fff
    border-radius: 50%
    background: rgba(191, 201, 235, 0.6)
    position: absolute !important
    right: -1vw
.game-list.game-list-carousel
  @apply w-screen overflow-hidden
  +iphone-width
    padding-right: 0 !important
    ::v-deep(.carousel__viewport)
      @apply overflow-visible
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
      // padding: 0 4vw
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
      @apply max-w-[87.5rem] min-h-[12.8125rem] relative
      +setFlex
      list-style: none
      margin: 0 auto
      padding: 1.5vw 1vw
      width: 90%
      border-radius: 24px
      background: $bg-dark-secondary
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
          width: 100vw
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
      @apply w-full bg-black text-white flex  overflow-auto gap-3
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
        @apply flex flex-col py-5
        align-items: flex-start
        -webkit-box-pack: center
        justify-content: center
        color: $text-light-tertiary
        h1
          @apply font-black mb-[.625rem]
          font-size: 3vw
          line-height: 3vw
          letter-spacing: 0
          color: $text-light-secondary
        h5
          @apply font-medium
          font-size: 1.2vw
          line-height: 2.5vw
          text-transform: capitalize
        p
          @apply font-normal mt-[.8125rem]
          font-size: 1vw
          line-height: 1.5vw
          width: 50%
          letter-spacing: 0.14px
          text-transform: capitalize

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
      @apply w-[1rem] h-[1rem]
      display: none
  .title-label-area
    @apply flex items-center justify-between w-full
    +iphone-width
      margin: 0.5rem 0.5rem 0.4rem
  .title-label
    @apply font-bold
    font-size: 1.25vw
    font-style: normal
    color: $text-light-secondary
    line-height: normal
    height: 2.5vw
    line-height: 2.5vw
    padding-right: 0 0.5vw
    margin: 0 .5vw
    +iphone-width
      font-size: 4vw
      margin: 0
      height: auto
      line-height: 1rem
  .view-all
    @apply capitalize font-normal
    :deep(.block)
      font-family: "NotoSansTC"
      color:  $text-light-secondary
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
