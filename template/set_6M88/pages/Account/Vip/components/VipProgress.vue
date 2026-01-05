<template>
  <div class="progress-box">
    <span class="currency">{{ props.currencyCode }}</span>
    <q-linear-progress :value="progress" track-color="progress">
      <div class="absolute-full info-content">
        <span>{{ progressLabel }}</span>
        <span>
          {{ moneyFormat(roundTo(Number(props.numerator), 0)) }}
          /
          {{ props.isLast ? "MAX" : moneyFormat(roundTo(Number(props.denominator), 0)) }}
        </span>
      </div>
    </q-linear-progress>
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
@import "app/template/okbet/assets/css/_variable.sass";

.progress-box {
  @apply w-full flex flex-nowrap items-center gap-1 py-[.125rem];
  .currency {
    color: #0897be;
    font-family: "NotoSansTC";
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.625rem;
    @include iphone-width {
      font-size: 0.625rem;
      line-height: 0.875rem;
    }
  }
  .q-linear-progress {
    @apply rounded-3xl;
    font-size: 1.1875rem;
    color: #005f79;

    @include iphone-width {
      font-size: 1rem;
      border-radius: 0.8319rem;
    }

    :deep(.bg-progress) {
      background: #93a9cb;
      opacity: 1;
    }
    .info-content {
      @apply flex justify-between items-center gap-1 pl-2 pr-[1.875rem] text-right;
      @include iphone-width {
        @apply px-[.375rem];
      }
      span {
        font-family: "NotoSansTC";
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 0.75rem;
        color: #ffffff;

        @include iphone-width {
          font-size: 0.625rem;
          line-height: 0.8rem;
        }
      }
    }
  }
}
</style>
