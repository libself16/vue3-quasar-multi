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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";

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
    border-left: 1px solid rgba($border-night-sky-color, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-family: OpenSans;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: $text-sky-gray-color;
    }
    .text {
      font-family: OpenSans;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: $text-night-sky-color;
    }
  }

  &.h5 {
    height: 4.4375rem;
    box-sizing: border-box;
    .icon {
      width: 3rem;
      height: 3rem;
    }
    .info {
      margin-left: 0.675rem;
      padding-left: 0.6575rem;
      border-left: 1px solid rgba($border-night-sky-color, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      .title {
        font-family: OpenSans;
        font-size: 0.625rem;
        font-weight: 600;
        line-height: 0.7831rem;
        color: $text-sky-gray-color;
      }
      .text {
        font-family: OpenSans;
        font-size: 0.8219rem;
        font-weight: 700;
        line-height: 1.1187rem;
        color: $text-night-sky-color;
      }
    }
  }
}
</style>
