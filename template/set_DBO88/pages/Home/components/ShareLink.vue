<template>
  <div class="share-link">
    <q-btn class="qrCode-btn" @click="isShowQrCode = true">
      <span>
        {{ $t("common.btn.share") }}
      </span>
      <q-img :src="shareLinkImage" class="icon-img" lazy-load />
    </q-btn>
    <q-btn class="copy-link-btn" @click="copyCurrentUrl">
      <span>
        {{ $t("common.btn.copyLink") }}
      </span>
      <q-img :src="downLineImage" class="icon-img" lazy-load />
    </q-btn>
    <q-dialog v-model="isShowQrCode">
      <q-card class="qrCode-dialog">
        <q-card-section>
          <div class="row items-center justify-end">
            <q-icon name="fas fa-times" class="icon-close" @click="isShowQrCode = false" />
          </div>
          <div class="qrcode-container">
            <qrcode-vue
              :value="currentUrl"
              :size="150"
              :level="level"
              :render-as="renderAs"
              :background="background"
              :foreground="foreground"
            />
            <span class="qrcode-text">
              {{ $t("common.btn.shareQRcodeText") }}
            </span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowCopyLink">
      <q-card class="copy-link-dialog">
        <q-card-section class="copied-container">
          <q-img :src="checkImage" class="icon-copied" lazy-load />
          <span class="copied-text">{{ $t("common.btn.copied") }}</span>
          <span class="current-url">{{ currentUrl }}</span>
          <q-btn class="copied-close-btn" @click="isShowCopyLink = false">{{ $t("modal.confirm") }}</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useSiteImg } from "app/template/set_DBO88/hooks/useSiteImg"
import QrcodeVue from "qrcode.vue"
import type { Level, RenderAs } from "qrcode.vue"

const { shareLinkImage, downLineImage, checkImage } = useSiteImg()

const isShowQrCode = ref(false)
const isShowCopyLink = ref(false)
const currentUrl = ref("")
const level = ref<Level>("M")
const renderAs = ref<RenderAs>("svg")
const background = ref("#ffffff")
const foreground = ref("#000000")

const copyCurrentUrl = () => {
  navigator.clipboard.writeText(currentUrl.value)
  isShowCopyLink.value = true
}

onMounted(() => {
  currentUrl.value = window.location.href
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.share-link {
  @apply flex justify-end gap-[10px] mb-[1.5rem];
}

.qrCode-btn,
.copy-link-btn {
  @apply flex items-center justify-center min-w-[150px];
  @apply py-[8px] px-[10px] rounded-[5px] capitalize;
  background: #3b414a;
  color: $text-white;

  &:hover {
    background: #4b525c;
  }
}

.icon-img {
  @apply w-4 h-4 ml-2;
}

.icon-close {
  @apply text-[1.25rem] cursor-pointer mb-4;
  color: $primary-color;
}

.qrCode-dialog,
.copy-link-dialog {
  @apply flex flex-col items-center min-w-[20rem];
  @apply p-[0.5rem] rounded-[1.0625rem];
  background: #262c35;
  box-shadow: -0.0625rem 0.125rem 0.625rem #040609, 0.125rem 0.0625rem 0.625rem #040609;
  color: $text-white;
}

.qrcode-container {
  @apply w-full flex flex-col items-center justify-center;
}

.qrcode-text {
  @apply mt-4 text-center;
}

.copied-container {
  @apply flex flex-col items-center justify-center;
}

.icon-copied {
  @apply w-[4.375rem] h-[4.375rem];
}

.copied-text {
  @apply my-[.625rem] font-bold text-[1.125rem];
  color: #7d91b2;
}

.current-url {
  @apply text-[.9375rem] font-bold mb-[.625rem];
}

.copied-close-btn {
  @apply bg-[#3d3f4b] w-[170px] p-[5px] rounded-[1.25rem] text-[#fff] font-bold;
  box-shadow: 0.1875rem 0.3125rem 0.625rem 0rem #181818;
}
</style>
