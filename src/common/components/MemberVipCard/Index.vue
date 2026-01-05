<template>
  <div>
    <component :is="compMap[props.module]" v-bind="props" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import type * as Response from "src/api/response.type"
import Module1 from "./components/module1.vue"

const props = defineProps({
  module: {
    type: String as PropType<"module1">,
    default: "module1"
  },
  vipData: {
    type: Object as PropType<Response.MemberVipItem>,
    required: true
  },
  nextVipData: {
    type: Object as PropType<Response.MemberVipItem>,
    required: true
  },
  userStatisticsMap: {
    type: Object as PropType<Response.UserStatisticsMap>,
    required: true
  },
  isActive: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false }
})

const compMap = {
  module1: Module1
} as const
</script>

<style scoped></style>
