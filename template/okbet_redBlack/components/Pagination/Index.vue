<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    boundary-links
    active-text-color="primary"
    color="white"
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

<style lang="scss" scoped>
.q-pagination {
  :deep(.bg-white) {
    background: transparent !important;

    &::before {
      box-shadow: none;
    }
  }
}
</style>
