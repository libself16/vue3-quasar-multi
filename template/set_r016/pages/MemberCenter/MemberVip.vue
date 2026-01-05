<template>
  <div class="vip-wrapper">
    <BackBtn />

    <div class="vip-content">
      <h2 class="vip-title">{{ $t("vip.vipRewards") }}</h2>

      <div class="main-content">
        <swiper
          :modules="[SwiperNavigation]"
          slides-per-view="auto"
          :space-between="20"
          :navigation="{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev'
          }"
          class="vip-swiper"
          @swiper="onSwiperInit"
          @slideChange="onSlideChange"
          :watch-slides-progress="true"
          :centered-slides="true"
        >
          <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
            <VipCard
              :vip-data="vip"
              :next-vip-data="memberVipList[index + 1] || vip"
              :user-statistics-map="userMultiStatisticsMap"
              :is-active="accountInfo.member_level === vip.id"
              :is-last="index === memberVipList.length - 1"
              :is-selected="currentVipIndex === index"
            />
          </swiper-slide>
        </swiper>
        <!-- Custom buttons -->
        <button class="swiper-btn swiper-prev"></button>
        <button class="swiper-btn swiper-next"></button>
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
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipCard from "./components/VipCard.vue"
import VipBenefit from "./components/VipBenefit.vue"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"

const $q = useQuasar()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, accountInfo } = useVip()
const { vipImg } = useSiteImg()

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
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.vip-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .vip-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    padding-right: 0;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .vip-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .main-content {
      margin-top: 2.5rem;
      position: relative;

      @include phone-width {
        margin-top: 1.25rem;
      }

      .vip-swiper {
        padding-right: 3.75rem;

        @include phone-width {
          padding-right: 0;
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 31.25rem;
          min-height: 18rem;

          @include phone-width {
            width: 100%;
          }
        }
      }

      .swiper-btn {
        width: 1.875rem;
        height: 1.875rem;
        color: $primary07;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;

        &.swiper-prev {
          left: -2.5rem;
          background-image: url("app/template/set_r016/assets/images/svg/btn-swiper-prev.svg");

          @include phone-width {
            left: -0.9375rem;
          }
        }
        &.swiper-next {
          right: 1.25rem;
          background-image: url("app/template/set_r016/assets/images/svg/btn-swiper-next.svg");

          @include phone-width {
            right: -0.9375rem;
          }
        }

        &.swiper-button-disabled {
          opacity: 0.4 !important;
        }
      }
    }

    .benefits-content {
      margin-top: 2.5rem;
      padding-right: 3.75rem;

      @include phone-width {
        margin-top: 1.25rem;
        padding-right: 0;
      }

      .benefits-title {
        @include fontStyle(1.75rem);
        color: $secondary03;
        margin-bottom: 2.5rem;

        @include phone-width {
          margin-bottom: 1.25rem;
        }
      }

      .no-benefits {
        @apply flex flex-col justify-center items-center py-5;
        gap: 1.875rem;
        border-radius: 0.625rem;
        background: $primary06;

        @include phone-width {
          padding: 1.25rem 0.8125rem;
        }

        .q-img {
          width: 17.3125rem;
          height: auto;

          @include phone-width {
            width: 100%;
            height: auto;
          }
        }

        .text {
          @include fontStyle();
          color: $neutral01;
          width: 26.25rem;
          text-align: center;
          text-transform: capitalize;

          @include phone-width {
            width: 100%;
            padding: 0 0.4375rem;
          }
        }
      }

      .benefits-single-currency {
        @apply flex flex-col gap-5 p-5;
        background: $primary06;
        border-radius: 0.625rem;

        @include phone-width {
          @apply justify-center;
        }
      }

      .benefits-multi-currency {
        @apply grid grid-cols-2 gap-5;

        @include phone-width {
          @apply grid-cols-1;
        }

        .benefits-multi-content {
          width: 100%;
          h3 {
            @include fontStyle(1.25rem);
            color: $neutral01;
          }
          .benefit-card {
            @apply flex flex-col justify-center gap-5 p-5;
            margin-top: 0.625rem;
            border-radius: 0.625rem;
            background: $primary06;
          }
        }
      }
    }
  }
}
</style>
