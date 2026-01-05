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
@import "app/template/set_r016/assets/css/_variable.scss";

.benefit-row {
  @apply flex items-center;
  padding: 0.625rem;

  .icon {
    width: 3.375rem;
    height: 3.375rem;
  }

  .info {
    margin-left: 1.25rem;
    padding-left: 1.25rem;
    border-left: 1px solid $primary05;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;

    .title {
      @include fontStyle();
      color: #ffffffcc;
    }
    .text {
      @include fontStyle(1.25rem);
      color: $neutral01;
    }
  }
}
</style>
