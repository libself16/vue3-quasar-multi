<template>
  <div v-if="isAIRpgShow" class="iframe-content" :class="{ active: isAIRpgIframeShow }">
    <q-btn class="absolute -top-12 right-0 bg-white" flat rounded size="lg" @click="isAIRpgIframeShow = false">
      X
    </q-btn>
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      ref="aiRpgIframeRef"
      allow="camera; microphone"
      allowfullscreen
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAIRpgEvent } from "src/common/hooks/useAIRpgEvent"

const { iframeOrigin, iframeUrl, isAIRpgShow, isAIRpgIframeShow, aiRpgIframeRef } = useAIRpgEvent()

onMounted(() => {
  iframeOrigin.value = "https://aigames.aimate.am"
  iframeUrl.value = "https://aigame.aimate.am/?v=2.0.5"
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.iframe-content {
  @apply fixed;
  width: 33.125rem;
  height: 37.5rem;
  max-width: 33.125rem;
  max-height: 81vh !important;
  z-index: 10001;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  transition: transform 0.3s ease;
  pointer-events: none; // 非 active 時不攔截事件，允許頁面滾動

  @include iphone-width() {
    width: 30.1875rem;
    max-width: 90vw;
  }

  &.active {
    transform: translate(0%, -50%);
    pointer-events: auto; // active 時恢復事件處理
  }

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
