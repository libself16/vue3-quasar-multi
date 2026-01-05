<template>
  <div v-if="!isMobile" class="rank-board-wrapper pc" :class="gameType ? 'white-style' : ''">
    <q-tabs
      v-model="tab"
      class="tabs-wrapper"
      indicator-color="transparent"
      content-class="tab-item text-xs gap-2"
      active-class="bg-active-tab"
      dense
    >
      <q-tab v-for="(type, key) in rankTypes.types" :key="key" :name="type.value" :label="$t(type.i18nLabel)"></q-tab>
    </q-tabs>
    <div class="rank-wrapper">
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
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>

  <div v-else class="rank-board-wrapper h5">
    <div class="rank-wrapper">
      <div class="relative title-wrapper">
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
        <!-- <q-img class="absolute rank-icon" :src="rankIcon()" alt="rank_board_icon"></q-img> -->
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
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/set_ed8888/hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList, getLatestBetList } from "src/api/rank"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"
import { useLogo } from "src/common/composables/useLogo"
import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"
import { useUserInfo } from "src/common/composables/useUserInfo"

enum RANK_TYPE {
  latestBet = "latestBet",
  latestWin = "latestWin"
}

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat, genEnumToArray } = useCommon()
const { userWalletList } = useUserInfo()
const {} = useSiteImg()
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
@import "app/template/set_ed8888/assets/css/_variable.scss";

.q-tabs {
  .q-tab {
    @apply rounded-full text-white;
    background-color: $primary-color;
  }
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_ed8888/assets/css/_variable.scss"

.bg-active-tab
  background: $pink-shadow-color !important


.account,
.games
  font-weight: 400
  font-size: 0.875rem
  line-height: 1.0625rem
  color: #fd857b
.stake
  font-weight: 700
  font-size: 1rem
  line-height: 1.3125rem
  color: #fd857b
.payout
  font-weight: 700
  font-size: 1rem
  line-height: 1.3125rem
  color: #ff4d00
  &.green
    color: #4cc700

.rank-board-wrapper
  @apply relative mt-10
  width: 100%
  +phone-width
    @apply mt-4

  :deep(.tabs-wrapper)
      @apply absolute right-0 h-12 -top-16

  &.pc .rank-wrapper
    width: 100%

    :deep(.q-tab-panels)
      background: transparent
      .q-tab-panel
        padding: 0

    .title-wrapper
      @apply pt-2 pb-8
      display: flex
      -webkit-box-align: center
      align-items: center
      -webkit-box-pack: start
      justify-content: flex-start
      flex-flow: row

    .title
      font-weight: 590
      font-size: 1.75rem
      line-height: 2.0625rem
      color: rgb(255, 255, 255)
      margin-right: 1.5625rem

    .rank-board
      .rank-table
        width: 100%

        .rank-thead
          .rank-tr
            background: $primary-color
            margin-bottom: 5px

        .rank-tr
          width: 100%
          height: 3.125rem
          display: flex
          flex-direction: row
          flex-wrap: nowrap
          background-color: #531a1b
          margin-bottom: 10px


        .rank-th,
        .rank-td
          height: 100%
          display: flex
          align-items: center
          justify-content: center
          flex: 1

        .rank-thead
          background: $secondary-color
          color: white
          width: 100%

          .rank-th
            font-weight: 510
            font-size: 1.125rem
            line-height: 1.3125rem

        .rank-tbody
          width: 100%
          // height: calc(3.125rem * v-bind(visibleCount) / 1.5)
          &.no-data
            @apply flex flex-col items-center justify-center
            @apply font-bold text-gray-300 text-2xl
            @apply py-4 gap-4
            height: 100%
            img
             @apply max-w-[200px]

  &.h5 .rank-wrapper
    background: transparent
    width: 100%
    .tabs-wrapper
      @apply relative top-0
    :deep(.q-tabs__content)
      @apply gap-4

    :deep(.q-tab-panels)
      border-radius: 0rem 0rem 0.5rem 0.5rem
      .q-tab-panel
        padding: 0

    :deep(.q-tab)
      &.active .q-tab__label
        color: $pink-color
        font-weight: bold
      .q-tab__indicator
        color: transparent !important

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
        color: #313f56
        font-size: 4vw
        margin: 0 .5vw
        margin-bottom: 1rem
        font-weight: 860

    .rank-card-wrapper
      background: #fff
      width: 100%
      // height: calc(3.5rem * v-bind(visibleCount))
      display: flex
      flex-direction: column

      .rank-card
        display: flex
        flex-direction: column
        padding: 0.75rem 0.75rem 0.625rem
        width: 100%
        height: 3.5rem

        &.no-data
          @apply h-auto flex flex-col items-center justify-center gap-4
          img
           @apply max-w-32


  &.white-style
    width: 100%
    max-width: 100%
    .rank-wrapper
      background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 103.12%, rgba(255, 255, 255, 0.9) 103.12%), linear-gradient(rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 0.01%, rgba(245, 252, 255, 0.5) 103.12%)
      box-shadow: rgba(0, 133, 255, 0.05) 0rem 0.375rem 0.9375rem
      backdrop-filter: blur(0.7813rem)

      .title-wrapper
        justify-content: space-between
        padding: 1.5rem 0
        .title
          color: rgb(60, 72, 88)
          font-style: normal
          font-weight: 860
          font-size: 1.75rem
          :deep(span)
            color: #025be8

      .tabs-wrapper
        .tab-item > .q-tab

      .rank-board .rank-table
        background: transparent
        .rank-thead
          .rank-tr

          .rank-th
            font-weight: bold
        .rank-tbody
          .rank-tr
            border-bottom: 0
            position: relative
            &:after
              content: ""
              height: 0.0625rem
              width: 100%
              position: absolute
              left: 0
              z-index: 1
              background: linear-gradient(90.07deg, rgba(252, 252, 252, 0.5) 0.65%, rgba(166, 197, 252, 0.5) 38.62%, rgba(151, 218, 225, 0.5) 62.63%, rgba(252, 252, 252, 0.5) 100.67%)
</style>
