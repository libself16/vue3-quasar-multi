<template>
  <div class="transaction-history-list mt-4">
    <q-list v-if="hasValidData(moneyHistoryStateList)">
      <q-expansion-item
        class="expansion-item"
        v-for="history in moneyHistoryStateList"
        :key="history.id"
        dense
        dense-toggle
        expand-separator
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="flex w-full">
              <div class="flex flex-col gap-[5px] w-6/12">
                <span>
                  {{ $t("tableHeader.timeNumber") }}：{{ history.id }} ({{
                    $t(actionType.I18nKeys[history.action_type as unknown as ACTION_TYPE.Enums])
                  }})
                </span>
                <span>{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
              </div>
              <div class="history-balance flex flex-col gap-[5px] w-5/12 pr-3">
                <span
                  class="flex justify-end font-bold"
                  :class="{ 'text-green': Number(history.amount) >= 0, 'text-red': Number(history.amount) < 0 }"
                  >{{ moneyFormat(history.amount ?? 0, 2) }}</span
                >
                <div class="flex justify-between">
                  <span class="text-yellow-primary">{{ $t("tableHeader.balance") }}</span>
                  <div class="text-[#005f79]">{{ moneyFormat(history.after_balance ?? 0, 2) }}</div>
                </div>
              </div>
              <div class="flex w-1/12 items-center justify-end">
                <span class="currency-code flex items-center justify-center" v-if="isCash">
                  {{ history.currency_code }}
                </span>
              </div>
            </div>
          </q-item-section>
        </template>
        <q-card class="px-3">
          <div class="transaction-history-card">
            <div class="history-table mt-[20px]">
              <div class="flex w-full bottom-primary-border text-black">
                <span class="w-1/2 p-2 right-primary-border">
                  {{ $t("tableHeader.accountVariableObject") }}
                </span>
                <div class="flex flex-col w-1/2 p-2">
                  <span>{{ history.game_name }}</span>
                  <span>{{ `[ ${history.transaction_code} ]` }}</span>
                </div>
              </div>
              <div class="flex second-table text-black">
                <span class="w-1/2 p-2 right-primary-border">
                  {{ $t("tableHeader.amountBeforeChanges") }}
                </span>
                <span class="flex w-1/2 p-2 justify-end items-center">
                  {{ moneyFormat(history.before_balance ?? 0, 2) }}
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="no-data">
      <p class="text-center text-yellow-primary">
        {{ $t("tableHeader.no_data") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as Response from "src/api/response.type"
import { ACTION_TYPE, AGENT_TYPE } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useEnv } from "src/common/hooks/useEnv"

defineProps<{ moneyHistoryStateList: Response.MoneyHistory[] }>()

const hasValidData = (list: Response.MoneyHistory[]): boolean => {
  return list.length > 0
}

const { moneyFormat } = useCommon()
const { isCash } = useEnv()
const actionType = ACTION_TYPE
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.expansion-item {
  @apply p-4 py-4 bg-black/[3%];

  border-radius: 0.625rem;
  margin-bottom: 1rem;
  border: 1px solid $primary;

  @include phone-width {
    @apply px-[5px];

    ::v-deep(.q-item__section--side) {
      padding-left: 0;
    }
  }
}

.history-balance {
  @include phone-width {
    @apply justify-between;
  }
}

.expansion-header {
  color: #8b8b8b;
}

.transaction-history-card {
  border-top: 1px solid $secondary !important;
  margin-top: 0.25rem;
}

.history-table {
  border: 1px solid $primary;

  &:first-child {
    background: $gradient-to-bottom;
    color: $dark-bg;
  }
}

.second-table {
  background: #fff !important;
}

.currency-code {
  @apply font-normal px-2 text-[9px] font-bold;
  background-color: #0897be;
  color: #000;
}
</style>
