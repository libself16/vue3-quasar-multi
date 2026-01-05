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
          color="primary"
          class="btn-action hide-hover"
          block
          rounded
          unelevated
          @click="
            openGame(
              betDetail.integration_id,
              betDetail.product_code,
              betDetail.game_code,
              betDetail.game_type_id,
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
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { dateformat, monthMap } from "src/common/utils/dayjsUtils"
import { useUserInfo } from "src/common/composables/useUserInfo"
import * as Response from "src/api/response.type"

const eventbus = injectStrict(EventBusKey)
const { setDefaultGameImg } = useCommonImg()
const { betDetailIcon } = useSiteImg()
const { getGameImage, openGame, gameTypeState } = useGame()
const { moneyFormat } = useCommon()
const { activeWalletLabel } = useUserInfo()

const dialog = ref(false)
const betDetail = ref<Response.RankItem | null>(null)
const betCurrency = ref<string | null>(null)

const monthI18n = computed(() => {
  if (!betDetail.value) return ""

  const monthStr = monthMap[dateformat(betDetail.value.settled_at ?? "", "MM")]
  if (!monthStr) return ""

  return `month.${monthStr}`
})

onMounted(() => {
  eventbus.on("openBetDetail", (show: boolean, data?: Response.RankItem, currency?: string | null) => {
    if (show && data) {
      dialog.value = true
      betDetail.value = data
      betCurrency.value = currency ?? null
      return
    }

    dialog.value = false
    betDetail.value = null
    betCurrency.value = null
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/button.scss";

.bet-detail-container {
  width: 100%;
  max-width: 26.75rem;
  border-radius: 1.5rem;
  height: 21.5625rem;
  background: #e7f8e9;

  .bet-detail-header {
    @apply p-5;
    background: $primary-color;

    :deep(.q-icon) {
      color: #fafafa;
    }

    .icon {
      width: 1.875rem;
      height: 1.875rem;
    }

    .title {
      color: #fafafa;
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
      p:nth-of-type(1) {
        font-size: 1.125rem;
        color: $text-deep-ocean-color;
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
      border: 1px solid #caddc9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        color: #848484;
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
          color: #848484;
        }
        &.payoutAmount {
          font-weight: 700;
          color: $primary-color;
        }
      }
    }
    .btn-action {
      width: 388px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-light-color;
      font-size: 16px;
      text-transform: capitalize;
      overflow-wrap: break-word;
      font-weight: 400;
      background-color: $primary-color;
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
        color: #fafafa;
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
        border: 0.5px solid #caddc9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span {
          color: $text-dusty-blue-color;
          font-size: 0.875rem;
          line-height: 1.125rem;
          height: 1.125rem;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
          overflow-wrap: break-word;
          &.betAmount {
            font-weight: 700;
            color: #848484;
            margin-bottom: 0;
          }
          &.payoutAmount {
            font-weight: 700;
            color: #1fab3d;
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
