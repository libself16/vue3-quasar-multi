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
@import "app/template/set_r022/assets/css/_variable.scss";

.benefit-row {
  display: flex;
  align-items: center;
  padding: 1.1875rem 2.1875rem;

  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }
  .info {
    margin-left: 1.375rem;
    padding-left: 1.375rem;
    border-left: 1px solid var(--neutral-03);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-family: OpenSans;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: var(--primary-08);
    }
    .text {
      font-family: OpenSans;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: var(--secondary-01);
    }
  }

  &.h5 {
    box-sizing: border-box;
    padding: 0.78125rem 1.4375rem;
    .icon {
      width: 3rem;
      height: 3rem;
    }
    .info {
      margin-left: 0.675rem;
      padding-left: 0.6575rem;
      border-left: 1px solid var(--neutral-03);
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      .title {
        font-family: OpenSans;
        font-size: 0.625rem;
        font-weight: 600;
        line-height: 0.7831rem;
        color: var(--primary-08);
      }
      .text {
        font-family: OpenSans;
        font-size: 0.8219rem;
        font-weight: 700;
        line-height: 1.1187rem;
        color: var(--secondary-01);
      }
    }
  }
}
</style>
