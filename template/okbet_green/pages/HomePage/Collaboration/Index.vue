<template>
  <section>
    <DesktopCollaboration v-if="!isMobile" />
    <MobileCollaboration v-else />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopCollaboration from "./DesktopCollaboration.vue"
import MobileCollaboration from "./MobileCollaboration.vue"

const { isMobile } = useMediaQuery()
</script>
