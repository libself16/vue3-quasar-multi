<template>
  <q-dialog
    v-model="modelValue"
    position="left"
    seamless
    transition-show="slide-right"
    transition-hide="slide-left"
    class="z-[10001]"
  >
    <q-card class="ai-helper-dialog-wrapper">
      <q-card-section class="ai-helper-dialog-header">
        <q-btn dense flat icon="close" size="sm" @click="modelValue = false"> </q-btn>
      </q-card-section>
      <q-card-section class="iframe-content">
        <iframe
          v-if="iframeUrl"
          :src="iframeUrl"
          allow="camera; microphone"
          allowfullscreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
        ></iframe>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const eventbus = injectStrict(EventBusKey)
const modelValue = ref(false)
const iframeUrl = ref("https://aikol.gpsriowdl.com:8000/ui/")

onMounted(async () => {
  eventbus.on("openAIHelper", async (show, url) => {
    if (url) {
      iframeUrl.value = url
    }
    modelValue.value = show

    if (show) {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    }
  })
})
</script>

<style lang="scss" scoped>
.ai-helper-dialog-wrapper {
  background-color: #fff;
  backdrop-filter: blur(68px);
  color: #646464;
  width: 30.1875rem;
  height: 41.25rem;
  max-width: 70vw;
  max-height: 81vh !important;

  .ai-helper-dialog-header {
    @apply flex items-center justify-end;
    padding: 0.25rem 0.75rem;
  }

  .iframe-content {
    padding: 0;
    width: 100%;
    height: calc(100% - 32px);
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
