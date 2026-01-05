<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="app/template/set_r023/assets/images/quasar-logo-full.svg" />
  </q-page>
</template>

<script>
import { defineComponent, watchEffect } from "vue"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { enableConfig, injectHtml } = useLiveChat()

const findWidgetElement = () => {
  const widgetElement = document.querySelector(".widget-visible")
  if (widgetElement) {
    console.log("找到 widget-visible 元件:", widgetElement)
    return widgetElement
  }
  return null
}

// 安全地設定樣式的函數
const setWidgetStyle = (style) => {
  const widget = findWidgetElement()
  if (widget) {
    console.log("設定樣式前:", widget.style.cssText)
    widget.style.cssText = style
    console.log("設定樣式後:", widget.style.cssText)
    return true
  } else {
    console.log("找不到 widget-visible 元件")
    return false
  }
}

// 重試機制
const retrySetStyle = (style, maxRetries = 10, delay = 500) => {
  let retries = 0
  const trySet = () => {
    if (setWidgetStyle(style)) {
      return true
    }
    if (retries < maxRetries) {
      retries++
      console.log(`重試設定樣式 (${retries}/${maxRetries})`)
      setTimeout(trySet, delay)
    } else {
      console.log("達到最大重試次數，無法設定樣式")
    }
  }
  trySet()
}

watchEffect(async () => {
  if (enableConfig.value) {
    await injectHtml()

    // 使用重試機制設定初始樣式
    retrySetStyle("transform: translateY(-60px) !important;")

    window.Tawk_API.onLoad = function () {
      console.log("Tawk_API onLoad 觸發")
      retrySetStyle("transform: translateY(-60px) !important;")
    }

    window.Tawk_API.onChatMaximized = function () {
      console.log("Tawk_API onChatMaximized 觸發")
      setWidgetStyle("")
    }

    window.Tawk_API.onChatMinimized = function () {
      console.log("Tawk_API onChatMinimized 觸發")
      setWidgetStyle("transform: translateY(-60px) !important;")
    }

    const observer = new MutationObserver((mutations) => {
      const widget = findWidgetElement()
      if (widget) {
        console.log("widget-visible 元件已載入")
        // 確保樣式被正確設定
        retrySetStyle("transform: translateY(-60px) !important;")
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
})
export default defineComponent({
  name: "PageIndex"
})
</script>

<style scoped>
/* 移除 CSS 中的 widget-visible 樣式，讓 JavaScript 完全控制 */
/* :deep(.widget-visible) {
  transform: translateY(40px) !important;
} */
</style>
