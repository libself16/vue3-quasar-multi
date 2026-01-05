<template>
  <q-dialog v-model="modelValue" persistent transition-show="jump-down" transition-hide="jump-up" @hide="emit('close')">
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
        <q-card-section class="primary-modal-content">
          <slot></slot>
        </q-card-section>
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
@import "app/template/set_paisa24/assets/css/_variable.scss";

.primary-modal {
  @apply w-[50rem];
  box-shadow: 0 0 0.3125rem 0.0625rem $pink-shadow-color;
  background: $modal-bg-light !important;

  @include pad-large-width() {
    @apply w-full;
  }

  .primary-title-wrapper {
    @apply flex justify-between items-center text-white font-bold;
    background: $modal-header-bg-color;

    .close-icon {
      @apply font-black text-xl cursor-pointer;
    }
  }

  .primary-modal-content {
    color: $input-text-color;
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
