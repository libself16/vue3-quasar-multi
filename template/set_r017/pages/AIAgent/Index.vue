<template>
  <section class="agent-wrapper">
    <DesktopAIAgent v-if="!isMobile" theme="set_r017" />
    <MobileAIAgent v-else theme="set_r017" />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopAIAgent from "app/template/set_r017/pages/AIAgent/Desktop/DesktopAIAgent.vue"
import MobileAIAgent from "app/template/set_r017/pages/AIAgent/Mobile/MobileAIAgent.vue"

const { isMobile } = useMediaQuery()
</script>

<style lang="scss">
@import "src/common/css/AIAgent/theme.scss";
</style>
