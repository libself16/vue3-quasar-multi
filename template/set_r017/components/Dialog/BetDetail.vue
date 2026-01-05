<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="bet-detail-container overflow-hidden">
      <q-card-section class="flex items-center q-mb-none bet-detail-header">
        <img :src="betDetailIcon()" alt="bet-detail" class="icon" />
        <span class="title"> {{ $t("modal.betsDetails") }} </span>
        <q-space />
        <q-btn class="text-lg hide-hover btn-close" icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="betDetail" class="bet-detail-body">
        <div class="flex items-center flex-nowrap">
          <img :src="getGameImage(betDetail)" :alt="betDetail.game_code" class="game-img" @error="setDefaultGameImg" />
          <div class="detail">
            <p>{{ betDetail.game_name }}</p>
            <p>{{ $t("common.player") }} : {{ betDetail.member_account }}</p>
            <p>
              {{ $t("modal.time") }} : {{ $t(monthI18n) }}
              {{ dateformat(betDetail.settled_at ?? "", "DD,YYYY HH:mm:ss") }}
            </p>
          </div>
        </div>
        <div class="mt-[1.8125rem] flex justify-between items-center gap-4 flex-nowrap">
          <div class="bet-box">
            <span>{{ $t("common.stake") }}</span>
            <span class="betAmount">
              {{ activeWalletLabel }}
              {{ moneyFormat(betDetail.bet_amount, 2) }}</span
            >
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
              betDetail.integration_id,
              betDetail.product_code,
              betDetail.game_code,
              gameTypeState.map[betDetail.game_type].game_type,
              true,
              betCurrency
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
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
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
@import "app/template/set_r017/assets/css/_variable.scss";

.bet-detail-container {
  width: 100%;
  max-width: 19.3125rem;
  height: 18.875rem;
  border-radius: 1.25rem;
  background: $secondary01;

  .bet-detail-header {
    background: $secondary10;
    padding: 0.6875rem 1.0625rem 0.375rem 1.1875rem;
    .icon {
      width: 1.9688rem;
      height: 1.9688rem;
    }

    .title {
      font-family: OpenSans;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.375rem;
      color: #fafafa;
      text-transform: capitalize;
      overflow-wrap: break-word;
      margin-left: 0.5938rem;
    }

    .btn-close {
      color: #fafafa;
      max-width: 1.875rem;
      max-height: 1.9375rem;
      min-width: 1.875rem;
      min-height: 1.9375rem;
    }
  }

  .bet-detail-body {
    @apply flex flex-col relative;
    padding: 1.1875rem 1.4375rem 1.75rem 1.1875rem;
    border-radius: 1.25rem;

    .game-img {
      width: 3.6875rem;
      height: 3.625rem;
      border-radius: 0.75rem;
    }

    .detail {
      margin-left: 0.5625rem;

      p:nth-of-type(1) {
        font-family: OpenSans;
        font-weight: 700;
        font-size: 1rem;
        line-height: 1.375rem;
        color: $neutral01;
        text-transform: capitalize;
        overflow-wrap: break-word;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 13.9375rem;
      }
      p {
        font-family: OpenSans;
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1rem;
        text-transform: capitalize;
        overflow-wrap: break-word;
        color: #fff4f4;
      }
    }
    .bet-box {
      width: 7.8125rem;
      height: 4rem;
      border-radius: 0.5rem;
      border: 1px solid $neutral04;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;

      span {
        font-family: OpenSans;
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.1875rem;
        text-transform: capitalize;
        color: #ffffffa6;
        text-transform: capitalize;
        overflow-wrap: break-word;
        display: flex;
        align-items: center;
        &.betAmount {
          font-weight: 700;
          color: #fff4f4;
        }
        &.payoutAmount {
          font-weight: 700;
          color: #fff4f4;
        }
        .q-icon {
          font-weight: 700;
        }
      }
    }
    .btn-action {
      width: 100%;
      height: 2.5625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $neutral01;
      font-family: NotoSans;
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.375rem;
      text-transform: capitalize;
      overflow-wrap: break-word;
      background: $gradient01;
      border-radius: 0.25rem;
      margin-top: 1.0625rem;
    }
  }
}
</style>
