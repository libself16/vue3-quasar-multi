// src/utils/imageLimiter.js
import pLimit from "p-limit"

const DEFAULT_LIMIT = 6

// limiter Cache
const limiters = new Map()

/**
 * 根據傳入的併發數獲取一個共享的 p-limit 實例。
 * @param {number} [concurrency] - 想要的併發數
 * @returns {import('p-limit').Limit}
 */
export const getLimiter = (concurrency: number) => {
  const key = isNaN(concurrency) || concurrency <= 0 ? DEFAULT_LIMIT : concurrency

  if (!limiters.has(key)) {
    limiters.set(key, pLimit(key))
  }

  // 返回共享的實例
  return limiters.get(key)
}
