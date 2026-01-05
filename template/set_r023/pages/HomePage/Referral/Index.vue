<template>
  <section>
    <DesktopReferral v-if="!isLargeTablet" />
    <MobileReferral v-else />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopReferral from "./DesktopReferral.vue"
import MobileReferral from "./MobileReferral.vue"

const { isLargeTablet } = useMediaQuery()
</script>
