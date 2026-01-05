<template>
  <ModalBase v-model="modalShow" use-title :title="$t('member.withdrawal.balance')">
    <q-item class="balance-wrapper">
      <q-item-section class="currency-content">
        <div class="currency-head">
          <span class="head-bg head-preferred">{{ $t("game.preferred") }}</span>
          <span class="head-bg head-balance">{{ $t("game.balance") }}</span>
        </div>
        <div class="currency-list">
          <label v-for="key in Object.keys(userWalletMap)" :key="key" class="currency-item">
            <q-checkbox
              :model-value="userWalletMap[key][WALLET_TYPE.Enums.Cash].in_use"
              @update:model-value="handleWalletChange(userWalletMap[key][WALLET_TYPE.Enums.Cash])"
              class="currency-checkbox"
            ></q-checkbox>
            <div class="currency-text">
              <span class="currency-country">{{ getWalletLabel(userWalletMap[key][WALLET_TYPE.Enums.Cash]) }}</span>
              <span>{{ moneyFormat(userWalletMap[key][WALLET_TYPE.Enums.Cash].balance) }}</span>
            </div>
          </label>
        </div>
      </q-item-section>
    </q-item>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import ModalBase from "./modalBase.vue"

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const { moneyFormat } = useCommon()
const { inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()
const activeCurrencyId = ref(0)

const handleWalletChange = async (item: Response.UserWallet) => {
  if (item.in_use) return
  await setUserActiveWallet(item.currency_id)
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})

onMounted(() => {
  eventbus.on("openBalance", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.balance-wrapper {
  @apply p-[1.1vw] m-6;
  border-radius: 0.3vw;
  background-color: #051335;
  border: 0.125rem solid #a51d71;

  .currency-content {
    @apply p-[.625rem];

    .currency-head {
      @apply grid;
      grid-template-columns: 40% 60%;
      text-align: center;

      .head-bg {
        @apply text-white;
        border: 0.0625rem solid #6237f0;
        box-shadow: inset 0rem -0.125rem 0.4375rem #2b061d, inset 0rem 0.0625rem 0.1875rem 0.0625rem #ffb6e3;
        text-shadow: 0.125rem 0.125rem 0.4375rem #000;
        background: #aa1e74;
        font-size: 0.875rem;
        padding: 0.3125rem 0.625rem;
      }

      .head-preferred {
        border-radius: 0.3125rem 0rem 0rem 0rem;
      }

      .head-balance {
        @apply ml-[.1875rem];
        border-radius: 0rem 0.3125rem 0rem 0rem;
      }
    }

    .currency-list {
      @apply mt-[0.3125rem];

      .currency-item {
        @apply grid items-center justify-between mb-[.1875rem] p-[.25rem];
        grid-template-columns: 20% 75%;
        background: #09112b;

        .currency-checkbox {
          @apply mb-3;

          ::v-deep(.q-checkbox__inner) {
            &:before {
              display: none;
            }
          }
          ::v-deep(.q-checkbox__inner) {
            @apply w-[1.875rem] h-[1.875rem];
            border-radius: 50%;
          }
          ::v-deep(.q-checkbox__bg) {
            @apply w-[1.875rem] h-[1.875rem];
            border-radius: 50%;

            .q-checkbox__svg {
              @apply w-[1.25rem] h-[1.25rem] !important;
              transform: translate(10%, 10%);
            }
          }
          ::v-deep(.q-checkbox__inner--falsy) {
            color: #cbd1d8;
            .q-checkbox__bg {
              background-color: #cbd1d8;
            }
          }
          ::v-deep(.q-checkbox__inner--truthy) {
            color: #aa1e74;
          }
        }

        .currency-text {
          @apply flex justify-between p-[.3125rem] ml-[.1875rem];

          .currency-country {
            @apply font-bold;
            color: #73a9ff;
          }
        }
      }
    }
  }
}
</style>
