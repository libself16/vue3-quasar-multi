import type { Directive } from "vue"

interface DragScrollElement extends HTMLElement {
  _dragScroll?: {
    isDragging: boolean
    startPos: number
    scrollPos: number
    direction: "horizontal" | "vertical"
    handleMouseDown: (e: MouseEvent) => void
    handleMouseMove: (e: MouseEvent) => void
    handleMouseUp: () => void
    handleDragStart: (e: DragEvent) => void
  }
}

/**
 * 用來實現拖動滾動效果的 Directive
 * @example
 * <div v-drag-scroll="'horizontal'"></div>
 * <div v-drag-scroll="'vertical'"></div>
 *
 * 內部不想拖動的元素可加上 draggable="false"
 * @example
 * <div v-drag-scroll="'horizontal'">
 *   <button draggable="false">Don't draggable me</button>
 * </div>
 */
export const vDragScroll: Directive<DragScrollElement, "horizontal" | "vertical"> = {
  mounted(el, binding) {
    const direction = binding.value || "horizontal"

    const state = {
      isDragging: false,
      startPos: 0,
      scrollPos: 0,
      direction,
      handleMouseDown: (e: MouseEvent) => {
        state.isDragging = true
        state.startPos = direction === "vertical" ? e.pageY : e.pageX
        state.scrollPos = direction === "vertical" ? el.scrollTop : el.scrollLeft
        el.style.cursor = "grabbing"
        el.style.userSelect = "none"
      },
      handleMouseMove: (e: MouseEvent) => {
        if (!state.isDragging) return
        e.preventDefault()
        const pos = direction === "vertical" ? e.pageY : e.pageX
        const walk = (pos - state.startPos) * 2
        if (direction === "vertical") {
          el.scrollTop = state.scrollPos - walk
        } else {
          el.scrollLeft = state.scrollPos - walk
        }
      },
      handleMouseUp: () => {
        state.isDragging = false
        el.style.cursor = "grab"
        el.style.removeProperty("user-select")
      },
      handleDragStart: (e: DragEvent) => {
        e.preventDefault()
      }
    }

    el.style.cursor = "grab"
    el.addEventListener("mousedown", state.handleMouseDown)
    document.addEventListener("mousemove", state.handleMouseMove)
    document.addEventListener("mouseup", state.handleMouseUp)
    el.addEventListener("dragstart", state.handleDragStart)

    el._dragScroll = state
  },

  unmounted(el) {
    if (el._dragScroll) {
      el.removeEventListener("mousedown", el._dragScroll.handleMouseDown)
      document.removeEventListener("mousemove", el._dragScroll.handleMouseMove)
      document.removeEventListener("mouseup", el._dragScroll.handleMouseUp)
      el.removeEventListener("dragstart", el._dragScroll.handleDragStart)
      delete el._dragScroll
    }
  }
}
