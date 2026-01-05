// 定義所有可用的元素 key 名稱作為常數
export const ELEMENT_KEYS = {
  FLOATICONCMS: "floatIconCMS",
  CLAIMGIFT: "claimGift"
} as const

// 從常數中提取型別
export type ElementKey = (typeof ELEMENT_KEYS)[keyof typeof ELEMENT_KEYS]
