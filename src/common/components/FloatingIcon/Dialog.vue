<template>
  <q-dialog v-model="open">
    <q-card class="w-[500px]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">SITUS KEAMANAN</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="p-8" v-if="content">
        <div class="flex gap-4">
          <q-img :src="content.image" />
          <q-btn
            class="w-full break-all text-left"
            :href="content.url"
            target="_blank"
            :label="content.url"
            no-caps
            flat
          >
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { EventBusKey } from "src/symbols"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { injectStrict } from "src/common/utils/injectTyped"
import { useCommonImg } from "src/common/hooks/useCommonImg"

const open = ref(false)
const { currentAgentCode } = useAgentCode()
const eventbus = injectStrict(EventBusKey)
const { commonResult } = useCommonImg()

/// [會員端/代理端]首頁上方新增網站標籤顯示
/// 針對此功能 0425做的暫時性寫死 for 印尼站
const tempContent = <Record<string, { image: string; url: string }>>{
  zlb1: {
    image: commonResult("temp/ZELOBET.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/0049696e-dcb4-4e9d-f099-4dd6eb7c6500/public?d=zelobet715.com"
  },
  mta1: {
    image: commonResult("temp/META.8.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/e5e0f853-cbc7-4991-91af-b6940f7f5500/1001?d=meta8bet.com"
  },
  vvc1: {
    image: commonResult("temp/VVCasino.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/2cfa452a-3d05-4262-cd7a-d3967cb42200/1001?d=slot138zeus.com"
  },
  nbl1: {
    image: commonResult("temp/GOG-NEBULABET.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/2514fdb1-cb35-4e48-d329-caba846b0b00/public?d=www.nebulabet.vip"
  },
  ns41: {
    image: commonResult("temp/NS41.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/4297a5a2-ec6a-451a-5e07-dece391aad00/public?d=nus45.com"
  },
  vp01: {
    image: commonResult("temp/VP01.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/125eb25a-0cc5-4560-9a32-24a9b0e81200/public?d=vip5000.info"
  },
  tle1: {
    image: commonResult("temp/TLE1.png"),
    url: "https://imagedelivery.net/Te6DdQqXh49nz9pcywVnmw/8fb84fbd-43cf-42c7-b75b-73bfae4bbe00/1001?d=telone.net"
  }
}

const content = computed(() => {
  return tempContent[currentAgentCode.value.toLowerCase()]
})

onMounted(() => {
  eventbus.on("openFloatingIconDialog", (show: boolean) => {
    open.value = show
  })
})
</script>
