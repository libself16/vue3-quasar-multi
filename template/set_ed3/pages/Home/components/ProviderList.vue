<template>
  <div class="provider-container" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <swiper
      :modules="[Autoplay]"
      :autoplay="{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }"
      :loop="true"
      :slides-per-view="$q.platform.is.mobile ? 2 : 10"
      :space-between="20"
      class="provider-swiper"
    >
      <swiper-slide
        v-for="(product, key) in productState.list"
        :key="key"
        :name="product.product_code"
        class="provider-swiper-slide"
      >
        <div class="provider-img">
          <img
            :src="getProductTabImage({ ...product, siteKey: 'set_ed3' })"
            :alt="product.product_name"
            @error="setDefaultProductTabImg"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set_ed3/hooks/useSiteImg"
import { GAME_TYPE } from "src/common/utils/constants"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay } from "swiper/modules"
import "swiper/css"

const route = useRoute()
const { productState, getProducts, getProductTabImage } = useGame()
const { setDefaultProductTabImg } = useSiteImg()

onMounted(async () => {
  if (route.name == "Home") {
    await getProducts(GAME_TYPE.Enums.SLOT)
  }
})
</script>

<style lang="scss" scoped>
@import "app/template/set_ed3/assets/css/_variable.scss";

.provider-container {
  @apply rounded-[60px] overflow-hidden mt-[10px];
  background: #012f24;
  padding: 15px 0;

  .provider-swiper {
    .provider-swiper-slide {
      .provider-img {
        @apply h-[40px];
        img {
          @apply object-contain object-center;
          @apply w-full h-full;
        }
      }
    }
  }
}
</style>
