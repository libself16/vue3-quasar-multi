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
@import "app/template/set_DBO88/assets/css/_variable.scss";

.benefit-row {
  display: flex;
  align-items: center;
  height: 6.75rem;
  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }
  .info {
    margin-left: 1.75rem;
    padding-left: 0.75rem;
    border-left: 1px solid #8aceff80;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: rgba($text-white, 0.8);
    }
    .text {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: $text-white;
    }
  }

  &.h5 {
    @apply py-3;
    height: 4.4375rem;
    box-sizing: border-box;
    .icon {
      width: 2.1875rem;
      height: 2.1875rem;
    }
    .info {
      margin-left: 1.15rem;
      padding-left: 0.6575rem;
      border-left: 1px solid #8aceff80;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      .title {
        font-size: 0.625rem;
        font-weight: 600;
        line-height: 0.7831rem;
        color: rgba($text-white, 0.8);
      }
      .text {
        font-size: 0.8219rem;
        font-weight: 700;
        line-height: 1.1187rem;
        color: $text-white;
      }
    }
  }
}
</style>
