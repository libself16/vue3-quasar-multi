<template>
  <div class="menu-tab">
    <div v-if="gameTypeState.list.length" class="carousel" draggable="true">
      <carousel :items-to-show="6" ref="myCarousel">
        <slide v-for="slide in menuTab" :key="slide.frontendKey">
          <div class="carousel-cell">
            <div class="tab-box" :class="{ active: props.tabName === slide.frontendKey }">
              <div class="tab-ico" @click="handleImgClick(slide)">
                <img :src="menuTabImg(slide.frontendKey)" alt="" />
              </div>
              <div class="tab-ttl">{{ $t(`menu.${slide.frontendKey}`) }}</div>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Carousel, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"

import { GAME_TYPE } from "src/common/utils/constants"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { menuTabImg } = useSiteImg()
const { gameTypeState } = useGame()

interface GameTypeItem {
  label?: string
  id?: GAME_TYPE.Enums
  frontendKey: string
  pathName: string
}

const props = defineProps({
  tabName: String,
  tabKey: {
    type: Number,
    default: 1
  }
})
const myCarousel: any = ref(null)

const homeTab: GameTypeItem = {
  frontendKey: "home",
  pathName: "HomePage"
}

const otherTab: GameTypeItem[] = [
  // {
  //   frontendKey: "promos",
  //   pathName: "Promotion"
  // }
  // {
  //   frontendKey: "vip",
  //   pathName: "Vip"
  // }
  // {
  //   frontendKey: "blog",
  //   pathName: "Blog"
  // }
]

const menuTab = computed(() => {
  const gameType = gameTypeState.list.map((item) => ({
    ...item,
    pathName: "ProductLobby"
  })) as GameTypeItem[]

  return [homeTab, ...gameType, ...otherTab]
})

const slideCarousel = () => {
  if (!myCarousel.value) {
    return
  }

  let tabIndex = 0
  if (route.name === "GameLobby" || route.name === "GameList") {
    const gameType = route.params.gameType as any as GAME_TYPE.Enums
    tabIndex = menuTab.value.findIndex((e) => e.id == gameType)
  } else {
    tabIndex = menuTab.value.findIndex((e) => e.pathName === route.name)
  }
  myCarousel.value.slideTo(tabIndex)
  myCarousel.value.updateSlideWidth()
}

const handleImgClick = (item: GameTypeItem) => {
  if (item.id) {
    router.push({ name: item.pathName, params: { gameType: item.id } })
  } else {
    router.push({ name: item.pathName })
  }
}

watchEffect(() => {
  if (route.fullPath && gameTypeState.list.length) {
    nextTick(() => {
      slideCarousel()
    })
  }
})
</script>
<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.menu-tab
  background: #050720
  display: none
  +pad-width
    display: block

.carousel
  background: #050720
  ::v-deep(.carousel__viewport)
    .carousel__track
      margin: 0px

.carousel-cell
  width: 30%
  min-width: 90px
  margin: 5px 0
  border-radius: 5px
  counter-increment: carousel-cell
  &:before
    display: block
    text-align: center
    line-height: 200px
    font-size: 80px
    color: white

.flickity-prev-next-button.previous
  display: none


.flickity-prev-next-button.next
  display: none


ol.flickity-page-dots
  display: none



.tab-box
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding-top: 5px
  cursor: pointer

.tab-ttl
  border-bottom: 5px solid #fff0
  line-height: 10px
  text-align: center
  margin-top: 9px

.tab-box.active .tab-ttl
  border-bottom: 5px solid #ffc000
  padding-bottom: 6px

.mobile-show
  display: none


.desktop-show
  display: block
</style>
