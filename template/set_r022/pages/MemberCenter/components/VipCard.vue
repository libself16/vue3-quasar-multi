<template>
  <div class="vip-card" :class="{ 'is-dark': $q.dark.isActive }">
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
@import "app/template/set_r022/assets/css/_variable.scss";

.vip-card {
  width: 41.25rem;
  min-height: 21.25rem;
  background-image: url("app/template/set_r022/assets/images/vip/bg-card.png");
  background-position: top right;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 2rem 3.625rem 2.5rem;
  position: relative;
  overflow: hidden;

  &.is-dark {
    background-image: url("app/template/set_r022/assets/images/vip/bg-card-dark.png");
  }

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
    color: var(--text-01);
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
      color: var(--secondary-01);
      @include iphone-width {
        font-size: 1.66375rem;
      }
    }

    .vip-card-subtitle {
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-02);
      @include iphone-width {
        font-size: 0.625rem;
        margin-top: 0.3125rem;
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
    font-size: 1rem;
    font-weight: 700;
    line-height: 21.79px;
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
      @apply w-full flex flex-col justify-end gap-2;
      min-height: 9.25rem;
    }
  }
}
</style>
