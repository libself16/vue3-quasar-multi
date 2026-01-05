<template>
  <div class="home-content">
    <div class="game-show-area" v-for="(item, key) in gameAreaList" :key="key">
      <SlideArea :slide="item"></SlideArea>
    </div>
    <div class="game-show-area">
      <GameArea v-if="isGameOpen"> </GameArea>
      <ProductArea v-else></ProductArea>
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
import MarqueeTag from "src/common/components/MarqueeTag.vue"
import { ref, Ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import GameArea from "../GameArea.vue"
import ProductArea from "../ProductArea.vue"
import SlideArea from "../SlideArea.vue"
// import { useWindowSize } from "@vueuse/core"
import { useGame } from "src/common/composables/useGame"

import "vue3-carousel/dist/carousel.css"

interface GameItem {
  fileName: string
  title: string
}

const route = useRoute()
const router = useRouter()

const { gameTypeState, initGameTypeList, getProducts, getGames, productState, isGameOpen } = useGame()

let gameAreaList: Ref<GameItem[]> = ref([
  {
    fileName: "m",
    title: "15 DAYS, 15 MISSIONS, 15 BONUSES"
  }
])

const getAreaList = async () => {
  let gameTypeId = Number(route.params.gameTypeId)
  const productCode = Number(route.params.productCode)
  if (!productState.list.length || gameTypeState.map[gameTypeId].game_type !== productState.list[0].game_type) {
    await getProducts(gameTypeId)
  }

  if (productCode) {
    if (isGameOpen.value) await getGames(gameTypeId, productCode)
    router.push({
      name: "GameLobby",
      params: {
        gameTypeId,
        productCode
      }
    })
  } else {
    if (productState.list.length) {
      router.push({
        name: "GameLobby",
        params: {
          gameTypeId,
          productCode: productState.list[0].product_code
        }
      })
    }
  }
}

// 切換遊戲大廳時觸發
// watch(
//   () => route.params,
//   (newCode) => {
//     if (gameTypeState.list.length) {
//       getAreaList()
//     }
//   }
// )

// 給頁面剛載入時, 要等home 那邊的init api取得後才打
// watch(
//   () => gameTypeState.list,
//   (newValue) => {
//     if (newValue.length !== 0) getAreaList()
//   }
// )

watchEffect(() => {
  if (gameTypeState.list.length && route.name === "GameLobby") {
    getAreaList()
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
