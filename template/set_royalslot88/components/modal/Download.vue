<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_download_custom"
    use-title
    :title="$t('menu.download')"
    title-class="modal_title_top"
  >
    <div class="download-area">
      <div class="donbox">
        <div class="device-type"><i class="fab fa-android"></i>Android</div>
        <q-img class="my-[.5rem] h-[100px] aspect-square" :src="QrSampleImg"> </q-img>
        <div class="dlbtn-wrap">
          <q-btn href="#" class="dl-btn">{{ $t("menu.download") }}</q-btn>
        </div>
      </div>
      <div class="donbox">
        <div class="device-type"><i class="fab fa-apple"></i>IOS</div>
        <q-img class="my-[.5rem] h-[100px] aspect-square" :src="QrSampleImg"> </q-img>
        <div class="dlbtn-wrap">
          <q-btn href="#" class="dl-btn">{{ $t("menu.download") }}</q-btn>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import QrSampleImg from "app/template/set_royalslot88/assets/images/qr-sample.png"
import ModalBase from "./modalBase.vue"
import { ref, onMounted, computed } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const modalShow = ref(false)
const eventbus = injectStrict(EventBusKey)

const openModal = () => {
  modalShow.value = true
}

defineExpose({
  openModal
})

onMounted(() => {
  eventbus.on("openDownload", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style scoped lang="scss">
.modal_download_custom {
  width: auto;
}
</style>
