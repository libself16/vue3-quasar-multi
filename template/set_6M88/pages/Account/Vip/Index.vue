<template>
  <q-card class="full-screen-container h5-vip-container">
    <div>
      <q-card-section class="h5-vip-header">
        <div class="title-container">
          <div class="left">
            <q-btn
              icon="arrow_back_ios"
              class="btn-back hide-hover"
              size="md"
              flat
              round
              dense
              :to="{ name: 'Home' }"
            />
          </div>
          <div class="middle">
            <h2 class="title">{{ $t("vip.vipRewards") }}</h2>
          </div>
          <div class="right">
            <div class="invisible w-8"></div>
          </div>
        </div>
        <div class="user-info-content">
          <q-avatar>
            <img :src="getUserAvatar(commonSvgIcon('avatar'))" />
          </q-avatar>
          <div class="user-info">
            <h3 class="user-nickname">
              {{ userInfo.nickname || userInfo2.nickname || userInfo.real_name || userInfo2.fullname }}
            </h3>
            <div class="user-info-row">
              <p class="user-name">
                {{ $t("member.register.username") }}: {{ userInfo.username || userInfo2.account || "" }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="memberVipList.length" class="h5-header">
          <div class="h5-main-content">
            <swiper
              class="h5-vip-swiper"
              :slides-per-view="1"
              :space-between="40"
              :modules="[SwiperNavigation]"
              :navigation="{
                nextEl: '.swiper-next',
                prevEl: '.swiper-prev'
              }"
              :centered-slides="true"
              @swiper="onSwiperInit"
              @slideChange="onSlideChange"
              :auto-height="true"
            >
              <swiper-slide v-for="(vip, index) in memberVipList" :key="index">
                <VipCard
                  :vip-data="vip"
                  :next-vip-data="memberVipList[index + 1] || vip"
                  :user-statistics-map="userMultiStatisticsMap"
                  :is-active="userInfo.member_level === vip.id"
                  :is-last="index === memberVipList.length - 1"
                />
              </swiper-slide>
            </swiper>
            <button class="swiper-btn swiper-prev"></button>
            <button class="swiper-btn swiper-next"></button>
          </div>
        </div>
      </q-card-section>
    </div>
    <div v-if="currentVip" class="h5-benefits-content">
      <div class="h5-benefits-title">{{ $t("vip.activatedBenefits") }}</div>
      <div v-if="currentVip.rewardBenefits.length" class="h5-benefits">
        <div v-if="currentVip.rewardBenefits.length !== 1" class="h5-benefit-card">
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
  </q-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useVip } from "src/common/composables/useVip"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipCard from "./components/VipCard.vue"
import VipBenefit from "./components/VipBenefit.vue"

const { userInfo, userInfo2, getUserAvatar } = useUserInfo()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList } = useVip()
const { commonSvgIcon } = useCommonImg()
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
    const targetIndex = memberVipList.value.findIndex((vip) => vip.id === userInfo.value.member_level)
    // 如果找到對應的 level，滑動到該位置，否則預設顯示第一個
    swiperInstance.value.slideTo(targetIndex >= 0 ? targetIndex : 0)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.full-screen-container {
  box-shadow: none;
  border-radius: 0;
  // background-color: #f9fafd;
  overflow: auto;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Webkit (Chrome, Safari) */
  }

  .h5-vip-header {
    @apply p-0  w-full relative;
    background-image: url("app/template/set_6M88/assets/images/vip/header-bg.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center top;
    min-height: 34.875rem;

    @include iphone-width {
      min-height: 20.9375rem;
    }

    .title-container {
      @apply w-full flex justify-between items-center shrink-0 sticky left-0 top-0 py-0 px-6;
      height: 5.625rem;
      z-index: 10;
      background: #fff;
      .title {
        color: #005f79;
        font-size: 2.25rem;
        text-transform: capitalize;
        font-family: Helvetica;
      }
      .btn-back {
        :deep(.q-icon) {
          font-size: 3rem;
          color: #005f79;
        }
      }

      @include iphone-width {
        @apply px-3;
        height: 3.125rem;
        .title {
          font-size: 1.125rem;
        }
        .btn-back {
          :deep(.q-icon) {
            font-size: 1.25rem;
          }
        }
      }
    }
    .user-info-content {
      @apply flex items-center;
      padding: 3rem 3.75rem;
      .q-avatar {
        width: 6.875rem;
        height: 6.875rem;
      }
      .user-info {
        @apply ml-8;
        h3 {
          font-size: 2.5rem;
          line-height: 3.5rem;
          font-family: OpenSans;
          font-weight: 600;
          color: #fafafa;
          padding-bottom: 0.625rem;
          display: inline;
        }

        .user-info-row {
          @apply flex items-center;
          p {
            font-size: 1.5rem;
            line-height: 2rem;
            color: rgb(255, 255, 255);
          }
        }
      }
      @include iphone-width {
        padding: 1.5rem 2.0313rem 1.5938rem;
        .q-avatar {
          width: 3.125rem;
          height: 3.125rem;
        }
        .user-info {
          @apply ml-4;
          h3 {
            font-size: 1.25rem;
            line-height: 1.6875rem;
            padding-bottom: 0.25rem;
          }

          .user-info-row {
            p {
              font-size: 0.75rem;
              line-height: 1rem;
            }
          }
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px 0rem;
    background: #fff;
    padding-top: 0.8125rem;
    overflow: hidden;

    .h5-main-content {
      @apply px-[1.75rem];
      background-color: #fff;
      width: auto;

      .h5-vip-swiper {
        padding: 1rem 0.75rem;
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 21.25rem;
        }
      }

      .swiper-btn {
        width: 1.875rem;
        height: 1.875rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;

        &.swiper-prev {
          left: 0.1875rem;
          background-image: url("app/template/set_6M88/assets/images/vip/btn-swiper-prev.svg");
        }
        &.swiper-next {
          right: 0.1875rem;
          background-image: url("app/template/set_6M88/assets/images/vip/btn-swiper-next.svg");
        }

        &.swiper-button-disabled {
          opacity: 0.4 !important;
        }
      }
    }

    @include iphone-width {
      border-radius: 1.25rem 0px 0px;

      .h5-main-content {
        @apply px-0;
        .h5-vip-swiper {
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
    padding: 1.75rem 2.5rem 2.75rem;
    margin-bottom: 1.25rem;
    .h5-benefits-title {
      margin-bottom: 1.5rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: #0897be;
    }
    .h5-no-benefits {
      @apply flex flex-col justify-center items-center gap-[1.5625rem] rounded-xl;
      padding: 2.6875rem 2.375rem;
      margin-bottom: 3.25rem;
      background: #ffffff;
      box-shadow: 2px 2px 8px 0px #005f7940;

      .q-img {
        width: 240px;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.1919rem;
        color: #005f79;
        width: 26.25rem;
        text-align: center;
        text-transform: capitalize;
      }
    }
    .h5-benefits {
      @apply flex justify-between items-center flex-wrap gap-4;
      font-family: OpenSans;
      .h5-benefit-multi-currency {
        width: calc(50% - 12px);

        @include phone-width {
          width: 100%;
        }

        h3 {
          font-family: OpenSans;
          font-weight: 600;
          font-size: 1.3rem;
          line-height: 1.2;
          color: #0897be;
          margin-bottom: 0.25rem;

          @include phone-width {
            font-size: 0.875rem;
          }
        }
      }
      .h5-benefit-card {
        @apply pl-[1.895rem] md:pl-[3.1875rem] pr-4;
        @apply flex flex-col gap-[.6094rem] md:gap-4;
        @apply rounded-[.9144rem] w-full min-h-[13.5313rem];
        background: #ffffff;
        box-shadow: 2px 2px 8px 0px #005f7940;
      }
    }

    @include iphone-width {
      padding: 0 1.25rem 1rem;
      .h5-benefits-title {
        margin-bottom: 0.8125rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }
      .h5-no-benefits {
        .q-img {
          width: 11.135rem;
        }
        .text {
          font-family: OpenSans;
          font-size: 0.5625rem;
          font-weight: 600;
          line-height: 0.75rem;
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
