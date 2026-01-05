<template>
  <div v-if="bannerListData.length" class="banner-container" ref="carouselContainer">
    <q-carousel animated v-model="slide" arrows navigation infinite :autoplay="3000">
      <q-carousel-slide
        v-for="(banner, index) in bannerListData"
        :key="index"
        :name="index + 1"
        :img-src="getBannerImage(banner)"
        @click="handleBannerRedirect(banner)"
      />
    </q-carousel>
  </div>
  <div v-if="props.showSubstitute && !bannerListData.length" class="substitute"></div>
</template>

<script setup lang="ts">
import { useBanner } from "src/common/composables/useBanner"
import { defineProps, ref, computed } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, getBannerImage, handleBannerRedirect } = useBanner()

const props = defineProps({
  showSubstitute: {
    type: Boolean,
    required: false,
    default: false
  },
  // 是否要顯示全部的banner
  showAll: {
    type: Boolean,
    required: false,
    default: true
  },
  bannerPosition: {
    type: Number,
    required: false,
    default: -1
  },
  gameType: {
    type: Number,
    required: false,
    default: -1
  }
})

const slide = ref(1)

const bannerListData = computed(() => {
  if (props.showAll) return bannerList.value

  let list = bannerList.value
  if (list.length) {
    if (props.bannerPosition !== -1) {
      list = list.filter((e) => e.position === props.bannerPosition)
    }

    if (props.gameType !== -1) {
      list = list.filter((e) => e.game_type === props.gameType)
    }
  }
  return list
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.banner-container
  border-radius: 10px
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.20)
  overflow: hidden
  display: flex
  flex-direction: column
  width: 100%
  aspect-ratio: 1560/666
  :deep(.q-carousel)
    @apply w-full h-full
  img
    width: 100%
    height: auto
  .carousel__item
    width: 100%
    .banner-item
      width: 100%
      height: auto
  :deep(.carousel__prev),
  :deep(.carousel__next)
    @apply text-gray-500
  :deep(.carousel)
    .banner-item
      width: 100vw
.substitute
  aspect-ratio: 1560/666
  width: 100%

:deep(.q-carousel__prev-arrow)
  left: 0

:deep(.q-carousel__next-arrow)
  right: 0
</style>
