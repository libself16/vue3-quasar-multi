<template>
  <div class="rank-board-wrapper">
    <p class="rank-title" v-html="$t('common.latestBetAndBigWins')"></p>
    <div class="tab-wrapper">
      <q-tabs v-model="tab" class="tab-container" active-class="tab-active" dense>
        <q-tab
          v-for="(type, key) in rankTypes.types"
          :key="key"
          :name="type.value"
          :label="$t(type.i18nLabel)"
          no-caps
        ></q-tab>
      </q-tabs>
    </div>
    <div class="rank-list-wrapper">
      <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
        <q-tab-panel v-for="(type, typeKey) in rankTypes.types" :key="typeKey" :name="type.value">
          <div class="rank-table">
            <div v-if="visibleItems.length" class="overflow-hidden">
              <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                <div
                  v-for="(item, key) in visibleItems"
                  :key="key"
                  class="cursor-pointer rank-item"
                  @click="
                    eventbus.emit(
                      'openBetDetail',
                      true,
                      item,
                      userWalletList.find((e: Response.UserWallet) => e.in_use)?.currency_code || null
                    )
                  "
                >
                  <div class="rank-item__cell rank-item__cell--account">{{ item.member_account }}</div>
                  <div class="rank-item__cell rank-item__cell--games">{{ item.game_name }}</div>
                  <div class="rank-item__cell rank-item__cell--stake">{{ moneyFormat(item.bet_amount) }}</div>
                  <div
                    class="rank-item__cell rank-item__cell--payout"
                    :class="parseInt(item.prize_amount) >= 0 ? 'active' : ''"
                  >
                    {{
                      parseInt(item.prize_amount) >= 0
                        ? `+${moneyFormat(item.prize_amount)}`
                        : `${moneyFormat(item.bet_amount)}`
                    }}
                  </div>
                </div>
              </transition-group>
            </div>
            <div v-else class="cursor-default no-data">
              <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
              <span>{{ $t("tableHeader.no_data") }}</span>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList, getLatestBetList } from "src/api/rank"
import { GAME_TYPE } from "src/common/utils/constants"
import { useLogo } from "src/common/composables/useLogo"
import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"

enum RANK_TYPE {
  latestBet = "latestBet",
  latestWin = "latestWin"
}

const { isLargeTablet } = useMediaQuery()
const { moneyFormat, genEnumToArray } = useCommon()
const { userWalletList } = useUserInfo()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)

const gameType = computed(() => {
  let gameType
  try {
    const allGameTypes = genEnumToArray(GAME_TYPE.Enums)
    const currentGameType = Number(route.params.gameType)
    if (allGameTypes.includes(currentGameType)) {
      gameType = currentGameType
    }
  } catch (e: any) {
    console.log(`rank board is not supported the game type: ${route.params.gameType}`)
  } finally {
    return gameType
  }
})
const { getWideLogo } = useLogo()

//#region 設定值
/** 動畫是否播放 */
const run = ref(true)

/** 動畫的間隔秒數 */
const durationSeconds = ref(1)

/** 是否重播 */
const infinite = ref(true)

/** 欲顯示的筆數 */
const visibleCount = ref(isLargeTablet.value ? 5 : 10)
//#endregion

const rankTypes = reactive({
  types: [
    {
      i18nLabel: "common.btn.latestBet",
      value: RANK_TYPE.latestBet
    },
    {
      i18nLabel: "common.btn.latestWin",
      value: RANK_TYPE.latestWin
    }
  ]
})
const tab = ref(rankTypes.types[0].value)

const headers = [
  { i18nLabel: "common.player" },
  { i18nLabel: "common.games" },
  { i18nLabel: "common.stake" },
  { i18nLabel: "common.payout" }
]

const visibleItems = ref<Response.RankItem[]>([])
async function getRankList() {
  let func: (params: Request.GetRankList) => Promise<Response.RankItem[]>
  switch (tab.value) {
    case RANK_TYPE.latestBet:
      func = getLatestBetList
      break
    case RANK_TYPE.latestWin:
      func = getLatestWinList
      break
    default:
      console.warn(`getRankList: ${tab.value} types is not allows.`)
      return
  }

  let { status, data } = await useApi(func, {
    currency_id: undefined,
    game_type: gameType.value ? gameType.value : undefined
  })

  startAnimation(status && data && data.length ? data : [])
}

/** 指針 */
const currentIndex = ref(0)

/** 動畫的Timer */
let intervalTimer: NodeJS.Timeout

/** 重置 */
function resetVisibleItems() {
  if (intervalTimer) clearInterval(intervalTimer)
  currentIndex.value = 0
  visibleItems.value = []
}

function startAnimation(list: Response.RankItem[] = []) {
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
  await getRankList()
})

onBeforeUnmount(() => {
  resetVisibleItems()
})

watch(
  () => tab.value,
  () => {
    resetVisibleItems()
    getRankList()
  }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.rank-board-wrapper {
  .rank-title {
    @apply text-base;
    color: var(--secondary-01);
  }

  .tab-wrapper {
    @apply my-[.625rem];
    width: fit-content;
    .tab-container {
      border: 0.0625rem solid var(--neutral-03);
      border-radius: 0.5rem;
      background: var(--primary-07);
      color: var(--primary-02);
      :deep(.q-tabs__content) {
        @apply justify-start;
      }
    }

    .tab-active {
      @apply relative;
      color: var(--primary-01);

      &::after {
        @apply absolute bottom-0 left-1/2 w-[30%] h-[.125rem];
        content: "";
        background: var(--primary-01);
        transform: translateX(-50%);
      }
    }

    :deep(.q-tab--active .q-tab__indicator) {
      display: none;
    }
  }

  .rank-list-wrapper {
    @apply rounded-[.5rem];
    border: 0.0625rem solid var(--neutral-03);
    background: var(--primary-07);

    :deep(.q-tab-panels) {
      @apply rounded-[.5rem];
    }

    :deep(.q-tab-panel) {
      padding: 0 !important;
    }
  }

  .rank-item {
    @apply grid grid-cols-4 gap-[.5rem] p-[.5rem] items-center;

    &:not(:last-child) {
      border-bottom: 1px solid var(--neutral-03);
    }

    &:nth-child(odd) {
      background: var(--neutral-02);
    }

    &:nth-child(even) {
      background: var(--primary-07);
    }
  }

  .rank-item__cell {
    @apply text-center;
  }

  .rank-item__cell--payout.active {
    color: var(--primary-01);
  }

  .no-data {
    @apply flex flex-col items-center justify-center p-[2rem] gap-[1rem];
    img {
      @apply w-[9.375rem];
      opacity: 0.6;
    }
    span {
      @apply text-base;
      color: var(--primary-01);
    }
  }
}
</style>
