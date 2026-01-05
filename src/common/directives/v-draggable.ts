import { ObjectDirective } from "vue"
import interact from "interactjs"
import { usePositionsStore } from "src/stores/positions"
import { ElementKey } from "src/common/utils/constants/draggableElementKeyName"

const positionsStore = usePositionsStore()

const setElementDefaultPosition = (el: HTMLElement) => {
  const computedStyle = getComputedStyle(el)

  el.style.top = computedStyle.top || "0px"
  el.style.left = computedStyle.left || "0px"
  // 清除 right/bottom，避免 CSS 衝突
  el.style.right = ""
  el.style.bottom = ""
}

const vDraggableCollision: ObjectDirective<HTMLElement, any> = {
  mounted(el, binding) {
    const margin = binding.value?.margin || 16
    const storeKey = binding.value?.storeKey as ElementKey // 取得用於儲存的唯一 key
    let isDragging = false

    // 記錄偏移（滑鼠點擊位置與元素左上角距離）
    let offsetX = 0
    let offsetY = 0

    // --- 設定初始樣式 ---
    el.style.touchAction = "none"
    el.style.userSelect = "none"
    el.style.position = el.style.position || getComputedStyle(el).position || "absolute"

    // 【讀取】: 如果有 storeKey 且 store 中有紀錄，就設定初始位置
    if (storeKey && positionsStore.elements[storeKey]) {
      const savedPosition = positionsStore.elements[storeKey]

      // 檢查螢幕尺寸和元素尺寸
      const parentRect = el.parentElement!.getBoundingClientRect()

      // 如果父元素尺寸為 0，使用 viewport 尺寸
      const containerWidth = parentRect.width > 0 ? parentRect.width : window.innerWidth
      const containerHeight = parentRect.height > 0 ? parentRect.height : window.innerHeight

      const savedLeft = parseInt(savedPosition.left)
      const savedTop = parseInt(savedPosition.top)

      // 檢查保存的位置是否超出當前螢幕範圍
      const isOutOfBounds =
        savedLeft + el.offsetWidth > containerWidth ||
        savedTop + el.offsetHeight > containerHeight ||
        savedLeft < 0 ||
        savedTop < 0

      if (isOutOfBounds) {
        setElementDefaultPosition(el)
      } else {
        // 使用保存的位置
        if (savedLeft >= 16 && savedTop >= 16) {
          el.style.top = savedPosition.top
          el.style.left = savedPosition.left
          el.style.right = "unset"
        }
      }
    } else {
      // 否則使用預設位置
      setElementDefaultPosition(el)
    }

    // 防止拖曳時觸發 click
    const onClick = (e: MouseEvent) => {
      if (isDragging) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }

    el.addEventListener("click", onClick, true)

    // 處理 RWD 和旋轉的 resize 事件
    const handleResize = () => {
      // 1. 回歸 CSS 設定 (移除 JS 的 inline style)
      el.style.top = ""
      el.style.left = ""
      el.style.right = ""
      el.style.bottom = ""

      // 2. 如果有 key，將 store 中的紀錄重置為 '0,0'
      if (storeKey) {
        // 恢復預設值
        positionsStore.updateDragPosition(storeKey, { top: "0px", left: "0px" })
      }

      // 3. 讓元素立即反應 CSS 位置
      setElementDefaultPosition(el)
    }

    window.addEventListener("resize", handleResize)

    // 初始化 draggable 行為
    interact(el).draggable({
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
          endOnly: true
        })
      ],
      listeners: {
        start(event) {
          isDragging = false
          el.setAttribute("data-shifted", "false")

          const rect = el.getBoundingClientRect()
          offsetX = event.client.x - rect.left
          offsetY = event.client.y - rect.top
        },
        move(event) {
          const parentRect = el.parentElement!.getBoundingClientRect()

          let newLeft = event.client.x - parentRect.left - offsetX
          let newTop = event.client.y - parentRect.top - offsetY

          // 邊界限制（含 margin）
          const maxLeft = parentRect.width - el.offsetWidth - margin
          const maxTop = parentRect.height - el.offsetHeight - margin

          newLeft = Math.max(margin, Math.min(newLeft, maxLeft))
          newTop = Math.max(margin, Math.min(newTop, maxTop))

          el.style.left = `${newLeft}px`
          el.style.top = `${newTop}px`

          isDragging = true
        },
        end() {
          setTimeout(() => {
            isDragging = false
          }, 50)
          el.setAttribute("data-shifted", "false")

          if (storeKey) {
            positionsStore.updateDragPosition(storeKey, {
              top: el.style.top,
              left: el.style.left
            })
          }
        }
      }
    })

    // 清理事件與 interact 實例
    el._vDraggableCollisionDestroy = () => {
      interact(el).unset()
      el.removeEventListener("click", onClick, true)
      window.removeEventListener("resize", handleResize)
    }
  },

  unmounted(el) {
    if (el._vDraggableCollisionDestroy) {
      el._vDraggableCollisionDestroy()
      delete el._vDraggableCollisionDestroy
    }
  }
}

export default vDraggableCollision
