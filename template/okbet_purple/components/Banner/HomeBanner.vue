<template>
  <div v-if="$q.platform.is.mobile" class="banner-container">
    <q-carousel
      v-if="bannerList.length"
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
        <div class="banner-img" :style="{ backgroundImage: `url(${getBannerImage(banner)})` }"></div>
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
  <div v-else class="banner-container">
    <q-carousel
      v-if="bannerList.length"
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
    <MarqueeList />
  </div>
</template>

<script setup lang="ts">
import MarqueeList from "app/template/okbet_purple/components/MarqueeList.vue"
import { useBanner } from "src/common/composables/useBanner"
import { ref } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, handleBannerRedirect, getBannerImage } = useBanner()

const slide = ref(1)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";

$pagination-height: 0.375rem;
$pagination-rounded: 0.625rem;

.q-carousel {
  @apply bg-transparent;

  &.pc {
    width: 100%;
    height: 33vw;

    .q-carousel__slide {
      @apply w-full h-full cursor-pointer;
      padding: 5rem 0px 3.25rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: right top;
    }

    .line-pagination {
      @apply mx-1 relative opacity-100;
      width: 3.75rem;
      height: $pagination-height;
      border-radius: $pagination-rounded;
      background-color: rgba($color: #000000, $alpha: 0.3);

      &::after {
        content: "";
        transition: width 2.5s linear;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 0px;
        height: $pagination-height;
        border-radius: $pagination-rounded;
      }

      &.active {
        &::after {
          background-color: $bg-secondary;
          width: 100%;
        }
      }
    }
  }

  &.h5 {
    @apply h-auto relative;
    width: calc(100vw - 1rem);
    margin: 0rem auto 0.3rem;

    .q-carousel__slide {
      @apply w-full h-full rounded-lg p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full aspect-[404/176] h-auto rounded-lg bg-cover bg-center;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.75rem;
        background-color: rgba(255, 255, 255, 0.4);

        &.active {
          width: 1.5rem;
          background-color: rgb(117, 153, 255);
        }

        @include iphone-width {
          width: 0.375rem;
          height: 0.375rem;

          &.active {
            width: 0.75rem;
          }
        }
      }
    }
  }
}

.banner-container {
  position: relative;

  :deep(.q-carousel__control) {
    bottom: 4vw;
  }
}
</style>
