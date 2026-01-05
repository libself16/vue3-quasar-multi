<template>
  <div v-if="isMobile" class="banner-container">
    <q-carousel
      v-if="bannerList.length && bannerLoaded"
      class="h5"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        @click="handleBannerRedirect(banner)"
      >
        <img :src="getBannerImage(banner)" alt="banner" class="banner-img" draggable="false" />
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>

  <div v-else class="banner-container">
    <q-carousel
      v-if="bannerList.length && bannerLoaded"
      class="pc"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        class="slide-pagination"
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        :img-src="getBannerImage(banner)"
        @click="handleBannerRedirect(banner)"
      />
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { useBanner } from "src/common/composables/useBanner"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { ref, watch } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, handleBannerRedirect, getBannerImage, preloadImages } = useBanner()

const { isMobile } = useMediaQuery()
const slide = ref(1)
const bannerLoaded = ref(false)

// 預加載所有 banner 圖片
watch(
  () => bannerList.value,
  (newBannerList) => {
    if (newBannerList && newBannerList.length > 0) {
      bannerLoaded.value = false
      const imageUrls = newBannerList
        .map((banner) => getBannerImage(banner))
        .filter((url): url is string => Boolean(url))

      preloadImages(imageUrls, {
        onComplete: (allLoaded) => {
          setTimeout(() => {
            bannerLoaded.value = true
          }, 300)
        }
      })
    } else {
      bannerLoaded.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.q-carousel {
  &.pc {
    @apply w-full h-auto bg-transparent;

    .q-carousel__slide {
      @apply w-full h-[23.75rem] cursor-pointer;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .line-pagination {
      @apply mx-1 relative opacity-100 w-[3.75rem] h-[0.375rem] rounded-[0.625rem];
      background: var(--slider-pagination-inactive, rgba(0, 0, 0, 0.3));

      &::after {
        @apply absolute left-0 top-0 h-[0.375rem] rounded-[0.625rem];
        content: "";
        transition: width 2.5s linear;
      }

      &.active {
        &::after {
          @apply w-full;
          background: var(--slider-pagination-active, #3b82f6);
        }
      }
    }
  }

  &.h5 {
    @apply w-full h-auto relative bg-transparent;

    .q-carousel__slide {
      @apply w-full h-full  p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full aspect-[404/176] h-auto rounded-lg bg-cover bg-center;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100 w-[0.75rem] h-[0.75rem] rounded-[0.75rem];
        background: var(--slider-pagination-mobile-inactive, rgba(255, 255, 255, 0.4));

        &.active {
          @apply w-[1.5rem];
          background: var(--slider-pagination-mobile-active, #3b82f6);
        }
      }
    }
  }
}

.banner-container {
  box-shadow: 0px 0px 30px 0px #ff8181;

  @apply max-w-[75rem] mx-auto;
}
</style>
