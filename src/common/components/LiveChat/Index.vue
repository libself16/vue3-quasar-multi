<template>
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useLiveChat } from "src/common/hooks/useLiveChat"

interface LiveChatProps {
  isRWD?: boolean
}

const props = withDefaults(defineProps<LiveChatProps>(), {
  isRWD: false
})

// 直接傳入 isRWD 參數
const { htmlContent, htmlContainer, enableConfig, injectHtml } = useLiveChat(undefined, props.isRWD)

watchEffect(() => {
  if (enableConfig.value) {
    injectHtml()
  }
})
</script>
