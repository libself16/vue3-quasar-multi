import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

export default function useSwipeLeft(devicePlatform: string) {
  const router = useRouter()
  let startX: number
  let startY: number
  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].pageX
    startY = e.touches[0].pageY
  }
  const handleTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].pageX - startX
    const deltaY = e.changedTouches[0].pageY - startY

    // 假設右滑距離超過一定閾值，則視為右滑手勢
    if (deltaX > 50 && Math.abs(deltaY) < 50) {
      // 觸發返回上一頁的相應事件
      router.go(-1)
    }
  }
  onMounted(() => {
    console.log("devicePlatform", devicePlatform)
    if (devicePlatform === "iOS") {
      document.addEventListener("touchstart", handleTouchStart)
      document.addEventListener("touchend", handleTouchEnd)
    }
  })

  onUnmounted(() => {
    if (devicePlatform === "iOS") {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  })
}
