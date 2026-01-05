<template>
  <div class="award-list-content">
    <q-tabs v-model="tab" class="tabs-wrapper" indicator-color="transparent" content-class="tab-item" dense>
      <q-tab
        v-for="(type, key) in tabTypes.types"
        :key="key"
        :name="type.value"
        :label="$t(type.i18nLabel)"
        class="hide-hover"
      ></q-tab>
    </q-tabs>

    <div class="award-board">
      <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
        <q-tab-panel v-for="(type, typeKey) in tabTypes.types" :key="typeKey" :name="type.value">
          <div class="overflow-hidden award-card-wrapper">
            <transition-group
              v-if="visibleItems.length"
              appear
              enter-active-class="animated slideInDown"
              :key="currentIndex"
            >
              <div v-for="(item, key) in visibleItems" :key="key" class="award-card">
                <template v-if="tab === TAB_TYPE.winner">
                  <div>{{ item.account }}</div>
                  <div>{{ $t("rouletteGame.just_received") }}</div>
                  <div :class="parseInt(item.amount) >= 0 ? 'green' : ''">
                    {{ parseInt(item.amount) >= 0 ? `+${moneyFormat(item.amount)}` : `${moneyFormat(item.amount)}` }}
                  </div>
                </template>
                <template v-else>
                  <div>{{ dateformat(item.created_at, "YYYY-MM-DD HH:mm:ss") }}</div>
                  <div>{{ $t("rouletteGame.received_got") }}</div>
                  <div :class="parseInt(item.amount) >= 0 ? 'green' : ''">
                    {{ parseInt(item.amount) >= 0 ? `+${moneyFormat(item.amount)}` : `${moneyFormat(item.amount)}` }}
                  </div>
                </template>
              </div>
            </transition-group>
            <div v-else class="cursor-default no-data">
              <!-- <img v-if="getWideLogo" :src="getWideLogo()" alt="" /> -->
              <span>{{ $t("tableHeader.no_data") }}</span>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import * as Response from "src/api/response.type"

const { moneyFormat } = useCommon()
const { referralWheelState, handleReferralWheellWinners, handleReferralWheelMemberPrizes } = useReferralWheel()

enum TAB_TYPE {
  winner = "winner",
  award = "award"
}

const tabTypes = reactive({
  types: [
    {
      i18nLabel: "rouletteGame.winner_list",
      value: TAB_TYPE.winner
    },
    {
      i18nLabel: "rouletteGame.award_records",
      value: TAB_TYPE.award
    }
  ]
})

const tab = ref(tabTypes.types[0].value)

/** 動畫是否播放 */
const run = ref(true)

/** 動畫的間隔秒數 */
const durationSeconds = ref(1)

/** 是否重播 */
const infinite = ref(true)

/** 欲顯示的筆數 */
const visibleCount = ref(5)

/** 指針 */
const currentIndex = ref(0)

/** 動畫的Timer */
let intervalTimer: NodeJS.Timeout

const visibleItems = ref<{ account: string; amount: string; created_at: string }[]>([])

async function getAwardList() {
  if (tab.value === TAB_TYPE.winner) {
    await handleReferralWheellWinners()
    startAnimation(referralWheelState.value.winners.length ? referralWheelState.value.winners : [])
    return
  }

  await handleReferralWheelMemberPrizes()
  startAnimation(referralWheelState.value.memberPrizes.length ? referralWheelState.value.memberPrizes : [])
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

onMounted(async () => {
  await getAwardList()
})

onBeforeUnmount(() => {
  resetVisibleItems()
})

watch(
  () => tab.value,
  () => {
    resetVisibleItems()
    getAwardList()
  }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.award-list-content {
  background: $neutral04;
  box-shadow: $shadow04;
  border-radius: 0.625rem;
  padding: 1.25rem;

  .tabs-wrapper {
    .tab-item > .q-tab {
      @include fontStyle(0.875rem, 700, 1rem);
      color: $primary04;
      text-transform: initial;

      &.q-tab--active {
        border-radius: 0.625rem;
        background: $gradient01;
        color: $neutral01;
      }
    }
  }

  .award-board {
    margin-top: 1.25rem;

    .q-tab-panels {
      background: transparent;

      .q-tab-panel {
        padding: 0;
      }
    }

    .award-card-wrapper {
      height: 12.5rem;
      overflow: hidden;

      .award-card {
        @apply flex items-center gap-4 p-3;
        border-bottom: 1px solid $neutral05;

        div {
          @include fontStyle(0.875rem, 400, 1rem);
          flex: 1;
          text-align: center;
          color: $neutral10;

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
