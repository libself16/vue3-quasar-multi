```typescript
// 使用範例：如何在組件中配置和監控懶載入佇列

import { useLazyLoadQueue } from "src/common/directives/v-lazy-load"

// 在組件中使用
export function setupLazyLoadConfig() {
  const { setMaxConcurrent, getStatus } = useLazyLoadQueue()

  // 根據設備性能調整併發數
  const isMobile = window.innerWidth <= 768
  const isSlowNetwork = (navigator as any).connection?.effectiveType === "2g"

  if (isMobile || isSlowNetwork) {
    setMaxConcurrent(3) // 行動裝置或慢網路：最多 3 張同時載入
  } else {
    setMaxConcurrent(8) // 桌面裝置：最多 8 張同時載入
  }

  // 監控佇列狀態（可選）
  const logStatus = () => {
    const status = getStatus()
    console.log(`載入中: ${status.loading}, 等待中: ${status.queued}, 最大併發: ${status.maxConcurrent}`)
  }

  return { logStatus }
}

/*
使用方式：

1. 基本使用（使用預設 6 個併發）：
<img v-lazy-load="imageUrl" />

2. 自定義併發數：
<img v-lazy-load:"{\"maxConcurrent\":4}" />

3. 完整配置：
<img v-lazy-load:"{\"maxConcurrent\":4,\"rootMargin\":\"100px 0px\",\"threshold\":0.2}" />

4. 在組件中動態配置：
onMounted(() => {
  const { logStatus } = setupLazyLoadConfig()

  // 每 5 秒監控一次狀態
  setInterval(logStatus, 5000)
})
*/
```
