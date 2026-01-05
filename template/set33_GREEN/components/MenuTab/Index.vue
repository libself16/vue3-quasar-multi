<template>
  <div class="menu-tab">
    <div v-if="gameTypeState.list.length" class="carousel" draggable="true">
      <carousel :items-to-show="5" ref="myCarousel" snapAlign="start">
        <slide v-for="(cmsItem, cmsIndex) in navigationBarList" :key="cmsIndex">
          <div class="carousel-cell">
            <div class="tab-box" :class="{ active: isActive(cmsItem.Entrance[0]) }">
              <div class="tab-ico" @click="handleEntranceClick(cmsItem.Entrance[0])">
                <img
                  :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
                />
              </div>
              <div class="tab-ttl">
                {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
              </div>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set33_GREEN/composables/useCms"
import { computed, nextTick, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Carousel, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"

import { GAME_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useI18n } from "vue-i18n"
import { MENU } from "../../utils/constants"

const { t } = useI18n()
const router = useRouter()
const { isLogin } = useAuth()
const route = useRoute()
const { menuTabImg } = useSiteImg()
const { gameTypeState } = useGame()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { cmsListState, navigationBarList, handleCmsList, handleEntrance } = useCms()

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
  {
    frontendKey: "promos",
    pathName: "Promotion"
  }
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

  const tabIndex = navigationBarList.value.findIndex(
    (item) => item.Entrance?.[0]?.payload?.game_type === Number(route.params.gameType)
  )

  if (tabIndex === -1) {
    myCarousel.value.slideTo(0)
  } else {
    myCarousel.value.slideTo(tabIndex)
  }

  myCarousel.value.updateSlideWidth()
}

const handleImgClick = (item: GameTypeItem) => {
  if (item.id) {
    router.push({ name: item.pathName, params: { gameType: item.id } })
  } else {
    router.push({ name: item.pathName })
  }
}

const limitWordLength = (word: string) => {
  if (!word) return ""
  return word.length > 10 ? word.slice(0, 5) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
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
  background: #011202
  display: none
  +pad-width
    display: block

.carousel
  background: #011202
  ::v-deep(.carousel__viewport)
    .carousel__track
      margin: 0px

.carousel-cell
  width: 30%
  min-width: 105px
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
  line-height: 15px
  text-align: center
  margin-top: 9px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  width: 100%
  // &:hover
  //   color: red
  //   white-space: normal
  //   overflow: visible
  //   text-overflow: unset

.tab-box.active .tab-ttl
  border-bottom: 5px solid #ffc000
  padding-bottom: 6px

.mobile-show
  display: none


.desktop-show
  display: block

.tab-ico
  width: 37%
</style>
