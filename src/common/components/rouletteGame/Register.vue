<template>
  <q-dialog v-model="dialog" persistent class="register-roulette-game-dialog">
    <q-card v-if="promotionState.isFinishSpinRegisterRoulette" class="roulette-result-wrapper">
      <q-card-section class="roulette-result-content">
        <q-btn class="btn-close" flat round dense @click="closeDialog">
          <q-img :src="rouletteGameRegisterImg('close.svg')" cover loading="lazy" />
        </q-btn>
        <div v-if="firstRegisterPromotion" class="roulette-result">
          <div class="result-title">{{ $t("promotion.congratulations") }}</div>
          <div class="result-value">
            <span>{{ getCurrencyCodeById(firstRegisterPromotion.reward[0].currency_id) }}</span>
            <span>{{ moneyFormat(firstRegisterPromotion.reward[0].amount) }} </span>
          </div>
          <q-btn class="btn-award" @click="submit">{{ $t("promotion.claim_your_reward") }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else class="roulette-wrapper">
      <div class="roulette-container pointer-frame-1 !absolute invisible"></div>
      <q-card-section id="rouletteContentRef" class="roulette-container pointer-frame-0">
        <q-btn class="btn-close" flat round dense @click="closeDialog">
          <q-img :src="rouletteGameRegisterImg('close.svg')" cover loading="lazy" />
        </q-btn>
        <h2 class="roulette-title">{{ $t("promotion.register_for_the_lucky_draw") }}</h2>
        <div class="roulette-tip">{{ $t("promotion.free_gifts_waiting_for_you") }}</div>
        <div class="roulette-content">
          <div ref="rouletteRef" class="roulette"></div>
        </div>
        <q-btn class="btn-spin" @click="onSpin">{{ $t("promotion.click_to_draw") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps } from "vue"
import { gsap } from "gsap"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"

const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { rouletteGameRegisterImg } = useCommonImg()
const {
  promotionState,
  showPromotionRegisterDialog,
  firstRegisterPromotion,
  handlePromotionRegisterList,
  finishSpinRegisterRoulette
} = usePromotionRegister()

const props = defineProps<{
  submitCallback?: () => void
}>()

const dialog = ref(false)
const rouletteRef = ref<HTMLElement>()
const isSpinning = ref(false)

/** 轉盤動畫持續時間 */
const ROULETTE_DURATION_SECOND = 5
/** 轉盤額外轉動圈數 */
const ROULETTE_EXTRA_ROUNDS = 10
/** 紀錄轉盤角度 */
let CURRENT_ROTATION_DEG = 0
/** 替換背景圖的數量 */
const FRAME_COUNT = 2
/** 背景圖更換速度 */
const FRAME_INTERVAL_MS = 200

let pointerFrameIndex = 0
let pointerIntervalId: number | null = null

interface IAward {
  name: string
  value: number
  color: string
  textColor: string
  icon: string
}

const awardList = reactive<{ list: IAward[]; current?: IAward }>({
  list: [
    {
      name: "",
      value: 1,
      color: "#fee393",
      textColor: "#ce0207",
      icon: rouletteGameRegisterImg("red-pack.svg")
    },
    {
      name: "",
      value: 2,
      color: "#ce0207",
      textColor: "#fff",
      icon: rouletteGameRegisterImg("money.svg")
    },
    {
      name: "",
      value: 3,
      color: "#fee393",
      textColor: "#ce0207",
      icon: rouletteGameRegisterImg("highfive.svg")
    },
    {
      name: "",
      value: 4,
      color: "#ce0207",
      textColor: "#fff",
      icon: rouletteGameRegisterImg("money.svg")
    },
    {
      name: "",
      value: 5,
      color: "#fee393",
      textColor: "#ce0207",
      icon: rouletteGameRegisterImg("red-pack.svg")
    },
    {
      name: "",
      value: 6,
      color: "#ce0207",
      textColor: "#fff",
      icon: rouletteGameRegisterImg("money.svg")
    }
  ],
  current: undefined
})

onMounted(async () => {
  await handlePromotionRegisterList()

  if (showPromotionRegisterDialog.value) {
    dialog.value = true
  }
})

function onSpin() {
  if (awardList.current && awardList.current.value) {
    handleSpin(awardList.current)
    return
  }

  const targetIndex = Math.floor(Math.random() * awardList.list.length)
  handleSpin(awardList.list[targetIndex])
}

function handleSpin(result: (typeof awardList.list)[number]) {
  if (isSpinning.value) return
  isSpinning.value = true

  const segmentCount = awardList.list.length
  const segmentAngleDeg = 360 / segmentCount
  const targetIndex = awardList.list.findIndex((a) => a.value === result.value)

  const visualOffsetDeg = (Math.random() - 0.5) * 32
  const targetAngleDeg = -targetIndex * segmentAngleDeg - segmentAngleDeg / 2 + visualOffsetDeg
  const totalRotationDeg = 360 * ROULETTE_EXTRA_ROUNDS + targetAngleDeg
  CURRENT_ROTATION_DEG += totalRotationDeg

  const rouletteContentEl = document.getElementById("rouletteContentRef")!
  const rouletteEl = rouletteRef.value!

  // 更換背景圖
  pointerFrameIndex = 0
  rouletteContentEl.classList.add(`pointer-frame-1`)
  pointerIntervalId = window.setInterval(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      rouletteContentEl.classList.remove(`pointer-frame-${i}`)
    }
    rouletteContentEl.classList.add(`pointer-frame-${pointerFrameIndex}`)
    pointerFrameIndex = (pointerFrameIndex + 1) % FRAME_COUNT
  }, FRAME_INTERVAL_MS)

  // 開始轉動
  gsap.to(rouletteEl, {
    rotation: CURRENT_ROTATION_DEG,
    duration: ROULETTE_DURATION_SECOND,
    ease: "power4.out",
    onComplete: () => {
      finishSpin(result)
    }
  })
}

function finishSpin(result: (typeof awardList.list)[number]) {
  if (pointerIntervalId) {
    clearInterval(pointerIntervalId)
    pointerIntervalId = null
  }

  const rouletteContentEl = document.getElementById("rouletteContentRef")!
  // 重設為初始圖片
  for (let i = 0; i < FRAME_COUNT; i++) {
    rouletteContentEl.classList.remove(`pointer-frame-${i}`)
  }
  rouletteContentEl.classList.add("pointer-frame-0")

  isSpinning.value = false

  finishSpinRegisterRoulette()
}

function closeDialog() {
  dialog.value = false
  finishSpinRegisterRoulette()
}

function submit() {
  if (props.submitCallback) {
    props.submitCallback()
  }
  closeDialog()
}
</script>

<!-- register-roulette-game-dialog -->
<style lang="scss">
.register-roulette-game-dialog {
  .q-dialog__inner--minimized {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.btn-close {
  @apply absolute z-10 top-0 right-0;

  :deep(.q-img__container) {
    @apply w-6 h-6;
  }
}

.roulette-wrapper {
  max-width: 22.25rem;
  width: 22.25rem;
  min-width: 22.25rem;
  aspect-ratio: 356 / 632;
  max-height: none !important;
  background: transparent;
  box-shadow: none;

  .roulette-container {
    @apply w-full h-full flex flex-col relative p-0;

    &:after {
      @apply block absolute top-4 right-0 bottom-0 left-0 z-0;
      content: "";
      background-size: cover;
      background-position: center bottom;
      background-repeat: no-repeat;
    }

    &.pointer-frame-0::after {
      background-image: url("../../assets/images/roulette-game-register/bg.png");
    }
    &.pointer-frame-1::after {
      background-image: url("../../assets/images/roulette-game-register/bg-light.png");
    }

    .roulette-title {
      font-family: NotoSans;
      font-weight: 900;
      font-size: 44px;
      line-height: 60px;
      text-align: center;
      background: linear-gradient(
        180deg,
        #fdf2ad 0%,
        #face43 24.52%,
        #b36c17 44%,
        #d4992b 45%,
        #face43 76.92%,
        #fdf2ad 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      /* 為了 Firefox 相容性 */
      background-clip: text;
      color: transparent;
      position: absolute;
      z-index: 2;
      width: 100%;
      top: 75px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 3.75rem;
    }

    .roulette-tip {
      font-family: NotoSansTC;
      font-weight: 600;
      font-size: 18px;
      line-height: 26px;
      text-align: center;
      color: #ffdcd6;
      // box-shadow: 0px 2.62px 5.24px 0px #000000cc;
      position: absolute;
      z-index: 2;
      width: 100%;
      top: 178px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 1rem;
    }

    // 輪盤盤面
    .roulette-content {
      position: absolute;
      width: 15.6875rem;
      height: 15.6875rem;
      z-index: 2;
      top: 235px;
      left: 54px;
      overflow: hidden;

      &::after {
        content: "";
        background-image: url("src/common/assets/images/roulette-game-register/arrow.png");
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        width: 4.5625rem;
        height: 6.375rem;
        padding: 0;
        font-size: 16px;
        position: absolute;
        top: 45%;
        left: 50%;
        z-index: 10;
        transform: translate(-50%, -50%);
      }
    }

    .roulette {
      width: 100%;
      height: 100%;
      background-image: url("src/common/assets/images/roulette-game-register/roulette.png");
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      border-radius: 50%;
    }

    .btn-spin {
      padding: 0.6544rem 1.9669rem;
      background: linear-gradient(180deg, #fdf2ad 0%, #face43 30.77%, #b36c17 64.42%, #face43 83.17%, #fdf2ad 100%);
      box-shadow: 0px 0px 37.69px 0px #ffa600, 0px 0px 17.28px 0px #ffffff inset;
      border-radius: 0.6544rem;
      position: absolute;
      bottom: 2.3694rem;
      left: 50%;
      z-index: 10;
      transform: translateX(-50%);
      max-width: 20.25rem;

      :deep(.q-btn__content) {
        font-family: NotoSansTC;
        font-weight: 700;
        font-size: 26px;
        line-height: 31px;
        text-align: center;
        color: #ffffff;
        text-transform: capitalize;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.roulette-result-wrapper {
  max-width: 19.9375rem;
  width: 19.9375rem;
  min-width: 19.9375rem;
  aspect-ratio: 319 / 389;
  background: transparent;
  box-shadow: none;
  border-radius: 1.5rem;
  max-height: none !important;

  .roulette-result-content {
    @apply w-full h-full flex flex-col relative p-0;

    &:after {
      @apply block absolute top-0 right-0 bottom-0 left-0 z-0 rounded-3xl;
      content: "";
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-image: url("../../assets/images/roulette-game-register/bg-result.png");
    }

    .roulette-result {
      @apply absolute z-10 flex flex-col gap-4 justify-between items-center;
      width: 16.4375rem;
      height: 11.5625rem;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);

      .result-title {
        font-family: NotoSans;
        font-weight: 700;
        font-size: 24px;
        line-height: 2.0625rem;
        letter-spacing: 0%;
        text-align: center;
        color: #ffdcd6;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .result-value {
        @apply py-2 flex justify-center items-center gap-3;
        font-family: NotoSans;
        font-weight: 900;
        font-size: 36px;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;
        color: #ffffff;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .btn-award {
        padding: 0.75rem 1.25rem;
        background: linear-gradient(180deg, #fdf2ad 0%, #face43 30.77%, #b36c17 64.42%, #face43 83.17%, #fdf2ad 100%);
        box-shadow: 0px 0px 37.69px 0px #ffa600, 0px 0px 17.28px 0px #ffffff inset;
        border-radius: 0.6544rem;
        max-width: 100%;

        :deep(.q-btn__content) {
          font-family: NotoSansTC;
          font-weight: 700;
          font-size: 26px;
          line-height: 31px;
          text-align: center;
          color: #ffffff;
          text-transform: capitalize;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
