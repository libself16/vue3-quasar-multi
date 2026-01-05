<template>
  <div v-if="bannerList.length" class="banner-container" ref="carouselContainer">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      infinite
      control-color="purple-2"
      control-type="push"
      navigation
      padding
      arrows
    >
      <q-carousel-slide
        class="column no-wrap carousel__item"
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
      >
        <q-img
          class="rounded-2xl col-6 full-height"
          :src="getBannerImage(banner)"
          @click="handleBannerRedirect(banner)"
        />
      </q-carousel-slide>
    </q-carousel>
  </div>
  <div v-if="props.showSubstitute && !bannerList.length" class="substitute"></div>
</template>

<script setup lang="ts">
import { useBanner } from "src/common/composables/useBanner"
import { defineProps, ref } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, getBannerImage, handleBannerRedirect } = useBanner()

const props = defineProps({
  showSubstitute: {
    type: Boolean,
    required: false,
    default: false
  }
})

const slide = ref(1)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.banner-container
  display: flex
  flex-direction: column
  width: 100%
  max-height: auto
  +pad-width
    max-height: 400px
  +phone-width
    max-height: 300px
  +iphone-width
    max-height: 200px
  .q-carousel
    height: 500px
  img
    width: 100%
    height: auto
  .carousel__item
    width: 100%
  :deep(.q-carousel__slide)
    background: #F5F5F5
  :deep(.carousel__prev),
  :deep(.carousel__next)
    @apply text-gray-500
  :deep(.carousel)
    .banner-item
      width: 100vw
.substitute
  aspect-ratio: 1916/500
  width: 100%
</style>
