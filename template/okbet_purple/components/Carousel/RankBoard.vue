<template>
  <div v-if="!isMobile" class="rank-board-wrapper pc" :class="gameType ? 'white-style' : ''">
    <div class="rank-wrapper">
      <div class="title-wrapper">
        <h5 class="title" v-html="$t('common.latestBetAndBigWins')"></h5>
        <q-tabs
          v-model="tab"
          class="text-teal tabs-wrapper"
          indicator-color="transparent"
          content-class="text-white tab-item"
          active-class="text-black bg-active-tab"
          dense
        >
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
            <div class="rank-table">
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
                    @click="eventbus.emit('openBetDetail', true, item)"
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
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>

  <div v-else class="rank-board-wrapper h5">
    <div class="rank-wrapper">
      <div class="relative title-wrapper">
        <h5 class="title" v-html="$t('common.latestBetAndBigWins')"></h5>
        <q-tabs
          v-model="tab"
          class="text-black tabs-wrapper"
          indicator-color="primary"
          narrow-indicator
          content-class="tab-item"
          active-class="active"
          dense
        >
          <q-tab
            v-for="(type, key) in rankTypes.types"
            :key="key"
            :name="type.value"
            :label="$t(type.i18nLabel)"
          ></q-tab>
        </q-tabs>
        <q-img class="absolute rank-icon" :src="rankIcon()" alt="rank_board_icon"></q-img>
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(type, typeKey) in rankTypes.types" :key="typeKey" :name="type.value">
            <div class="overflow-hidden rank-card-wrapper">
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
                  @click="eventbus.emit('openBetDetail', true, item)"
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
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList, getLatestBetList } from "src/api/rank"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"
import { useLogo } from "src/common/composables/useLogo"
import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"

enum RANK_TYPE {
  latestBet = "latestBet",
  latestWin = "latestWin"
}

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat, genEnumToArray } = useCommon()
const { rankIcon } = useSiteImg()
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

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/data.scss"

.bg-active-tab
  background: $bg-secondary !important
  color: $text-light-secondary !important

.white-style .bg-active-tab
  @apply text-white
  background: $bg-secondary !important

.account,
.games
  font-weight: 400
  font-size: 0.875rem
  line-height: 1.0625rem
.stake
  font-weight: 700
  font-size: 1rem
  line-height: 1.3125rem
.payout
  font-weight: 700
  font-size: 1rem
  line-height: 1.3125rem
  color: #ff4d00
  &.green
    color: #4cc700

.rank-board-wrapper
  font-family: OpenSans
  width: 90%
  max-width: 87.5rem
  margin-bottom: 3.125rem
  +pc-width
    width: 100%
    padding: 0 0.5rem

  &.pc .rank-wrapper
    width: 100%
    background: $bg-dark-secondary
    padding: 0rem 1.5rem 2.5rem
    border-radius: 1.5rem

    :deep(.q-tab-panels)
      background: transparent
      border-radius: 1rem
      .q-tab-panel
        padding: 0

    .title-wrapper
      padding: 2.1875rem 0rem 3.75rem
      display: flex
      -webkit-box-align: center
      align-items: center
      -webkit-box-pack: start
      justify-content: flex-start
      flex-flow: row

    .title
      @apply text-white
      font-weight: 590
      font-size: 1.75rem
      line-height: 2.0625rem
      margin-right: 1.5625rem

    .tabs-wrapper
      .tab-item > .q-tab
        background: #433e70
        color: $text-gray
        border-radius: 50em
        margin: 0 0.625rem
        text-transform: initial

    .rank-board
      .rank-table
        @apply w-full
        .rank-tr
          @apply flex flex-row flex-nowrap w-full h-[3.125rem]
          color: $text-light-secondary

        .rank-th,
        .rank-td
          @apply flex flex-1 h-full items-center justify-center

        .rank-thead
          @apply w-full h-[3.125rem]
          background: linear-gradient(0deg, #1E1B39 45.5%, #312D5E 100%)
          color: $text-light-secondary

          .rank-th
            font-weight: 510
            font-size: 1.125rem
            line-height: 1.3125rem

        .rank-tbody
          width: 100%
          height: calc(3.125rem * v-bind(visibleCount))
          background: #2C294A

  &.h5 .rank-wrapper
    width: 100%
    padding: 0.625rem 0 0

    :deep(.q-tab-panels)
      border-radius: 0rem 0rem 0.5rem 0.5rem
      background: $bg-tab
      .q-tab-panel
        padding: 0

    :deep(.q-tab)
      &.active .q-tab__label
        font-weight: bold
    :deep(.q-tab--active)
      background: $bg-tab !important
      color: $text-light-secondary !important

    .account,
    .games,
    .stake
      font-size: 0.75rem

    .account
      font-weight: bold

    .payout
      font-size: 0.875rem

    .title-wrapper
      display: flex
      flex-direction: column

      .rank-icon
        position: absolute
        width: 6.25rem
        height: 3.125rem
        top: 0
        right: 0

      .title
        color: $text-light-secondary
        font-size: 4vw
        margin: 0 .5vw
        margin-bottom: 1rem
        font-weight: 860

      :deep(.tabs-wrapper)
        .tab-item
          border-radius: 0.5rem 0.5rem 0 0
          display: flex
          align-items: center
          justify-content: center
          height: 3.125rem
          font-size: 0.875rem
          color: #6d7693

          > *
            flex: 1
            text-transform: none

    .rank-card-wrapper
      width: 100%
      height: calc(3.5rem * v-bind(visibleCount))
      display: flex
      flex-direction: column
      color: $text-light-secondary

      .rank-card
        display: flex
        flex-direction: column
        padding: 0.75rem 0.75rem 0.625rem
        width: 100%
        height: 3.5rem

        &.no-data
          height: 100%
          align-items: center
          justify-content: center
          font-size: 2rem

  &.white-style
    width: 100%
    max-width: 100%
    .rank-wrapper
      backdrop-filter: blur(0.7813rem)

      .title-wrapper
        justify-content: space-between
        padding: 1.5rem 0
        .title
          color: $text-light-secondary
          font-style: normal
          font-weight: 860
          font-size: 1.75rem

      .tabs-wrapper
        .tab-item > .q-tab
          font-style: normal
          font-weight: 510
          font-size: 1rem
          color: $text-gray
          padding: 0rem 1.25rem
          height: 2.4375rem

      .rank-board .rank-table
        background: transparent
        .rank-thead
          background: linear-gradient(0deg, #1E1B39 45.5%, #312D5E 100%)
          color: $text-light-secondary
          .rank-th
            font-weight: bold
</style>
