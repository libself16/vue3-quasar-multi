<template>
  <div v-if="$q.platform.is.desktop" class="pc-vip-container">
    <div class="vip-content">
      <div class="header">
        <div class="title">{{ $t("vip.vipRewards") }}</div>
        <q-btn-dropdown
          :label="vipCurrencyCode"
          class="currency-select"
          dropdown-icon="expand_more"
          content-class="currency-menu"
        >
          <q-list>
            <q-item
              v-for="curr in currencyDropdown"
              :key="curr.value"
              clickable
              v-close-popup
              @click="vipCurrencyId = curr.value"
              class="flex justify-center items-center flex-nowrap"
            >
              <q-icon
                :name="vipCurrencyId === curr.value ? 'check_circle' : 'radio_button_unchecked'"
                class="mr-5"
              ></q-icon>
              <span class="w-10">
                {{ curr.label }}
              </span>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
          <swiper-slide v-for="(vip, index) in vipList" :key="index">
            <VipCard :vip-data="vip" :user-statistics="userStatistics" :is-active="userInfo.member_level === vip.id" />
          </swiper-slide>
        </swiper>
      </div>
      <div v-if="currentVip" class="benefits-content">
        <div class="benefits-title">{{ $t("vip.benefits") }}</div>
        <div class="benefits">
          <div class="benefit-card">
            <div class="icon">
              <q-img loading="lazy" :src="vipImg('icon-upgrade.png')"></q-img>
            </div>
            <div class="title">{{ $t("vip.upgradeBonus") }}</div>
            <div class="text">{{ moneyFormat(currentVip.reward?.promotion_bonus) }}</div>
          </div>
          <div class="benefit-card">
            <div class="icon">
              <q-img loading="lazy" :src="vipImg('icon-birthday.png')"></q-img>
            </div>
            <div class="title">{{ $t("vip.birthdayBonus") }}</div>
            <div class="text">{{ moneyFormat(currentVip.reward?.birthday_bonus) }}</div>
          </div>
          <div class="benefit-card">
            <div class="icon">
              <q-img loading="lazy" :src="vipImg('icon-withdrawal.png')"></q-img>
            </div>
            <div class="title">{{ $t("vip.freeWithdrawal") }}</div>
            <div class="text">{{ moneyFormat(currentVip.benefit?.withdraw.daily_limit) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <VipH5Dialog v-else title-i18n="vip.vipRewards" variant="purple" class="h5-vip-container">
    <template #header>
      <div class="h5-header">
        <div class="flex justify-end">
          <q-btn-dropdown
            :label="vipCurrencyCode"
            class="h5-currency-select"
            dropdown-icon="expand_more"
            content-class="h5-currency-menu"
          >
            <q-list>
              <q-item
                v-for="curr in currencyDropdown"
                :key="curr.value"
                clickable
                v-close-popup
                @click="vipCurrencyId = curr.value"
                class="flex justify-center items-center flex-nowrap"
              >
                <q-icon :name="vipCurrencyId === curr.value ? 'check_circle' : 'radio_button_unchecked'"></q-icon>
                <span class="w-10">
                  {{ curr.label }}
                </span>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="h5-main-content">
          <swiper
            slides-per-view="auto"
            :space-between="12"
            class="h5-vip-swiper"
            @swiper="onSwiperInit"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="(vip, index) in vipList" :key="index">
              <VipCard
                :vip-data="vip"
                :user-statistics="userStatistics"
                :is-active="userInfo.member_level === vip.id"
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </template>
    <template #body>
      <div v-if="currentVip" class="h5-benefits-content">
        <div class="h5-benefits-title">{{ $t("vip.benefits") }}</div>
        <div class="h5-benefits">
          <div class="h5-benefit-card">
            <div class="h5-icon">
              <q-img loading="lazy" :src="vipImg('icon-upgrade.png')"></q-img>
            </div>
            <div class="h5-title">{{ $t("vip.upgradeBonus") }}</div>
            <div class="h5-text">{{ moneyFormat(currentVip.reward?.promotion_bonus) }}</div>
          </div>
          <div class="h5-benefit-card">
            <div class="h5-icon">
              <q-img loading="lazy" :src="vipImg('icon-birthday.png')"></q-img>
            </div>
            <div class="h5-title">{{ $t("vip.birthdayBonus") }}</div>
            <div class="h5-text">{{ moneyFormat(currentVip.reward?.birthday_bonus) }}</div>
          </div>
          <div class="h5-benefit-card">
            <div class="h5-icon">
              <q-img loading="lazy" :src="vipImg('icon-withdrawal.png')"></q-img>
            </div>
            <div class="h5-title">{{ $t("vip.freeWithdrawal") }}</div>
            <div class="h5-text">{{ moneyFormat(currentVip.benefit?.withdraw.daily_limit) }}</div>
          </div>
        </div>
      </div>
    </template>
  </VipH5Dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useQuasar } from "quasar"
import { useVip } from "src/common/composables/useVip"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipH5Dialog from "src/common/components/okbet/VipH5Dialog.vue"
import VipCard from "./components/VipCard.vue"

const $q = useQuasar()
const { initVipSingleCurrency, currencyDropdown, vipCurrencyId, vipCurrencyCode, userStatistics, vipList, userInfo } =
  useVip()
const { vipImg } = useSiteImg()
const { moneyFormat } = useCommon()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => vipList.value[currentVipIndex.value])

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
  await initVipSingleCurrency()

  await nextTick()
  if (swiperInstance.value && vipList.value.length > 0) {
    // 找到對應的 VIP level index
    const targetIndex = vipList.value.findIndex((vip) => vip.id === userInfo.value.member_level)
    // 如果找到對應的 level，滑動到該位置，否則預設顯示第一個
    swiperInstance.value.slideTo(targetIndex >= 0 ? targetIndex : 0)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";

.pc-vip-container {
  .vip-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    padding: 2.5rem 3.125rem;
    .header {
      @apply flex items-end justify-between;
      margin-bottom: 1.1875rem;
      .title {
        font-family: OpenSans;
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 3.4044rem;
        text-align: left;
        color: $text-light-secondary;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .currency-select {
        width: 148px;
        height: 40px;
        border-radius: 1.5rem;
        background-color: $bg-dark-tertiary;
        border: 1px solid #8a8a8a;
        color: $text-light-secondary;

        :deep(.q-btn__content) {
          position: relative;
          .q-icon {
            position: absolute;
            right: 0;
          }
        }
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
        height: 21.25rem;
      }

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background-color: #4c496a;
        border: 1px solid #4c496a;
        color: $text-light-primary;

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
        color: $text-light-primary;
        border: 1px solid #4c496a;
        background-color: #4c496a;
      }
    }
  }

  .benefits-content {
    .benefits-title {
      margin-top: 3.9375rem;
      margin-bottom: 2.125rem;
      font-family: OpenSans;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 2.3831rem;
      color: $text-gray-secondary;
    }
    .benefits {
      font-family: OpenSans;
      box-sizing: border-box;
      gap: 1rem;
      display: flex;
      flex-flow: wrap;
      .benefit-card {
        width: 13.75rem;
        height: 9.125rem;
        border: 1px solid $border-dark;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
          width: 3.375rem;
          height: 3.375rem;
          margin-top: 1.125rem;
        }
        .title {
          font-family: OpenSans;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 19.07px;
          color: $text-gray;
          margin-top: 0.5625rem;
        }
        .text {
          margin-top: 0.5625rem;
          font-family: OpenSans;
          font-size: 20px;
          font-weight: 700;
          line-height: 27.24px;
          color: $text-light-secondary;
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px;
    background-color: $bg-dark-secondary;
    padding-top: 2rem;
    overflow: hidden;

    .h5-currency-select {
      @apply mr-16;
      width: 11rem;
      height: 2.875rem;
      border-radius: 1.5rem;
      background-color: $bg-dark-tertiary;
      border: 1px solid #8a8a8a;
      color: $text-light-secondary;

      :deep(.q-btn__content) {
        position: relative;
        font-size: 1.25rem;
        .q-icon {
          position: absolute;
          right: 0;
        }
      }
    }

    .h5-main-content {
      width: 62rem;
      padding-left: 3.5rem;
      padding-right: 3.5rem;
      .h5-vip-swiper {
        padding: 1.875rem 0;
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 41.25rem;
          height: 21.25rem;
        }
      }
    }

    @include pad-width {
      .h5-main-content {
        width: auto;
      }
    }

    @include iphone-width {
      border-radius: 1.5rem 0px 0px;
      padding-top: 1rem;

      .h5-currency-select {
        @apply mr-8 p-0;
        width: 5.5rem;
        height: 1.4375rem;
        min-height: 1.5rem;

        :deep(.q-btn__content) {
          font-size: 0.75rem;
          .q-icon {
            right: 8px;
            font-size: 0.875rem;
          }
        }
      }

      .h5-main-content {
        padding-left: 1.75rem;
        padding-right: 0;
        .h5-vip-swiper {
          padding: 0.9375rem 0;
          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20.375rem;
            height: 10.5rem;
          }
        }
      }
    }
  }

  .h5-benefits-content {
    padding: 49.125rem 3.5rem 3.5rem;
    .h5-benefits-title {
      margin-top: 0.625rem;
      margin-bottom: 1rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: $text-light-secondary;
    }
    .h5-benefits {
      font-family: OpenSans;
      box-sizing: border-box;
      gap: 1.25rem;
      display: flex;
      flex-flow: wrap;
      .h5-benefit-card {
        width: 12.5rem;
        height: 12.5rem;
        border: 1px solid $border-dark;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .h5-icon {
          width: 4.5rem;
          height: 4.5rem;
        }
        .h5-title {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.6875rem;
          color: $text-gray;
          margin-top: 0.375rem;
        }
        .h5-text {
          margin-top: 0.375rem;
          font-family: OpenSans;
          font-size: 2rem;
          font-weight: 700;
          line-height: 2.75rem;
          color: $text-light-secondary;
        }
      }
    }

    @include iphone-width {
      padding: 1.75rem;
      .h5-benefits-title {
        margin-top: 0.3125rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }
      .h5-benefits {
        gap: 0.625rem;
        .h5-benefit-card {
          width: 6.25rem;
          height: 6.25rem;

          .h5-icon {
            width: 2.25rem;
            height: 2.25rem;
          }
          .h5-title {
            font-size: 0.625rem;
            line-height: 0.8512rem;
            margin-top: 0.1875rem;
          }
          .h5-text {
            margin-top: 0.1875rem;
            font-size: 1rem;
            line-height: 1.375rem;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";

.currency-menu {
  border-radius: 1.5rem;
  background-color: $bg-dark-tertiary;
  .q-item {
    color: $text-light-secondary;
  }
}

.h5-currency-menu {
  width: 11rem;
  border-radius: 1.5rem;
  background-color: $bg-dark-tertiary;
  .q-item {
    font-size: 1.25rem;
    color: $text-light-secondary;
    .q-icon {
      margin-right: 1.25rem;
    }
  }

  @include iphone-width {
    width: 5.5rem;
    .q-item {
      font-size: 0.75rem;
      .q-icon {
        margin-right: 0.625rem;
      }
    }
  }
}
</style>
