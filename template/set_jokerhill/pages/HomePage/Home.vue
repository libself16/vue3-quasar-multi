<template>
  <div class="carousel-box">
    <CommonCarouselBanner v-if="isMobile" />
    <CarouselBanner v-else />
  </div>
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
              <div class="flex items-center justify-between w-[95%]">
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
      <!-- 首頁形象圖 CMS -->
      <template v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length">
        <div v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][0]?.Setting" class="game-show-area">
          <div class="game-list welcome">
            <CmsInformationImage :item="mainInfoImageItem" />
          </div>
        </div>
        <!-- join us -->
        <div v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length > 1" class="game-show-area">
          <div class="game-title">
            <div class="title-icon"></div>
            <p class="title-label">{{ $t("home.joinUs") }}</p>
          </div>
          <ul class="game-list join">
            <li v-if="joinUsImageItem1?.Setting || joinUsImageItem2?.Setting" class="join-left">
              <CmsInformationImage v-if="joinUsImageItem1?.Setting" :item="joinUsImageItem1" />
              <CmsInformationImage v-if="joinUsImageItem2?.Setting" :item="joinUsImageItem2" />
            </li>
            <li v-if="joinUsImageItem3?.Setting" class="join-right">
              <CmsInformationImage :item="joinUsImageItem3" />
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue"
import { useRoute } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE, CMS_VIEW_ALL } from "src/common/utils/constants"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCms } from "src/common/composables/useCms"
import CarouselBanner from "app/template/set_jokerhill/components/CarouselBanner.vue"
import CommonCarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import CmsGameItem from "app/template/set_jokerhill/pages/HomePage/Cms/CmsGameItem.vue"
import CmsInformationImage from "app/template/set_jokerhill/pages/HomePage/Cms/CmsInformationImage.vue"
import type * as Response from "src/api/response.type"

const route = useRoute()
const { width } = useWindowSize()
const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useSiteImg()
const eventbus = injectStrict(EventBusKey)
const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle } = useCms()
const { nowLang } = useLanguage()

const isMobile = ref(false)

const handleLoginMeta = () => {
  if (route.meta.login) {
    eventbus.emit("openLogin", true)
  }
}

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const homeInfoImages = computed<Response.CmsItem[]>(
  () => (cmsListState.value as Record<number, Response.CmsItem[]>)[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE] || []
)

const mainInfoImageItem = computed(() => homeInfoImages.value[0])
const joinUsImageItem1 = computed(() => homeInfoImages.value[1])
const joinUsImageItem2 = computed(() => homeInfoImages.value[2])
const joinUsImageItem3 = computed(() => homeInfoImages.value[3])

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await handleCmsList(CMS_TYPE.Enums.HOME)
  await handleCmsList(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)
  handleLoginMeta()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_jokerhill/assets/css/scss/button.scss"

.carousel-box
  width: 100%
  padding: 0 5vw
  +phone-width
    padding: 0
.home-layout
  width: 100%
  height: 70%
  padding-top: 2rem
  +phone-width
    padding-top: 1rem
.game-list
  .carousel
    .carousel__viewport
      li
        // padding: 0 0.5vw
  ::v-deep(.carousel__prev)
    width: 20px
    height: 20px
    color: #fff
    border: 1px solid #cac8ef
    border-radius: 50%
    background: #cac8ef
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
    color: #fff
    border: 1px solid #cac8ef
    border-radius: 50%
    background: #cac8ef
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
    background-color: #F5F5F5
    flex-direction: column
    padding: 1vw
    width: 100%
    &.product
      margin: 2vw 0
      background: linear-gradient(270deg, rgba(56, 164, 177, 0.40) 0%, rgba(140, 130, 233, 0.40) 100%)
      +iphone-width
        margin-top: 10px
    &.provider
      padding-left: 0
      padding-right: 0
    .game-title
      width: 100%
      height: 4vw
      display: flex
      justify-content: flex-start
      align-items: center
      padding: 0 5vw
      +pad-width
        height: 40px
      +iphone-width
        height: 8vw
        padding: 0 5.5vw
      .title-icon
        width: 1.5vw
        height: 1.5vw
        background-image: url("app/template/set_jokerhill/assets/images/home/title-icon.png")
        background-repeat: no-repeat
        background-size: 100%
        +pad-width
          width: 15px
          height: 15px
        +iphone-width
          width: 3.4vw
          height: 3.4vw

      p.title-label
        color: #14141466
        font-family: "NotoSansTC"
        font-size: 1.4vw
        font-style: normal
        font-weight: 700
        line-height: normal
        text-transform: uppercase
        height: 2.5vw
        line-height: 2.5vw
        padding-right: 0 0.5vw
        margin: 0 .5vw
        +iphone-width
          font-size: 3vw
    .game-list
      +setFlex
      list-style: none
      margin: 0
      padding: 0 4.5vw
      width: 100%
      +iphone-width
        display: inline-block
        width: 98vw
        padding: 0 3.5vw
      &.slide-game-list
        +iphone-width
          padding: 0 28px
      &.product
        @apply w-full grid grid-cols-4 gap-4
        +iphone-width
          @apply grid-cols-2
        li
          width: 96%
          +setFlex
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            padding: 0
            width: 100%
            cursor: pointer
            &::before
              box-shadow: none
            +iphone-width
              margin: 0
              width: 40vw
            .play-now
              position: absolute
              top: 10vw
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
      &.welcome
        @apply mt-5
        li
          @apply px-2
          img
            &:last-child
              display: none
            +iphone-width
              &:first-child
                display: none
              &:last-child
                display: block
      &.join
        @apply flex gap-10
        li
          @apply px-1
          img
            @apply pb-2
        +iphone-width
          @apply mb-10
          flex-direction: column
          li
            @apply px-2
            img
              @apply py-1
      img
        width: 100%
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 100vw
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
.view-all
  background: linear-gradient(270deg, rgba(56, 164, 177, 0.40) 0%, rgba(140, 130, 233, 0.40) 100%)
  color: #fff
</style>
