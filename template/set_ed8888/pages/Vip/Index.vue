<template>
  <div v-if="$q.platform.is.desktop" class="pc-vip-container py-10 px-16">
    <div class="vip-content bg-white">
      <div class="header">
        <div class="title">{{ $t("vip.vipRewards") }}{{ currentVipIndex }}</div>
      </div>
      <div class="main-content">
        <swiper
          :modules="[SwiperNavigation]"
          :loop="true"
          slides-per-view="auto"
          :space-between="36"
          :navigation="true"
          class="vip-swiper"
          @swiper="onSwiperInit"
          @slideChange="onSlideChange"
        >
          <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
            <VipCard
              :class="{ 'active-card': currentVipIndex === index }"
              :vip-data="vip"
              :next-vip-data="memberVipList[index + 1] || vip"
              :user-statistics-map="userMultiStatisticsMap"
              :is-active="accountInfo.member_level === vip.id"
              :is-last="index === memberVipList.length - 1"
              @click="onVipClick(index, vip.id)"
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
  <VipH5Dialog v-else title-i18n="vip.vipRewards" class="h5-vip-container">
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
                :is-active="accountInfo.member_level === vip.id"
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useQuasar } from "quasar"
import { useVip } from "src/common/composables/useVip"
import { useSiteImg } from "app/template/set_ed8888/hooks/useSiteImg"
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
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, accountInfo } = useVip()
const { vipImg } = useSiteImg()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => memberVipList.value[currentVipIndex.value])

const onVipClick = (index: number, id: number) => {
  currentVipIndex.value = index
  // swiperInstance.value?.slideTo(index)
  console.log(currentVipIndex.value, index, id)
}

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
  console.log("onSwiperInit")
}
let slideClickedEventIndex = 0
const onSlideChange = (swiper: SwiperType) => {
  console.log("onSlideChange", swiper.realIndex, slideClickedEventIndex, swiper.clickedIndex)
  if (swiper.clickedIndex === undefined) {
    currentVipIndex.value = swiper.realIndex
    return
  } else if (slideClickedEventIndex !== swiper.clickedIndex) {
    slideClickedEventIndex = swiper.clickedIndex
  } else {
    currentVipIndex.value = swiper.realIndex
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
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/button.scss";

.pc-vip-container {
  .vip-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    padding: 2.5rem 3.125rem;
    border-radius: 24px;
    .header {
      @apply flex items-end justify-between;
      margin-bottom: 1.1875rem;
      .title {
        font-family: OpenSans;
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 3.4044rem;
        text-align: left;
        color: #000;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  .main-content {
    .active-card {
      border: 4px solid #ffa602;
      border-radius: 2.15rem;
    }
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
        border: 1px solid #400001;
        background: #ffffff;
        color: #400001;

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

      :deep(.swiper-button-disabled) {
        color: #400001;
        border: 1px solid #400001;
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .benefits-content {
    .benefits-title {
      margin-top: 3.9375rem;
      margin-bottom: 0.75rem;
      font-family: OpenSans;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 2.3831rem;
      color: #000000;
    }
    .no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background: linear-gradient(90deg, #d35861 0%, #fc847b 100%);

      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: #fff;
        width: 26.25rem;
        text-align: center;
        text-transform: capitalize;
      }
    }
    .benefits-single-currency {
      @apply rounded-3xl flex flex-col gap-4;
      background: linear-gradient(90deg, #d35861 0%, #fc847b 100%);
      padding: 1.6875rem 3.1875rem 8.375rem;
    }
    .benefits-multi-currency {
      @apply grid grid-cols-2 gap-9 mb-[5.6875rem];
      .benefits-multi-content {
        h3 {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.7025rem;
          color: #400001;
        }
        .benefit-card {
          @apply rounded-3xl mt-2 pl-[3.1875rem];
          background: linear-gradient(90deg, #d35861 0%, #fc847b 100%);
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px;
    background: #fff;
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
    background: #fff;
    padding: 2.75rem 2.5rem;
    .h5-benefits-title {
      margin-bottom: 1.5rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: #000;
    }
    .h5-no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background: linear-gradient(90deg, #d35861 0%, #fc847b 100%);

      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: #fff;
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
          color: #000;
          margin-bottom: 0.25rem;
        }
      }
      .h5-benefit-card {
        @apply py-2 pl-6 flex flex-col gap-2 rounded-xl w-full h-[15.3125rem];
        background: linear-gradient(90deg, #d35861 0%, #fc847b 100%);
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
        background: rgba(252, 132, 123, 1);

        .q-img {
          width: 180px;
        }
        .text {
          font-family: OpenSans;
          font-size: 0.625rem;
          font-weight: 600;
          line-height: 0.8512rem;
          color: #fff;
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
