<template>
  <div class="vip-card">
    <div v-if="isActive" class="current-tag">
      <span>{{ $t("vip.current") }}</span>
    </div>

    <div class="vip-card-title">{{ vipData.title }}</div>

    <div class="vip-card-subtitle">{{ vipData.remark }}</div>

    <div
      v-if="
        vipData.promotion_condition === PROMOTION_CONDITION.Enums.BET ||
        vipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
      "
      class="progress-wrapper"
    >
      <q-slider
        v-model="betPercent"
        :min="0"
        :max="100"
        label
        label-always
        :label-value="betPercent + '%'"
        thumb-color="thumb"
        track-color="track"
        selection-color="selection"
        label-color="transparent"
        label-text-color="label"
        class="cursor-default"
        readonly
      />
      <div class="progress-info">
        <span class="text-percent"
          >{{ moneyFormat(userStatistics?.total_valid_bet_amount) }}/{{
            moneyFormat(vipData.condition?.valid_bet_amount)
          }}</span
        >
        <span class="text-type">{{ $t("vip.bet") }}</span>
      </div>
    </div>

    <div
      v-if="
        vipData.promotion_condition === PROMOTION_CONDITION.Enums.DEPOSIT ||
        vipData.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
      "
      class="progress-wrapper"
    >
      <q-slider
        v-model="depositPercent"
        :min="0"
        :max="100"
        label
        label-always
        :label-value="depositPercent + '%'"
        thumb-color="thumb"
        track-color="track"
        selection-color="selection"
        label-color="transparent"
        label-text-color="label"
        class="cursor-default"
        readonly
      />
      <div class="progress-info">
        <span class="text-percent"
          >{{ moneyFormat(userStatistics?.total_deposit) }}/{{ moneyFormat(vipData.condition?.deposit_amount) }}</span
        >
        <span class="text-type">{{ $t("vip.deposit") }}</span>
      </div>
    </div>

    <div class="vip-icon">
      <q-img loading="lazy" :src="vipData.img" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { VipItem, UserStatistics } from "src/api/response.type"
import { PROMOTION_CONDITION } from "src/common/utils/constants"

const { moneyFormat, calculatePercentage } = useCommon()

const props = defineProps<{
  vipData: VipItem
  userStatistics?: UserStatistics
  isActive: boolean
}>()

const betPercent = computed({
  get: () => {
    const numerator = props.userStatistics?.total_valid_bet_amount ? props.userStatistics.total_valid_bet_amount : 0
    const denominator = props.vipData.condition?.valid_bet_amount ? props.vipData.condition.valid_bet_amount : 0
    return calculatePercentage(numerator, denominator)
  },
  set: (value) => value
})

const depositPercent = computed({
  get: () => {
    const numerator = props.userStatistics?.total_deposit ? props.userStatistics.total_deposit : 0
    const denominator = props.vipData.condition?.deposit_amount ? props.vipData.condition.deposit_amount : 0
    return calculatePercentage(numerator, denominator)
  },
  set: (value) => value
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";

.vip-card {
  width: 41.25rem;
  height: 21.25rem;
  background-image: url("app/template/okbet_purple/assets/images/vip/bg-card.png");
  background-repeat: no-repeat;
  background-size: 41.25rem 21.25rem;
  padding: 2rem 3.625rem;
  position: relative;
  overflow: hidden;

  .current-tag {
    position: absolute;
    top: 14px;
    left: -74px;
    width: 197.29px;
    height: 29.47px;
    background: #f900fe;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    line-height: 17.7px;
    transform: rotate(-45deg);
    z-index: 1;
  }

  .vip-card-title {
    font-family: OpenSans;
    font-size: 3rem;
    font-weight: 800;
    line-height: 4.0856rem;
    color: $bg-secondary;
  }

  .vip-card-subtitle {
    font-family: OpenSans;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3619rem;
    color: $text-gray-secondary;
    width: 21.5rem;
    margin-top: 0.625rem;
  }

  @include iphone-width {
    width: 20.375rem;
    height: 10.5rem;
    background-size: 20.375rem 10.5rem;
    padding: 0.875rem 1.8125rem;

    .current-tag {
      position: absolute;
      top: 7px;
      left: -37px;
      width: 6.0925rem;
      height: 0.91rem;
      font-size: 6px;
      line-height: 8.75px;
    }

    .vip-card-title {
      font-size: 1.5rem;
      line-height: 2.0625rem;
    }

    .vip-card-subtitle {
      font-size: 0.5rem;
      line-height: 0.6731rem;
      width: 10.625rem;
      margin-top: 0.3125rem;
    }
  }
}

.progress-wrapper {
  position: relative;
  width: 20rem;
  margin-top: 1.875rem;
  .q-slider {
    :deep(.q-slider__track-container--h) {
      padding: 0;

      .q-slider__track {
        height: 0.5rem !important;
      }

      .q-slider__thumb {
        width: 0.875rem !important;
        height: 0.875rem !important;
      }

      .q-slider__pin {
        .q-slider__label--h-standard {
          bottom: 0.125rem;
        }

        .q-slider__text-container {
          width: 2.2656rem;
          height: 1.8125rem;
          background-image: url("app/template/okbet_purple/assets/images/vip/bg-badge.png");
          background-repeat: no-repeat;
          background-size: contain;
          transform: translateX(0) !important;
          display: flex;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }
      }
      .bg-track {
        background: #e3e3e3 !important;
      }
      .text-selection {
        background: $bg-secondary;
      }
      .text-thumb {
        color: $text-light-primary;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          width: 0.625rem;
          height: 0.625rem;
          top: 2px;
          left: 2px;
          border-radius: 50%;
          box-shadow: $text-light-effect-strong;
          z-index: -1;
        }
      }
      .text-label {
        color: $bg-secondary;
      }
    }
  }

  .progress-info {
    @apply flex justify-between mt-1;
    .text-percent {
      padding: 0.25rem 0.625rem;
      border-radius: 1.25rem;
      background: $bg-dark-secondary;
      color: $text-light-secondary;
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.3619rem;
    }
    .text-type {
      color: $text-light-secondary;
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3619rem;
    }
  }

  @include iphone-width {
    width: 10rem;
    margin-top: 0.125rem;
    height: 2.375rem;

    .q-slider {
      :deep(.q-slider__track-container--h) {
        padding: 0;

        .q-slider__track {
          height: 0.25rem !important;
        }

        .q-slider__thumb {
          width: 0.4375rem !important;
          height: 0.4375rem !important;
        }

        .q-slider__pin {
          .q-slider__label--h-standard {
            bottom: 0;
          }
          .q-slider__text-container {
            width: 1.125rem;
            height: 0.9375rem;
            min-height: 0.9375rem;
            .q-slider__text {
              font-size: 0.375rem;
            }
          }
        }

        .text-thumb {
          &:after {
            width: 0.3125rem;
            height: 0.3125rem;
            top: 1px;
            left: 1px;
          }
        }
      }
    }
    .progress-info {
      .text-percent {
        padding: 0.125rem 0.3125rem;
        font-size: 0.5rem;
        line-height: 0.6731rem;
      }
      .text-type {
        font-size: 0.5rem;
        line-height: 0.6731rem;
      }
    }
  }
}

.vip-icon {
  position: absolute;
  width: 13.25rem;
  height: 11.68rem;
  top: 2.6875rem;
  right: 1.375rem;
  @include iphone-width {
    width: 6.5469rem;
    height: 5.7713rem;
    top: 1.3281rem;
    right: 0.6794rem;
  }
}
</style>
