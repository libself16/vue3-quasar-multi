<template>
  <div>
    <component :is="compMap[props.module]" />
  </div>
</template>

<script setup lang="ts">
import Module1 from "./components/module1.vue"

const props = withDefaults(
  defineProps<{
    module?: "module1"
  }>(),
  {
    module: "module1"
  }
)

const compMap = {
  module1: Module1
} as const
</script>

<style scoped></style>
