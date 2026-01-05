<template>
  <div v-if="!isLargeTablet" class="pc-vip-container">
    <div class="header">
      {{ $t("vip.vipRewards") }}
    </div>
    <div class="main-content">
      <swiper
        slides-per-view="auto"
        :space-between="36"
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
            :is-active="accountInfo.member_level === vip.id"
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

  <VipH5Dialog v-else title-i18n="vip.vipRewards" class="h5-vip-container">
    <template #header>
      <div class="h5-header">
        <swiper
          :modules="[SwiperNavigation]"
          :slides-per-view="1"
          :space-between="12"
          :navigation="true"
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
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/vue"
import type { Swiper as SwiperType } from "swiper"
import VipCard from "./components/VipCard.vue"
import VipBenefit from "./components/VipBenefit.vue"
import { useVip } from "src/common/composables/useVip"
import type * as Response from "src/api/response.type"
import { ref, computed, onMounted, nextTick } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { Navigation as SwiperNavigation } from "swiper/modules"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import VipH5Dialog from "src/common/components/set_r022/VipH5Dialog.vue"

const { isLargeTablet } = useMediaQuery()
const { vipImg } = useSiteImg()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, accountInfo } = useVip()

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
    const targetIndex = memberVipList.value.findIndex((vip) => vip.id === accountInfo.value.member_level)
    // 如果找到對應的 level，滑動到該位置，否則預設顯示第一個
    swiperInstance.value.slideTo(targetIndex >= 0 ? targetIndex : 0)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.pc-vip-container {
  width: 100%;
  max-width: 87.5rem;
  min-width: 76rem;
  height: 100%;
  margin: 0.625rem auto 0;
  background: var(--bg-main-bg);

  .header {
    width: 100%;
    margin-bottom: 1.25rem;
    color: var(--secondary-01);
    background: var(--neutral-01);
    border-radius: 0.5rem;
    padding: 0.9375rem 1.5rem;
    font-weight: 400;
    font-size: 1.75rem;
  }

  .main-content {
    .vip-swiper {
      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 41.25rem;
        min-height: 21.25rem;
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
      color: var(--secondary-01);
    }

    .benefits-single-currency {
      @apply flex flex-col gap-4;
      background: var(--neutral-01);
      padding: 1.6875rem 3.1875rem 8.375rem;
    }
    .benefits-multi-currency {
      @apply grid grid-cols-2 gap-9 mb-[5.6875rem];
      .benefits-multi-content {
        width: 100%;

        h3 {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.7025rem;
          color: var(--primary-02);
        }
        .benefit-card {
          @apply rounded-3xl mt-2;
          background: var(--neutral-01);
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    width: auto;
    padding: 0 1.25rem;
    overflow: hidden;
    background: var(--bg-main-bg);

    .h5-vip-swiper {
      padding: 1.25rem 0;
      overflow: unset;

      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 10.5rem;
      }

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        width: 1.875rem;
        height: 1.875rem;
        border-radius: 50%;
        border: 1px solid var(--primary-01);
        background: var(--primary-07);
        color: var(--primary-01);

        &::after {
          font-size: 1rem;
          font-weight: 600;
        }
      }

      :deep(.swiper-button-next) {
        right: -0.5rem;
      }

      :deep(.swiper-button-prev) {
        left: -0.5rem;
      }
    }
  }

  .h5-benefits-content {
    min-height: 100%;
    padding: 2.75rem 2.5rem;
    background: var(--bg-main-bg);

    .h5-benefits-title {
      margin-bottom: 1.5rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: var(--secondary-01);
    }
    .h5-no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background: var(--neutral-01);

      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: rgba(var(--primary-02), 0.3);
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
          color: var(--primary-02);
          margin-bottom: 0.25rem;
        }
      }
      .h5-benefit-card {
        @apply flex flex-col gap-2 rounded-xl w-full min-h-[13rem];
        background: var(--neutral-01);
      }
    }

    @include iphone-width {
      padding: 0 1.25rem 20%;

      .h5-benefits-title {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }

      .h5-no-benefits {
        @apply flex flex-col justify-center items-center rounded-3xl;
        padding-top: 1.875rem;
        padding-bottom: 2.5rem;
        margin-bottom: 2.5625rem;
        background: var(--neutral-01);

        .q-img {
          width: 180px;
        }
        .text {
          font-family: OpenSans;
          font-size: 0.625rem;
          font-weight: 600;
          line-height: 0.8512rem;
          color: rgba(var(--primary-02), 0.3);
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
