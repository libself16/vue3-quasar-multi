<template>
  <div class="desktop-history-list">
    <div class="table-wrapper">
      <table v-if="hasValidData(moneyHistoryStateList)" class="history-table">
        <thead>
          <tr>
            <th>{{ $t("tableHeader.type") }}</th>
            <th>{{ $t("tableHeader.dateAndTime") }}</th>
            <th>{{ $t("tableHeader.amount") }}</th>
            <th>{{ $t("tableHeader.balance") }}</th>
            <th v-if="agentType === AGENT_TYPE.Enums.Cash">{{ $t("tableHeader.currency") }}</th>
            <th>{{ $t("tableHeader.accountVariableObject") }}</th>
            <th>{{ $t("tableHeader.amountBeforeChanges") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in moneyHistoryStateList" :key="history.id">
            <td class="text-center">
              {{ $t(actionType.I18nKeys[history.action_type as unknown as ACTION_TYPE.Enums]) }}
            </td>
            <td class="text-center">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</td>
            <td
              class="text-right"
              :class="{
                'text-green': Number(history.amount) >= 0,
                'text-red': Number(history.amount) < 0
              }"
            >
              {{ moneyFormat(history.amount ?? 0, 2) }}
            </td>
            <td class="text-right">
              {{ moneyFormat(history.after_balance ?? 0, 2) }}
            </td>
            <td class="text-center" v-if="agentType === AGENT_TYPE.Enums.Cash">
              {{ history.currency_code }}
            </td>
            <td>
              <span>{{ history.game_name }}</span>
              <span>[ {{ history.transaction_code }} ]</span>
            </td>
            <td class="text-right">
              {{ moneyFormat(history.before_balance ?? 0, 2) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">
        <p class="text-center">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as Response from "src/api/response.type"
import { ACTION_TYPE, AGENT_TYPE } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useEnv } from "src/common/hooks/useEnv"

defineProps<{
  moneyHistoryStateList: Response.MoneyHistory[]
}>()

const hasValidData = (list: Response.MoneyHistory[]): boolean => {
  return list.length > 0
}

const { moneyFormat } = useCommon()
const { envData } = useEnv()
const { agentType } = envData()

const actionType = ACTION_TYPE
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.desktop-history-list {
  margin: 1rem 0;

  .table-wrapper {
    @apply max-w-full overflow-x-auto p-[1.5rem] rounded-md;
    color: $text-white;
    background: #24262b;
  }

  .history-table {
    @apply w-full;
    background: #212529;
    border: 1px solid $primary-color;
    border-collapse: separate;
    border-spacing: 0;

    th,
    td {
      padding: 0.75rem;
      font-size: 0.875rem;
    }

    th {
      background: $primary-color;

      &:last-child {
        @apply border-r-0;
      }
    }

    td {
      @apply border-r border-b;
      border-color: $primary-color;

      &:last-child {
        @apply border-r-0;
      }
    }

    tr:last-child td {
      @apply border-b-0;
    }
  }

  .no-data {
    @apply py-2 rounded-md;
    border: 1px solid $primary-color;
  }
}
</style>
