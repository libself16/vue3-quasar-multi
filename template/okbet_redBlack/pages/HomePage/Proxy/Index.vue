<template>
  <DesktopProxy v-if="!isMobile" />
  <MobileProxy v-else />
  <FooterArea />
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import FooterArea from "app/template/okbet_redBlack/components/Footer/Index.vue"
import DesktopProxy from "./DesktopProxy.vue"
import MobileProxy from "./MobileProxy.vue"

const { isMobile } = useMediaQuery()
</script>
