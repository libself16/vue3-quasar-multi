import { Directive } from "vue"

// lazy-load佇列管理器
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent: number
  private queue: (() => void)[] = []

  // 預設併發數6筆
  constructor(maxConcurrent = 6) {
    this.maxConcurrent = maxConcurrent
  }

  // 變動最大併發數
  setMaxConcurrent(max: number) {
    this.maxConcurrent = max
    this.processQueue()
  }

  // 加入queue
  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)
    } else {
      this.queue.push(loadFn)
    }
  }

  // 執行load
  private executeLoad(loadFn: () => void) {
    this.loadingCount++
    loadFn()
  }

  // load載入完成
  onLoadComplete() {
    this.loadingCount--
    this.processQueue()
  }

  // 處理queue
  private processQueue() {
    while (this.queue.length > 0 && this.loadingCount < this.maxConcurrent) {
      const nextLoad = this.queue.shift()
      if (nextLoad) {
        this.executeLoad(nextLoad)
      }
    }
  }

  getStatus() {
    return {
      loading: this.loadingCount,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent
    }
  }
}

const globalQueue = new LazyLoadQueue(6) // 預設最大併發 6

export const useLazyLoadQueue = () => {
  return {
    setMaxConcurrent: (max: number) => globalQueue.setMaxConcurrent(max),
    getStatus: () => globalQueue.getStatus(),
    queue: globalQueue
  }
}

// lazy-load directive
const vLazyLoad: Directive = {
  mounted(el: HTMLImageElement, binding) {
    // 檢查是否為瀏覽器環境
    if (typeof window === "undefined") return

    const src = binding.value
    if (!src) {
      console.warn("v-lazy-load: 缺少圖片 URL")
      return
    }

    // 獲取併發控制選項
    const options = binding.arg ? JSON.parse(binding.arg) : {}
    const maxConcurrent = options.maxConcurrent || 6

    // 如果有自定義併發數，更新全域設定
    if (options.maxConcurrent) {
      globalQueue.setMaxConcurrent(maxConcurrent)
    }

    // 創建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const dataSrc = img.getAttribute("data-src")

            if (dataSrc) {
              // 將載入任務加入佇列
              globalQueue.enqueue(() => {
                const loadVersion = img.getAttribute("data-version")

                img.onload = () => {
                  // 驗證版本，確保圖片與當前數據匹配
                  const currentVersion = img.getAttribute("data-version")
                  if (loadVersion === currentVersion) {
                    img.removeAttribute("data-src")
                    img.removeAttribute("data-version")
                  }
                  globalQueue.onLoadComplete()
                }

                img.onerror = () => {
                  globalQueue.onLoadComplete()
                }

                // 再次確認版本匹配才載入
                const currentVersion = img.getAttribute("data-version")
                if (loadVersion === currentVersion) {
                  img.src = dataSrc
                } else {
                  // 版本不匹配，跳過載入
                  globalQueue.onLoadComplete()
                }
              })

              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: options.rootMargin || "50px 0px",
        threshold: options.threshold || 0.1
      }
    )

    // 設置懶載入
    el.setAttribute("data-src", src)
    el.setAttribute("data-version", Date.now().toString())
    // 預設一張透明base64圖檔
    el.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+"

    // 保存 observer 到元素上，方便清理
    ;(el as any)._lazyObserver = observer
    observer.observe(el)
  },

  updated(el: HTMLImageElement, binding) {
    const newSrc = binding.value
    const currentDataSrc = el.getAttribute("data-src")
    const currentSrc = el.src

    // 如果 src 變了，需要重新載入
    if (currentDataSrc !== newSrc && newSrc) {
      // 取消當前載入
      if (currentSrc && !currentSrc.startsWith("data:")) {
        el.onload = null
        el.onerror = null
      }

      // 重置為透明圖片
      el.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ci8+PC9zdmc+"

      // 更新 data-src
      el.setAttribute("data-src", newSrc)

      // 添加版本標記用於驗證
      el.setAttribute("data-version", Date.now().toString())

      // 重新開始觀察 (如果已經在視窗內)
      const observer = (el as any)._lazyObserver
      if (observer) {
        observer.unobserve(el)
        observer.observe(el)
      }
    }
  },

  unmounted(el: HTMLImageElement) {
    const observer = (el as any)._lazyObserver
    if (observer) {
      observer.unobserve(el)
      observer.disconnect()
      delete (el as any)._lazyObserver
    }
  }
}

export default vLazyLoad
