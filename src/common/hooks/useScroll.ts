import { throttle } from "lodash"
import { onMounted, ref } from "vue"

export function useScroll(elRef?: any) {
  // 默认监听window上的scroll事件
  // const el: any = window
  const scrollTop = ref(0) // 已经滚动区域的高

  // 使用lodash实现节流效果
  const handleScroll = throttle(() => {
    if (!elRef) {
      scrollTop.value = document.documentElement.scrollTop
    } else {
      scrollTop.value = elRef.scrollTop
    }
  }, 100)

  /**
   * 捲動指定元素到頂部
   * @param el 指定元素 dom
   * @param speed 持續時間
   */
  const scrollToTopAnimated = (el: any, speed: any = 500) => {
    const easeInOutQuad = (t: any, b: any, c: any, d: any) => {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }
    if (el) {
      const startPosition = el.scrollTop
      const duration = speed // 預設持續時間 500ms
      let startTime: any = null

      const animateScroll = (currentTime: any) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const run = easeInOutQuad(timeElapsed, startPosition, -startPosition, duration)
        el.scrollTop = run

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", handleScroll)
  })

  return {
    handleScroll,
    scrollTop,
    scrollToTopAnimated
  }
}
