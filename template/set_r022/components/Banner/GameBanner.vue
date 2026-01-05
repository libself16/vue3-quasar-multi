<template>
  <div class="banner-container" v-if="bannerList.length">
    <Swiper
      class="carousel"
      :modules="[Navigation]"
      @swiper="onSwiper"
      @slide-change="updateNavigationState"
      :breakpoints="{
        300: { slidesPerView: 1, spaceBetween: 10 },
        500: { slidesPerView: 2, spaceBetween: 10 },
        1024: { slidesPerView: 3, spaceBetween: 10 }
      }"
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
    <div class="navigation" v-if="bannerList.length > 0">
      <q-btn :disable="!canGoPrev" flat dense rounded icon="fas fa-chevron-left" @click="productSwiper.slidePrev()">
      </q-btn>
      <q-btn :disable="!canGoNext" flat dense rounded icon="fas fa-chevron-right" @click="productSwiper.slideNext()">
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation } from "swiper/modules"
import { useBanner } from "src/common/composables/useBanner"
import "swiper/css"
import "swiper/css/navigation"

const { bannerList, handleBannerRedirect, getBannerImage } = useBanner()

const productSwiper = ref()
const canGoNext = ref(true)
const canGoPrev = ref(true)

const onSwiper = (swiper: any) => {
  productSwiper.value = swiper
  updateNavigationState()
}
const updateNavigationState = () => {
  if (productSwiper.value) {
    canGoPrev.value = !productSwiper.value.isBeginning
    canGoNext.value = !productSwiper.value.isEnd
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.banner-container {
  @apply w-full relative;
  .carousel {
    @apply px-[5px];
    .slide {
      @apply aspect-[285/157] rounded-xl overflow-hidden;
      height: 9.375rem;

      .img {
        @apply w-full h-full bg-cover bg-center cursor-pointer;
      }
    }
  }
  .navigation {
    @apply absolute w-full;
    @apply flex justify-between items-center;
    @apply top-1/2 transform -translate-y-1/2;
    @apply z-10 pointer-events-none;
    ::v-deep(.q-btn) {
      background: var(--primary-01);
      @apply w-[1.5625rem] h-[1.5625rem] min-h-[1.5625rem];
      @apply pointer-events-auto;
      color: var(--text-01);

      .q-icon {
        @apply text-[.75rem];
      }
    }
  }
}
</style>
