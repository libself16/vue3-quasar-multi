<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    @update:model-value="$emit('update:model-value', $event)"
    color="white"
    active-color="green-btn"
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
  .active-green {
    background: red;
    color: red;
  }
</style>
