<template>
  <div class="q-pa-md q-gutter-sm" v-if="currencySupportDialog.show">
    <q-dialog v-model="currencySupportDialog.show" persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-dark text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" size="md" @click="currencySupportDialog.closeDialog">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <template v-if="isCash">
          <q-card-section class="text-lg">
            {{ $t("game.currency_modal_title") }}
          </q-card-section>
          <q-card-section class="currency-wrap">
            <div class="head">
              <div class="head-preferred">{{ $t("game.preferred") }}</div>
              <div class="head-balance">{{ $t("game.balance") }}</div>
            </div>
            <div class="body">
              <div v-for="curr in supportCurrency" :key="curr.currency_code" class="body-row">
                <div class="body-preferred">
                  <input
                    type="radio"
                    class="option-input radio"
                    name="example"
                    @click="changeCurr(curr)"
                    :checked="curr.currency_code === activeWalletCurrencyCode"
                    :disabled="!curr.balance"
                  />
                </div>
                <div class="body-balance">
                  <span>{{ curr.currency_code }}</span>
                  <span>{{ curr.balance ? curr.balance : $t("game.no_enable") }}</span>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn
              color="positive"
              :label="$t('game.play_now')"
              class="w-full text-bold uppercase"
              size="lg"
              @click="handlePlayNowClick"
            />
          </q-card-section>
        </template>
        <template v-else>
          <q-card-section>{{ $t("common.alarm.currencyNotSupport") }}</q-card-section>
        </template>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { UserWallet } from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { t } = useI18n()

const { currencySupportDialog, openGame } = useGame()
const { isCash } = useEnv()
const { userWalletMap, activeWalletCurrencyCode, inUseWallet, setUserActiveWallet } = useUserInfo()

const supportCurrency = computed(() => {
  return currencySupportDialog.currencies.map((e) => {
    if (userWalletMap.value.hasOwnProperty(e)) {
      return userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    } else {
      return {
        balance: "",
        currency_code: e,
        currency_id: 0,
        in_use: false,
        remaining_turnover: "",
        wallet_type: WALLET_TYPE.Enums.Cash
      } as UserWallet
    }
  })
})

async function changeCurr(curr: UserWallet) {
  await setUserActiveWallet(curr.currency_id)
}

const handlePlayNowClick = () => {
  if (!inUseWallet.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: t("common.alarm.pleaseUseCurrency"),
      badgeStyle: "opacity: 0"
    })
    return
  }

  if (currencySupportDialog.currencies.includes(activeWalletCurrencyCode.value)) {
    currencySupportDialog.closeDialog()
    openGame(currencySupportDialog.integrationId, currencySupportDialog.productCode, currencySupportDialog.gameCode)
  }
}

watch(
  () => currencySupportDialog.show,
  (newValue) => {
    if (newValue) {
      if (currencySupportDialog.currencies.length && supportCurrency.value.length) {
        const userOwnSupportCurrencise = supportCurrency.value.find((e) => e.balance !== "")
        if (userOwnSupportCurrencise && userOwnSupportCurrencise.currency_code !== activeWalletCurrencyCode.value) {
          changeCurr(userOwnSupportCurrencise)
        }
      }
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@mixin table-head {
  @apply px-1 py-2 text-base text-white text-center uppercase;
  background: linear-gradient(to bottom, #373636 0%, #000000 100%);
}
.gameIframe {
  width: 100%;
  height: calc(100% - 32px);
}
.currency-wrap {
  .head {
    @apply flex flex-nowrap;
    .head-preferred {
      @apply w-2/5;
      @include table-head;
      border-radius: 5px 0px 0px 0px;
    }
    .head-balance {
      @apply w-3/5 ml-1;
      @include table-head;
      border-radius: 0px 5px 0px 0px;
    }
  }
  .body {
    @apply mt-1 h-64 overflow-auto;

    .body-row {
      @apply flex flex-nowrap text-sm text-white mt-0.5 p-1;
      background-color: rgba($color: #fff, $alpha: 0.2);

      .body-preferred {
        @apply w-2/5 flex justify-center;

        .option-input {
          @apply w-6 h-6 cursor-pointer rounded-full text-white relative;
          transition: all 0.15s ease-out 0s;
          background: #cbd1d8;
          appearance: none;
          &:hover {
            background: #9faab7;
          }
          &:checked {
            background: #97c618;

            &::before {
              @apply w-full h-full flex justify-center items-center text-lg font-bold;
              content: "✔";
              font-family: "Font Awesome 5 Free";
            }

            &::after {
              -webkit-animation: click-wave 0.65s;
              -moz-animation: click-wave 0.65s;
              animation: click-wave 0.65s;
              background: #40e0d0;
              content: "";
              display: block;
              position: relative;
              z-index: 100;
            }
          }
        }
      }

      .body-balance {
        @apply w-3/5 px-2 flex justify-between;
      }
    }
  }
}
</style>
