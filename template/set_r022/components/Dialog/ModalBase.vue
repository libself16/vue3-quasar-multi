<template>
  <q-dialog
    maximized
    v-model="modelValue"
    persistent
    transition-show="jump-down"
    transition-hide="jump-up"
    @hide="emit('close')"
  >
    <template v-if="props.templateType === 'primary'">
      <q-card
        :class="props.modalClass"
        :style="`
        width: ${props.width ? props.width : ''};
        max-width: ${props.maxWidth ? props.maxWidth : ''};
        border-radius: ${props.borderRadius};
      `"
      >
        <q-card-section v-if="props.useTitle" class="primary-title-wrapper">
          <span class="primary-title">{{ props.title }}</span>
          <i class="close-icon fas fa-times" @click="handleClose"></i>
        </q-card-section>
        <q-card-section class="primary-modal-content"> <slot></slot> </q-card-section>
      </q-card>
    </template>
    <template v-else>
      <q-card
        :class="props.modalClass"
        :style="`
        width: ${props.width ? props.width : ''};
        max-width: ${props.maxWidth ? props.maxWidth : ''};
        border-radius: ${props.borderRadius};
      `"
      >
        <q-card-section>
          <slot></slot>
        </q-card-section>
      </q-card>
    </template>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineModel } from "vue"

const emit = defineEmits(["close"])
const modelValue = defineModel<boolean>()
const props = defineProps({
  modalClass: {
    type: String,
    default: ""
  },
  useTitle: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  width: {
    type: String,
    default: ""
  },
  maxWidth: {
    type: String,
    default: ""
  },
  templateType: {
    type: String,
    default: "primary"
  },
  borderRadius: {
    type: String,
    default: ""
  }
})

const handleClose = () => {
  modelValue.value = false
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
// @import "app/template/set_paisa24/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/_variable.scss";

.primary-modal {
  @apply w-[55rem];
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  background: var(--bg-main-bg);
  overflow: hidden;

  @include pad-large-width() {
    @apply w-full;
  }

  .primary-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-01);
    text-align: center;
    font-family: "Segoe UI";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 36px; /* 150% */
    border-radius: 8px 8px 0px 0px;
    background: var(--neutral-01);
    position: relative;

    @include pad-large-width() {
      font-size: 18px;
      padding: 0.5rem 0;
    }

    .close-icon {
      position: absolute;
      right: 0;
      color: #9eacc9;
      padding: 0 1rem;
      @apply font-black text-xl cursor-pointer;
    }
  }

  .primary-modal-content {
    color: var(--primary-02);
    padding: 12px !important;

    @include pad-large-width() {
      padding: 0 !important;
    }
  }
}

.secondary-modal {
  :deep(.q-card__section--vert) {
    padding: 0 !important;
  }

  @include pad-large-width() {
    @apply w-full;
  }
}
</style>
