<!-- src/pages/IndexPage.vue -->
<template>
  <div class="roulette-wrapper">
    <div ref="rouletteRef" class="roulette" :class="{ empty: isRouletteEmpty }">
      <q-btn
        v-if="isLogin"
        class="btn-spin"
        :class="{ 'text-small': spinTicket > 99, 'text-mini': spinValue }"
        rounded
        flat
        @click="onSpin"
        :disable="!canSpin || isSpinning"
      >
        <count-up v-if="spinValue" :end-val="spinValue" :duration="0.5" :decimalPlaces="2">
          <template #prefix>+</template>
        </count-up>
        <span v-else> {{ spinTicket > 99 ? "99+" : spinTicket }}</span>
      </q-btn>
      <q-btn v-else class="btn-spin" rounded flat :to="{ name: 'Login' }"> 1 </q-btn>
      <div class="roulette-shadow"></div>
    </div>
    <div class="roulette-border"></div>
    <div class="dealer-wrapper">
      <q-img :src="rouletteGameImg('fortune-god/fortune-god.png')" cover />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { Application, Container, Graphics, Sprite, Text, Texture } from "pixi.js"
import { gsap } from "gsap"
import { useWindowSize, watchDebounced } from "@vueuse/core"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import type * as Response from "src/api/response.type"
import CountUp from "vue-countup-v3"

const { width, height } = useWindowSize()
const { isLogin } = useAuth()
const { rouletteGameImg } = useCommonImg()
const { nowLang } = useLanguage()
const { eventEmit } = useEventBus()
const { spinTicket, prizeList, canSpin, handleReferralWheelPrize, handleReferralWheelSpin } = useReferralWheel()

const spinValue = ref("")
const rouletteRef = ref<HTMLElement>()
const isRouletteEmpty = ref(false)

const COLOR_ARY = [
  {
    color: "#ce0005",
    textColor: "#FFBF00"
  },
  {
    color: "#fffcf5",
    textColor: "#C98E02"
  }
]

/** 轉盤動畫持續時間 */
const ROULETTE_DURATION_SECOND = 5
/** 轉盤額外轉動圈數 */
const ROULETTE_EXTRA_ROUNDS = 10

let app: Application | null
let rouletteContainer: Container

const awardList = computed(() => {
  let randomIconIndex = 0
  return prizeList.value.map((e, i) => {
    const colorIndex = i % 2
    e.color = COLOR_ARY[colorIndex].color
    e.textColor = COLOR_ARY[colorIndex].textColor

    if (e.is_thank_you) {
      e.icon = rouletteGameImg("fortune-god/cry-face.svg")
      e.name = ""
      return e
    }

    if (e.is_random_amount) {
      e.icon = rouletteGameImg(`fortune-god/${e.prize_name}.svg`)
      e.name = ""
      randomIconIndex++
      return e
    }

    e.icon = ""
    e.name = e.amount

    return e
  })
})

// 載入圖片
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

async function createRoulette() {
  if (app) {
    app.destroy(true, { children: true, texture: true })
    app = null
  }

  // 取得 .roulette 的實際寬高
  const rect = rouletteRef.value?.getBoundingClientRect()
  const ROULETTE_WIDTH = rect?.width ? rect.width - 10 : 0
  const ROULETTE_HEIGHT = rect?.height ? rect.height - 10 : 0
  const radius = ROULETTE_WIDTH / 2

  app = new Application()
  await app.init({
    width: ROULETTE_WIDTH,
    height: ROULETTE_HEIGHT,
    backgroundAlpha: 0
  })
  rouletteRef.value?.appendChild(app.canvas)

  // 輪盤容器
  rouletteContainer = new Container()
  rouletteContainer.x = ROULETTE_WIDTH / 2
  rouletteContainer.y = ROULETTE_HEIGHT / 2
  app.stage.addChild(rouletteContainer)

  const segmentCount = awardList.value.length || 8
  const segmentAngle = (2 * Math.PI) / segmentCount

  if (awardList.value.length) {
    for (let i = 0; i < awardList.value.length; i++) {
      const award = awardList.value[i]
      const startAngle = i * segmentAngle - Math.PI / 2
      const endAngle = startAngle + segmentAngle
      const midAngle = (startAngle + endAngle) / 2

      // 畫扇形區塊
      const g = new Graphics()
      g.beginFill(awardList.value[i].color)
      g.moveTo(0, 0)
      g.arc(0, 0, radius, startAngle, startAngle + segmentAngle)
      g.lineTo(0, 0)
      g.endFill()
      rouletteContainer.addChild(g)

      // 上文字
      const label = new Text(`${awardList.value[i].name}`, {
        fontSize: 18,
        fontWeight: "bold",
        fill: awardList.value[i].textColor,
        align: "center"
      })
      label.anchor.set(0.5)

      // 設定文字位置
      label.x = Math.cos(midAngle) * radius * 0.65
      label.y = Math.sin(midAngle) * radius * 0.65

      // 設定文字角度
      label.rotation = midAngle
      rouletteContainer.addChild(label)

      // 上icon圖
      if (!award.icon) continue
      try {
        const img = await loadImage(award.icon)
        const texture = Texture.from(img)
        const sprite = new Sprite(texture)
        sprite.anchor.set(0.5)
        sprite.scale.set(radius * 0.003)

        // 設定icon位置
        sprite.x = Math.cos(midAngle) * radius * 0.65
        sprite.y = Math.sin(midAngle) * radius * 0.65

        // 設定icon角度
        sprite.rotation = midAngle + Math.PI / 2
        rouletteContainer.addChild(sprite)
      } catch (err) {
        console.error("圖片載入失敗：", award.icon, err)
      }
    }
    return
  }
  isRouletteEmpty.value = true
}

onMounted(async () => {
  await handleReferralWheelPrize()
  createRoulette()
})

const isSpinning = ref(false)
let spinTween: gsap.core.Tween | null = null

async function onSpin() {
  if (!awardList.value.length) return

  const { status, data } = await handleReferralWheelSpin()
  if (status && data?.winning) {
    handleSpin(data)
  }
}

function handleSpin(result: Response.PostReferralWheelSpin) {
  if (isSpinning.value) return
  const prize_id = result.winning.prize_id
  const award = awardList.value.find((e) => e.id === prize_id)
  if (!award) return

  isSpinning.value = true

  const segmentCount = awardList.value.length
  const segmentAngle = (2 * Math.PI) / segmentCount
  const targetIndex = awardList.value.findIndex((a) => a.id === award.id)

  // 將目前角度限制在 0 ~ 2PI 範圍內，避免累加導致動畫失效
  const currentRotation = rouletteContainer.rotation % (2 * Math.PI)
  rouletteContainer.rotation = currentRotation // 🔧 重設 rotation 為合理值

  // 目標角度：該區塊的中間對準上方
  const targetAngle = -targetIndex * segmentAngle - segmentAngle / 2

  const totalRotation = 2 * Math.PI * ROULETTE_EXTRA_ROUNDS + (targetAngle - currentRotation)

  spinTween = gsap.to(rouletteContainer, {
    rotation: currentRotation + totalRotation,
    duration: ROULETTE_DURATION_SECOND,
    ease: "power4.out",
    onComplete: () => finishSpin(result)
  })
}

function finishSpin(result: Response.PostReferralWheelSpin) {
  isSpinning.value = false
  spinValue.value = result.winning.amount

  setTimeout(() => {
    spinValue.value = ""
    eventEmit("openRouletteWinningDialog", true, result.is_winning)
  }, 1000)
}

watchDebounced(
  [width, height, nowLang],
  () => {
    createRoulette()
  },
  { debounce: 300, maxWait: 1000 }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.roulette-wrapper
  border-radius: 10px
  display: flex
  flex-direction: column
  width: 100%
  position: relative
  aspect-ratio: 614 / 680
  +phone-width
    aspect-ratio: 343 / 482

  &:after
    content: ""
    position: absolute
    width: 100%
    height: 100%
    display: block
    background-image: url("src/common/assets/images/roulette-game/fortune-god/bg.png")
    background-size: cover
    background-position: center top
    background-repeat: no-repeat
    border-radius: 10px
    top: 0
    left: 0
    z-index: 0

  .roulette-border
    background-image: url("src/common/assets/images/roulette-game/fortune-god/border.svg")
    background-size: contain
    background-position: center center
    background-repeat: no-repeat
    width: 65.15%
    height: 61.32%
    bottom: 53px
    position: absolute
    left: 50%
    transform: translateX(-50%)
    z-index: 3
    +phone-width
      width: 84.84%
      height: 62.21%
      bottom: 50px

    &:before
      background-image: url("src/common/assets/images/roulette-game/fortune-god/treasure.png")
      background-size: contain
      background-position: center center
      background-repeat: no-repeat
      content: ""
      display: block
      width: 29.25%
      height: 19.9%
      position: absolute
      bottom: 0px
      left: -19px
      z-index: 5
      +phone-width
        width: 27.83%
        height: 19%
        left: -11.5px

  .roulette
    position: absolute
    left: 50%
    transform: translateX(-50%)
    bottom: 88px
    z-index: 4
    width: 56.35%
    height: 50.88%
    display: flex
    justify-content: center
    align-items: center
    &.empty
      background-image: url("src/common/assets/images/roulette-game/fortune-god/empty-roulette.png")
      background-size: calc(100% - 10px), calc(100% - 10px)
      background-position: center center
      background-repeat: no-repeat
    +phone-width
      width: 73.47%
      height: 52.28%
      bottom: 75px

    &:after
      background-image: url("src/common/assets/images/roulette-game/fortune-god/arrow.svg")
      background-size: contain
      background-position: center center
      background-repeat: no-repeat
      content: ""
      display: block
      width: 29.4px
      height: 39.57px
      position: absolute
      top: -14px
      left: 50%
      transform: translateX(-50%)
      z-index: 5
      +phone-width
        width: 21.39px
        height: 28.81px
        top: -8px

    .roulette-shadow
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border-radius: 50%
      background: transparent
      box-shadow: inset 0 0 25px 7px #9D7125
      pointer-events: none
      +phone-width
        box-shadow: inset 0 0 25px 3px #9D7125

  .dealer-wrapper
    width: 50.84%
    height: 37.53%
    position: absolute
    top: 34px
    left: 50%
    transform: translateX(-50%)
    z-index: 1
    +phone-width
      width: 63.26%
      height: 41.63%
      top: 20px

  .btn-spin
    border-radius: 50em
    background-image: url("src/common/assets/images/roulette-game/fortune-god/btn-spin.png")
    background-size: contain
    background-position: center center
    background-repeat: no-repeat
    width: 28.9%
    aspect-ratio: 1 / 1
    padding: 0
    position: absolute
    top: 50%
    left: 50%
    z-index: 10
    transform: translate(-50%, -50%)
    color: #FFFFFF
    text-align: center
    font-feature-settings: 'liga' off, 'clig' off
    text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.40)
    font-family: Roboto
    font-size: 2.604vw
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    min-height: auto

    &.text-mini
      font-size: 1.146vw

    &.q-btn.disabled
      opacity: 1 !important

    +phone-width
      font-size: 5.2vw
      &.text-mini
        font-size: 3.385vw

    +iphone-se-width
      font-size: 10.66vw
      &.text-small
        font-size: 8vw
</style>
