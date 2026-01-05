<template>
  <div class="vip-card" :class="{ selected: isSelected }">
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
  isSelected: boolean
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.vip-card {
  width: 41.25rem;
  min-height: 18rem;
  background: $gradient04;
  border: 1px solid $primary03;
  border-radius: 0.625rem;
  padding: 1.875rem;
  position: relative;
  overflow: hidden;

  &.selected {
    border: 0.25rem solid $primary01;

    @include phone-width {
      border: 1px solid $primary03;
    }
  }

  .current-tag {
    @include fontStyle(0.75rem);
    color: $neutral01;
    position: absolute;
    top: 14px;
    left: -74px;
    width: 197.29px;
    height: 29.47px;
    background: #fe0000;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(-45deg);
    z-index: 1;

    @include iphone-width {
      position: absolute;
      top: 7px;
      left: -76px;
      width: 190px;
      height: 20px;
    }
  }

  .vip-card-title-content {
    @apply relative;
    .vip-card-title {
      @include fontStyle(2.5rem);
      background: linear-gradient(0deg, #ff7a00 1.47%, #ffc002 79.41%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      max-width: calc(100% - 5.6875rem);

      @include iphone-width {
        font-size: 1.5rem;
        max-width: calc(100% - 4.25rem);
      }
    }

    .vip-card-subtitle {
      @include fontStyle(1rem);
      margin-top: 0.375rem;
      color: #ffffffcc;
      max-width: calc(100% - 5.6875rem);

      @include iphone-width {
        font-size: 0.875rem;
        margin-top: 0.25rem;
        max-width: calc(100% - 4.25rem);
      }
    }

    .vip-icon {
      position: absolute;
      width: 5.6875rem;
      height: 5rem;
      top: 0;
      right: 0;

      @include iphone-width {
        width: 4.25rem;
        height: 3.75rem;
      }
    }
  }

  .progress-type {
    @include fontStyle(1rem);
    color: $neutral01;
  }

  .single-progress-container {
    margin-top: 1.875rem;
    .single-progress-content {
      margin-bottom: 1.5rem;
      .progress-type {
        @apply mb-2;

        @include iphone-width {
          margin-bottom: 0.375rem;
        }
      }
    }
  }

  .multi-progress-container {
    margin-top: 1.875rem;
    min-height: 7.375rem;

    .multi-condition {
      @apply grid grid-cols-2 gap-5;
      min-height: 7.375rem;

      @include iphone-width {
        @apply grid-cols-1;
        gap: 0.625rem;
      }
    }

    .single-condition {
      min-height: 7.375rem;
    }

    .progress-content {
      @apply w-full flex flex-col justify-end gap-2;
      min-height: 7.375rem;

      @include iphone-width {
        gap: 0.375rem;
      }
    }
  }
}
</style>
