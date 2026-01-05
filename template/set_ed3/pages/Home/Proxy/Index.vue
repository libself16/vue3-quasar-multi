<template>
  <DesktopProxy v-if="!isMobile" />
  <MobileProxy v-else />
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopProxy from "./DesktopProxy.vue"
import MobileProxy from "./MobileProxy.vue"

const { isMobile } = useMediaQuery()
</script>
