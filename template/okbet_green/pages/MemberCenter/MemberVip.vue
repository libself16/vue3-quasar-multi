<template>
  <div v-if="$q.platform.is.desktop" class="pc-vip-container">
    <div class="vip-content">
      <div class="header">
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
  <VipH5Dialog v-else title-i18n="vip.vipRewards" class="h5-vip-container" variant="green">
    <template #header>
      <div class="h5-header">
        <div class="h5-main-content">
          <swiper
            :modules="[SwiperNavigation]"
            :slides-per-view="1"
            :space-between="12"
            :navigation="true"
            :centered-slides="true"
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
        <div class="h5-benefits-title flex items-center justify-between">
          <span class="text-md">{{ $t("vip.activatedBenefits") }}</span>
          <span
            v-if="showPage === 'benefits'"
            class="text-sm font-normal flex items-center gap-1"
            @click="showPage = 'level'"
            >{{ $t("common.btn.level_comparison") }} <q-icon name="navigate_next" class="text-xl font-normal"></q-icon
          ></span>
        </div>
        <div v-if="currentVip.rewardBenefits.length && showPage === 'benefits'" class="h5-benefits">
          <template v-if="currentVip.rewardBenefits.length === 1">
            <div class="h5-benefit-card-container flex flex-wrap justify-between">
              <div
                class="h5-benefit-card"
                :class="{ '!w-full': index === 0, '!w-[48%]': index > 0 }"
                v-for="(item, index) in benefitsArray"
                :key="index"
              >
                <VipBenefit
                  :img-src="vipImg(item.imgFile)"
                  :title="$t(item.titleI18n)"
                  :value="currentVip.rewardBenefits[0][item.column]"
                  :use-currency="item.useCurrency"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="h5-benefit-multi-currency"
              v-for="rewardBenefit in currentVip.rewardBenefits"
              :key="rewardBenefit.currency_id"
            >
              <h3>{{ getCurrencyCode(rewardBenefit.currency_id) }}</h3>
              <div class="h5-benefit-card-container flex flex-wrap justify-between">
                <div
                  class="h5-benefit-card"
                  :class="{ '!w-full': index === 0, '!w-[48%]': index > 0 }"
                  v-for="(item, index) in benefitsArray"
                  :key="index"
                >
                  <VipBenefit
                    :img-src="vipImg(item.imgFile)"
                    :title="$t(item.titleI18n)"
                    :value="rewardBenefit[item.column]"
                    :use-currency="item.useCurrency"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-else-if="!currentVip.rewardBenefits.length && showPage === 'benefits'" class="h5-no-benefits">
          <q-img class="mb-6" :src="vipImg('no-benefits.png')" loading="lazy"></q-img>
          <p class="text">
            {{ $t("vip.noBenefits") }}
          </p>
        </div>
        <div v-if="showPage === 'level'" class="h5-level-content">
          <div class="back_btn" @click="showPage = 'benefits'">
            <q-icon name="arrow_back_ios" class="text-md font-normal"></q-icon>
            <span class="text-sm font-normal">{{ $t("common.btn.back") }}</span>
          </div>
          <div class="level-content">
            <div class="level-table" ref="tableContainerRef">
              <q-table
                ref="tableRef"
                class="vip-sticky-column"
                :rows="memberVipTableRows"
                :columns="memberVipTableColumns"
                hide-bottom
                table-header-class="bg-[#E7F8E9]"
                separator="cell"
              >
                <template #body="props">
                  <q-tr>
                    <q-td v-for="col in props.cols" :key="col.name" :props="props" class="!py-3">
                      <template v-if="Array.isArray(col.value)">
                        <span v-for="(item, index) in col.value" :key="index">
                          {{ item }}<br v-if="index < col.value.length - 1" />
                        </span>
                      </template>
                      <span v-else>{{ col.value }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
          <div class="scroll-btn-wrapper flex items-center justify-between mt-3">
            <div class="prev-btn" @click="scrollTableLeft">
              <span
                class="text-sm font-normal w-[30px] h-[30px] rounded-full bg-white border border-[#1fab3d] text-[#1fab3d] flex items-center justify-center"
              >
                <q-icon name="arrow_back_ios" class="text-md font-normal"></q-icon>
              </span>
            </div>
            <div class="next-btn" @click="scrollTableRight">
              <span
                class="text-sm font-normal w-[30px] h-[30px] rounded-full bg-white border border-[#1fab3d] text-[#1fab3d] flex items-center justify-center"
              >
                <q-icon name="arrow_forward_ios" class="text-md font-normal"></q-icon>
              </span>
            </div>
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
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipH5Dialog from "src/common/components/okbet_green/VipH5Dialog.vue"
import VipCard from "./components/VipCard.vue"
import VipBenefit from "./components/VipBenefit.vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, userInfo2 } = useVip()
const { vipImg } = useSiteImg()
const { t } = useI18n()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => memberVipList.value[currentVipIndex.value])
const memberVipTableRows = computed(() => {
  const rows = [
    {
      vip_level: `${t("vip.upgradeBonus")}`
    },
    {
      vip_level: `${t("vip.birthdayBonus")}`
    },
    {
      vip_level: `${t("vip.freeWithdrawal")}`
    }
  ]
  memberVipList.value.forEach((vip) => {
    console.log(vip)
    rows[0][`vip_${vip.level}`] = vip.rewardBenefits.map(
      (benefit) => `${benefit.promotion_bonus} ${getCurrencyCode(benefit.currency_id)}`
    )
    rows[1][`vip_${vip.level}`] = vip.rewardBenefits.map(
      (benefit) => `${benefit.birthday_bonus} ${getCurrencyCode(benefit.currency_id)}`
    )
    rows[2][`vip_${vip.level}`] = vip.rewardBenefits.map(
      (benefit) => `${benefit.daily_limit} ${getCurrencyCode(benefit.currency_id)}`
    )
  })
  return rows
})
const memberVipTableColumns = computed(() => {
  return Object.keys(memberVipTableRows.value[0]).map((row, index) => {
    console.log(row)
    return {
      label: t(`vip.${row}`),
      field: row,
      name: row
    }
  })
})
const showPage = ref("benefits")

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
    titleI18n: "vip.dailyWithdrawalTransactionLimit",
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

const tableRef = ref()

const scrollTableLeft = () => {
  console.log("scrollTableLeft", tableRef.value)
  if (tableRef.value) {
    const tableContainer = tableRef.value.$el.querySelector(".q-table__middle")
    if (tableContainer) {
      tableContainer.scrollLeft -= 100
    }
  }
}

const scrollTableRight = () => {
  console.log("scrollTableRight", tableRef.value)
  if (tableRef.value) {
    const tableContainer = tableRef.value.$el.querySelector(".q-table__middle")
    if (tableContainer) {
      tableContainer.scrollLeft += 100
    }
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

  console.log(memberVipList.value, memberVipTableRows.value, memberVipTableColumns.value)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/button.scss";

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
        color: $text-light-fourth;
        display: flex;
        align-items: center;
        gap: 8px;
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
        box-shadow: rgba(0, 0, 0, 0.45) 0px 4px 12px;
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
      color: $text-gray-fourth;
    }
    .no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 5.375rem;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background-color: $bg-header-tertiary;
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
      background-color: $bg-header-tertiary;
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
          color: $text-gray-fourth;
        }
        .benefit-card {
          @apply rounded-3xl mt-2 pl-[3.1875rem];
          background-color: $bg-header-tertiary;
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px;
    overflow: hidden;

    .h5-main-content {
      width: auto;

      .h5-vip-swiper {
        padding: 1.875rem 2.5rem;
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 21.25rem;
        }

        :deep(.swiper-button-next),
        :deep(.swiper-button-prev) {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 50%;
          border: 1px solid $text-light-primary;
          background-color: $text-light-fifth;
          color: $text-light-primary;

          &::after {
            font-size: 1.5rem;
            font-weight: 900;
          }
        }

        :deep(.swiper-button-next) {
          right: 0;
        }

        :deep(.swiper-button-prev) {
          left: 0px;
        }
      }
    }

    @include iphone-width {
      border-radius: 1.5rem 0px 0px;
      padding-top: 1rem;

      .h5-main-content {
        .h5-vip-swiper {
          padding: 0.9375rem 0.75rem;

          :deep(.swiper-button-next),
          :deep(.swiper-button-prev) {
            width: 1.875rem;
            height: 1.875rem;

            &::after {
              font-size: 0.75rem;
            }
          }
        }
      }
    }
  }

  .h5-benefits-content {
    padding: 2.75rem 2.5rem;
    .h5-benefits-title {
      margin-bottom: 2.5rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: $text-gray-fourth;
    }
    .h5-no-benefits {
      @apply flex flex-col justify-center items-center rounded-3xl;
      padding-top: 30px;
      padding-bottom: 53px;
      margin-bottom: 3.25rem;
      background-color: $bg-header-tertiary;
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
          font-size: 0.875rem;
          line-height: 1.1919rem;
          color: $text-gray-fourth;
          margin-bottom: 0.25rem;

          @include phone-width {
            font-size: 1rem;
          }
        }
      }
      .h5-benefit-card {
        @apply flex flex-col gap-2 rounded-xl mb-8;
        width: 100%;
        background-color: $bg-header-tertiary;
      }
    }

    @include iphone-width {
      padding: 1.375rem 1.25rem;
      .h5-benefits-title {
        margin-bottom: 1.75rem;
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

    .back_btn {
      border-radius: 100px;
      border: 1px solid #1fab3d;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #000;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      margin-bottom: 2.5rem;
      cursor: pointer;
      width: fit-content;
    }
  }
}
.vip-sticky-column {
  max-width: 100%;
  color: #848484;
  :deep(thead) {
    tr:first-child {
      th:first-child {
        position: sticky;
        left: 0;
        z-index: 1;
        filter: drop-shadow(4px 0 8px rgba(0, 0, 0, 0.1));
      }
      th {
        font-weight: 700;
        color: #000;
      }
    }
  }
  :deep(tbody) {
    th:first-child,
    td:first-child {
      font-weight: 700;
      position: sticky;
      left: 0;
      z-index: 1;
      filter: drop-shadow(4px 0 8px rgba(0, 0, 0, 0.1));
      color: #000;
    }
    tr:nth-child(odd) {
      background-color: #fff;
    }

    tr:nth-child(even) {
      background-color: #e7f8e9;
    }
  }
}
</style>
