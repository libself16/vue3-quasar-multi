<template>
  <q-dialog
    v-model="modelValue"
    persistent
    maximized
    :full-height="false"
    transition-show="jump-down"
    transition-hide="jump-up"
    class="modal_share"
    :class="props.modalClass"
    @hide="emit('close')"
  >
    <q-card
      class="modal-content"
      :style="`
        width: ${props.width ? props.width : ''};
        max-width: ${props.maxWidth ? props.maxWidth : ''};
      `"
    >
      <q-btn flat v-close-popup class="close hide-hover"> </q-btn>
      <q-card-section v-if="props.useTitle" class="modal_title_top" :class="props.titleClass">
        <span class="text-white">{{ props.title }}</span>
      </q-card-section>
      <q-card-section
        class="modal-body"
        :style="`
        height: ${props.height ? props.height : ''};
      `"
      >
        <slot></slot>
      </q-card-section>
    </q-card>
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
  titleClass: {
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
  height: {
    type: String,
    default: ""
  }
})
</script>

<style lang="scss" scoped>
.q-dialog {
  :deep(.q-dialog__inner) {
    margin: 0.5rem;
  }
}

.q-dialog.modal_share {
  .modal-content {
    width: 100%;
    max-width: 31.25rem;
    height: auto;
    max-height: calc(100vh - 100px);
    overflow: visible;
    position: relative;
    display: flex;
    flex-direction: column;
    .close {
      &:hover {
        opacity: 0.75;
      }
    }
  }
}
</style>
