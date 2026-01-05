<template>
  <div class="saba-area">
    <!-- Loading Skeleton -->
    <SabaSkeletonLoader v-if="isLoading" />
    <!-- Actual iframes -->
    <div v-else class="iframe-stack">
      <iframe
        v-for="(url, index) in widgetUrls"
        :key="index"
        ref="iframeRefs"
        class="saba-iframe"
        :src="url"
        :style="getIframeStyles(index)"
        frameborder="0"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useSabaGame } from "src/common/hooks/useSabaGame"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import SabaSkeletonLoader from "src/common/components/SabaArea/SabaSkeletonLoader.vue"

const { initSabaGame, isLoading, widgetUrls, processSabaMessage } = useSabaGame()
const { width, isMobile, isLargeTablet } = useMediaQuery()

const iframeSizes = ref<{ width: number; height: number }[]>([])
const iframeRefs = ref<HTMLIFrameElement[]>([])

// 處理 S001 事件的尺寸變化
const handleS001Event = (event: any) => {
  // 使用 MessageEvent 的 source 來識別是哪個 iframe
  if (event.source && widgetUrls.value.length > 0) {
    let targetIndex = -1

    for (let i = 0; i < iframeRefs.value.length; i++) {
      if (iframeRefs.value[i]?.contentWindow === event.source) {
        targetIndex = i
        break
      }
    }

    if (targetIndex >= 0) {
      while (iframeSizes.value.length <= targetIndex) {
        iframeSizes.value.push({ width: 0, height: 0 })
      }

      iframeSizes.value[targetIndex] = event.data.size
    }
  }
}

// 動態樣式：根據 iframe 索引使用對應的 S001 事件尺寸
const getIframeStyles = (index: number) => {
  // 檢查是否有對應索引的尺寸資料
  const currentSize = iframeSizes.value[index]

  // 處理收到 S001 事件的情況
  if (currentSize) {
    // 第一個 iframe 特殊處理：根據設備類型決定高度策略
    if (index === 0) {
      if (isLargeTablet.value) {
        // 手機版 & 平板：card_id 模式，寬高為 0，需要自行處理
        if (currentSize.width === 0 || currentSize.height === 0) {
          // card_id 模式下，根據設備類型設定高度
          const height = width.value < 768 ? "220px" : "420px" // 手機 220px，平板 420px
          return {
            width: "100%",
            height
          }
        }
        // 如果有有效尺寸，使用動態高度
        return {
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`
        }
      } else {
        // PC 版：DynamicCards 模式，確保最小高度為 200px
        if (currentSize.width > 0 && currentSize.height > 0) {
          const minHeight = 200
          const finalHeight = Math.max(currentSize.height, minHeight)

          return {
            width: `${currentSize.width}px`,
            height: `${finalHeight}px`
          }
        }
      }
    } else {
      // 其他 iframe：使用原始尺寸（如果有效）
      if (currentSize.width > 0 && currentSize.height > 0) {
        return {
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`
        }
      }
    }
  }

  // 如果還沒收到 S001 事件，使用默認值
  if (index === 0) {
    // 第一個 iframe 根據設備類型設定默認高度
    let defaultHeight = "200px" // PC 版默認
    if (isLargeTablet.value) {
      // 手機版和平板的默認高度
      defaultHeight = width.value < 768 ? "200px" : "420px"
    }
    return {
      width: "100%",
      height: defaultHeight
    }
  }

  // 其他 iframe 使用通用默認值
  return {
    width: "100%",
    height: "300px"
  }
}

// 保持原有的事件處理邏輯 - 只改進錯誤處理
const handlePostMessage = (event: MessageEvent) => {
  try {
    processSabaMessage(event)

    const data = event.data
    if (data && typeof data === "object" && data.eventCode === "S001") {
      handleS001Event(event)
    }
  } catch (error) {
    console.log("處理 postMessage 錯誤:", error) // 改進：具體的錯誤處理
  }
}

onMounted(async () => {
  try {
    // 重置 iframe 尺寸狀態
    iframeSizes.value = []

    await initSabaGame()

    window.addEventListener("message", handlePostMessage)
  } catch (error) {
    console.log("Saba 組件初始化失敗:", error) // 改進：具體的錯誤處理
  }
})

onUnmounted(() => {
  window.removeEventListener("message", handlePostMessage)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.saba-area {
  @apply flex flex-col h-full;

  @include pad-large-width {
    @apply px-[0.5rem];
  }
}

.iframe-stack {
  @apply flex flex-col gap-4;

  .saba-iframe {
    @apply rounded-[.5rem];
  }
}
</style>
