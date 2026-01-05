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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.banner-container {
  @apply w-full py-[30px] relative;
  .carousel {
    @apply px-[5px];
    @include phone-width {
      @apply px-[5px];
    }
    .slide {
      @apply aspect-[285/157] rounded-xl overflow-hidden;
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
      background: $primary-color;
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
import { onMounted, ref } from "vue"
import "vue3-carousel/dist/carousel.css"
import { BANNER_POSITION } from "src/common/utils/constants"
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue"
import { Navigation } from "swiper/modules"
const { bannerList, handleBannerList, handleBannerRedirect, getBannerImage } = useBanner()

const breakpoints = {
  1920: {
    itemsToShow: 3,
    snapAlign: "start",
    gap: 20
  },
  1024: {
    itemsToShow: 3,
    snapAlign: "start",
    gap: 10
  },
  525: {
    itemsToShow: 2,
    snapAlign: "start",
    gap: 7.5
  },
  300: {
    itemsToShow: 1,
    snapAlign: "start",
    gap: 7.5
  }
}

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

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
</script>
