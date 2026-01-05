<template>
  <DesktopProxy v-if="!isLargeTablet" />
  <MobileProxy v-else />
  <FooterArea />
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import FooterArea from "app/template/set_r022/components/Footer/Index.vue"
import DesktopProxy from "./DesktopProxy.vue"
import MobileProxy from "./MobileProxy.vue"

const { isLargeTablet } = useMediaQuery()
</script>
