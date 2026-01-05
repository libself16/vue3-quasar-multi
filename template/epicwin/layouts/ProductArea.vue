<template>
  <div class="game-area">
    <div class="game-list product">
      <!-- <div class="gbox-menu-wrap">
        <div class="gbox-filbox ss-filter" dd="provider">
          <div class="nname">Epic</div>
          <div class="iicon">
            <img :src="dropdownIcon" />
          </div>
        </div>
      </div> -->
      <ul class="game-inner">
        <template v-if="!isMobile">
          <li v-for="(item, key) in productState.list" :key="key">
            <div class="game-box" @click="openGame(item.product_code)">
              <img :src="getPorductImg(gameTypeId, item.product_code)" @error="setDefaultProductImg" />
              <p class="title-label">{{ item.product_name }}</p>
            </div>
          </li>
        </template>
        <template v-else>
          <li v-for="(item, key) in productState.list" :key="key">
            <div class="game-box" @click="openGame(item.product_code)">
              <!-- todo -->
              <img :src="getPorductImg(gameTypeId, item.product_code)" @error="setDefaultProductImg" />
              <p class="title-label">{{ item.product_name }}</p>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEnvInfoStore } from "src/stores/envStore"
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useRouter, useRoute } from "vue-router"

// import SelectBox from 'src/common/components/SelectBox.vue';
import { ref, watch, computed } from "vue"
import { useWindowSize } from "@vueuse/core"
import { useGame } from "src/common/composables/useGame"

const { openGame, productState } = useGame()
const { setDefaultProductImg } = useSiteImg()
const { getPorductImg } = useCommonImg()
const { envInfo } = useEnvInfoStore()

const router = useRouter()
const route = useRoute()
let gameTypeId = computed(() => {
  return Number(route.params.gameTypeId)
})

const props = defineProps(["list"])

const { width } = useWindowSize()
let isMobile = ref(false)

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
      margin: 2vw
      padding: 3vw
      border-radius: 3vw
      flex-direction: column
      width: 70vw
      +iphone-width
        width: 100%
        padding: 0px
        margin: 0vw
      .gbox-menu-wrap
        margin: 2vw
        width: auto
        position: absolute
        top: 0
        right: 0
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
        @apply py-4 #{!important}
        width: 100%
        +phone-width
          @apply py-8 #{!important}
        li
          width: 12vw
          +phone-width
            width: 32%
          .game-box
            @apply m-3
            position: relative
            display: inline-block
            cursor: pointer
            color: #fff
            text-align: center
            width: auto
            +iphone-width
              @apply m-2
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
        width: 100vw
</style>
