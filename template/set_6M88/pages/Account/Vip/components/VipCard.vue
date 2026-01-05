<template>
  <div class="vip-card">
    <div v-if="isActive" class="current-tag">
      <span>{{ $t("vip.current") }}</span>
    </div>

    <div class="vip-card-title-content">
      <div class="vip-card-title">{{ vipData.title }}</div>

      <div class="vip-card-subtitle">{{ $t(getLevelUpI18n(vipData)) }}</div>

      <div class="vip-icon">
        <q-img loading="lazy" :src="vipData.img" />
      </div>
    </div>

    <!-- 單幣別 -->
    <div v-if="nextVipData.conditions.length === 1" class="single-progress-container">
      <!-- bet -->
      <div
        v-if="
          nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET ||
          nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
        "
        class="single-progress-content"
      >
        <p class="progress-type">{{ $t("vip.bet") }}</p>
        <VipProgress
          :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
          :numerator="userStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_valid_bet_amount"
          :denominator="nextVipData.conditions[0]?.valid_bet_amount"
          :isLast="isLast"
        />
      </div>
      <!-- deposit -->
      <div
        v-if="
          nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.DEPOSIT ||
          nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
        "
        class="single-progress-content"
      >
        <p class="progress-type">{{ $t("vip.deposit") }}</p>
        <VipProgress
          :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
          :numerator="userStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_deposit"
          :denominator="nextVipData.conditions[0]?.deposit_amount"
          :isLast="isLast"
        />
      </div>
    </div>
    <!-- 多幣別 -->
    <div v-else class="multi-progress-container">
      <!-- 多條件 -->
      <div v-if="nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT" class="multi-condition">
        <div>
          <div class="progress-content">
            <p class="progress-type">
              {{ $t("vip.bet") }}
            </p>
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
              :denominator="condition.valid_bet_amount"
              :isLast="isLast"
            />
          </div>
        </div>
        <div>
          <div class="progress-content">
            <p class="progress-type">
              {{ $t("vip.deposit") }}
            </p>
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_deposit"
              :denominator="condition.deposit_amount"
              :isLast="isLast"
            />
          </div>
        </div>
      </div>
      <!-- 單條件 -->
      <div v-else class="single-condition">
        <template v-if="nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET">
          <div class="progress-content">
            <p class="progress-type">
              {{ $t("vip.bet") }}
            </p>
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
              :denominator="condition.valid_bet_amount"
              :isLast="isLast"
            />
          </div>
        </template>
        <template v-else>
          <div class="progress-content">
            <p class="progress-type">
              {{ $t("vip.deposit") }}
            </p>
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_deposit"
              :denominator="condition.deposit_amount"
              :isLast="isLast"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVip } from "src/common/composables/useVip"
import type * as Response from "src/api/response.type"
import { PROMOTION_CONDITION } from "src/common/utils/constants"
import VipProgress from "./VipProgress.vue"

const { getLevelUpI18n, getCurrencyCode } = useVip()

const props = defineProps<{
  vipData: Response.MemberVipItem
  nextVipData: Response.MemberVipItem
  userStatisticsMap: Response.UserStatisticsMap
  isActive: boolean
  isLast: boolean
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.vip-card {
  width: 41.25rem;
  min-height: 21.25rem;
  background-image: url("app/template/set_6M88/assets/images/vip/card-bg.png");
  background-position: top right;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 2rem 3.625rem 2.5rem;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 2px 2px 8px 0px #005f7940;
  @include pc-width {
    width: 100%;
  }

  @include iphone-width {
    min-height: 10.5rem;
    padding: 1.125rem 1.5rem 1.5rem;
  }

  .current-tag {
    position: absolute;
    top: 14px;
    left: -74px;
    width: 197.29px;
    height: 29.47px;
    background: #00c8ff;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    line-height: 17.7px;
    transform: rotate(-45deg);
    z-index: 1;
    @include iphone-width {
      position: absolute;
      top: 7px;
      left: -37px;
      width: 6.0925rem;
      height: 0.91rem;
      font-size: 6px;
      line-height: 8.75px;
    }
  }

  .vip-card-title-content {
    @apply relative;

    .vip-card-title {
      font-family: OpenSans;
      font-size: 3rem;
      font-weight: 800;
      line-height: 4.0856rem;
      color: #0897be;
      @include iphone-width {
        font-size: 1.6638rem;
        line-height: 2.25rem;
      }
    }

    .vip-card-subtitle {
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.3619rem;
      color: #005f79;
      min-height: 1.375rem;
      @include iphone-width {
        font-size: 0.625rem;
        line-height: 0.875rem;
        min-height: 0.875rem;
      }
    }

    .vip-icon {
      position: absolute;
      width: 5.6875rem;
      height: 5rem;
      top: 0;
      right: 0;
      @include iphone-width {
        width: 3.1538rem;
        height: 2.7738rem;
      }
    }
  }

  .progress-type {
    font-family: OpenSans;
    font-weight: 700;
    font-size: 0.9375rem;
    line-height: 1.25rem;
    color: #0897be;
  }

  .single-progress-container {
    margin-top: 3.3125rem;
    .single-progress-content {
      margin-bottom: 0.9219rem;
      .progress-type {
        @apply mb-[.4375rem];
      }
    }
  }

  .multi-progress-container {
    margin-top: 1.625rem;
    min-height: 7.9531rem;
    .multi-condition {
      @apply grid grid-cols-2 gap-[3.625rem];
      min-height: 7.9531rem;
      @include iphone-width {
        @apply gap-[1.5rem];
      }
    }
    .single-condition {
      min-height: 7.9531rem;
    }
    .progress-content {
      @apply w-full flex flex-col justify-end gap-2;
      min-height: 7.9531rem;
    }
  }
}
</style>
