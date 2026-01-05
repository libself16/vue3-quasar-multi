<template>
  <div class="pc-vip-container">
    <div class="vip-header">
      <q-img class="vip-header-logo" :src="vipLogoImg"></q-img>
      <div v-if="isMobile" class="mobile-account-info">
        <q-img :src="vipMobileAvatar" class="mobile-avatar"></q-img>
        <div class="mobile-account-text">
          <span class="account-title">{{ userInfo2.account }}</span>
          <span class="account-name">{{ userInfo2.nickname || userInfo2.fullname }}</span>
        </div>
      </div>
    </div>
    <div class="vip-content-wrapper">
      <div class="vip-content-container">
        <div class="main-content">
          <div class="swiper-title">{{ $t("vip.vipRewards") }}</div>
          <swiper
            :modules="[SwiperNavigation]"
            :slides-per-view="isMobile ? 1 : 1.5"
            :space-between="isMobile ? 12 : 36"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import type * as Response from "src/api/response.type"
import { useVip } from "src/common/composables/useVip"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import VipCard from "./components/VIP/VipCard.vue"
import VipBenefit from "./components/VIP/VipBenefit.vue"

const { getUserInfo2 } = useUserInfo()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, userInfo2 } = useVip()
const { vipImg, vipLogoImg, vipMobileAvatar } = useSiteImg()
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
  await getUserInfo2()
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
@import "app/template/set49/assets/css/_variable.scss";

.pc-vip-container {
  @include phone-width {
    width: 100vw;
  }
  .vip-header {
    @apply flex justify-center items-center w-full h-[44.125rem] bg-no-repeat;
    background: url("app/template/set49/assets/images/vip/vip-bg.png");
    background-size: 100% 100%;

    @include phone-width {
      @apply w-full h-[6.875rem];
      background: url("app/template/set49/assets/images/vip/vip-bg-mobile.png");
    }

    .vip-header-logo {
      @apply w-[29.125rem] h-[26.8125rem];

      @include phone-width {
        display: none;
      }
    }

    .mobile-account-info {
      @apply flex w-full h-full items-center pl-[1.75rem];
      color: #fff;

      .mobile-avatar {
        @apply w-[3.125rem] h-[3.125rem] rounded-full;
      }

      .mobile-account-text {
        @apply flex flex-col gap-1 ml-[1.25rem];

        .account-title {
          @apply text-[1.25rem] font-semibold;
          color: #ffe6b3;
        }
      }
    }
  }

  .vip-content-wrapper {
    @apply px-[7.0625rem] py-[4.3125rem] h-full;

    @include phone-width {
      @apply p-[1.5rem];
    }
  }

  .vip-content-container {
    @apply rounded-[1.5rem] pb-[1.5rem];
    background: #3e0303;
  }

  .main-content {
    @apply px-[5.5rem];

    @include phone-width {
      @apply px-[1.25rem];
    }

    .swiper-title {
      @apply font-bold pt-[2.0625rem] pb-[1.25rem];
      font-size: 1.75rem;
      color: $primary-color;
    }

    .vip-swiper {
      .swiper-slide {
        @apply flex justify-center items-center;
        width: auto;
        max-width: 40rem;
        min-height: 21.25rem;
      }

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: 1px solid $primary-color;
        background-color: rgba(241, 246, 255, 0.9);
        box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
        color: $primary-color;

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
        color: #818181;
        border: 1px solid #e8edfe;
        background-color: #ebebec;
      }
    }
  }

  .benefits-content {
    @apply px-[5.5rem];

    @include phone-width {
      @apply px-[1.25rem];
    }

    .benefits-title {
      margin-top: 3.75rem;
      margin-bottom: 1.25rem;
      font-family: OpenSans;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 2.3831rem;
      color: $primary-color;
    }
    .no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background: #790f0f;
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
      @apply flex flex-col gap-4 bg-white;
      font-family: OpenSans;
      padding: 1.6875rem 3.1875rem 8.375rem;
    }
    .benefits-multi-currency {
      @apply grid grid-cols-2 gap-9 mb-[5.6875rem];

      @include phone-width {
        @apply grid-cols-1 gap-4 mb-[2.5rem];
      }

      .benefits-multi-content {
        width: 100%;
        h3 {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.7025rem;
          color: #fff;
        }
        .benefit-card {
          @apply rounded-3xl mt-2 pl-[3.1875rem];
          background: #790f0f;
        }
      }
    }
  }
}
</style>
