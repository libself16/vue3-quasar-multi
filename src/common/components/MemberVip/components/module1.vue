<template>
  <div
    id="member-vip-content"
    class="w-full h-full max-w-full min-w-0 rounded-lg pt-5 pb-[4.0625rem] phone:p-0 flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <!-- 標題 -->
    <div id="member-vip-header" class="flex items-center justify-between gap-[.625rem] px-5 phone:px-0">
      <div
        id="member-vip-header-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)] flex items-center gap-2 flex-1"
      >
        <span> {{ $t("menu.vip_rewards") }}</span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-pointer hidden phone:!block"
        >
          <path
            d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
            class="fill-[var(--icon-02)]"
          />
        </svg>
        <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
          <MemberNav module="module2" />
        </q-menu>
      </div>
    </div>

    <!-- 卡片 -->
    <div v-if="memberVipList.length" class="member-vip-card-content">
      <swiper
        class="vip-swiper"
        :key="isDown.phone ? 'h5' : 'pc'"
        :modules="[SwiperNavigation]"
        slides-per-view="auto"
        :space-between="20"
        :navigation="{
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev'
        }"
        @swiper="onSwiperInit"
        @slideChange="onSlideChange"
        :watch-slides-progress="true"
        :centered-slides="true"
        :breakpoints="{
          0: { autoHeight: true },
          768: { autoHeight: false }
        }"
      >
        <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
          <MemberVipCard
            :vip-data="vip"
            :next-vip-data="memberVipList[index + 1] || vip"
            :user-statistics-map="userMultiStatisticsMap"
            :is-active="accountInfo.member_level === vip.id"
            :is-last="index === memberVipList.length - 1"
            :is-selected="currentVipIndex === index"
          />
        </swiper-slide>
      </swiper>
      <button class="swiper-btn swiper-prev">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.66971 0.310741C7.23481 -0.10358 6.52973 -0.10358 6.09472 0.310741L0.651613 5.501C-0.217505 6.32979 -0.21716 7.6727 0.652381 8.50096L6.09873 13.6893C6.53374 14.1036 7.23882 14.1036 7.67383 13.6893C8.10872 13.275 8.10872 12.6032 7.67383 12.1889L3.01223 7.74824C2.57731 7.33395 2.57731 6.66228 3.01223 6.24788L7.66971 1.81111C8.10472 1.39679 8.10472 0.725051 7.66971 0.310741Z"
            class="fill-[var(--icon-01)]"
          />
        </svg>
      </button>
      <button class="swiper-btn swiper-next">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.33029 0.310741C2.76519 -0.10358 3.47027 -0.10358 3.90528 0.310741L9.34839 5.501C10.2175 6.32979 10.2172 7.6727 9.34762 8.50096L3.90127 13.6893C3.46626 14.1036 2.76118 14.1036 2.32617 13.6893C1.89128 13.275 1.89128 12.6032 2.32617 12.1889L6.98777 7.74824C7.42269 7.33395 7.42269 6.66228 6.98777 6.24788L2.33029 1.81111C1.89528 1.39679 1.89528 0.725051 2.33029 0.310741Z"
            class="fill-[var(--icon-01)]"
          />
        </svg>
      </button>
    </div>

    <!-- 福利 -->
    <div
      v-if="currentVip"
      id="member-vip-benefits-wrapper"
      class="w-full mt-[.625rem] px-5 phone:px-0 flex flex-col gap-[.625rem]"
    >
      <div
        id="member-vip-benefits-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)]"
      >
        {{ $t("vip.activatedBenefits") }}
      </div>
      <MemberVipBenefits :vip-data="currentVip" id="member-vip-benefits-content" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import { useVip } from "src/common/composables/useVip"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import MemberNav from "src/common/components/MemberNav/Index.vue"
import MemberVipCard from "src/common/components/MemberVipCard/Index.vue"
import MemberVipBenefits from "src/common/components/MemberVipBenefits/Index.vue"

const { initVipMultiCurrency, userMultiStatisticsMap, memberVipList, accountInfo } = useVip()
const { isDown } = useMediaQuery()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => memberVipList.value[currentVipIndex.value])

const onSwiperInit = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  currentVipIndex.value = swiper.activeIndex
}

const onSlideChange = () => {
  if (swiperInstance.value) {
    currentVipIndex.value = swiperInstance.value.activeIndex
  }
}

onMounted(async () => {
  await initVipMultiCurrency()

  await nextTick()
  if (swiperInstance.value && memberVipList.value.length > 0) {
    // 找到對應的 VIP level index
    const targetIndex = memberVipList.value.findIndex((vip) => vip.id === accountInfo.value.member_level)
    // 如果找到對應的 level，滑動到該位置，否則預設顯示第一個
    swiperInstance.value.slideTo(targetIndex >= 0 ? targetIndex : 0)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.member-vip-card-content {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @include phone-width {
    @apply px-5;
  }

  .vip-swiper {
    width: 100%;
    max-width: 100%;
    min-width: 0;

    .swiper-slide {
      width: 31.25rem;
      min-height: 12.5rem;
      box-sizing: border-box;
      max-width: 100%;
      overflow: hidden;
      height: auto;

      @include phone-width {
        width: 100%;
      }
    }
  }

  .swiper-btn {
    @apply flex items-center justify-center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--icon-bg-08);
    border: 2px solid var(--icon-border-01);
    border-radius: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    &.swiper-prev {
      left: 0;

      @include phone-width {
        left: -0.125rem;
      }
    }
    &.swiper-next {
      right: 0;

      @include phone-width {
        right: -0.125rem;
      }
    }

    &.swiper-button-disabled {
      opacity: 0.4 !important;
    }
  }
}
</style>
