<template>
  <div class="home">
    <div class="header-partial-conatiner">
      <Carousel :wrap-around="true" v-if="bannerList.length">
        <!-- TODO: rebase error -->
        <Slide v-for="(banner, index) in bannerList" :key="index">
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
        <div class="game-list">
          <div class="inc-item-all">
            <div class="lby-box">
              <ul>
                <li v-for="(item, key) in gameTypeState.list" :key="key">
                  <router-link
                    :to="{
                      name: 'ProductLobby',
                      params: { gameType: item.id }
                    }"
                  >
                    <img :src="homeImg(`game-type-${item.frontendKey}.png`)" />
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{
                      name: 'Promotion'
                    }"
                  >
                    <img :src="homeImg('promo.png')" />
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="inc-item">
          <div class="ttl-inx">
            <div class="ttl-inx-l">
              <span><i class="fas fa-info"></i></span>
              {{ $t("home.infomation") }}
            </div>
            <!--<a href="lotto.html" class="btn-find">Find Out More</a>-->
          </div>
          <div class="index-info">
            <div class="cursor-pointer inx-bnr" @click="router.push({ name: 'AppDownload' })">
              <!--<router-link class="index-dl" :to="{ name: 'AppDownload' }">
                <img :src="homeImg('download.png')" />
              </router-link>-->
              <img :src="homeImg('download.png')" />
            </div>
            <div class="inx-bnr-2">
              <div class="in-info">
                <ul class="mb-3 nav nav-pills index-tab" id="pills-tab" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: tab === 1 }" @click="changeTab(1)">{{ $t("home.video") }}</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: tab === 2 }" @click="changeTab(2)">{{
                      $t("home.info_center")
                    }}</a>
                  </li>
                  <!-- <li class="nav-item">
                    <a
                      class="nav-link"
                      >{{ $t('home.blog') }}</a
                    >
                  </li> -->
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: tab === 3 }" @click="changeTab(3)">{{
                      $t("home.contact_us")
                    }}</a>
                  </li>
                </ul>
                <div class="tab-content index-tab-content" id="pills-tabContent">
                  <div
                    class="tab-pane fade"
                    :class="{ 'show active': tab === 1 }"
                    id="video"
                    role="tabpanel"
                    aria-labelledby="video-tab"
                  >
                    <a><img :src="homeImg('video.png')" /></a>
                  </div>
                  <div
                    class="tab-pane fade"
                    :class="{ 'show active': tab === 2 }"
                    id="info"
                    role="tabpanel"
                    aria-labelledby="info-tab"
                  >
                    <router-link :to="{ name: 'WebInformation', params: { id: 'AboutUs' } }">
                      <img :src="homeImg('info-center.png')" />
                    </router-link>
                  </div>
                  <!-- <div
                    class="tab-pane fade"
                    id="blog"
                    role="tabpanel"
                    aria-labelledby="blog-tab"
                  >
                    <a @click="$router.push('/Blog')"
                      ><img src="../../assets/images/home/info-blog.png"
                    /></a>
                  </div> -->
                  <div
                    class="tab-pane fade"
                    id="contact"
                    :class="{ 'show active': tab === 3 }"
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                  >
                    <router-link :to="{ name: 'ContactUs' }">
                      <img :src="homeImg('info-contact.png')" />
                    </router-link>
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
import MenuTab from "app/template/set33/components/MenuTab/Index.vue"
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import { BANNER_POSITION } from "src/common/utils/constants"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import "vue3-carousel/dist/carousel.css"
import { Vue3Marquee } from "vue3-marquee"
import { Carousel, Navigation, Slide } from "vue3-carousel"

const { companyName } = useEnv()
const { bannerList, handleBannerList, getBannerImage } = useBanner()
const { gameTypeState } = useGame()
const { homeImg } = useSiteImg()
const router = useRouter()

const tab = ref(1)
onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
const changeTab = (num: number) => {
  tab.value = num
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.home
  font-family: Nunito, sans-serif
  line-height: 1.4
  font-size: 14px
  margin: 0 auto
  color: #fff
  :deep(.carousel)
    .banner-item
      width: 100vw
  :deep(.carousel__prev),
  :deep(.carousel__next)
    @apply text-gray-500
  .annoucement
    background: #0774b8
    .container-fluid
      padding: 0
      width: 100%
      max-width: 1366px
      .annouc-wrap
        padding: 7px
        display: flex
        gap: 10px
        width: 100%
        justify-content: flex-start
        align-items: center
        .icon-annoucement
          padding: 0 10px
          color: #fff
          font-size: 18px
        .annoucement-text
          width: 100%
          display: flex
          align-items: center
  .step-bar
    background-image: url('../../assets/images/home/step-bg.png')
    +iphone-width
      display: none
    .step_container
      max-width: 1366px
      padding: 0
      margin: 0 auto
      .step-in ul
        display: flex
        justify-content: space-between
        padding-top: 10px
        li
          display: flex
          align-items: center
          .step-text
            padding-left: 20px
          h4
            color: #fff
            font-weight: bold
            font-size: 22px
            background: -webkit-linear-gradient(#ffee00, #b78327)
            -webkit-background-clip: text
            -webkit-text-fill-color: transparent
            filter: drop-shadow(2px 2px #333)
  .home_container
    max-width: 1366px
    padding: 0
    margin: 0 auto
    +iphone-width
      width: 100%
    .game-list
      .inc-item-all
        padding: 20px 0
        +iphone-width
          padding: 20px 20px
        ul
          display: flex
          flex-wrap: wrap
          padding: 0
          justify-content: flex-start
          +iphone-width
            grid-template-columns: repeat(2, 1fr)
            display: grid
          li
            list-style: none
            width: 25%
            position: relative
            +iphone-width
              width: 100%
            a
              text-decoration: none
              cursor: pointer
              transition: all .3s
              img
                transition: all .6s ease-in-out
                -webkit-transition: all .6s ease-in-out
                -moz-transition: all .6s ease-in-out
                -ms-transition: all .6s ease-in-out
                -o-transition: all .6s ease-in-out
                padding: 10px
    .inc-item
      +iphone-width
          padding: 20px 20px
      .ttl-inx
        .ttl-inx-l
          padding: 0 10px
          display: flex
          font-size: 18px
          margin-bottom: 10px
          color: #fff
          font-weight: 700
          span
            margin-right: 10px
            color: #52a0d0
      .index-info
        display: flex
        justify-content: space-between
        position: relative
        +iphone-width
          flex-direction: column
        .inx-bnr
          margin: 0 20px 40px
          width: 100%
          height: 100%
          +iphone-width
            margin: 0 0 50px
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
            .fade:not(.show)
              opacity: 0
          .in-info ul
            display: grid
            grid-template-columns: repeat(3, 1fr)
            border-bottom: 1px solid #239bcc
            margin-bottom: 1rem !important
            li
              cursor: pointer
              .nav-link
                white-space: nowrap
                text-align: center
                color: #fff
                font-weight: 700
                border-radius: 10px 10px 0 0
                border: 1px solid rgba(35, 155, 204, 0)
                text-transform: uppercase
                padding: 5px
                display: block
              .active
                background: linear-gradient(to bottom, #10c0ff 0%, #0c6ba4 50%, #075c8c 100%)
                border-radius: 10px 10px 0 0
                border: 1px solid #239bcc

:deep(.carousel__prev)
  left: 5vw
  +iphone-width
    left: 0

:deep(.carousel__next)
  right: 5vw
  +iphone-width
    right: 0
</style>
