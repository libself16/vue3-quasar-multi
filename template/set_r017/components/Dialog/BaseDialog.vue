<template>
  <q-dialog v-model="model" v-bind="attrs" transition-show="fade" transition-hide="fade" class="base-dialog-wrapper">
    <q-card class="base-dialog-content" :style="{ 'max-width': maxWidth }">
      <q-card-section class="base-dialog-header">
        <slot v-if="slots['title']" name="title"></slot>
        <h3 v-else class="base-dialog-title">{{ props.title }}</h3>
        <!-- <q-btn class="base-close-btn hide-hover" flat round dense v-close-popup @click="$emit('closeDialog')" /> -->
        <q-btn class="base-close-btn" flat round dense v-close-popup @click="$emit('closeDialog')">
          <q-img :src="svgIcon('close')" loading="lazy"></q-img>
        </q-btn>
      </q-card-section>
      <q-card-section class="base-dialog-body">
        <slot></slot>
      </q-card-section>
      <slot v-if="slots['footer']" name="footer"></slot>
      <q-card-section v-if="useFooter" class="base-dialog-footer">
        <q-btn class="btn-footer hide-hover" @click="$emit('footerBtnClick')">{{ footerBtnTitle }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { defineEmits, defineModel, defineProps, useAttrs, useSlots } from "vue"

const model = defineModel<boolean | undefined>()
const attrs = useAttrs()
const slots = useSlots()
const emits = defineEmits(["closeDialog", "footerBtnClick"])
const { svgIcon } = useSiteImg()

const props = defineProps({
  title: {
    type: [String],
    required: false,
    default: () => ""
  },
  maxWidth: {
    type: [String],
    required: false,
    default: () => ""
  },
  useFooter: {
    type: [Boolean],
    required: false,
    default: () => false
  },
  footerBtnTitle: {
    type: [String],
    required: false,
    default: () => ""
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.base-dialog-content {
  max-width: 37.5rem !important;
  width: 100%;
  max-height: 25rem;
  padding: 1.25rem;
  padding-bottom: 1rem;
  border-radius: 1.5rem;
  background: $secondary01;

  &::-webkit-scrollbar {
    display: none;
  }

  .base-dialog-header {
    @apply flex items-center justify-between p-0;
    color: #f2f2f2;

    .base-dialog-title {
      font-family: NotoSans;
      font-weight: 700;
      font-size: 1.5rem;
      line-height: 3.0625rem;
    }

    .base-close-btn {
      min-width: auto;
      min-height: auto;

      .q-img {
        width: 1.375rem;
        height: 1.375rem;
      }
    }
  }

  .base-dialog-body {
    @apply p-0 pb-1 overflow-y-auto;
    color: #c4c4c4;
    font-family: OpenSans;
    font-weight: 400;
    font-size: 1rem;
    line-height: 100%;
    margin-top: 1.875rem;
    border-radius: 0 !important;
  }

  // .base-dialog-footer {
  //   @apply p-0 flex;

  //   .btn-footer {
  //     @apply w-full;
  //     padding: 0.625rem;
  //     border-radius: 0.625rem;
  //     background: $gradient01;
  //     color: $neutral01;
  //   }
  // }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.base-dialog-wrapper {
  .q-dialog__backdrop {
    background: #00000066 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      padding: 6.25rem 0.875rem 0;
      &.flex-center {
        align-items: start;
      }
    }
  }
}
</style>
