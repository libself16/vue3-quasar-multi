<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom">
    <div class="login_form reg_form">
      <template v-if="iOSPlatform">
        <p v-for="(item, index) in iOSContent" :key="index">{{ $t(item) }}</p>
      </template>
      <template v-else>
        <p>{{ $t("common.tip.fullscreen_mode") }}</p>
        <div class="btn-modal-big">
          <button class="btn-modal-login" @click="handleFullScreen">{{ $t("common.btn.fullscreen") }}</button>
        </div>
      </template>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useQuasar } from "quasar"
import { useFullscreen } from "@vueuse/core"
import ModalBase from "./modalBase.vue"
import { usePlatform } from "src/common/hooks/usePlatform"

const $q = useQuasar()
const { isFullscreen, enter } = useFullscreen()
const { iOSPlatform } = usePlatform()

const iOSContent = [
  "common.tip.fullscreen_ios_title",
  "common.tip.fullscreen_ios_step1",
  "common.tip.fullscreen_ios_step2"
]

const modalShow = ref(false)

function handleFullScreen() {
  enter()
  modalShow.value = false
}

onMounted(() => {
  if (!isFullscreen.value) {
    modalShow.value = true
  }
})
</script>

<style scoped lang="scss"></style>
