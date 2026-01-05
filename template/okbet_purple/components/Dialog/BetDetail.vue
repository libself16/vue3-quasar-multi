<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="bet-detail-container overflow-hidden" :class="{ h5: $q.platform.is.mobile }">
      <q-card-section class="flex items-center q-mb-none bet-detail-header">
        <img :src="betDetailIcon()" alt="bet-detail" class="icon" />
        <span class="title"> {{ $t("modal.betsDetails") }} </span>
        <q-space />
        <q-btn class="text-lg hide-hover btn-close" icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="betDetail" class="bet-detail-body">
        <div class="flex items-center flex-nowrap">
          <div class="w-20 h-20">
            <img
              :src="getGameImage(betDetail)"
              :alt="betDetail.game_code"
              class="game-img"
              @error="setDefaultGameImg"
            />
          </div>
          <div class="ml-3 detail">
            <p>{{ betDetail.game_name }}</p>
            <p>{{ $t("common.player") }} : {{ betDetail.member_account }}</p>
            <p>
              {{ $t("modal.time") }} : {{ $t(monthI18n) }}
              {{ dateformat(betDetail.settled_at ?? "", "DD,YYYY HH:mm:ss") }}
            </p>
          </div>
        </div>
        <div class="mt-3 flex justify-between items-center">
          <div class="bet-box">
            <span>{{ $t("common.stake") }}</span>
            <span class="betAmount">
              {{ activeWalletLabel }}
              {{ moneyFormat(betDetail.bet_amount, 2) }}
            </span>
          </div>
          <div class="bet-box">
            <span>{{ $t("common.payout") }}</span>
            <span class="payoutAmount">
              {{ activeWalletLabel }}
              {{ moneyFormat(betDetail.prize_amount, 2) }}
            </span>
          </div>
        </div>
        <q-btn
          :label="$t('game.play_now')"
          class="btn-action hide-hover"
          block
          rounded
          unelevated
          @click="
            openGame(
              betDetail.product_code,
              betDetail.game_code,
              gameTypeState.map[betDetail.game_type].game_type,
              true
            )
          "
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { dateformat, monthMap } from "src/common/utils/dayjsUtils"
import * as Response from "src/api/response.type"
import { useUserInfo } from "src/common/composables/useUserInfo"

const eventbus = injectStrict(EventBusKey)
const { setDefaultGameImg } = useCommonImg()
const { betDetailIcon } = useSiteImg()
const { getGameImage, openGame, gameTypeState } = useGame()
const { moneyFormat } = useCommon()
const { activeWalletLabel } = useUserInfo()

const dialog = ref(false)
const betDetail = ref<Response.RankItem | null>(null)

const monthI18n = computed(() => {
  if (!betDetail.value) return ""

  const monthStr = monthMap[dateformat(betDetail.value.settled_at ?? "", "MM")]
  if (!monthStr) return ""

  return `month.${monthStr}`
})

onMounted(() => {
  eventbus.on("openBetDetail", (show: boolean, data?: Response.RankItem) => {
    if (show && data) {
      dialog.value = true
      betDetail.value = data
      return
    }

    dialog.value = false
    betDetail.value = null
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";

.bet-detail-container {
  width: 100%;
  max-width: 26.75rem;
  border-radius: 1.5rem;
  height: 21.5625rem;
  background: $bg-primary;

  .bet-detail-header {
    background: $bg-secondary;
    @apply p-5;
    .icon {
      width: 1.875rem;
      height: 1.875rem;
    }

    .btn-close {
      color: $text-light-secondary;
    }

    .title {
      color: $text-light-secondary;
      font-size: 1.125rem;
      text-transform: capitalize;
      overflow-wrap: break-word;
      margin-left: 0.75rem;
    }
  }

  .bet-detail-body {
    @apply p-5 rounded-2xl flex flex-col relative;
    .game-img {
      @apply w-full h-full rounded-2xl;
    }
    .detail {
      color: $text-light-secondary;
      p:nth-of-type(1) {
        font-size: 1.125rem;
        font-weight: 700;
        text-transform: capitalize;
        overflow-wrap: break-word;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 18.5rem;
        margin: 4px 0;
      }
      p {
        font-size: 12px;
        font-weight: 400;
        overflow-wrap: break-word;
        margin: 4px 0px;
      }
    }
    .bet-box {
      width: 11.75rem;
      height: 4.25rem;
      border-radius: 0.5rem;
      border: 1px solid $border-dark-secondary;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        color: $text-light-secondary;
        font-size: 14px;
        line-height: 20px;
        height: 20px;
        padding-bottom: 4px;
        text-transform: capitalize;
        overflow-wrap: break-word;
        display: flex;
        align-items: center;
        &.betAmount {
          font-weight: 700;
          color: $text-light-secondary;
        }
        &.payoutAmount {
          font-weight: 700;
          color: rgb(28, 210, 25);
        }
        .q-icon {
          font-weight: 700;
        }
      }
    }
    .btn-action {
      width: 388px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      text-transform: capitalize;
      overflow-wrap: break-word;
      font-weight: 400;
      color: $text-light-secondary;
      background-color: $bg-secondary;
      border-radius: 8px;
      margin-top: 1rem;
    }
  }

  &.h5 {
    max-width: 20.375rem;
    height: 20rem;
    border-radius: 1.5rem;
    .bet-detail-header {
      @apply pl-5 pr-3 py-1;
      .btn-close {
        color: $text-light-secondary;
      }
    }
    .bet-detail-body {
      .game-img {
        border-radius: 1.25rem;
      }
      .detail {
        p:nth-of-type(1) {
          max-width: 12.125rem;
          margin: 4px 0;
        }
      }
      .bet-box {
        width: calc(50% - 0.375rem);
        height: 4.25rem;
        border-radius: 0.5rem;
        border: 2px solid $border-dark;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span {
          color: $text-light-secondary;
          font-size: 0.875rem;
          line-height: 1.125rem;
          height: 1.125rem;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
          overflow-wrap: break-word;
          &.betAmount {
            font-weight: 700;
            color: $text-light-secondary;
            margin-bottom: 0;
          }
          &.payoutAmount {
            font-weight: 700;
            color: rgb(28, 210, 25);
            margin-bottom: 0;
          }
        }
      }
    }
    .btn-action {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
