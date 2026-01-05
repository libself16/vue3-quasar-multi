<template>
  <q-dialog v-model="modelValue" transition-show="fade" transition-hide="fade" class="slide-verify-dialog">
    <q-card class="!w-[21.375rem]">
      <q-card-section class="flex justify-between items-start">
        <div>
          <p class="text-gray-500">{{ $t("modal.verification") }}</p>
          <p class="text-lg">{{ $t("modal.slideComplete") }}</p>
        </div>
        <div>
          <q-btn icon="highlight_off" flat class="min-h-0 min-w-0 p-0" v-close-popup> </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="slide-body">
        <slide-verify
          ref="block"
          slider-text=""
          :l="42"
          :r="10"
          :w="verifyWidth"
          :h="155"
          :accuracy="8"
          :imgs="imgs"
          :show="false"
          @success="onSuccess"
          @fail="onFail"
          @again="refresh"
        ></slide-verify>
      </q-card-section>
      <q-card-section class="p-0 ml-2 mb-3 text-gray-600">
        <q-btn icon="refresh" flat size="lg" @click="refresh"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify"
import "vue3-slide-verify/dist/style.css"

const { verifyImg } = useCommonImg()
const eventbus = injectStrict(EventBusKey)

const imgs = [verifyImg(1), verifyImg(2)]
const modelValue = ref(false)
const block = ref<SlideVerifyInstance>()
const verifyWidth = ref()

const refresh = () => {
  block.value?.refresh()
}

const onSuccess = (times: number) => {
  eventbus.emit("verifyResult", true)
  setTimeout(async () => {
    modelValue.value = false
    await nextTick()
    refresh()
  }, 300)
}

const onFail = () => {
  eventbus.emit("verifyResult", false)
}

onMounted(() => {
  refresh()

  eventbus.on("openSlideVerify", (show: boolean) => {
    modelValue.value = show
  })
})
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";
.slide-verify-dialog {
  .q-dialog__inner {
    @include iphone-pro-width {
      padding: 1.5rem 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.slide-body {
  width: 100%;

  .slide-verify {
    width: 100% !important;
    overflow: hidden;

    // :deep(canvas) {
    //   &:first-of-type {
    //     width: 100%;
    //   }
    // }
  }
}
</style>
