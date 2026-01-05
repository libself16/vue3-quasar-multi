<template>
  <div>
    <div class="flex justify-end items-center">
      <span class="progress-number">
        <span class="text-bold">{{ moneyFormat(roundTo(Number(props.numerator), 0)) }}</span>
        <span>/</span>
        <span class="mr-1">{{ props.isLast ? "MAX" : moneyFormat(roundTo(Number(props.denominator), 0)) }}</span>
        <span>{{ props.currencyCode }}</span>
      </span>
    </div>
    <div class="progress-box">
      <span class="currency">{{ props.progressType }}</span>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: `${progress * 100}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"

const { moneyFormat, roundTo, calculatePercentage, preciseDivide, preciseMultiply } = useCommon()

const props = defineProps({
  currencyCode: {
    type: String,
    default: ""
  },
  numerator: {
    type: String,
    default: "0"
  },
  denominator: {
    type: String,
    default: "0"
  },
  isLast: {
    type: Boolean,
    default: false
  },
  progressType: {
    type: String,
    default: ""
  }
})

const progress = computed({
  get: () => preciseDivide(calculatePercentage(props.numerator, props.denominator), 100),
  set: (value) => value
})

const progressLabel = computed(() => `${preciseMultiply(progress.value, 100)}%`)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.progress-number {
  @apply text-xs text-black;
}

.progress-box {
  @apply w-full flex flex-nowrap items-center gap-1 py-[.125rem];
  .currency {
    color: $text-light-primary;
    font-family: "NotoSansTC";
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.9375rem;
    @include iphone-width {
      font-size: 0.625rem;
    }
  }
  .progress-bar {
    @apply rounded-3xl;
    flex: 1;
    height: 0.625rem;
    background-color: #f4f4f4;
    padding: 0.125rem;
    .progress-bar-inner {
      @apply rounded-3xl;
      height: 100%;
      background-color: #2dd652;
    }
  }
  .q-linear-progress {
    @apply rounded-3xl;
    font-size: 1.1875rem;

    @include iphone-width {
      font-size: 1rem;
      border-radius: 0.8319rem;
    }

    &.text-primary {
      color: #2dd652 !important;
    }

    :deep(.bg-progress) {
      background-color: #f4f4f4;
      opacity: 1;
    }
    .info-content {
      @apply flex justify-end items-center pl-2 pr-[1.875rem];
      @include iphone-width {
        @apply px-[.405rem];
      }
      span {
        font-family: "NotoSansTC";
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 0.75rem;
        color: $text-dark;

        @include iphone-width {
          font-size: 0.625rem;
          line-height: 0.905rem;
        }
      }
    }
  }
}
</style>
