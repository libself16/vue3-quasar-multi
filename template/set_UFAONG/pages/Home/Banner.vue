<template>
  <div class="banner-wrapper">
    <q-carousel
      v-if="bannerList.length"
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

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useBanner } from "src/common/composables/useBanner"
import { BANNER_POSITION } from "src/common/utils/constants"

const { bannerList, handleBannerList, handleBannerRedirect, getBannerImage } = useBanner()

const slide = ref(1)

onMounted(async () => {
  // 2024/09/11 確認 ufaong 版型的 Banner 為特規，僅使用首頁 banner，不隨產品切換
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../assets/css/_variable.scss";

$pagination-height: 0.375rem;
$pagination-rounded: 0.625rem;

.banner-wrapper {
  @apply w-full h-full px-[10px] cursor-pointer;

  ::v-deep(.q-carousel) {
    @apply max-h-[375px];

    @include phone-width {
      @apply max-h-[180px];
    }
  }

  .q-carousel__slide {
    @apply w-full h-full;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .line-pagination {
    @apply mx-1 relative opacity-100;
    width: 3.75rem;
    height: $pagination-height;
    border-radius: $pagination-rounded;
    background-color: rgba($color: #000000, $alpha: 0.3);

    @include phone-width {
      width: 2rem;
    }

    &::after {
      content: "";
      transition: width 2.5s linear;
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: $pagination-height;
      border-radius: $pagination-rounded;
    }
    &.active {
      &::after {
        background: $gradient-to-bottom;
        width: 100%;
      }
    }
  }
}
</style>
