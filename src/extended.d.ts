import type { cx } from "src/common/utils/cx"

export {}

declare global {
  interface HTMLElement {
    _vDraggableCollisionDestroy?: () => void
  }
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    cx: typeof cx
  }
}
