<template>
  <div
    v-if="shouldShow"
    ref="imageContainerEl"
    class="base-image-container inline-block relative overflow-hidden"
    v-bind="$attrs"
  >
    <div v-if="isLoading" class="absolute inset-0" :class="cx(FLEX_CENTER)">
      <q-spinner color="primary" size="2em" />
    </div>

    <img
      v-if="imageSrc"
      ref="imageEl"
      :src="imageSrc"
      :alt="alt"
      @load="onImageLoaded"
      @error="onImageError"
      :class="
        cx(
          'base-image',
          'block w-full h-full',
          'object-cover transition-opacity duration-300 ease-in-out',
          { 'opacity-100': !isLoading, 'opacity-0': isLoading },
          imgClass
        )
      "
      :style="imgStyle"
    />
  </div>
</template>

<script setup>
import { FLEX_CENTER } from "src/common/utils/constants/styles"
import { ref, onMounted, onBeforeUnmount, watch } from "vue"
import { cx } from "src/common/utils/cx.ts"
import { getLimiter } from "src/common/utils/limiter.ts"

// =============================================
// Props 定義
// =============================================
const props = defineProps({
  // 後端提供的完整圖片 URL (優先級最高)
  src: {
    type: String,
    default: null
  },
  // 本地圖片路徑 - URL 陣列: [new URL('path1.webp', import.meta.url).href, new URL('path1.png', import.meta.url).href]
  path: {
    type: Array,
    default: null
  },
  // 圖片替代文字 (對於 SEO 和無障礙至關重要)
  alt: {
    type: String,
    required: true
  },
  // 預設圖片路徑 (當找不到指定圖片時使用) - URL 陣列格式
  defaultImgPath: {
    type: Array,
    default: () => []
  },
  // 是否顯示預設圖片 (false 時找不到圖片就不顯示整個節點)
  isDefault: {
    type: Boolean,
    default: true
  },
  // 併發加載限制數量
  limit: {
    type: Number,
    default: 6 // 預設併發數為 6
  },
  // 傳遞給 <img> 標籤的客製化 class
  imgClass: {
    type: [String, Array, Object], // Vue 支援所有 class 綁定類型
    default: null
  },
  // 傳遞給 <img> 標籤的客製化 style
  imgStyle: {
    type: [String, Array, Object], // Vue 支援所有 style 綁定類型
    default: null
  }
})

// =============================================
// Refs and Reactive State
// =============================================
const imageContainerEl = ref(null) // 包裹容器的 DOM 引用
const imageEl = ref(null) // <img> 元素的 DOM 引用
const imageSrc = ref("") // 最終要顯示的圖片 src
const isLoading = ref(true) // 是否正在加載中
const isVisible = ref(false) // 元素是否進入可視區域
const shouldShow = ref(true) // 是否應該顯示組件
const hasTriedDefault = ref(false) // 標記是否已經嘗試過載入預設圖片

let observer = null // IntersectionObserver 實例
let controller = new AbortController()

// =============================================
// Core Logic
// =============================================

/**
 * 過濾 new URL() 產生的 URL 陣列，移除 "undefined" 或 null
 * @param {string[]} urlArray - 原始 URL 陣列
 * @returns {string[]} 過濾後的有效 URL 陣列
 */
const filterValidUrls = (urlArray) => {
  if (!Array.isArray(urlArray) || urlArray.length === 0) {
    return [] // 返回空陣列
  }

  const validUrls = urlArray.filter((url) => {
    if (!url || typeof url !== "string" || url.includes("undefined")) {
      console.warn(`[BaseImage] Skipping invalid URL: ${url}`)
      return false
    }
    return true
  })

  if (urlArray.length > 0 && validUrls.length === 0) {
    console.warn("[BaseImage] No valid URLs after filtering")
  }

  return validUrls
}

/**
 * 使用 new Image() 來異步檢查圖片是否可加載
 * @param {string} url - new URL 產生的 href 或是完整圖片 URL
 * @param {AbortSignal} signal - 用於中止請求的信號
 * @returns {Promise<string|null>} - 返回找到的可用圖片 URL，或 null
 */
const checkImage = (url, signal) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const abortHandler = () => {
      img.src = ""
      img.onload = null
      img.onerror = null
      reject(new DOMException("Aborted", "AbortError"))
    }

    if (signal.aborted) {
      return reject(new DOMException("Aborted", "AbortError"))
    }
    signal.addEventListener("abort", abortHandler, { once: true })

    img.onload = () => {
      signal.removeEventListener("abort", abortHandler)
      resolve(url)
    }
    img.onerror = (err) => {
      signal.removeEventListener("abort", abortHandler)
      reject(err)
    }
    img.src = url
  })
}

/**
 * 替換：findBestLocalImage -> tryLoadPathArray ---
 * 替換了 'fetch' + 'HEAD'，改用 'checkImage' 和 'p-limit'
 *
 * @param {string[]} urlArray - new URL 產生的 href 陣列
 * @param {AbortSignal} signal - AbortController signal
 * @param {Function} limit - p-limit 實例
 * @returns {Promise<string|null>} - 返回找到的可用圖片 URL，或 null
 */
const tryLoadPathArray = async (urlArray, signal, limit) => {
  // *** 使用抽離出來的過濾函數 ***
  const validUrls = filterValidUrls(urlArray)

  if (validUrls.length === 0) {
    return null // 沒有有效的 URL 可以嘗試
  }

  for (const url of validUrls) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError")

    try {
      // console.log("🔍 Trying to check image with new Image():", url)
      const foundUrl = await limit(() => checkImage(url, signal))
      // console.log("✅ Found valid image at URL:", foundUrl)
      return foundUrl
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Image check aborted.")
        throw error
      }
      // console.log(`❌ Failed to load ${url}:`, error.message)
      continue
    }
  }

  console.warn(`[BaseImage] Could not find any valid image in the provided URL array`)
  return null
}

/**
 * 啟動圖片加載流程
 */
const loadImage = async () => {
  const limit = getLimiter(props.limit)
  controller.abort()
  controller = new AbortController()
  const { signal } = controller

  let foundUrl = null

  try {
    if (props.src) {
      // --- 嘗試用 checkImage 驗證 props.src ---
      console.log("🔍 Trying to check props.src:", props.src)
      foundUrl = await limit(() => checkImage(props.src, signal))
      console.log("✅ props.src is valid:", foundUrl)
    } else if (props.path) {
      // --- 嘗試 props.path ---
      foundUrl = await tryLoadPathArray(props.path, signal, limit)
    }

    // --- 根據結果設置 src 或觸發錯誤 ---
    if (foundUrl) {
      imageSrc.value = foundUrl
      // <img> 的 @load 事件將會觸發 onImageLoaded()
    } else {
      // 找不到 src/path，或者 src/path 都為 null
      console.warn("[BaseImage] No valid src or path found.")
      onImageError() // 觸發預設圖片邏輯
    }
  } catch (error) {
    // --- 4. (修改) 捕獲 checkImage(props.src) 的錯誤 ---
    if (error.name === "AbortError") {
      console.log("Image load aborted.")
      return
    }

    // 捕獲 props.src 的 404 等錯誤
    console.warn(`[BaseImage] Initial image check failed (src: ${props.src}):`, error.message)
    onImageError() // 觸發預設圖片邏輯
  }
}

// 監聽 isVisible 狀態，一旦進入可視區域就開始加載
watch(isVisible, async (newValue) => {
  if (newValue) {
    await loadImage()
    if (observer && imageContainerEl.value) {
      observer.unobserve(imageContainerEl.value)
    }
  }
})

// 監聽 Props 變化 (不變)
watch(
  () => [props.src, props.path, props.defaultImgPath],
  () => {
    if (isVisible.value) {
      imageSrc.value = ""
      isLoading.value = true
      hasTriedDefault.value = false
      shouldShow.value = true
      loadImage()
    } else {
      imageSrc.value = ""
      isLoading.value = true
      hasTriedDefault.value = false
      shouldShow.value = true
      if (observer && imageContainerEl.value) {
        observer.unobserve(imageContainerEl.value)
        observer.observe(imageContainerEl.value)
      }
    }
  },
  { deep: true }
)

// =============================================
// Event Handlers
// =============================================

const onImageLoaded = () => {
  isLoading.value = false
}

const onImageError = async () => {
  isLoading.value = false

  if (hasTriedDefault.value && imageSrc.value.includes(props.defaultImgPath[0])) {
    console.warn(`[BaseImage] Default image also failed to load.`)
    return
  }

  if (!props.isDefault) {
    console.log(`[BaseImage] isDefault is false, hiding component`)
    shouldShow.value = false
    return
  }

  if (!hasTriedDefault.value && props.defaultImgPath && props.defaultImgPath.length > 0) {
    hasTriedDefault.value = true
    console.log(`[BaseImage] Trying to load default image from URL array`)

    const limit = getLimiter(props.limit)
    controller.abort()
    controller = new AbortController()
    const { signal } = controller

    try {
      const defaultImageSrc = await tryLoadPathArray(props.defaultImgPath, signal, limit)
      if (defaultImageSrc) {
        imageSrc.value = defaultImageSrc
        isLoading.value = true
        return
      } else {
        console.warn(`[BaseImage] Failed to load default image from URL array`)
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Default image load aborted.")
        return
      }
      console.warn(`[BaseImage] Error loading default image:`, error)
    }
  }

  if (hasTriedDefault.value) {
    console.warn(`[BaseImage] All attempts failed, including default image.`)
  } else {
    console.warn(`[BaseImage] Failed to load image: ${props.src || props.path}`)
  }
}

// =============================================
// Lifecycle Hooks
// =============================================

onMounted(() => {
  if (!imageContainerEl.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    },
    {
      root: null, // 使用 viewport 作為根
      threshold: 0.1 // 進入可視區域 10% 時觸發
    }
  )

  observer.observe(imageContainerEl.value)
})

onBeforeUnmount(() => {
  // 中止正在進行的圖片請求
  if (controller) {
    controller.abort()
  }

  // 停止觀察，釋放資源
  if (observer && imageContainerEl.value) {
    observer.unobserve(imageContainerEl.value)
    observer.disconnect()
  }
})
</script>
