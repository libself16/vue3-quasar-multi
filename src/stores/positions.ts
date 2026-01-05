import { defineStore } from "pinia"
import { ELEMENT_KEYS, ElementKey } from "src/common/utils/constants/draggableElementKeyName"

// 定義位置物件的型別
interface Position {
  top: string;
  left: string;
}

// 定義 elements 的完整型別，所有 key 都是必需的
type ElementsState = Record<ElementKey, Position>;

export const usePositionsStore = defineStore('positions', {
  state: () => ({
    // 使用一個物件來儲存所有元素的位置
    elements: {
      [ELEMENT_KEYS.FLOATICONCMS]: { top: '0px', left: '0px' },
    } as ElementsState,
  }),
  actions: {
    // 更新或新增一個元素的位置
    updateDragPosition(key: ElementKey, position: Position) {
      this.elements[key] = position
    },
  },
  // 啟用此 Store 的持久化
  persist: true,
})