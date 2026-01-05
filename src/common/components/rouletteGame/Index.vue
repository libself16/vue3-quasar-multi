<!-- src/pages/IndexPage.vue -->
<template>
  <div class="roulette-wrapper">
    <div ref="rouletteRef" class="roulette"></div>
    <div class="roulette-border">
      <q-btn
        v-if="isLogin"
        class="btn-spin"
        :class="{ 'text-small': spinTicket > 99 }"
        rounded
        flat
        @click="onSpin"
        :disable="!canSpin || isSpinning"
      >
        {{ spinTicket > 99 ? "99+" : spinTicket }}
      </q-btn>
      <q-btn v-else class="btn-spin" rounded flat :to="{ name: 'Login' }"> 1 </q-btn>
    </div>
    <div class="dealer-wrapper">
      <q-img :src="rouletteGameImg('dealer.png')" cover />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { Application, Container, Graphics, Sprite, Text, Texture } from "pixi.js"
import { gsap } from "gsap"
import { useWindowSize, watchDebounced } from "@vueuse/core"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import type * as Response from "src/api/response.type"

const { t } = useI18n()
const { width, height } = useWindowSize()
const { isLogin } = useAuth()
const { rouletteGameImg } = useCommonImg()
const { nowLang } = useLanguage()
const { eventEmit } = useEventBus()
const { spinTicket, prizeList, canSpin, handleReferralWheelPrize, handleReferralWheelSpin } = useReferralWheel()

const rouletteRef = ref<HTMLElement>()

/** 中間轉盤寬度 */
// const ROULETTE_WIDTH = 400
/** 中間轉盤高度 */
// const ROULETTE_HEIGHT = 400

const COLOR_ARY = [
  {
    color: "#fee393",
    textColor: "#ce0207"
  },
  {
    color: "#ce0207",
    textColor: "#fff"
  }
]
/** 轉盤動畫持續時間 */
const ROULETTE_DURATION_SECOND = 5
/** 轉盤額外轉動圈數 */
const ROULETTE_EXTRA_ROUNDS = 10

let app: Application | null
let rouletteContainer: Container

const awardList = computed(() => {
  return prizeList.value.map((e, i) => {
    const colorIndex = i % 2
    e.color = COLOR_ARY[colorIndex].color
    e.textColor = COLOR_ARY[colorIndex].textColor

    if (e.is_thank_you) {
      e.icon = rouletteGameImg("highfive.svg")
      e.name = t("rouletteGame.thank_you")
      return e
    }

    if (e.is_random_amount) {
      e.icon = rouletteGameImg("money.svg")
      e.name = t("rouletteGame.random")
      return e
    }

    e.icon = rouletteGameImg("red-pack.svg")
    e.name = `¥ ${e.amount}`

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

  if (rouletteRef.value) {
    rouletteRef.value.innerHTML = ""
  }

  // 取得 .roulette 的實際寬高
  const rect = rouletteRef.value?.getBoundingClientRect()
  const ROULETTE_WIDTH = rect?.width ? rect.width - 10 : 0
  const ROULETTE_HEIGHT = rect?.height ? rect.height - 10 : 0

  app = new Application()
  await app.init({
    width: ROULETTE_WIDTH,
    height: ROULETTE_HEIGHT,
    backgroundAlpha: 0
  })
  rouletteRef.value?.appendChild(app.canvas)

  rouletteContainer = new Container()
  rouletteContainer.x = ROULETTE_WIDTH / 2
  rouletteContainer.y = ROULETTE_HEIGHT / 2
  app.stage.addChild(rouletteContainer)

  const segmentCount = awardList.value.length || 8
  const segmentAngle = (2 * Math.PI) / segmentCount
  const radius = ROULETTE_WIDTH / 2

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
        fontSize: 14,
        fontWeight: "bold",
        fill: awardList.value[i].textColor,
        align: "center",
        wordWrap: true, // ✅ 啟用自動換行
        wordWrapWidth: radius * 0.4, // ✅ 設定最大寬度（依你需求調整）
        breakWords: true // ✅ 可選：強制中間斷詞（避免過長英文不換行）
      })
      label.anchor.set(0.5)

      // 設定文字位置
      label.x = Math.cos(midAngle) * radius * 0.5
      label.y = Math.sin(midAngle) * radius * 0.5

      // 設定文字角度
      label.rotation = midAngle
      rouletteContainer.addChild(label)

      // 上icon圖
      try {
        const img = await loadImage(award.icon)
        const texture = Texture.from(img)
        const sprite = new Sprite(texture)
        sprite.anchor.set(0.5)
        sprite.scale.set(radius * 0.0025)

        // 設定icon位置
        sprite.x = Math.cos(midAngle) * radius * 0.8
        sprite.y = Math.sin(midAngle) * radius * 0.8

        // 設定icon角度
        sprite.rotation = midAngle
        rouletteContainer.addChild(sprite)
      } catch (err) {
        console.error("圖片載入失敗：", award.icon, err)
      }
    }
    return
  }

  /** 畫空轉盤 */
  for (let i = 0; i < segmentCount; i++) {
    const colorIndex = i % 2
    const startAngle = i * segmentAngle - Math.PI / 2
    const endAngle = startAngle + segmentAngle
    const midAngle = (startAngle + endAngle) / 2

    // 畫扇形區塊
    const g = new Graphics()
    g.beginFill(COLOR_ARY[colorIndex].color)
    g.moveTo(0, 0)
    g.arc(0, 0, radius, startAngle, startAngle + segmentAngle)
    g.lineTo(0, 0)
    g.endFill()
    rouletteContainer.addChild(g)
  }
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

  eventEmit("openRouletteWinningDialog", true, result.is_winning)
  eventEmit("openRouletteGameDialog", false)
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
  background: #000
  border-radius: 10px
  display: flex
  flex-direction: column
  width: 100%
  position: relative
  aspect-ratio: 614 / 680
  +phone-width
    aspect-ratio: 343 / 460

  &:after
    content: ""
    position: absolute
    width: 100%
    height: 100%
    display: block
    background-image: url("src/common/assets/images/roulette-game/bg.png")
    background-size: cover
    background-position: center bottom
    background-repeat: no-repeat
    border-radius: 10px
    top: 0
    left: 0
    z-index: 0
    opacity: 0.5

  .roulette-border
    background-image: url("src/common/assets/images/roulette-game/border.svg")
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
      width: 84.39%
      height: 65.27%
      bottom: 40px

    &:after
      background-image: url("src/common/assets/images/roulette-game/arrow.svg")
      background-size: contain
      background-position: center center
      background-repeat: no-repeat
      content: ""
      display: block
      width: 52px
      height: 97px
      position: absolute
      top: -37.5px
      left: 50%
      transform: translateX(-50%)
      z-index: 5
      +phone-width
        width: 33px
        height: 60px
        top: -16px


  .roulette
    position: absolute
    left: 50%
    transform: translateX(-50%)
    bottom: 3.3125rem
    z-index: 2
    width: 65.15%
    height: 61.32%
    display: flex
    justify-content: center
    align-items: center
    +phone-width
      width: 84.39%
      height: 65.27%
      bottom: 40px

  .dealer-wrapper
    width: 38.15%
    height: 52.65%
    position: absolute
    top: 10px
    left: 50%
    transform: translateX(-50%)
    z-index: 1
    +phone-width
      width: 38.19%
      height: 43.47%

  .btn-spin
    border-radius: 50em
    background-image: url("src/common/assets/images/roulette-game/btn-spin.svg")
    background-size: contain
    background-position: center center
    background-repeat: no-repeat
    width: 18.5%
    aspect-ratio: 1 / 1
    padding: 0
    position: absolute
    top: 50%
    left: 50%
    z-index: 10
    transform: translate(-50%, -50%)
    color: #E5C05A
    text-align: center
    font-feature-settings: 'liga' off, 'clig' off
    text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.40)
    font-family: Roboto
    font-size: 1.875vw
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    min-height: auto
    box-shadow: 0px 0px 10px 0px #00000066

    &.q-btn.disabled
      opacity: 1 !important

    &.text-small
      font-size: 1.67vw

    +phone-width
      font-size: 5.46vw
      &.text-small
        font-size: 4.85vw

    +iphone-se-width
      font-size: 7.46vw
      &.text-small
        font-size: 5.59vw
</style>
