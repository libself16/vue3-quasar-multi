<template>
  <qrcode-vue
    :value="model"
    v-bind="attrs"
    :level="level"
    :render-as="renderAs"
    :background="background"
    :foreground="foreground"
  />
</template>

<script setup lang="ts">
import { ref, defineModel, useAttrs } from "vue"
import QrcodeVue from "qrcode.vue"
import type { Level, RenderAs } from "qrcode.vue"

const model = defineModel<string | undefined>()
const attrs = useAttrs()
const level = ref<Level>("M")
const renderAs = ref<RenderAs>("svg")
const background = ref("#ffffff")
const foreground = ref("#000000")
</script>

<style scoped lang="scss"></style>
