<template>
  <div class="slide-area">
    <div class="game-title">
      <img :src="slideTitleImg" />
      <p class="title-label">{{ props.slide.title }}</p>
    </div>
    <ul class="game-list long">
      <Carousel snapAlign="start" :itemsToShow="isMobile ? 3 : 6" :wrapAround="true" :transition="500">
        <Slide v-for="slide in 14" :key="slide">
          <div class="carousel__item">
            <img :src="gameImg(props.slide.fileName, slide)" alt="" />
          </div>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

// import SelectBox from 'src/common/components/SelectBox.vue';
import { ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"

const { slideTitleImg, gameImg } = useSiteImg()

const props = defineProps(["modelValue", "slide"])
const emit = defineEmits(["update:modelValue", "changeLogin", "changeRegister"])

const { width } = useWindowSize()
let isMobile = ref(false)

const getLogin = () => {
  emit("changeLogin", true)
}

const getRegister = () => {
  emit("changeRegister", true)
}

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

// common style
.game-list
  .carousel
    width: 100%
    .carousel__viewport
      li
        padding-right: 0.5vw
  ::v-deep(.carousel__prev)
    width: 2vw
    height: 2vw
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    left: -3vw !important
    +iphone-width
      width: 5vw
      height: 5vw
  ::v-deep(.carousel__next)
    width: 2vw
    height: 2vw
    color: rgba(255,255,255,0.7)
    border: 1px solid #24262B
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    right: -3vw !important
    +iphone-width
      width: 5vw
      height: 5vw

.slide-area
  width: 100%
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
  .game-list
    display: flex
    justify-content: flex-start
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
      flex-direction: row
      flex-wrap: wrap
      width: 70vw
      +iphone-width
        width: 100%
        padding: 0px
      li
        width: 10vw
        +phone-width
          width: 32%
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
