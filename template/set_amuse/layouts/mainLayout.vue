<template>
  <div class="relative">
    <router-view></router-view>
    <div ref="htmlContainer" v-html="htmlContent"></div>
    <div v-if="isShowLineIcon" class="line-image" @click="handleOpenLineLink"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, computed, watchEffect } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const $q = useQuasar()
const { handleOpenLineLink, htmlContent, htmlContainer, enableConfig, injectHtml } =
  useLiveChat("https://lin.ee/z1DurpK")
const route = useRoute()

const isShowLineIcon = computed(() => {
  // 手機版時不顯示，登入頁面也不顯示
  return !$q.platform.is.mobile && route.path !== "/login"
})

// watchEffect(() => {
//   if (enableConfig.value && !$q.platform.is.mobile) {
//     injectHtml()
//   }
// })
</script>

<style lang="scss" scoped>
.line-image {
  @apply absolute bottom-5 right-5 w-[70px] h-[70px] z-10 cursor-pointer;
  background: url("../assets/images/chat/line-dark.png") no-repeat;
  background-size: contain;
  transition: background-image 0.3s ease;

  &:hover {
    background-image: url("../assets/images/chat/line-light.png");
  }

  + iphone-width {
    display: none;
  }
}
</style>
