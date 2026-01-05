<template>
  <div class="vip-card">
    <div v-if="isActive" class="current-tag">
      <span>{{ $t("vip.current") }}</span>
    </div>

    <div class="vip-card-title-content">
      <div class="vip-card-title">{{ vipData.title }}</div>

      <div class="vip-card-subtitle !text-[#457950]">{{ $t(getLevelUpI18n(vipData)) }}</div>

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
        <VipProgress
          :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
          :numerator="userStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_valid_bet_amount"
          :denominator="nextVipData.conditions[0]?.valid_bet_amount"
          :isLast="isLast"
          :progressType="$t('vip.bet')"
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
        <VipProgress
          :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
          :numerator="userStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_deposit"
          :denominator="nextVipData.conditions[0]?.deposit_amount"
          :isLast="isLast"
          :progressType="$t('common.btn.cash_in')"
        />
      </div>
    </div>
    <!-- 多幣別 -->
    <div v-else class="multi-progress-container">
      <!-- 多條件 -->
      <div v-if="nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT" class="multi-condition">
        <div>
          <div class="progress-content">
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
              :denominator="condition.valid_bet_amount"
              :isLast="isLast"
              :progressType="$t('vip.bet')"
            />
          </div>
        </div>
        <div>
          <div class="progress-content">
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_deposit"
              :denominator="condition.deposit_amount"
              :isLast="isLast"
              :progressType="$t('common.btn.cash_in')"
            />
          </div>
        </div>
      </div>
      <!-- 單條件 -->
      <div v-else class="single-condition">
        <template v-if="nextVipData.promotion_condition === PROMOTION_CONDITION.Enums.BET">
          <div class="progress-content">
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
              :denominator="condition.valid_bet_amount"
              :isLast="isLast"
              :progressType="$t('vip.bet')"
            />
          </div>
        </template>
        <template v-else>
          <div class="progress-content">
            <VipProgress
              v-for="condition in nextVipData.conditions"
              :key="condition.currency_id"
              :currencyCode="getCurrencyCode(condition.currency_id)"
              :numerator="userStatisticsMap[condition.currency_id]?.total_deposit"
              :denominator="condition.deposit_amount"
              :isLast="isLast"
              :progressType="$t('common.btn.cash_in')"
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
import { PROMOTION_CONDITION, LEVEL_UP_TYPE } from "src/common/utils/constants"
import VipProgress from "./VipProgress.vue"

const { getCurrencyCode } = useVip()

const props = defineProps<{
  vipData: Response.MemberVipItem
  nextVipData: Response.MemberVipItem
  userStatisticsMap: Response.UserStatisticsMap
  isActive: boolean
  isLast: boolean
}>()

function getLevelUpI18n(vipData: Response.MemberVipItem): string {
  if (!vipData.conditions.length) return ""
  if (vipData.conditions.length === 1) return "vip.meetingTheRequirement"
  if (vipData.promotion_type === LEVEL_UP_TYPE.Enums.All) return "vip.allRequirements"
  return "vip.completeTheRequirementsToLevelUp"
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.vip-card {
  width: 41.25rem;
  min-height: 21.25rem;
  border-radius: 12px;
  border: 2px solid #e1ffd8;
  background: linear-gradient(139deg, #fff 0%, #a3d9b3 38.76%, #ccffe3 62.11%, #a3d9b3 79.86%);
  box-shadow: 2px 2px 22.3px 0 rgba(255, 255, 255, 0.25) inset, 0 2px 8px 0 rgba(0, 0, 0, 0.55);
  padding: 2rem 3.625rem 2.5rem;
  position: relative;
  overflow: hidden;
  // background-color: white;
  // border-radius: 1.5rem;
  // border: 1px solid rgba(133, 147, 175, 0.3);

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
    background: red;
    color: white;
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
    min-height: 5rem;

    .vip-card-title {
      font-family: OpenSans;
      font-size: 3rem;
      font-weight: 800;
      line-height: 4.0856rem;
      color: $text-light-primary;
      @include iphone-width {
        font-size: 1.6638rem;
        line-height: 2.375rem;
      }
    }

    .vip-card-subtitle {
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.3619rem;
      color: #ffffffcc;
      min-height: 1.375rem;
      @include iphone-width {
        font-size: 0.625rem;
        line-height: 0.875rem;
        margin-top: 0;
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
    font-size: 16px;
    font-weight: 700;
    line-height: 21.79px;
    color: $text-light-fifth;
  }

  .single-progress-container {
    margin-top: 3.125rem;
    .single-progress-content {
      margin-bottom: 1.5rem;
      .progress-type {
        @apply mb-2;
      }
    }
  }

  .multi-progress-container {
    margin-top: 1.8125rem;
    min-height: 8.75rem;
    .multi-condition {
      @apply grid grid-cols-2 gap-[1.9375rem];
      min-height: 8.75rem;
    }
    .single-condition {
      min-height: 8.75rem;
    }
    .progress-content {
      @apply w-full flex flex-col justify-end gap-3;
      min-height: 9.25rem;
    }
  }
}
</style>
