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

.progress-box {
  @apply w-full flex flex-nowrap items-center gap-[.375rem];

  .currency {
    font-family: Helvetica;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: var(--text-07);
    min-width: 2rem;
  }

  .q-linear-progress {
    @apply rounded-3xl;
    font-size: 1.1875rem;

    :deep(.bg-progress) {
      background: var(--bg-11);
      opacity: 1;
    }

    :deep(.q-linear-progress__model) {
      // @apply rounded-3xl;
      background: linear-gradient(90deg, var(--btn-bg-02) 0%, var(--btn-bg-01) 100%);
    }

    .info-content {
      @apply flex justify-between items-center px-[.625rem];

      span {
        font-family: Helvetica;
        font-weight: 700;
        font-size: 0.75rem;
        line-height: 0.875rem;
        color: var(--text-01);
      }
    }
  }
}
</style>
