type PlainObject = Record<string | number | symbol, any>

function customCloneDeep<T>(value: T, hash = new WeakMap()): T {
  // 處理基本類型和 null/undefined
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value !== "object") {
    return value
  }

  // 處理循環引用
  if (hash.has(value as object)) {
    return hash.get(value as object)
  }

  // 處理日期對象
  if (value instanceof Date) {
    return new Date(value.getTime()) as any
  }

  // 處理正則表達式
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as any
  }

  // 處理陣列
  if (Array.isArray(value)) {
    const arr: any[] = []
    hash.set(value, arr)
    return arr.concat(value.map((item) => customCloneDeep(item, hash))) as any
  }

  // 處理 Map
  if (value instanceof Map) {
    const map = new Map()
    hash.set(value, map)
    value.forEach((val, key) => {
      map.set(customCloneDeep(key, hash), customCloneDeep(val, hash))
    })
    return map as any
  }

  // 處理 Set
  if (value instanceof Set) {
    const set = new Set()
    hash.set(value, set)
    value.forEach((val) => {
      set.add(customCloneDeep(val, hash))
    })
    return set as any
  }

  // 處理普通對象
  const result = {} as T
  hash.set(value as object, result)
  Object.entries(value as PlainObject).forEach(([key, val]) => {
    ;(result as PlainObject)[key] = customCloneDeep(val, hash)
  })

  return result
}

/**
 * @author Husky
 * 深拷貝函數
 * 優先使用原生 structuredClone，不支援時使用自行實作版本
 *
 * @param value - 要複製的值，支援以下類型：
 * - 基本類型（number、string、boolean）
 * - null 和 undefined
 * - 物件（Object）
 * - 陣列（Array）
 * - 日期物件（Date）
 * - 正則表達式（RegExp）
 * - Map
 * - Set
 *
 * @example
 * // 基本類型
 * cloneDeep(123)               // returns 123
 * cloneDeep("test")           // returns "test"
 *
 * // 物件
 * const obj = { a: 1, b: { c: 2 } }
 * cloneDeep(obj)              // returns deep copy of obj
 *
 * // 特殊物件
 * cloneDeep(new Date())       // returns new Date instance
 * cloneDeep(new Map())        // returns new Map instance
 * cloneDeep(new Set([1,2,3])) // returns new Set instance
 *
 * @returns {T} 回傳一個完全獨立的深層複製
 */
export function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value)
    } catch (error) {
      console.warn(
        "[cloneDeep] structuredClone failed, fallback to custom implementation:",
        error instanceof Error ? error.message : error
      )

      // structuredClone 可能會在某些情況下失敗（如含有 Function），回退到自行實作版本
      return customCloneDeep(value)
    }
  }
  return customCloneDeep(value)
}

export default cloneDeep
