<template>
  <div class="vip-card" :class="{ selected: isSelected }">
    <div v-if="isActive" class="current-tag">
      <span>{{ $t("vip.current") }}</span>
    </div>

    <div class="vip-card-header">
      <div class="vip-card-title-content">
        <div class="vip-card-title">{{ vipData.title }}</div>

        <div class="vip-card-subtitle">{{ $t(getLevelUpI18n(vipData)) }}</div>
      </div>

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
        <MemberVipProgress
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
        <MemberVipProgress
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
            <MemberVipProgress
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
            <MemberVipProgress
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
            <MemberVipProgress
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
            <MemberVipProgress
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
import { PropType } from "vue"
import { useVip } from "src/common/composables/useVip"
import type * as Response from "src/api/response.type"
import { PROMOTION_CONDITION } from "src/common/utils/constants"
import MemberVipProgress from "src/common/components/MemberVipProgress/Index.vue"

const { getLevelUpI18n, getCurrencyCode } = useVip()

const props = defineProps({
  vipData: {
    type: Object as PropType<Response.MemberVipItem>,
    required: true
  },
  nextVipData: {
    type: Object as PropType<Response.MemberVipItem>,
    required: true
  },
  userStatisticsMap: {
    type: Object as PropType<Response.UserStatisticsMap>,
    required: true
  },
  isActive: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.vip-card {
  border: 1px solid var(--bg-line-02);
  border-radius: 0.625rem;
  padding: 1.875rem;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 22.3px 0px #ffffff40 inset;
  box-sizing: border-box;
  background: linear-gradient(164.02deg, var(--bg-18) 0%, var(--bg-19) 88.9%);

  &.selected {
    border: 4px solid var(--bg-line-03);

    @include phone-width {
      border: 1px solid var(--bg-line-02);
    }
  }

  .current-tag {
    font-family: Helvetica;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: var(--text-01);
    position: absolute;
    top: 14px;
    left: -74px;
    width: 11.875rem;
    height: 1rem;
    background: var(--text-06);
    display: flex;
    justify-content: center;
    transform: rotate(-45deg);
    z-index: 1;
  }

  .vip-card-header {
    @apply flex items-center justify-between mb-5;

    .vip-card-title-content {
      @apply flex-1;

      .vip-card-title {
        font-family: OpenSans;
        font-weight: 800;
        font-size: 2.25rem;
        line-height: 3.0625rem;
        background: linear-gradient(90deg, var(--text-07) 0%, var(--text-06) 31.66%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .vip-card-subtitle {
        font-family: Helvetica;
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1rem;
        color: var(--text-03);
      }
    }

    .vip-icon {
      width: 5.6875rem;
      height: 5rem;

      .q-img {
        height: 100%;
      }

      @include iphone-width {
        width: 4.25rem;
        height: 3.75rem;
      }
    }
  }

  .progress-type {
    font-family: Helvetica;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: var(--text-01);
  }

  .single-progress-container {
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
    min-height: 7.375rem;

    .multi-condition {
      @apply grid grid-cols-2 gap-5;
      min-height: 7.375rem;

      @include iphone-width {
        @apply grid-cols-1 gap-[.625rem];
      }
    }

    .single-condition {
      min-height: 7.375rem;
    }

    .progress-content {
      @apply w-full flex flex-col justify-end gap-[.375rem];
      min-height: 7.375rem;
    }
  }
}
</style>
