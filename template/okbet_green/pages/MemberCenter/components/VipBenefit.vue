<template>
  <div class="benefit-row" :class="{ h5: !$q.platform.is.desktop }">
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
import { useCommon } from "src/common/hooks/useCommon"

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
@import "app/template/okbet_green/assets/css/_variable.sass";
.benefit-row {
  @apply flex items-center;
  height: 6.75rem;

  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-family: OpenSans;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: $text-gray;
    }
    .text {
      font-family: OpenSans;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: $text-light-fourth;
    }
  }

  &.h5 {
    height: 10rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: -1.5rem;
    margin-bottom: 1rem;
    .icon {
      width: 8rem;
      height: 8rem;
      margin-bottom: 0.25rem;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: center;
      .title {
        font-family: OpenSans;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        color: $text-gray;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 700;
        line-height: 1.1875rem;
        color: $text-light-fourth;
      }
    }
  }
}
</style>
