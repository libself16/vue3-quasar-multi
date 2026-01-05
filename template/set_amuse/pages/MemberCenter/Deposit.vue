<template>
  <q-card class="deposit-layout">
    <q-card-section class="deposit-container">
      <div class="deposit-title">
        <img src="./../../assets/images/vip/vip-title.png" class="title-image" />
        <span v-if="currentLevelInfo!.id === userActiveLevelsInfo!.id" class="title-level">{{
          $t("vip.levelTitle")
        }}</span>
        <span class="title-name">{{ currentLevelInfo!.lang }}</span>
      </div>
      <div class="deposit-detail">
        <div class="left-section">
          <div v-if="currentLevelInfo!.id === userActiveLevelsInfo!.id" class="row items-center font-semibold">
            <div class="mr-3">{{ $t("vip.CurrentPoint") }} :</div>
            <div v-if="inUseWallet">
              <div class="row">
                <span class="w-20 overflow-hidden text-ellipsis">
                  {{ $t("common.btn.point") }}
                </span>
                <span>
                  {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}
                </span>
              </div>
              <div v-if="showBonusWallet" class="row">
                <span class="w-20 overflow-hidden text-ellipsis">
                  {{ $t("common.btn.bonus") }}
                </span>
                <span>
                  {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Bonus].balance || "0") }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="currentLevelInfo!.img !== `${VITE_APP_DYNAMIC_RESOURCE_URL}/`" class="image-container">
            <img :src="currentLevelInfo!.img" alt="" />
          </div>
          <span>{{ currentLevelInfo!.remark }}</span>
        </div>
        <!-- <div class="right-section">
          <div v-html="userCurrentRemark"></div>
        </div> -->
      </div>
    </q-card-section>
    <div class="level-list">
      <div class="title">{{ $t("vip.ViewOtherLevels") }}</div>
      <img v-if="!isMobile" src="./../../assets/images/vip/button-arrow.png" class="prev-arrow" @click="prevSlide" />
      <img v-if="!isMobile" src="./../../assets/images/vip/button-arrow.png" class="next-arrow" @click="nextSlide" />
      <Carousel :breakpoints="breakPoints" ap-around="true" ref="carouselRef">
        <Slide v-for="(level, idx) in userCurrentLevelsInfo" :key="level.id" @click="selectLevel(level)">
          <div class="carousel-cell">
            <span class="title">{{ level.lang }}</span>
            <div class="level">
              <img :src="level.img" :class="{ bordered: level.id === currentLevelInfo!.id }" />
              <img
                v-if="idx !== userCurrentLevelsInfo.length - 1"
                src="./../../assets/images/vip/vip-arrow.png"
                class="level-arrow"
              />
            </div>
            <span v-if="level.id === userActiveLevelsInfo!.id" class="level-now">{{ $t("vip.CurrentLevel") }}</span>
            <span v-else class="level-now-placeholder"></span>
          </div>
        </Slide>
      </Carousel>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch, computed, watchEffect } from "vue"
import { Carousel, Slide } from "vue3-carousel"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useWindowSize } from "@vueuse/core"
import { WALLET_TYPE } from "src/common/utils/constants"

const { envData, showBonusWallet } = useEnv()
const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
const { moneyFormat } = useCommon()
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

const { userInfo, userActiveLevelsInfo, userCurrentLevelsInfo, inUseWallet, resetUserInfoForm } = useUserInfo()
interface LevelInfo {
  id: number
  lang: string
  img: string
  quota: number
  remark: string
}
const currentLevelInfo = ref<LevelInfo | null>(null)

watch(
  () => userActiveLevelsInfo.value,
  (newLevels) => {
    if (newLevels) {
      currentLevelInfo.value = newLevels
    }
  },
  { immediate: true }
)

const selectLevel = (level) => {
  currentLevelInfo.value = level
}
const levelLabel = computed(() => {
  if (userCurrentLevelsInfo.value.length === 0 || !currentLevelInfo.value) {
    return ""
  }
  const firstLevel = userCurrentLevelsInfo.value[0]
  if (currentLevelInfo.value.id === firstLevel.id) {
    return `${moneyFormat(currentLevelInfo.value.quota)} 次の`
  } else {
    return `${moneyFormat(currentLevelInfo.value.quota)} その上`
  }
})

const breakPoints = {
  300: {
    itemsToShow: 2.5,
    snapAlign: "center"
  },
  700: {
    itemsToShow: 4,
    snapAlign: "start"
  },
  1024: {
    itemsToShow: 5,
    snapAlign: "start"
  }
}
const carouselRef = ref(null)
const prevSlide = () => {
  if (carouselRef.value) {
    carouselRef.value.prev()
  }
}

const nextSlide = () => {
  if (carouselRef.value) {
    carouselRef.value.next()
  }
}
watchEffect(async () => {
  if (userInfo.value.contact) resetUserInfoForm()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set_amuse/assets/css/button.sass'

.deposit-layout
  @apply block text-white
  min-height: 37.5rem
  border-radius: .625rem
  background: url('app/template/set_amuse/assets/images/vip/vip-background.png') no-repeat
  background-size: cover
  padding-bottom: .5rem
  +iphone-width
    background-position: center center
  .deposit-container,.level-list
    position: relative
    z-index: 2
  .deposit-container
    @apply text-white mt-2 p-6 w-full rounded-lg flex flex-col
    +setFlex(start, center)
    +pad-width
      @apply mt-0 rounded-none
      padding: 1.25rem .625rem .625rem
    .deposit-title
      @apply flex items-center
      .title-image
        @apply mr-4
        width: 5rem
        +iphone-width
          width: 3rem
      .title-level,.title-name
        @apply mr-4 mt-6
        font-size: 1.5rem
        font-weight: bolder
        +iphone-width
          @apply mr-2 mt-4
          font-size: 1rem
      .title-name
        color: #E2B854
    .deposit-detail
      @apply mt-4
      +setFlex(center, center)
      width: 100%
      +iphone-width
        flex-direction: column
      .right-section
        @apply ml-6
      .left-section
        @apply flex flex-col
        +setFlex(center, center)
        .image-container
          position: relative
          display: inline-block
          margin: 1rem 0
          max-width: 20rem
          border-radius: 1.2rem
          z-index: 100
          overflow: hidden
          border: 3px solid #E2B854
          img
            position: relative
            z-index: 2
            width: auto
            height: auto
            display: block
            border-radius: 1rem
            vertical-align: top
.level-list
  @apply m-4
  border: 2px solid #6C5E3C !important
  border-radius: 0.1rem !important
  background: #000
  +pad-width
    border: none !important
  .title
    +setFlex(center, center)
    @apply p-2
  .prev-arrow
    position: absolute
    top: 6.5rem
    left: -1rem
    z-index: 20
  .next-arrow
    position: absolute
    transform: rotate(180deg)
    top: 6.5rem
    right: -1rem
    z-index: 20
  .level
    +setFlex(start, center)
    img
      border-radius: 10%
      vertical-align: top
      height: 6rem
      margin-bottom: .5rem
      +iphone-width
        height: 4rem
    .level-arrow
      margin: auto 1rem
      height: 1.5rem
    .bordered
      border: 2px solid #E2B854
  .level-now, .level-now-placeholder
    display: block
    height: 1.8rem
    font-size: .75rem
    text-align: center
    color: #E2B854
  .level-now-placeholder
    visibility: hidden
.carousel__slide
  padding: 0 2rem
  margin: auto 0
  overflow: visible
  .carousel-cell
    width: 100%
    min-width: 90px
    margin: 5px 0
    border-radius: 5px
    counter-increment: carousel-cell
</style>
