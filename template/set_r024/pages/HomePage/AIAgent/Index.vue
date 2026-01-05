<template>
  <section>
    <DesktopAIAgent v-if="!isMobile" theme="set_r024" />
    <MobileAIAgent v-else theme="set_r024" />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopAIAgent from "app/template/set_r024/pages/HomePage/AIAgent/Desktop/DesktopAIAgent.vue"
import MobileAIAgent from "app/template/set_r024/pages/HomePage/AIAgent/Mobile/MobileAIAgent.vue"

const { isMobile } = useMediaQuery()
</script>

<style lang="scss">
@import "src/common/css/AIAgent/theme.scss";
</style>
