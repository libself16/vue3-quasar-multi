<template>
  <div class="lobby-content">
    <div class="game-show-area" v-for="(item, key) in gameAreaList" :key="key">
      <SlideArea :slide="item"></SlideArea>
    </div>
    <div class="game-show-area">
      <ProductArea :list="productList"></ProductArea>
    </div>
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
<script lang="ts" setup>
import { ref, Ref, watch } from "vue"
import MarqueeTag from "src/common/components/MarqueeTag.vue"
import SlideArea from "../SlideArea.vue"
import ProductArea from "../ProductArea.vue"
import { useWindowSize } from "@vueuse/core"

interface GameItem {
  fileName: string
  title: string
}

const { width } = useWindowSize()
let isMobile = ref(false)
const productList: Ref<string[]> = ref(["pg_soft"])
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
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

// layout style
.lobby-content
  +setFlex
  flex-direction: column
  // +iphone-width
  //   padding-bottom: 88vw
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
