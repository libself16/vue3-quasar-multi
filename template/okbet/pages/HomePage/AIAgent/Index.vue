<template>
  <section>
    <DesktopAIAgent v-if="!isMobile" theme="default" />
    <MobileAIAgent v-else theme="default" />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopAIAgent from "app/template/okbet/pages/HomePage/AIAgent/Desktop/DesktopAIAgent.vue"
import MobileAIAgent from "app/template/okbet/pages/HomePage/AIAgent/Mobile/MobileAIAgent.vue"

const { isMobile } = useMediaQuery()
</script>

<style lang="scss">
@import "src/common/css/AIAgent/theme.scss";
</style>
