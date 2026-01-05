import { ref, onUnmounted } from 'vue'
import coinImg from 'src/common/assets/images/gift/coin.png'

export interface Coin {
  x: number
  y: number
  dy: number
  s: number
  state: number
}

export function useCoinsAnimation() {
  const coinCanvas = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  let coins: Coin[] = []

  const startCoinAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    const canvas = coinCanvas.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    coins = []
    let count = 0
    const stoploop = 88
    const coin = new Image()
    coin.src = coinImg

    const drawloop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.1 && count <= stoploop) {
        coins.push({
          x: Math.random() * canvas.width | 0,
          y: -50,
          dy: 2,
          s: 0.4 + Math.random() * 0.5,
          state: Math.random() * 10 | 0
        })
        count++
      }

      for (let i = coins.length - 1; i >= 0; i--) {
        let x = coins[i].x
        if (x + 105 > canvas.width) {
          x -= 105
        }

        const y = coins[i].y
        const s = coins[i].s
        const state = coins[i].state
        coins[i].state = state > 15 ? 0 : state + 0.1
        coins[i].dy += 0.1
        coins[i].y += coins[i].dy

        ctx.drawImage(coin, 105 * Math.floor(state), 0, 105, 105, x, y, 105 * s, 105 * s)

        if (y > canvas.height) {
          coins.splice(i, 1)
        }
      }

      animationFrameId = requestAnimationFrame(drawloop)
    }

    coin.onload = drawloop
  }

  const stopAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    coins = []
  }

  onUnmounted(() => {
    stopAnimation()
  })

  return {
    coinCanvas,
    startCoinAnimation,
    stopAnimation
  }
}


