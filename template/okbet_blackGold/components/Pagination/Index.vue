<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    boundary-links
    @update:model-value="$emit('update:model-value', $event)"
    active-color="active-pagination"
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
@import "app/template/okbet_blackGold/assets/css/referral.scss";
</style>
