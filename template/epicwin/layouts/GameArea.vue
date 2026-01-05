<template>
  <div class="game-area">
    <div class="game-list product">
      <!-- 切換product -->
      <div class="gbox-top" v-if="productState.list.length > 0">
        <ul class="tab-list" v-if="productState.list.length < 6">
          <li
            class="game-box tab"
            :class="{ active: productState.using === item.product_code }"
            v-for="(item, key) in productState.list"
            @click="handleTabClick(item.product_code)"
            :key="key"
          >
            <img :src="getTabProductImages(item.product_code)" @error="setDefaultProductTabImg" />
          </li>
        </ul>
        <div class="gbox-menu-wrap" @click="toggleMenu()" v-else>
          <div class="gbox-filbox ss-filter" dd="provider">
            <div class="nname">{{ usingProductName }}</div>
            <div class="iicon">
              <img :src="dropdownIcon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 遊戲區塊 -->
      <ul class="game-inner">
        <template v-if="!isMobile">
          <li v-for="item in gameState.list" :key="item.game_id">
            <div class="game-box" @click="openGame(item.product_code, item.game_code)">
              <img :src="getGametImg(gameTypeId, item.product_code, item.game_code)" @error="setDefaultGameImg" />
            </div>
          </li>
        </template>
        <template v-else>
          <li v-for="(item, key) in gameState.list" :key="key">
            <div class="game-box" @click="openGame(item.product_code, item.game_code)">
              <!-- todo -->
              <img :src="getGametImg(gameTypeId, item.product_code, item.game_code)" @error="setDefaultGameImg" />
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
  <!-- 切換product -->
  <Transition>
    <modalMenu
      @changeProduct="(code: number) => handleTabClick(code)"
      :list="productState.list"
      v-if="isMenuShow"
      v-model="isMenuShow"
    ></modalMenu>
  </Transition>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"

// import SelectBox from 'src/common/components/SelectBox.vue';
import modalMenu from "app/template/epicwin/layouts/modal/modalMenu.vue"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { ref } from "vue"

const { usingProductName, gameState, productState, openGame } = useGame()
const { dropdownIcon, setDefaultProductTabImg, setDefaultGameImg } = useSiteImg()
const { getGametImg, getTabProductImages } = useCommonImg()
const route = useRoute()
const router = useRouter()

// const { width } = useWindowSize()
let isMenuShow = ref(false)
let isMobile = ref(false)
let gameTypeId = ref(Number(route.params.gameTypeId))

const toggleMenu = () => {
  isMenuShow.value = !isMenuShow.value
}

const handleTabClick = (productCode: number) => {
  gameTypeId.value = Number(route.params.gameTypeId)
  router.push({
    name: "GameLobby",
    params: {
      gameTypeId: gameTypeId.value,
      productCode: productCode
    }
  })
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

// fadeIn
.v-enter-active,
.v-leave-active
  transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
  opacity: 0

.game-area
  .game-list
    position: relative
    display: flex
    justify-content: center
    align-items: center
    list-style: none
    margin: 0
    padding: 0 4.5vw
    width: 100%
    +iphone-width
      padding: 0 3.5vw
    &.product
      border: 2px solid #9601e1
      box-shadow: 0 0 6px #9601e1
      background: rgba(0, 0, 0, 0.7)
      // margin: 2vw
      // padding: 3vw
      border-radius: 3vw
      flex-direction: column
      width: 70vw
      +iphone-width
        width: 100%
        padding: 0px
        margin: 0vw
      .tab-list
        display: inline-flex
        justify-content: flex-start
        align-items: center
        flex-wrap: wrap
        padding: 20px 0
        width: 100%
        .game-box
          width: 12vw
          padding: 10px
          &.tab
            background-color: #2f2f2f
            border-radius: 6px
            display: flex
            justify-content: center
            align-items: center
            color: #ffffff
            font-size: 16px
            height: 40px
            width: 14%
            margin: 8px
            padding: 15px
            filter: grayscale(1)
            transition: all 0.3s
            cursor: pointer
            min-width: 10vw
            &.active
              filter: grayscale(0)
              color: #ffffff
              border: 1px solid #40e6ff
          img
            width: 100%
      .gbox-top
        width: 100%
      .gbox-menu-wrap
        display: flex
        justify-content: end
        margin: 2vw
        width: 100%
        // position: absolute
        // top: 0
        // right: 0
        +phone-width
          padding: 0 2vw
        .gbox-filbox
          display: flex
          justify-content: space-between
          align-items: center
          color: #ffffff
          padding: 0px 12px
          margin-left: 10px
          font-size: 0.8rem
          background-color:#1f1f1e
          height: 6vw
          max-height: 35px
          width: 6vw
          min-width: 90px
          cursor: pointer
          border-radius: 5px
          .nname
            padding-right: 12px
          .iicon
            max-width: 18px
      .game-inner
        display: flex
        justify-content: flex-start
        align-items: center
        flex-wrap: wrap
        list-style: none
        margin: 0
        @apply pb-4 #{!important}
        width: 100%
        +phone-width
          padding: 0
        li
          width: 12vw
          +phone-width
            width: calc(100% / 3)
            @apply p-2 #{!important}
          .game-box
            @apply m-3
            position: relative
            display: inline-block
            cursor: pointer
            color: #fff
            text-align: center
            width: auto
            +iphone-width
              margin: 0
              width: 100%
            .title-label
              font-family: "Century Gothic"
              font-size: 1vw
              font-style: normal
              font-weight: 700
              +phone-width
                font-size: 2vw
              +iphone-width
                font-size: 2vw
            .play-now
              position: absolute
              top: 8vw
              left: 2vw
              +iphone-width
                top: 24vw
                left: 6vw
    &.long
      li
        // margin-right: 1vw
      img
        width: 90%
    &.join
        li
          margin-right: 1vw
          &:last-child
            margin-right: 0
    &.marquee
      width: 100%
    img
      +phone-width
        width: 20vw
      +iphone-width
        width: 100%
</style>
