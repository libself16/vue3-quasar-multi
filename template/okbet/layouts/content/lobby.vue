<template>
  <div class="lobby-content">
    <div class="game-show-area">
      <!-- <BreadcrumbBox :routes="routes"></BreadcrumbBox> -->
      <ul class="game-list product">
        <template v-if="!isMobile">
          <li v-for="item in 2" :key="item">
            <div class="game-box" v-for="n in 2" :key="n">
              <PlayNowBtn :disable="item === 2 && n === 2"></PlayNowBtn>
              <img :src="lobbyGameImg(n + (item - 1) * 2)" />
            </div>
          </li>
        </template>

        <template v-else>
          <li v-for="item in 4" :key="item">
            <div class="game-box">
              <PlayNowBtn :disable="item === 4"></PlayNowBtn>
              <img :src="lobbyGameImg(item)" />
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { defineComponent, ref, Ref, computed, watch } from "vue"
import PlayNowBtn from "src/common/components/PlayNowBtn.vue"
import { useWindowSize } from "@vueuse/core"

import { Carousel, Navigation, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

interface GameItem {
  fileName: string
  title: string
}

export default defineComponent({
  name: "AsideMenu",
  components: {
    PlayNowBtn
  },
  setup() {
    const { lobbyGameImg } = useSiteImg()
    const { width } = useWindowSize()
    let isMobile = ref(false)
    let gameAreaList: Ref<GameItem[]> = ref([
      {
        fileName: "new-game",
        title: "NEW GAME"
      },
      {
        fileName: "popular",
        title: "POPULAR"
      }
    ])

    const routes = computed(() => [
      {
        title: "Lobby",
        routeName: "lobby"
      }
    ])

    watch(
      width,
      (newWidth) => {
        if (newWidth >= 769) {
          isMobile.value = false
        } else {
          isMobile.value = true
        }
      },
      { immediate: true }
    )

    return {
      isMobile,
      gameAreaList,
      routes,
      // 圖片類
      lobbyGameImg
    }
  },
  mounted() {
    console.log("mounted")
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet/assets/css/_variable.sass"

.game-list
  .carousel
    .carousel__viewport
      li
        padding-right: 0.5vw
  ::v-deep(.carousel__prev)
    width: 2vw
    height: 2vw
    color: rgba($text-light-color, 0.7)
    border: 1px solid $border-midnight-gray-color
    border-radius: 50%
    background: rgba($background-light-color, 0.2)
    position: absolute !important
    top: -2vw!important
    left: 61vw !important
    +pc-width
      left: 58vw !important
    +phone-width
      left: 56vw !important
    +iphone-width
      left: 78vw !important
  ::v-deep(.carousel__next)
    width: 2vw
    height: 2vw
    color: rgba($text-light-color, 0.7)
    border: 1px solid $border-midnight-gray-color
    border-radius: 50%
    background: rgba($background-light-color, 0.2)
    position: absolute !important
    top: -2vw !important
    +iphone-width
      right: 0vw !important
// layout style
.lobby-content
  +setFlex
  flex-direction: column
  +iphone-width
    padding-bottom: 88vw
  .game-show-area
    +setFlex
    flex-direction: column
    padding: 1vw
    .game-list
      +setFlex
      list-style: none
      margin: 2vw 0
      padding: 0 4.5vw
      width: 100%
      +iphone-width
        padding: 0 3.5vw
      &.product
        flex-direction: column
        width: 100%
        li
          width: 100%
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            width: 49%
            +iphone-width
              margin: 0
              width: 100%
            .play-now
              position: absolute
              top: 9vw
              left: 2vw
              +iphone-width
                top: 24vw
                left: 6vw
</style>
