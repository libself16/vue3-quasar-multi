<template>
  <div class="outer-layout" :class="`${devicePlatform}`">
    <router-view />

    <VueQueryDevtools />
  </div>
</template>

<script setup>
import "animate.css"
import useSwipeLeft from "src/common/hooks/useSwipeLeft"
import { onMounted } from "vue"
import { VueQueryDevtools } from "@tanstack/vue-query-devtools"

const devicePlatform = window.device?.platform || ""
useSwipeLeft(devicePlatform)

onMounted(() => {
  console.log("[Init URL]: ", window.location.href)
})
</script>

<style lang="sass">
.outer-layout
  position: relative
</style>
