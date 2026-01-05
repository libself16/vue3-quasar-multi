<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    boundary-links
    flat
    active-design="flat"
    color="neutral-01"
    active-color="primary"
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
@import "app/template/set_r025/assets/css/button.scss";
</style>
