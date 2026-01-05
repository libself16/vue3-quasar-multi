<template>
  <div class="custom-slider-wrapper">
    <!-- Mobile Carousel -->
    <div v-if="isMobile" class="banner-container">
      <q-carousel
        v-if="sliderItems.length"
        class="mobile"
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
          v-for="(item, index) in sliderItems"
          :key="index"
          :name="index + 1"
          @click="handleSlideClick(item)"
        >
          <img :src="item.img_path" :alt="item.alt_tag" class="banner-img" draggable="false" />
        </q-carousel-slide>
        <template v-slot:navigation-icon="{ active, onClick }">
          <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
        </template>
      </q-carousel>
    </div>

    <!-- Desktop Carousel -->
    <div v-else class="banner-container">
      <q-carousel
        v-if="sliderItems.length"
        class="desktop"
        animated
        v-model="slide"
        navigation
        swipeable
        infinite
        :autoplay="5000"
        transition-prev="slide-right"
        transition-next="slide-left"
        transition-duration="500"
      >
        <q-carousel-slide
          v-for="(item, index) in sliderItems"
          :key="index"
          :name="index + 1"
          :img-src="item.img_path"
          @click="handleSlideClick(item)"
        />
        <template v-slot:navigation-icon="{ active, onClick }">
          <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
        </template>
      </q-carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useCmsImage } from "src/common/composables/useCmsImage"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"
import type {
  CmsSliderPayload,
  CmsSliderNestedEntrance,
  CmsSliderProcessedItem,
  CmsGamePayload,
  CmsLinkPayload,
  CmsNestedEntrancePayload
} from "src/types/cmsCustomPage"

const { isMobile } = useMediaQuery()
const { getCmsImageSource } = useCmsImage()
const { getGameImageByCustomPage } = useGame()
const slide = ref(1)

const props = defineProps<{
  entrance: Response.CmsEntranceItem
  handleEntranceClick: (item: { entrance: CmsSliderProcessedItem; opening_method?: number }) => void
}>()

const getFallbackImage = (item: CmsSliderNestedEntrance): string => {
  const gamePayload = item.payload as CmsGamePayload

  if (
    gamePayload?.game_code &&
    gamePayload?.product_code &&
    gamePayload?.product_integration_id &&
    gamePayload?.game_type
  ) {
    return getGameImageByCustomPage({
      game_type: gamePayload.game_type,
      product_integration_id: gamePayload.product_integration_id,
      product_code: gamePayload.product_code,
      game_code: gamePayload.game_code
    })
  }

  return ""
}

const sliderItems = computed((): CmsSliderProcessedItem[] => {
  const payload = props.entrance.payload as unknown as CmsSliderPayload
  if (payload?.nested_entrance && Array.isArray(payload.nested_entrance)) {
    return payload.nested_entrance.map((item: CmsSliderNestedEntrance): CmsSliderProcessedItem => {
      let imgPath = getCmsImageSource(item)

      if (!imgPath) {
        imgPath = getFallbackImage(item)
      }

      return {
        ...item,
        img_path: imgPath,
        alt_tag: (item.payload as CmsGamePayload)?.alt_tag || "slider image"
      }
    })
  }
  return []
})

const hasOpeningMethod = (payload: CmsNestedEntrancePayload): payload is CmsLinkPayload => {
  return "opening_method" in payload
}

const handleSlideClick = (item: CmsSliderProcessedItem) => {
  const openingMethod = hasOpeningMethod(item.payload) ? item.payload.opening_method : undefined

  props.handleEntranceClick({
    entrance: item,
    opening_method: openingMethod
  })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.q-carousel {
  &.desktop {
    @apply w-full h-auto bg-transparent rounded-[1.375rem];

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

  &.mobile {
    @apply w-full h-auto relative rounded-lg;
    background: var(--slider-carousel-bg, #f8f9fa);

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
  @apply max-w-[75rem] mx-auto;
}
</style>
