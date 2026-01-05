<template>
  <q-dialog
    v-model="dialog"
    v-bind="attrs"
    transition-show="fade"
    transition-hide="fade"
    class="roulette-winning-dialog-wrapper"
    persistent
    @hide="syncReferralWheelSpinInfo"
  >
    <q-card class="roulette-winning-wrapper" :class="{ isWinning: isWinning }">
      <q-btn class="close-btn" flat round v-close-popup>
        <q-img :src="svgIcon('btn-close')" loading="lazy"></q-img>
      </q-btn>

      <div class="roulette-winning-content">
        <div class="roulette-winning-red-card-content">
          <div class="roulette-winning-red-card-shadow"></div>
          <div v-if="isWinning" class="roulette-winning-red-card">
            <div class="free-money">
              <q-img :src="svgIcon('money')" loading="lazy"></q-img>
              <p>{{ $t("rouletteGame.get_for_free") }}¥100</p>
            </div>
            <div class="roulette-winning-red-card-top">
              <div class="header-top-text">{{ $t("rouletteGame.withdraw_now") }}</div>
              <q-img :src="svgIcon('gift')" loading="lazy"></q-img>
              <div class="header-top-text">{{ $t("rouletteGame.congratulations_you_won") }}</div>
            </div>
            <div class="roulette-winning-red-card-middle">
              <q-img :src="svgIcon('cash')" loading="lazy"></q-img>
              <p>¥{{ moneyFormat(bonusValue) }}</p>
            </div>
            <div class="roulette-winning-red-card-bottom">
              <q-slider
                v-model="bonusValue"
                :min="0"
                :max="100"
                thumb-size="18px"
                track-size="10px"
                label
                label-always
                :label-value="bonusValue + '%'"
                class="roulette-game-progess"
                readonly
              />
              <div class="red-card-bottom-text">
                {{ $t("rouletteGame.you_just_need_extra") }}¥{{ moneyFormat(withdrawalDiff)
                }}{{ $t("rouletteGame.then_you_can_withdraw") }}
              </div>
            </div>
          </div>
          <div v-else class="roulette-not-winning-red-card">
            <q-img :src="svgIcon('gift-not-winning')" loading="lazy"></q-img>
            <div class="not-winning-text">{{ $t("rouletteGame.try_again") }}</div>
          </div>
        </div>

        <div class="roulette-winning-body">
          <q-btn @click="handleBodtBtnClick">{{ $t("rouletteGame.click_to_get_more_rewards") }}</q-btn>
        </div>
        <div class="roulette-winning-footer">
          <div class="overflow-hidden award-card-wrapper">
            <transition-group
              v-if="visibleItems.length"
              appear
              enter-active-class="animated slideInDown"
              :key="currentIndex"
            >
              <div v-for="(item, key) in visibleItems" :key="key" class="award-card">
                <div>{{ item.account }}</div>
                <div>{{ $t("rouletteGame.just_received") }}</div>
                <div :class="parseInt(item.amount) >= 0 ? 'green' : ''">
                  {{ parseInt(item.amount) >= 0 ? `+${moneyFormat(item.amount)}` : `${moneyFormat(item.amount)}` }}
                </div>
              </div>
            </transition-group>
            <div v-else class="cursor-default no-data">
              <span>{{ $t("tableHeader.no_data") }}</span>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useAttrs, defineProps, ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import * as Response from "src/api/response.type"

const props = defineProps<{
  footerClickRouteName?: string
}>()

const router = useRouter()
const { eventOn } = useEventBus()
const { moneyFormat } = useCommon()
const {
  bonusValue,
  withdrawalDiff,
  referralWheelState,
  handleReferralWheellWinners,
  handleReferralWheelCurrent,
  handleReferralWheelMemberInfo,
  syncReferralWheelSpinInfo
} = useReferralWheel()
const { svgIcon } = useSiteImg()

const attrs = useAttrs()
const dialog = ref(false)
const isWinning = ref(false)
/** 動畫是否播放 */
const run = ref(true)

/** 動畫的間隔秒數 */
const durationSeconds = ref(1)

/** 是否重播 */
const infinite = ref(true)

/** 欲顯示的筆數 */
const visibleCount = ref(4)

/** 指針 */
const currentIndex = ref(0)

/** 動畫的Timer */
let intervalTimer: NodeJS.Timeout

const visibleItems = ref<Response.GetReferralWheelWinners>([])

async function getAwardList() {
  await handleReferralWheellWinners()
  startAnimation(referralWheelState.value.winners.length ? referralWheelState.value.winners : [])
}

/** 重置 */
function resetVisibleItems() {
  if (intervalTimer) clearInterval(intervalTimer)
  currentIndex.value = 0
  visibleItems.value = []
}

function startAnimation(list: any[]) {
  resetVisibleItems()

  if (!run.value || !list.length || list.length <= visibleCount.value) {
    visibleItems.value = list
    return
  }

  const updateVisibleItems = () => {
    visibleItems.value.unshift(list[currentIndex.value])
    if (visibleItems.value.length > visibleCount.value + 1) {
      visibleItems.value.pop()
    }
  }

  intervalTimer = setInterval(() => {
    updateVisibleItems()

    currentIndex.value++
    if (currentIndex.value >= list.length) {
      if (infinite.value) {
        currentIndex.value = 0
      } else {
        clearInterval(intervalTimer)
      }
    }
  }, durationSeconds.value * 1000)
}

const handleBodtBtnClick = () => {
  const name = props.footerClickRouteName ? props.footerClickRouteName : "RouletteGame"
  router.push({ name })
  dialog.value = false
}

onMounted(async () => {
  eventOn("openRouletteWinningDialog", async (show, status) => {
    dialog.value = show
    isWinning.value = status
    if (show) {
      await getAwardList()
      if (status) {
        await handleReferralWheelCurrent()
        await handleReferralWheelMemberInfo()
      }
    }
  })
})

onBeforeUnmount(() => {
  resetVisibleItems()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.roulette-winning-wrapper {
  position: relative;
  max-width: 900px;
  width: 100%;
  height: 38.875rem;
  max-height: initial !important;
  overflow: hidden;
  border-radius: 0px;
  background-color: transparent;
  box-shadow: none;

  @include phone-width {
    height: 29.5625rem;
  }

  &.isWinning {
    height: 48.9375rem;

    @include phone-width {
      height: 42.625rem;
    }
  }

  .close-btn {
    @apply absolute  min-w-0 min-h-0;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);

    .q-img {
      width: 3.75rem;
      height: 3.75rem;

      @include phone-width {
        width: 2.375rem;
        height: 2.375rem;
      }
    }
  }

  .roulette-winning-content {
    padding: 1.25rem;
    border-radius: 1.875rem !important;
    background: linear-gradient(0deg, #ffffff, #ffffff), linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15));

    @include phone-width {
      padding: 0.625rem 0.625rem 1.25rem;
    }
  }

  .roulette-winning-red-card-content {
    @apply relative;

    .roulette-not-winning-red-card {
      @apply relative z-10 flex flex-col justify-center items-center gap-[.625rem];
      padding: 3.75rem;
      border-radius: 1.875rem;
      background: linear-gradient(0deg, $primary04, $primary04),
        radial-gradient(79.11% 79.11% at 50% 5.95%, rgba(0, 0, 0, 0) 22%, rgba(0, 0, 0, 0.26) 100%);

      @include phone-width {
        padding: 1.875rem;
      }

      .q-img {
        width: 7.875rem;
        height: 7.5625rem;
      }

      .not-winning-text {
        @include fontStyle(1.25rem, 700, 1.4375rem);
        color: #ffffff;

        @include phone-width {
          @include fontStyle(1rem, 700, 1.125rem);
        }
      }
    }

    .roulette-winning-red-card {
      @apply relative z-10 flex flex-col items-center;
      padding: 25px 27px 25.63px 26px;
      border-radius: 1.875rem;
      background: linear-gradient(0deg, $primary04, $primary04),
        radial-gradient(79.11% 79.11% at 50% 5.95%, rgba(0, 0, 0, 0) 22%, rgba(0, 0, 0, 0.26) 100%);

      @include phone-width {
        padding: 0.9688rem 0.625rem 0.9688rem 0.5rem;
      }

      .free-money {
        @apply absolute top-2 left-[1.5625rem];
        @apply flex items-center gap-3;

        @include phone-width {
          @apply top-[.9688rem] left-2 gap-2;
        }
        .q-img {
          width: 2.3125rem;
          height: 2.0625rem;
        }
        p {
          font-family: Helvetica;
          font-weight: 700;
          font-size: 16px;
          line-height: 1.375rem;
          color: #ffffff;

          @include phone-width {
            font-size: 12px;
            line-height: 0.875rem;
          }
        }
      }

      .roulette-winning-red-card-top {
        @apply flex flex-col items-center gap-[.875rem];

        @include phone-width {
          margin-top: 3.375rem;
          gap: 0.625rem;
        }

        .q-img {
          width: 7.875rem;
          height: 7.5625rem;
        }

        .header-top-text {
          @include fontStyle(1.25rem, 700, 1.6875rem);
          color: #ffffff;

          @include phone-width {
            @include fontStyle(1rem, 700, 1.125rem);
          }
        }
      }

      .roulette-winning-red-card-middle {
        @apply flex items-center gap-[1.625rem];

        @include phone-width {
          gap: 1.25rem;
          margin-top: 0.625rem;
        }

        .q-img {
          width: 4.7225rem;
          height: 4.61rem;

          @include phone-width {
            width: 2.625rem;
            height: 2.5625rem;
          }
        }

        p {
          @include fontStyle(3.5rem, 700, 4.8125rem);
          color: #ffffff;

          @include phone-width {
            @include fontStyle(2.25rem, 700, 2.5625rem);
          }
        }
      }

      .roulette-winning-red-card-bottom {
        @apply w-full flex flex-col items-center gap-9 mt-[.4375rem];

        @include phone-width {
          margin-top: 1.3125rem;
          gap: 12px;
        }

        .roulette-game-progess {
          :deep(.q-slider__track) {
            height: 0.625rem !important;
            border-radius: 6.25rem;
            background: $neutral05;

            @include phone-width {
              height: 0.4375rem !important;
            }

            .q-slider__selection {
              background: linear-gradient(90deg, #ffb689 0%, #e85a86 100%);
              border: 3px solid #fff;

              @include phone-width {
                border-width: 1px;
              }
            }

            .q-slider__thumb {
              .q-slider__thumb-shape {
                visibility: hidden;
              }

              .q-slider__pin {
                &::before {
                  border: 0;
                  width: 7.58px;
                  height: 17.39px;
                  background: linear-gradient(to bottom, #f99, #f6a);
                  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 60% 100%, 40% 100%, 0% 75%);

                  @include phone-width {
                    bottom: -0.25rem;
                    height: 0.7137rem;
                  }
                }

                .q-slider__label {
                  top: 2.5669rem;

                  @include phone-width {
                    top: 1.75rem;
                  }

                  .q-slider__text-container {
                    transform: none !important;
                    background-color: transparent;

                    .q-slider__text {
                      @include fontStyle(1rem, 400);
                      color: #ffffff;

                      @include phone-width {
                        @include fontStyle(0.625rem, 400, 0.8125rem);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .red-card-bottom-text {
          @include fontStyle(1.125rem, 400, 1.1481rem);
          color: #ffffff;

          @include phone-width {
            @include fontStyle(0.75rem, 400, 1rem);
          }
        }
      }
    }

    .roulette-winning-red-card-shadow {
      @apply absolute w-full h-full left-0;
      content: "";
      border-radius: 1.875rem;
      top: 5px;
      background: linear-gradient(
        90deg,
        #ea6363 0%,
        #7c2323 18.5%,
        #e57676 34.5%,
        #e77a7a 51%,
        #df6060 67%,
        #742323 82%,
        #d76868 100%
      );
      box-shadow: 0px 4px 4px 0px #00000040;

      @include phone-width {
        top: 3px;
      }
    }
  }

  .roulette-winning-body {
    @apply mt-5 flex justify-center items-center;
    .q-btn {
      min-height: auto;
      padding: 1rem 2.875rem 1.0625rem;
      border-radius: 1rem;
      background: linear-gradient(0deg, $primary04, $primary04),
        linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
      box-shadow: 0px 4px 4px 0px #00000040;

      @include phone-width {
        padding: 0.8125rem 2.7813rem;
      }

      :deep(.q-btn__content) {
        @include fontStyle(1.25rem, 700, 1.6875rem);
        color: #ffffff;

        @include phone-width {
          @include fontStyle(1rem, 700, 1.375rem);
        }
      }
    }
  }
  .roulette-winning-footer {
    margin-top: 1.5625rem;

    @include phone-width {
      margin-top: 1.25rem;
    }

    .award-card-wrapper {
      height: 7.375rem;
      overflow: hidden;

      @include phone-width {
        height: 6.125rem;
      }

      .award-card {
        @apply flex items-center gap-4;
        padding: 0.3125rem 2.625rem;
        border-bottom: 0.5px solid $neutral05;

        &:nth-of-type(4),
        &:nth-of-type(5) {
          border-bottom: none;
        }

        div {
          @include fontStyle(1rem, 400, 1.125rem);
          flex: 1;
          text-align: center;
          color: $neutral10;

          @include phone-width {
            @include fontStyle(0.625rem, 400, 0.8562rem);
          }

          &.green {
            color: $secondary06;
            font-weight: 700;
          }
        }
      }

      .no-data {
        @apply w-full h-full flex justify-center items-center;
        span {
          @include fontStyle(0.875rem, 700, 1rem);
          color: $neutral10;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.roulette-winning-dialog-wrapper {
  .q-dialog__backdrop {
    background: $secondary01 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      &.q-dialog__inner--minimized {
        padding: 0 1.0938rem;
      }
    }
  }
}
</style>
