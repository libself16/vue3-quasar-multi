<template>
  <div>
    <component :is="compMap[props.module]" v-bind="$props" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import Module1 from "./components/module1.vue"

const props = defineProps({
  module: {
    type: String as PropType<"module1">,
    default: "module1"
  },
  currencyCode: {
    type: String,
    default: ""
  },
  numerator: {
    type: String,
    default: "0"
  },
  denominator: {
    type: String,
    default: "0"
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const compMap = {
  module1: Module1
} as const
</script>

<style scoped></style>
