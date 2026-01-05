<template>
  <div class="banner-container" v-if="bannerList.length">
    <Swiper
      class="carousel"
      :modules="[Navigation, Autoplay]"
      @swiper="onSwiper"
      @slide-change="updateNavigationState"
      :autoplay="{ delay: 2000 }"
      :itemsToShow="1"
      :space-between="10"
      ref="productSwiperRef"
    >
      <SwiperSlide
        class="slide"
        v-for="(banner, index) in bannerList"
        :key="index"
        @click="handleBannerRedirect(banner)"
      >
        <div class="img" :style="{ backgroundImage: `url(${getBannerImage(banner)})` }"></div>
      </SwiperSlide>
    </Swiper>
    <!-- <div class="navigation" v-if="bannerList.length > 0">
      <q-btn :disable="!canGoPrev" flat dense rounded icon="fas fa-chevron-left" @click="productSwiper.slidePrev()">
      </q-btn>
      <q-btn :disable="!canGoNext" flat dense rounded icon="fas fa-chevron-right" @click="productSwiper.slideNext()">
      </q-btn>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.banner-container {
  @apply w-full relative;
  padding: 0 2.5rem;
  @include iphone-width {
    padding: 0 0.9375rem;
    margin-bottom: 0.9375rem;
  }
  .carousel {
    .slide {
      @apply aspect-[1580/588] overflow-hidden;
      border-radius: 12px;
      .img {
        cursor: pointer;
        @apply w-full h-full bg-cover bg-center;
      }
    }
  }
  .navigation {
    @apply absolute w-full;
    @apply flex justify-between items-center;
    @apply top-1/2 transform -translate-y-1/2;
    @apply z-10 pointer-events-none;
    ::v-deep(.q-btn) {
      // background: $primary-color;
      @apply w-[25px] h-[25px] min-h-[25px];
      @apply text-white pointer-events-auto;
      .q-icon {
        @apply text-[12px];
      }
    }
    @include phone-width {
    }
  }
}
</style>

<script lang="ts" setup>
import { useBanner } from "src/common/composables/useBanner"
import { ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"

const { bannerList, handleBannerRedirect, getBannerImage } = useBanner()

const productSwiper = ref()
const canGoNext = ref(true)
const canGoPrev = ref(true)

const onSwiper = (swiper: any) => {
  productSwiper.value = swiper
  updateNavigationState()
}
const updateNavigationState = () => {
  canGoPrev.value = !productSwiper.value.isBeginning
  canGoNext.value = !productSwiper.value.isEnd
}
</script>
