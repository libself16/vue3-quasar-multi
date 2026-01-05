<template>
  <div class="banner-container" v-if="bannerList.length">
    <Swiper
      class="carousel"
      :modules="[Navigation]"
      @swiper="onSwiper"
      @slide-change="updateNavigationState"
      :slidesPerView="1"
      :spaceBetween="10"
      :centeredSlides="true"
      ref="productSwiperRef"
    >
      <SwiperSlide
        class="slide"
        v-for="(banner, index) in bannerList"
        :key="index"
        @click="handleBannerRedirect(banner)"
      >
        <q-img :src="getBannerImage(banner)" :alt="banner.title" class="img"></q-img>
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
@import "app/template/set_DBO88/assets/css/_variable.scss";

.banner-container {
  @apply w-full pb-[1.875rem] relative;
  .carousel {
    @apply px-[5px];
    @include phone-width {
      @apply px-[5px];
    }
    .slide {
      @apply rounded-xl overflow-hidden;
      .img {
        cursor: pointer;
        @apply w-full h-auto max-h-full;
      }
    }
  }
  .navigation {
    @apply absolute w-full;
    @apply flex justify-between items-center;
    @apply top-1/2 transform -translate-y-1/2;
    @apply z-10 pointer-events-none;

    ::v-deep(.q-btn) {
      @apply w-[25px] h-[25px] min-h-[25px];
      @apply pointer-events-auto;
      background: $midnight-blue-bg;
      color: $text-sky-blue;

      .q-icon {
        @apply text-[.75rem];
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation } from "swiper/modules"
import { useBanner } from "src/common/composables/useBanner"
import { BANNER_POSITION } from "src/common/utils/constants"
import "vue3-carousel/dist/carousel.css"

const { bannerList, handleBannerList, handleBannerRedirect, getBannerImage } = useBanner()
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
