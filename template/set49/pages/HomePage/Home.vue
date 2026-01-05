<template>
  <CarouselBanner />
  <!-- <MarqueeList /> -->
  <div class="home-layout">
    <div class="home-content">
      <!-- 串接 CMS 首頁入口列表 -->
      <div v-if="cmsListState[CMS_TYPE.Enums.HOME].length" class="home-content-cms">
        <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
          <div v-if="shouldDisplayDevice(cmsItem)" class="home-cms-item">
            <div class="game-title">
              <q-img
                v-if="cmsItem.Setting.icon_path"
                :src="cmsItem.Setting.icon_path"
                class="home-title-icon"
                @error="setDefaultProductImg"
                contain
              />
              <p class="title-label">
                {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
              </p>
            </div>
            <ul class="game-list long slide-game-list">
              <template v-if="isCarousel(cmsItem)">
                <Carousel
                  :breakpoints="getBreakpoints(cmsItem)"
                  :wrapAround="false"
                  :transition="500"
                  snapAlign="start"
                >
                  <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </Slide>
                  <template #addons>
                    <Navigation />
                  </template>
                </Carousel>
              </template>
              <template v-else>
                <div class="game-grid" :style="getGridStyle(cmsItem)">
                  <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <!-- 串接 CMS 網頁形象圖 -->
      <template v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length">
        <div class="game-show-area">
          <ul class="game-list join">
            <li
              v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].slice(0, 3)"
              :key="cmsIndex"
            >
              <q-img
                @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
                :src="cmsItem.Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
                class="cursor-pointer"
                contain
              />
            </li>
          </ul>
        </div>
        <div
          v-if="
            cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length > 3 &&
            cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3]?.Setting
          "
          class="game-show-area"
        >
          <img
            @click="
              handleEntranceClick({ entrance: cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3].Entrance[0] })
            "
            :src="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3].Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
            class="px-[4.5vw]"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set49/composables/useCms"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted } from "vue"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import CmsGameItem from "./Cms/CmsGameItem.vue"

const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const { getAllGames } = useGame()
const { handleBannerList } = useBanner()
const { downloadImg, homeImg, setDefaultProductImg } = useSiteImg()

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await getAllGames()
  await handleCmsList(CMS_TYPE.Enums.HOME)
  await handleCmsList(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.home-layout
  width: 100%
  height: 70%
  padding-top: 2rem
  +phone-width
    padding-top: 1.25rem

.game-list
  .carousel
    @apply w-full
    .carousel__viewport
      li
        @apply justify-start
  ::v-deep(.carousel__prev)
    width: 20px
    height: 20px
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    top: -2vw !important
    right: 40px
    left: unset
    +phone-width
      right: 2rem !important
    +iphone-width
      top: -4vw !important
  ::v-deep(.carousel__next)
    width: 20px
    height: 20px
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    top: -2vw !important
    +iphone-width
      top: -4vw !important
// layout style
.home-content
  +setFlex
  flex-direction: column
  .game-show-area
    +setFlex
    flex-direction: column
    padding: 1vw
    width: 100%
    &.provider
      padding-left: 0
      padding-right: 0
    .game-title
      width: 100%
      display: flex
      justify-content: flex-start
      align-items: center
      padding: 0 5vw
      +pad-width
        height: 40px
      +iphone-width
        height: 8vw
        padding: 0 1.75rem
      .title-icon
        width: 0.5vw
        height: 1.5vw
        background: $yellow-active
        margin-right: 0.5rem
        +pad-width
          width: 5px
          height: 15px
        +iphone-width
          width: 1.2vw
          height: 3.4vw

      p.title-label
        color: #FFF
        font-weight: 700
        font-size: 1.5rem
        +iphone-width
          font-size: 1rem
    .game-list
      +setFlex
      @apply justify-start
      list-style: none
      margin-top: 1.75rem
      margin-bottom: 2.75rem
      padding: 0 5vw
      width: 100%
      +iphone-width
        display: inline-block
        padding: 0 3.5vw
        margin-top: .875rem
        margin-bottom: 2.5rem
      &.slide-game-list
        +iphone-width
          padding: 0 28px
      &.product
        @apply w-full grid grid-cols-2 gap-2
        +iphone-width
          @apply grid-cols-1
        li
          width: 96%
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            padding: 0
            width: 100%
            cursor: pointer
            +iphone-width
              margin: 0
              width: 91vw
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
        li
          // margin-right: 1vw
        img
          // width: 90%
          // border-radius: .75rem
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
        // margin-right: 1vw
        width: 35vw
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 100vw
        // max-width: 200px
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
// custom cms style
.home-content-cms
  @apply flex flex-col w-full
  +phone-width
    @apply pt-4 !important
  @apply py-[1vw]
  .game-show-area
    @apply px-[0.5vw]
  .image-container
    @apply flex w-full px-[4.5vw]
  .home-cms-item
    @apply flex flex-col w-full
    .game-list
      .game-item
        @apply mx-1 md:mr-3
    +phone-width
      @apply relative
      .game-title
        @apply absolute -top-[1.5rem] left-0
      ::v-deep(.carousel__prev)
        @apply -top-[1.5rem] !important
      ::v-deep(.carousel__next)
        @apply -top-[1.5rem] !important
    .home-title-icon
      @apply w-[3vw] h-[3vw] mr-[0.5rem]
  .game-grid
    @apply grid gap-3
    grid-template-columns: repeat(var(--grid-columns), 1fr)
  +phone-width
    @apply pt-[3.75rem]
</style>
