<template>
  <q-dialog v-model="model" v-bind="attrs" transition-show="fade" transition-hide="fade" class="base-dialog-wrapper">
    <q-card class="base-dialog-content" :style="{ 'max-width': maxWidth }">
      <q-card-section class="base-dialog-header">
        <slot v-if="slots['title']" name="title"></slot>
        <h3 v-else class="base-dialog-title">{{ props.title }}</h3>
        <q-btn
          class="base-close-btn hide-hover"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="$emit('closeDialog')"
        />
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
import { defineModel, useAttrs, useSlots, defineEmits, defineProps } from "vue"

const model = defineModel<boolean | undefined>()
const attrs = useAttrs()
const slots = useSlots()
const emits = defineEmits(["closeDialog", "footerBtnClick"])

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
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.base-dialog-content {
  max-width: 31.25rem;
  width: 100%;
  min-height: 14.25rem;
  padding: 1.25rem;
  border-radius: 0.625rem;

  .base-dialog-header {
    @apply flex items-center justify-between p-0;
    color: $primary04;

    .base-dialog-title {
      @include fontStyle(1.5rem, 700, 1.75rem);
    }

    .base-close-btn {
      min-width: auto;
      min-height: auto;

      :deep(.q-icon) {
        font-size: 1.625rem;
        font-weight: 500;
      }
    }
  }

  .base-dialog-body {
    @apply p-0 overflow-y-auto;
    @include fontStyle;
    margin-top: 1.875rem;
    max-height: calc(100vh - 12.5rem);
    min-height: 8.125rem;
    box-sizing: content-box;
    border: none;
  }

  .base-dialog-footer {
    @apply p-0 flex;

    .btn-footer {
      @apply w-full;
      @include fontStyle();
      padding: 0.625rem;
      border-radius: 0.625rem;
      background: $gradient01;
      color: $neutral01;
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.base-dialog-wrapper {
  .q-dialog__backdrop {
    background: $secondary01 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      &.q-dialog__inner--minimized {
        padding: 3.125rem 1rem;
      }
      &.flex-center {
        align-items: start;
      }
    }
  }

  &.mobile-align-center {
    .q-dialog__inner {
      @include phone-width {
        &.q-dialog__inner--minimized {
          padding: 0 1rem;
        }
        &.flex-center {
          align-items: center;
        }
      }
    }
  }
}
</style>
