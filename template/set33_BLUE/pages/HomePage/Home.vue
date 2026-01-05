<template>
  <div class="home">
    <div class="header-partial-conatiner">
      <Carousel :wrap-around="true" v-if="bannerList.length">
        <!-- TODO: rebase error -->
        <Slide v-for="(banner, index) in bannerList" :key="index" @click="handleBannerRedirect(banner)">
          <div class="carousel__item">
            <img :src="getBannerImage(banner)" class="banner-item" />
          </div>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
      <div class="step-bar">
        <div class="step_container">
          <div class="step-in">
            <ul>
              <li>
                <div class="step-icon">
                  <img :src="homeImg('step-1.png')" />
                </div>
                <div class="step-text">
                  <h4>{{ $t("home.joinUs") }}</h4>
                  <p>{{ $t("home.step_join_tip") }}</p>
                </div>
              </li>
              <li>
                <div class="step-icon">
                  <img :src="homeImg('step-2.png')" />
                </div>
                <div class="step-text">
                  <h4>{{ $t("home.step_deposit_title") }}</h4>
                  <p>{{ $t("home.step_deposit_tip") }}</p>
                </div>
              </li>
              <li>
                <div class="step-icon">
                  <img :src="homeImg('step-3.png')" />
                </div>
                <div class="step-text">
                  <h4>{{ $t("home.step_play_title") }}</h4>
                  <p>{{ $t("home.step_play_tip") }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--step-bar end-->
      <MenuTab :tabName="'home'"></MenuTab>
      <div class="home_container">
        <!-- 串接 CMS 首頁入口列表 -->
        <div v-if="cmsListState[CMS_TYPE.Enums.HOME].length" class="game-list">
          <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
            <div v-if="shouldDisplayDevice(cmsItem)">
              <div class="home-title">
                <q-img
                  v-if="cmsItem.Setting.icon_path"
                  :src="cmsItem.Setting.icon_path"
                  fit="contain"
                  class="home-title-icon"
                  :error-src="gameDefaultImg"
                />
                <div class="flex items-center justify-between w-full">
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
              <ul>
                <template v-if="isCarousel(cmsItem)">
                  <Carousel
                    :breakpoints="getBreakpoints(cmsItem)"
                    :wrapAround="shouldWrapAround(cmsItem)"
                    :transition="500"
                  >
                    <Slide v-for="entrance in cmsItem.Entrance" :key="entrance.img_path">
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
        <!-- 串接 CMS 首頁 Information 圖片 -->
        <div v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length" class="game-type-item">
          <div class="ttl-inx">
            <div class="ttl-inx-l">
              <span><i class="fas fa-info"></i></span>
              {{ cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][0].Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
            </div>
          </div>
          <div class="index-info">
            <div class="inx-bnr">
              <q-img
                @click="handleEntranceClick(cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][0].Entrance[0])"
                :src="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][0].Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
                class="cursor-pointer"
                contain
              />
            </div>
            <div class="inx-bnr-2">
              <div v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length > 1" class="in-info">
                <ul class="mb-3 nav nav-pills index-tab" id="pills-tab" role="tablist">
                  <li
                    v-for="(item, index) in cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].slice(1)"
                    :key="index"
                    class="nav-item"
                  >
                    <a class="nav-link" :class="{ active: tab === index + 1 }" @click="changeTab(index + 1)">
                      {{ item.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
                    </a>
                  </li>
                </ul>
                <div class="tab-content index-tab-content" id="pills-tabContent">
                  <div
                    v-for="(item, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].slice(1)"
                    :key="cmsIndex"
                    class="tab-pane fade"
                    :class="{ 'show active': tab === cmsIndex + 1 }"
                    :id="`tab-${cmsIndex + 1}`"
                    role="tabpanel"
                    :aria-labelledby="`tab-${cmsIndex + 1}-tab`"
                  >
                    <q-img
                      @click="handleEntranceClick(item.Entrance[0])"
                      :src="item.Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
                      class="cursor-pointer"
                      contain
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end-->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set33_BLUE/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE, CMS_VIEW_ALL } from "src/common/utils/constants"
import { useRouter } from "vue-router"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import { useEntranceHandler } from "app/template/set33_BLUE/composables/useCms"
import MenuTab from "app/template/set33_BLUE/components/MenuTab/Index.vue"
import CmsGameItem from "./Cms/CmsGameItem.vue"
import "vue3-carousel/dist/carousel.css"
import type * as Response from "src/api/response.type"

const { companyName } = useEnv()
const { bannerList, handleBannerList, getBannerImage, handleBannerRedirect } = useBanner()
const { gameDefaultImg } = useCommonImg()
const { homeImg } = useSiteImg()
const { cmsListState, handleCmsList, getBreakpoints, shouldDisplayDevice, getGridStyle, isCarousel, shouldWrapAround } =
  useCms()
const router = useRouter()
const tab = ref(1)
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

const changeTab = (num: number) => {
  tab.value = num
}

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  await handleCmsList(CMS_TYPE.Enums.HOME)
  await handleCmsList(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.home
  font-family: Nunito, sans-serif
  line-height: 1.4
  font-size: .875rem
  margin: 0 auto
  color: #fff
  :deep(.carousel)
    .banner-item
      width: 100vw
  .annoucement
    background: #0774b8
    .container-fluid
      padding: 0
      width: 100%
      max-width: 85.375rem
      .annouc-wrap
        padding: .4375rem
        display: flex
        gap: .625rem
        width: 100%
        justify-content: flex-start
        align-items: center
        .icon-annoucement
          padding: 0 .625rem
          color: #fff
          font-size: 1.125rem
        .annoucement-text
          width: 100%
          display: flex
          align-items: center
  .step-bar
    background-image: url('../../assets/images/home/step-bg.png')
    +iphone-width
      display: none
    .step_container
      max-width: 85.375rem
      padding: 0
      margin: 0 auto
      .step-in ul
        display: flex
        justify-content: space-between
        padding-top: .625rem
        li
          display: flex
          align-items: center
          .step-text
            padding-left: 1.25rem
          h4
            color: #fff
            font-weight: bold
            font-size: 1.375rem
            background: -webkit-linear-gradient(#ffee00, #b78327)
            -webkit-background-clip: text
            -webkit-text-fill-color: transparent
            filter: drop-shadow(.125rem .125rem #333)
  .home_container
    max-width: 1320px
    padding: 0
    margin: 0 auto
    +pc-lg-width
      max-width: 1140px
    +pc-width
      max-width: 960px
    +pad-width
      max-width: 540px
    +iphone-width
      width: 100%
    .game-type-item
      +iphone-width
        padding: 1.25rem 1.25rem
      .ttl-inx
        .ttl-inx-l
          img
            height: 1.25rem
            margin-right: .625rem
          i
            color: #52a0d0
            padding: 0 .625rem
          display: flex
          font-size: 1.125rem
          margin-bottom: .625rem
          color: #fff
          font-weight: 700
      .index-info
        display: flex
        justify-content: space-between
        position: relative
        +iphone-width
          flex-direction: column
        .inx-bnr
          margin: 0 1.25rem 2.5rem
          width: 100%
          height: 100%
          +iphone-width
            margin: 0 0 3.125rem
          a
            text-decoration: none
            cursor: pointer
            transition: all .3s
        .inx-bnr-2
          width: 70%
          +iphone-width
            width: 100%
          .tab-content
            .active
              display: block !important
            .fade
              transition: opacity .15s linear
            .tab-pane
              text-align: center
              display: none
              a
                img
                  width: 100%
            .fade:not(.show)
              opacity: 0
          .in-info ul
            display: grid
            grid-template-columns: repeat(3, 1fr)
            border-bottom: .0625rem solid #47B83D
            margin-bottom: 16px !important
            li
              cursor: pointer
              .nav-link
                white-space: nowrap
                text-align: center
                color: #fff
                font-weight: 700
                border-radius: .625rem .625rem 0 0
                border: .0625rem solid rgba(35, 155, 204, 0)
                padding: .3125rem
                display: block
              .active
                background: linear-gradient(to bottom, #10c0ff 0%, #0c6ba4 50%, #075c8c 100%)
                border-radius: .625rem .625rem 0 0
                border: .0625rem solid #239bcc
    .game-list
      .inc-item-all
        padding: 20px 0
        +iphone-width
          padding: 15px
        .lby-box ul
          display: flex
          flex-wrap: wrap
          padding: 0rem
          justify-content: flex-start
          li
            padding: .625rem
            list-style: none
            width: 25%
            position: relative
            +pad-width
              width: 50%
        .inc-item
          .ttl-inx
            display: flex
            justify-content: space-between
            align-items: center
            margin: 10px 0
            :deep(.q-btn)
              text-transform: none
              &.bg-find
                background: #022b47
            .ttl-inx-l
              padding: 0 .625rem
              display: flex
              font-size: 24px
              margin-bottom: .625rem
              color: #fff
              font-weight: 700
              .icon-img
                width: 5vw
                height: 5vw
                max-width: 2.5rem
                max-height: 2.5rem
                margin-right: 10px
                vertical-align: middle
              &.yellow-type
                font-size: 36px
                color: #f1d908
                +iphone-width
                  font-size: 20px
                  color: #fff
            .icon-img
              width: 36px
              height: 36px
              +iphone-width
                width: 20px
                height: 20px
              span
                margin-right: .625rem
                color: #52a0d0
          .game-item
            background: transparent
            border: 0
            padding: 0

            img
              border-radius: 10%
              vertical-align: top
          .indx-3
            ul
              @apply grid grid-cols-3 gap-4 mt-5
          .indx-7
            ul
              @apply grid grid-cols-9 gap-4
              +pc-lg-width
                @apply grid-cols-8
              +pc-width
                @apply grid-cols-5
              +iphone-width
                @apply grid-cols-3

.carousel__slide
  padding: 0 .625rem
  padding-left: 0
  padding-right: 0
  .carousel-cell
    width: 100%
    min-width: 5.625rem
    margin: .3125rem 0
    border-radius: .3125rem
    counter-increment: carousel-cell
    .game-item
      background: transparent
      border: 0
      padding: 0
      border-radius: 10%
      img
        border-radius: 10%
        vertical-align: top

:deep(.carousel__prev)
  left: 5vw
  +iphone-width
    left: 0

:deep(.carousel__next)
  right: 5vw
  +iphone-width
    right: 0

// cms custom style
.game-list
  @apply my-5
  +iphone-width
    @apply p-4 my-0
  .home-title
    @apply flex items-center gap-1 w-full justify-start mb-2
  .home-title-icon
    @apply w-[3.5rem] h-[3.5rem]
    @include iphone-width
      @apply w-[2.5rem] h-[2.5rem]
  .title-label
    @apply font-black text-2xl
    font-family: "NotoSansTC"
    font-style: normal
    line-height: normal
    text-transform: uppercase
    height: 2.5vw
    line-height: 2.5vw
    padding-right: 0 0.5vw
    margin: 0.5vw
    +iphone-width
      font-size: 3vw
  .view-all
    @apply capitalize font-normal
    :deep(.block)
      font-family: "NotoSansTC"
  .game-grid
    @apply grid gap-4
    grid-template-columns: repeat(var(--grid-columns), 1fr)
    .carousel
      max-width: 62.5rem
    @include iphone-width
      min-width: 100%
  ::v-deep(.carousel__prev)
    color: #fff
    backdrop-filter: blur(2px)
    border-radius: 50%
    text-indent: -100px
    overflow: hidden
    background: #03764D
    position: absolute !important
    left: -3vw
    &:hover
      background: #23A073
  ::v-deep(.carousel__next)
    color: #fff
    border-radius: 50%
    background: #03764D
    position: absolute !important
    right: -3vw
    &:hover
      background: #23A073
</style>
