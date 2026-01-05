<template>
  <div class="benefit-row">
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
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { moneyFormat } = useCommon()
const { isMobile } = useMediaQuery()
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
  display: flex;
  align-items: center;
  height: 6.75rem;
  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-left: 1.75rem;
    padding-left: 0.75rem;
    border-left: 1px solid #d1444480;
    .title {
      font-family: OpenSans;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1919rem;
      color: #ffffffcc;
    }
    .text {
      font-family: OpenSans;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.7025rem;
      color: #fff;
    }
  }
}
</style>
