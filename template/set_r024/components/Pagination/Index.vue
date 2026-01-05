<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    boundary-links
    flat
    active-design="flat"
    class="custom-pagination"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  totalPages: number
  maxPages?: number
}>()

defineEmits<{
  "update:model-value": [value: number]
}>()
</script>

<style scoped lang="scss">
@import "app/template/set_r024/assets/css/_variable.sass";

.custom-pagination {
  :deep(.q-btn) {
    color: $neutral-01 !important;

    &.q-btn--active,
    &.q-btn--focus,
    &[aria-current="true"] {
      background-color: $primary-01 !important;
      color: $neutral-01 !important;
    }

    &:hover:not(.q-btn--active):not(.q-btn--focus):not([aria-current="true"]) {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }

  :deep(.q-btn--flat) {
    color: $neutral-01 !important;

    &.q-btn--active,
    &.q-btn--focus,
    &[aria-current="true"] {
      background-color: $primary-01 !important;
      color: $neutral-01 !important;
    }
  }
}
</style>
