<template>
  <div class="home-content">
    <div class="game-show-area" v-for="(item, key) in gameAreaList" :key="key">
      <SlideArea :slide="item"></SlideArea>
    </div>
    <!-- <div class="game-show-area">
      <GameArea :list="gameDetailList"></GameArea>
    </div> -->
    <div class="game-show-area">
      <div class="game-title small">
        <p class="title-label">Real time transaction</p>
      </div>
      <ul class="game-list marquee">
        <MarqueeTag></MarqueeTag>
      </ul>
    </div>
    <div class="game-show-area">
      <div class="con-info">
        <div class="con">
          <h1>Top Slot Game Platform</h1>
          <p>
            Explore an extensive selection of Slot Games sourced from renowned vendors worldwide. Engage with
            award-winning slot games through our internationally acclaimed, game-centric platform – an exclusive
            experience brought to you solely by Epicwin!
          </p>
        </div>
        <div class="con">
          <h1>Affiliate Partnership with Epicwin</h1>
          <p>
            Here at Epicwin Affiliates, we acknowledge the paramount importance of our affiliate partners. Our amiable
            and skilled team is dedicated to supporting you throughout your endeavor to generate profits alongside us.
            Embark on your journey with us today!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from "vue"
import { useRouter } from "vue-router"
import MarqueeTag from "src/common/components/MarqueeTag.vue"
import SlideArea from "../SlideArea.vue"
import GameArea from "../GameArea.vue"
import { useWindowSize } from "@vueuse/core"

import "vue3-carousel/dist/carousel.css"

interface GameItem {
  fileName: string
  title: string
}

interface GameDetail {
  gameType: string
  gameName: string
}

export default defineComponent({
  name: "HomeContent",
  components: {
    MarqueeTag,
    SlideArea
    // GameArea
  },
  setup() {
    const router = useRouter()
    const { width } = useWindowSize()
    let isMobile = ref(false)
    const gameDetailList: Ref<GameDetail[]> = ref([
      { gameType: "1148", gameName: "ANDAR_BAHAR" },
      { gameType: "1148", gameName: "BILLIONAIRE_PARTY" },
      { gameType: "1148", gameName: "BINGO_CARIBBEAN" },
      { gameType: "1148", gameName: "BINGO_KITTY" },
      { gameType: "1148", gameName: "BINGO_ROCKET" },
      { gameType: "1148", gameName: "CALL_UFO" },
      { gameType: "1148", gameName: "FATE_AND_LUCK" },
      { gameType: "1148", gameName: "FLOWERISH_FAIRY" },
      { gameType: "1148", gameName: "JACK_AND_THE_BEANSTALK" },
      { gameType: "1148", gameName: "MAGICIAN" },
      { gameType: "1148", gameName: "NIGHT_BAR" },
      { gameType: "1148", gameName: "ROTI_LAGI_SATU" },
      { gameType: "1148", gameName: "SECRET_SCROLL_OF_NINJA" },
      { gameType: "1148", gameName: "THORS_HAMMER" }
    ])
    let gameAreaList: Ref<GameItem[]> = ref([
      {
        fileName: "m",
        title: "15 DAYS, 15 MISSIONS, 15 BONUSES"
      }
    ])

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

    return {
      isMobile,
      gameAreaList,
      gameDetailList,
      router
    }
  },
  mounted() {
    console.log("mounted")
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.game-list
  .carousel
    .carousel__viewport
      li
        // padding: 0 0.5vw
  ::v-deep(.carousel__prev)
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    // top: -2vw !important
    left: -3vw !important
    // +pc-width
    //   left: 60vw !important
    // +pad-width
    //   left: 58vw !important
    // +phone-width
    //   left: 56vw !important
    // +iphone-width
    //   top: -4vw !important
    //   left: 74vw !important
  ::v-deep(.carousel__next)
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    right: -3vw !important
    // +iphone-width
    //   top: -4vw !important
    //   right: 0vw !important
// layout style
.home-content
  +setFlex
  flex-direction: column
  .game-show-area
    +setFlex
    flex-direction: column
    padding: 1vw
    width: 100%
    .con-info
      +setFlex
      flex-direction: row
      .con
        color: #af96cc
        background: rgb(0 0 0 / 60%)
        margin: 10px 20px
        padding: 20px
        border-radius: 20px
        font-size: 12px
      +pc-width
        flex-direction: column
      h1
        font-size: 1rem
        color: #fde32a
      // color: #fff
    .game-title
      width: 100%
      height: 10vw
      +setFlex
      flex-direction: column
      padding: 0 5vw
      +pad-width
        height: 15vw
      +iphone-width
        height: 20vw
        padding: 0 5.5vw
      .title-icon
        width: 0.5vw
        height: 1.5vw
        background: $yellow-active
        +iphone-width
          width: 1.2vw
          height: 3.4vw
      &.small
        @apply h-20 #{!important}
        +iphone-width
          @apply h-10 #{!important}
      p.title-label
        color: #FFF
        font-family: "Century Gothic"
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
</style>
