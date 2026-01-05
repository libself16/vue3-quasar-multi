<template>
  <div class="benefit-row" :class="{ h5: isMobile }">
    <div class="icon">
      <q-img loading="lazy" :src="props.imgSrc"></q-img>
    </div>
    <div class="info">
      <p class="title">
        {{ props.title }}
      </p>
      <p class="text">
        {{ Number(props.value) >= 0 ? moneyFormat(props.value) : 0 }}
        <span v-if="props.useCurrency" class="ml-1">
          {{ currency }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { moneyFormat } = useCommon()

const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  currency: {
    type: String,
    required: false,
    default: ""
  },
  useCurrency: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.benefit-row {
  @apply flex items-center;
  height: 6.75rem;

  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }
  .info {
    margin-left: 1.75rem;
    padding-left: 0.75rem;
    border-left: 1px solid #0897be;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-family: OpenSans;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: #0897be;
    }
    .text {
      font-family: OpenSans;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: #005f79;
    }
  }

  &.h5 {
    @apply py-3 md:py-[1.6875rem] h-auto box-border;

    .icon {
      width: 2.0569rem;
      height: 2.0569rem;
    }
    .info {
      margin-left: 1.0669rem;
      padding-left: 0.6094rem;
      border-left: 1px solid #0897be;
      display: flex;
      flex-direction: column;
      gap: 0.3331rem;
      .title {
        font-family: OpenSans;
        font-size: 1rem;
        font-weight: 600;

        color: #0897be;

        @include phone-width {
          font-size: 0.75rem;
          line-height: 1rem;
        }
      }
      .text {
        font-family: OpenSans;
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.2;
        color: #005f79;

        @include phone-width {
          font-size: 0.875rem;
          line-height: 1.1875rem;
        }
      }
    }
  }
}
</style>
