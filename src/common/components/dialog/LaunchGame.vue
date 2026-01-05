<template>
  <div class="q-pa-md q-gutter-sm" v-if="launchGameDialog.show">
    <q-dialog
      v-model="launchGameDialog.show"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      class="z-[9400]"
    >
      <q-card class="bg-dark text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" @click="launchGameDialog.closeDialog">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <iframe v-if="launchGameDialog.gameUrl" :src="launchGameDialog.gameUrl" class="gameIframe"></iframe>
        <iframe v-if="launchGameDialog.gameContent" ref="iframe" frameborder="0" class="gameIframe"></iframe>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useGame } from "src/common/composables/useGame"
import { ref, watchEffect } from "vue"

const { launchGameDialog } = useGame()

const iframe = ref<HTMLIFrameElement | null>(null)

watchEffect(() => {
  if (launchGameDialog.gameContent && iframe.value) {
    iframe.value.contentDocument?.open()
    iframe.value.contentDocument?.write(launchGameDialog.gameContent)
    iframe.value.contentDocument?.close()
  }
})
</script>

<style lang="scss" scoped>
.gameIframe {
  width: 100%;
  height: calc(100% - 32px);
}
</style>
