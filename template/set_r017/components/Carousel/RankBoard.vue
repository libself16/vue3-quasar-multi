<template>
  <div class="rank-board-wrapper">
    <div class="rank-wrapper">
      <div class="title-wrapper">
        <h5 class="title" v-html="$t('common.latestBetAndBigWins')"></h5>
        <q-tabs v-model="tab" align="left" class="tabs-wrapper" indicator-color="transparent" dense>
          <q-tab
            v-for="(type, key) in rankTypes.types"
            :key="key"
            :name="type.value"
            :label="$t(type.i18nLabel)"
          ></q-tab>
        </q-tabs>
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(type, typeKey) in rankTypes.types" :key="typeKey" :name="type.value">
            <div v-if="isDesktop" class="rank-table">
              <div class="rank-thead">
                <div class="rank-tr">
                  <div v-for="(item, key) in headers" :key="key" class="rank-th">{{ $t(item.i18nLabel) }}</div>
                </div>
              </div>
              <div v-if="visibleItems.length" class="overflow-hidden rank-tbody">
                <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                  <div
                    v-for="(item, key) in visibleItems"
                    :key="key"
                    class="cursor-pointer rank-tr"
                    @click="
                      eventbus.emit(
                        'openBetDetail',
                        true,
                        item,
                        userWalletList.find((e) => e.in_use)?.currency_code || null
                      )
                    "
                  >
                    <div class="rank-td account">{{ item.member_account }}</div>
                    <div class="rank-td games">{{ item.game_name }}</div>
                    <div class="rank-td stake">{{ moneyFormat(item.bet_amount) }}</div>
                    <div class="rank-td payout" :class="parseInt(item.prize_amount) >= 0 ? 'green' : ''">
                      {{
                        parseInt(item.prize_amount) >= 0
                          ? `+${moneyFormat(item.prize_amount)}`
                          : `${moneyFormat(item.bet_amount)}`
                      }}
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-else class="cursor-default rank-tbody no-data">
                <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
                <span>{{ $t("tableHeader.no_data") }}</span>
              </div>
            </div>
            <div v-else class="overflow-hidden rank-card-wrapper">
              <transition-group
                v-if="visibleItems.length"
                appear
                enter-active-class="animated slideInDown"
                :key="currentIndex"
              >
                <div
                  v-for="(item, key) in visibleItems"
                  :key="key"
                  class="cursor-pointer rank-card"
                  @click="
                    eventbus.emit(
                      'openBetDetail',
                      true,
                      item,
                      userWalletList.find((e) => e.in_use)?.currency_code || null
                    )
                  "
                >
                  <div class="flex flex-row items-center justify-between">
                    <span class="font-bold account">{{ item.member_account }}</span>
                    <span class="payout" :class="parseInt(item.prize_amount) >= 0 ? 'green' : ''">
                      {{
                        parseInt(item.prize_amount) >= 0
                          ? `+${moneyFormat(item.prize_amount)}`
                          : `${moneyFormat(item.bet_amount)}`
                      }}
                    </span>
                  </div>
                  <div class="flex flex-row items-center">
                    <span class="games">{{ item.game_name }}</span>
                    <span class="ml-2 font-bold stake">{{ moneyFormat(item.bet_amount) }}</span>
                  </div>
                </div>
              </transition-group>
              <div v-else class="cursor-default rank-card no-data">
                <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
                <span>{{ $t("tableHeader.no_data") }}</span>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { getLatestBetList, getLatestWinList } from "src/api/rank"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { GAME_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import { useRoute } from "vue-router"

enum RANK_TYPE {
  latestBet = "latestBet",
  latestWin = "latestWin"
}

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat, genEnumToArray } = useCommon()
const { userWalletList } = useUserInfo()
const { isDesktop } = useMediaQuery()
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
    console.warn(`rank board is not supported the game type: ${route.params.gameType}`)
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
const visibleCount = ref(isMobile.value ? 5 : 10)
//#endregion

const rankTypes = reactive({
  types: [
    {
      i18nLabel: "common.btn.latestWin",
      value: RANK_TYPE.latestWin
    },
    {
      i18nLabel: "common.btn.latestBet",
      value: RANK_TYPE.latestBet
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
@import "app/template/set_r017/assets/css/_variable.scss";

.rank-board-wrapper {
  @apply w-full mt-11;
  max-width: 75rem;
  margin: 2.75rem auto 4.8125rem;

  .title-wrapper {
    .title {
      font-family: NotoSansTC;
      font-weight: 700;
      font-size: 1.25rem;
      line-height: 1.8125rem;
      color: $neutral01;

      @include phone-width {
        font-size: 1rem;
        line-height: 1.4375rem;
      }
    }

    .tabs-wrapper {
      @apply mt-3 inline-block;
      border-radius: 3.125rem;
      padding: 0.375rem;
      background-color: $secondary06;

      :deep(.q-tab) {
        @apply w-auto capitalize;
        padding: 0.9375rem 1.25rem;
        border-radius: 3.125rem;
        color: $neutral01;

        // &:first-child {
        //   margin-right: 0.75rem;
        // }

        @include phone-width {
          white-space: normal;
          word-break: break-word;
        }

        .q-tab__content {
          padding: 0;

          .q-tab__label {
            font-family: NotoSans;
            font-weight: 700;
            font-size: 0.9375rem;
            line-height: 1.25rem;
            letter-spacing: 0.6px;
          }
        }
      }

      :deep(.q-tab--active) {
        background: $gradient01;
        color: #f2f2f2;
      }
    }
  }

  .rank-board {
    margin-top: 0.75rem;
    :deep(.q-tab-panels) {
      background: transparent;
      .q-tab-panel {
        padding: 0;
      }
    }

    .rank-table {
      width: 100%;

      .rank-tr {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        background: $secondary09;

        &:nth-of-type(2n) {
          background: #030323;
        }
      }

      .rank-th,
      .rank-td {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }

      .rank-thead {
        width: 100%;

        .rank-tr {
          background: #030323;
          height: 3rem;
          .rank-th {
            font-family: NotoSans;
            font-weight: 700;
            font-size: 1.125rem;
            line-height: 1.5625rem;
            color: $neutral01;
          }
        }
      }

      .rank-tbody {
        width: 100%;
        height: calc(3.125rem * v-bind(visibleCount));

        .rank-tr {
          height: 3.4375rem;

          .rank-td {
            font-family: NotoSans;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.375rem;
            color: $neutral02;

            &.stake {
              font-family: NotoSans;
              font-weight: 700;
              font-size: 1.125rem;
              line-height: 1.5625rem;
              color: $neutral01;
            }

            &.payout {
              font-family: NotoSansTC;
              font-weight: 900;
              font-size: 1.125rem;
              line-height: 1.375rem;
              color: $neutral01;

              &.green {
                color: #59ce4e;
              }
            }
          }
        }

        &.no-data {
          @apply flex flex-col justify-center items-center;
          font-size: 2rem;
          color: $neutral01;

          img {
            max-width: 10rem;
            margin-bottom: 0.5rem;
          }
        }
      }
    }

    .rank-card-wrapper {
      width: 100%;
      height: calc(3.5rem * v-bind(visibleCount));
      display: flex;
      flex-direction: column;

      .rank-card {
        display: flex;
        flex-direction: column;
        padding: 0.5625rem 0.75rem;
        width: 100%;
        height: 3.6875rem;
        background: $secondary08;
        font-family: NotoSansTC;
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1.0625rem;
        color: $neutral02;

        &:nth-of-type(2n) {
          background: $secondary09;
        }

        &.no-data {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          img {
            width: 10rem;
          }
        }

        .stake {
          font-weight: 700;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: $neutral01;
        }

        .payout {
          font-weight: 900;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: $neutral01;

          &.green {
            color: #3ecc31;
          }
        }
      }
    }
  }
}
</style>
