<template>
  <VipH5Dialog v-if="isMobile" title-i18n="vip.vipRewards" class="h5-vip-container" variant="deep-green">
    <template #header>
      <div class="h5-header">
        <div class="h5-main-content">
          <swiper
            :slides-per-view="1"
            :space-between="12"
            class="h5-vip-swiper"
            @swiper="onSwiperInit"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
              <VipCard
                :vip-data="vip"
                :next-vip-data="memberVipList[index + 1] || vip"
                :user-statistics-map="userMultiStatisticsMap"
                :is-active="userInfo2.member_level === vip.id"
                :is-last="index === memberVipList.length - 1"
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </template>
    <template #body>
      <div v-if="currentVip" class="h5-benefits-content">
        <div class="h5-benefits-title">{{ $t("vip.activatedBenefits") }}</div>
        <div v-if="currentVip.rewardBenefits.length" class="h5-benefits">
          <div v-if="currentVip.rewardBenefits.length === 1" class="h5-benefit-card">
            <VipBenefit
              v-for="(item, index) in benefitsArray"
              :key="index"
              :img-src="vipImg(item.imgFile)"
              :title="$t(item.titleI18n)"
              :value="currentVip.rewardBenefits[0][item.column]"
              :currency="getCurrencyCode(currentVip.rewardBenefits[0].currency_id)"
              :use-currency="item.useCurrency"
            />
          </div>
          <template v-else>
            <div
              class="h5-benefit-multi-currency"
              v-for="rewardBenefit in currentVip.rewardBenefits"
              :key="rewardBenefit.currency_id"
            >
              <h3>{{ getCurrencyCode(rewardBenefit.currency_id) }}</h3>
              <div class="h5-benefit-card">
                <VipBenefit
                  v-for="(item, index) in benefitsArray"
                  :key="index"
                  :img-src="vipImg(item.imgFile)"
                  :title="$t(item.titleI18n)"
                  :value="rewardBenefit[item.column]"
                  :currency="getCurrencyCode(rewardBenefit.currency_id)"
                  :use-currency="item.useCurrency"
                />
              </div>
            </div>
          </template>
        </div>
        <div v-else class="h5-no-benefits">
          <q-img :src="vipImg('no-benefits.png')" loading="lazy"></q-img>
          <p class="text">
            {{ $t("vip.noBenefits") }}
          </p>
        </div>
      </div>
    </template>
  </VipH5Dialog>
  <div v-else class="pc-vip-container">
    <div class="vip-content">
      <div class="pc-header">
        <div class="title">{{ $t("vip.vipRewards") }}</div>
      </div>
      <div class="main-content">
        <swiper
          :modules="[SwiperNavigation]"
          slides-per-view="auto"
          :space-between="36"
          :navigation="true"
          :centered-slides="true"
          class="vip-swiper"
          @swiper="onSwiperInit"
          @slideChange="onSlideChange"
        >
          <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
            <VipCard
              :vip-data="vip"
              :next-vip-data="memberVipList[index + 1] || vip"
              :user-statistics-map="userMultiStatisticsMap"
              :is-active="userInfo2.member_level === vip.id"
              :is-last="index === memberVipList.length - 1"
            />
          </swiper-slide>
        </swiper>
      </div>
      <div v-if="currentVip" class="benefits-content">
        <div class="benefits-title">{{ $t("vip.activatedBenefits") }}</div>
        <template v-if="currentVip.rewardBenefits.length">
          <div v-if="currentVip.rewardBenefits.length === 1" class="benefits-single-currency">
            <VipBenefit
              v-for="(item, index) in benefitsArray"
              :key="index"
              :img-src="vipImg(item.imgFile)"
              :title="$t(item.titleI18n)"
              :value="currentVip.rewardBenefits[0][item.column]"
              :currency="getCurrencyCode(currentVip.rewardBenefits[0].currency_id)"
              :use-currency="item.useCurrency"
            />
          </div>
          <div v-else class="benefits-multi-currency">
            <div
              class="benefits-multi-content"
              v-for="rewardBenefit in currentVip.rewardBenefits"
              :key="rewardBenefit.currency_id"
            >
              <h3>{{ getCurrencyCode(rewardBenefit.currency_id) }}</h3>
              <div class="benefit-card">
                <VipBenefit
                  v-for="(item, index) in benefitsArray"
                  :key="index"
                  :img-src="vipImg(item.imgFile)"
                  :title="$t(item.titleI18n)"
                  :value="rewardBenefit[item.column]"
                  :currency="getCurrencyCode(rewardBenefit.currency_id)"
                  :use-currency="item.useCurrency"
                />
              </div>
            </div>
          </div>
        </template>
        <div v-else class="no-benefits">
          <q-img :src="vipImg('no-benefits.png')" loading="lazy"></q-img>
          <p class="text">
            {{ $t("vip.noBenefits") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useQuasar } from "quasar"
import { useVip } from "src/common/composables/useVip"
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Response from "src/api/response.type"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipH5Dialog from "src/common/components/okbet/VipH5Dialog.vue"
import VipCard from "./components/VipCard.vue"
import VipBenefit from "./components/VipBenefit.vue"

const $q = useQuasar()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, userInfo2 } = useVip()
const { vipImg } = useSiteImg()
const { isMobile } = useMediaQuery()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => memberVipList.value[currentVipIndex.value])

const benefitsArray: {
  imgFile: string
  titleI18n: string
  column: keyof Response.VipRewardBenefit
  useCurrency: boolean
}[] = [
  {
    imgFile: "icon-upgrade.png",
    titleI18n: "vip.upgradeBonus",
    column: "promotion_bonus",
    useCurrency: true
  },
  {
    imgFile: "icon-birthday.png",
    titleI18n: "vip.birthdayBonus",
    column: "birthday_bonus",
    useCurrency: true
  },
  {
    imgFile: "icon-withdrawal.png",
    titleI18n: "vip.freeWithdrawal",
    column: "daily_limit",
    useCurrency: false
  }
]

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
    const targetIndex = memberVipList.value.findIndex((vip) => vip.id === userInfo2.value.member_level)
    // 如果找到對應的 level，滑動到該位置，否則預設顯示第一個
    swiperInstance.value.slideTo(targetIndex >= 0 ? targetIndex : 0)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_GREEN/assets/css/_variable.sass";
@import "app/template/set33_GREEN/assets/css/main.sass";

.pc-vip-container {
  .vip-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    padding: 2.0625rem 0;
    background-color: $bg-dark-first;
    border-radius: 1.5rem;
    .pc-header {
      @apply flex items-end justify-between px-[2.75rem];
      margin-bottom: 1.1875rem;
      .title {
        font-family: OpenSans;
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 3.4044rem;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 8px;
        @include gradient-text;
      }
    }
  }

  .main-content {
    .vip-swiper {
      padding: 10px 0;

      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 41.25rem;
        min-height: 21.25rem;
      }

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: 1px solid $bg-dark-forth;
        background-color: $bg-dark-forth;
        color: $text-light-fifth;

        &::after {
          font-size: 1rem;
          font-weight: 600;
        }
      }

      :deep(.swiper-button-next) {
        right: 1.125rem;
      }

      :deep(.swiper-button-prev) {
        left: 1.125rem;
      }
    }
  }

  .benefits-content {
    @apply px-[2.75rem];
    .benefits-title {
      margin-top: 3.9375rem;
      margin-bottom: 0.75rem;
      font-family: OpenSans;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 2.3831rem;
      @include gradient-text;
    }
    .no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 5.375rem;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background-color: $bg-header-second;
      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: $text-light-fourth;
        width: 26.25rem;
        text-align: center;
        text-transform: capitalize;
        margin-top: 2.375rem;
      }
    }
    .benefits-single-currency {
      @apply flex flex-col gap-4 rounded-3xl;
      font-family: OpenSans;
      padding: 1.6875rem 3.1875rem 8.375rem;
      background-color: #1e5939;
    }
    .benefits-multi-currency {
      @apply grid grid-cols-2 gap-9 mb-[5.6875rem];
      .benefits-multi-content {
        width: 26.1875rem;
        h3 {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.7025rem;
          color: $text-light-fifth;
        }
        .benefit-card {
          @apply rounded-3xl mt-2 pl-[3.1875rem];
          background-color: #1e5939;
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px;
    background-color: $bg-dark-first;
    padding-top: 2rem;
    overflow: hidden;

    .h5-main-content {
      width: auto;
      padding-left: 2.5rem;
      padding-right: 2.5rem;
      .h5-vip-swiper {
        padding: 1.875rem 0;
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 21.25rem;
        }
      }
    }

    @include iphone-width {
      border-radius: 1.5rem 0px 0px;
      padding-top: 1rem;

      .h5-main-content {
        @apply px-3;
        .h5-vip-swiper {
          padding: 0.9375rem 0;
          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 10.5rem;
          }
        }
      }
    }
  }

  .h5-benefits-content {
    padding: 2.75rem 2.5rem;
    .h5-benefits-title {
      margin-bottom: 1.5rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      @include gradient-text;
    }
    .h5-no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background-color: $bg-header-second;
      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: $text-light-fifth;
        width: 26.25rem;
        text-align: center;
        text-transform: capitalize;
      }
    }
    .h5-benefits {
      @apply flex justify-between items-center flex-wrap gap-4;
      font-family: OpenSans;
      .h5-benefit-multi-currency {
        width: 45%;
        h3 {
          font-family: OpenSans;
          font-weight: 600;
          font-size: 0.875rem;
          line-height: 1.1919rem;
          color: $text-light-fifth;
          margin-bottom: 0.25rem;
        }
      }
      .h5-benefit-card {
        @apply py-2 pl-6  flex flex-col gap-2 rounded-xl;
        width: 100%;
        height: 15.3125rem;
        background-color: $bg-header-tertiary;
      }
    }

    @include iphone-width {
      padding: 1.375rem 1.25rem;
      .h5-benefits-title {
        margin-bottom: 0.75rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }
      .h5-no-benefits {
        @apply flex flex-col justify-center items-center rounded-3xl;
        padding-top: 1.875rem;
        padding-bottom: 2.5rem;
        margin-bottom: 2.5625rem;
        .q-img {
          width: 180px;
        }
        .text {
          font-family: OpenSans;
          font-size: 0.625rem;
          font-weight: 600;
          line-height: 0.8512rem;
          width: 85%;
          text-align: center;
          text-transform: capitalize;
        }
      }

      .h5-benefits {
        @apply flex flex-col justify-start  items-center gap-3;
        .h5-benefit-multi-currency {
          width: 100%;
        }
      }
    }
  }
}
</style>
