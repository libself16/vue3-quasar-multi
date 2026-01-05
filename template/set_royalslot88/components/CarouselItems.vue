<template>
  <div class="carousel-wrapper">
    <div class="t-body">
      <div class="w-full lobby_wrap">
        <div class="lobby_body_wrap">
          <div class="arrow_slider" v-if="slides.length > itemToShow">
            <div class="slide-arrow slide-arrow__prev slidePrev-btn cursor-pointer" @click="carouselRef.slidePrev(300)">
              <img :src="leftArrow" />
            </div>
            <div class="slide-arrow slide-arrow__next slideNext-btn cursor-pointer" @click="carouselRef.slideNext(300)">
              <img :src="rightArrow" />
            </div>
          </div>

          <swiper :slides-per-view="itemToShow" loop @swiper="getRef">
            <swiper-slide class="px-[1vw]" v-for="(slide, i) in slides" :key="i" @click="slide.onSlideClick">
              <img :src="slide.img" @error="setDefaultProductImg" class="cursor-pointer" />
            </swiper-slide>
          </swiper>

          <!-- Mobile Items -->
          <div class="mobile_lobby">
            <div class="mobile_lobby_wrap">
              <a :href="slide.link" v-for="(slide, i) in slides" :key="i" @click="slide.onSlideClick">
                <img :src="slide.img" @error="setDefaultProductImg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import leftArrow from "../assets/images/icon/left_arrow.png"
import rightArrow from "../assets/images/icon/right_arrow.png"

const $q = useQuasar()
const { setDefaultProductImg } = useSiteImg()
const props = defineProps({
  itemToShow: Number,
  slides: Array
})

const carouselRef = ref(null)
const isHorizontalMobile = ref(false)

const onWindowResize = () => {
  // 手機橫向
  if (!$q.platform.is.mobile) return
  if (window.innerWidth > window.innerHeight) {
    isHorizontalMobile.value = true
  } else {
    isHorizontalMobile.value = false
  }
}

const getRef = (swiperInstance) => {
  carouselRef.value = swiperInstance
}

onMounted(() => {
  window.addEventListener("resize", onWindowResize)
  onWindowResize()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.lobby_wrap {
  @include phone-width {
    @apply px-0;
  }

  @include pad-width {
    @apply px-0;
  }

  @apply p-[0_10%];
}

.mobile_lobby_wrap {
  margin-bottom: 0;
}

@include phone-width {
  .mobile_lobby {
    // padding-top: 20vw;
    // padding-bottom: calc(17vh + 25vw);
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait) {
  // 以下 pad 直式
  .carousel {
    @apply hidden;
  }

  .lobby_wrap {
    @apply px-0 pt-0;
  }

  .mobile_lobby {
    padding-top: 32vw;

    .mobile_lobby_wrap {
      padding: 2%;
    }
  }
}

@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) {
  // 以下 pad 橫式
  .carousel {
    @apply hidden;
  }

  .lobby_wrap {
    @apply px-0 pt-[16vw];
  }

  .mobile_lobby {
    padding-top: 0;
    padding-bottom: calc(17vh + 40vw);
  }
}

@media (orientation: landscape) {
  // 以下 phone 橫式
  @include pad-width {
    .lobby_wrap {
      @apply px-[10%] pt-0;
    }

    .carousel {
      @apply block;
    }
  }
}
</style>
