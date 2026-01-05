<template>
  <div class="desktop-pending-transaction-list">
    <div class="table-wrapper">
      <table v-if="hasValidData(moneyPendingStateList)" class="pending-table">
        <thead>
          <tr>
            <th>{{ $t("tableHeader.no") }}</th>
            <th>{{ $t("tableHeader.status") }}</th>
            <th>{{ $t("tableHeader.cashFlowType") }}</th>
            <th>{{ $t("tableHeader.paymentProvider") }}</th>
            <th>{{ $t("tableHeader.currency") }}</th>
            <th>{{ $t("tableHeader.amount") }}</th>
            <th>{{ $t("tableHeader.actualAmount") }}</th>
            <th>{{ $t("tableHeader.dateOfApplication") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pending, index) in moneyPendingStateList" :key="index">
            <td>{{ pending.trans_code }}</td>
            <td
              class="text-center"
              :class="{
                'text-red': pending.status === PENDING_STATUS.Enums.rejected,
                'text-green': pending.status !== PENDING_STATUS.Enums.rejected
              }"
            >
              {{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}
            </td>
            <td class="text-center">
              {{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}
            </td>
            <td class="text-center">{{ pending.payment_gateway_name }}</td>
            <td class="text-center">{{ currencyName(pending.currency) }}</td>
            <td class="text-right">{{ moneyFormat(pending.amount, 2) }}</td>
            <td class="text-right">{{ moneyFormat(pending.actual_amount, 2) }}</td>
            <td class="text-center">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</td>
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
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { PENDING_SEARCH_TYPE, PENDING_STATUS, FUND_METHOD_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import { dateformat } from "src/common/utils/dayjsUtils"

defineProps<{ moneyPendingStateList: Response.MoneyPending[] }>()

const hasValidData = (list: Response.MoneyPending[]): boolean => {
  return list.length > 0 && list[0].trans_code !== ""
}

const { moneyFormat } = useCommon()
const { currencyName, getPaymentTypeName } = usePendingOrder()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.desktop-pending-transaction-list {
  margin: 1rem 0;

  .table-wrapper {
    @apply max-w-full overflow-x-auto p-[1.5rem] rounded-md;
    color: $text-white;
    background: #24262b;
  }

  .pending-table {
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
      @apply text-white;
      background: $primary-color;

      &:last-child {
        @apply border-r-0;
      }
    }

    td {
      @apply border-r;
      border-color: $primary-color;

      &:last-child {
        @apply border-r-0;
      }
    }
  }

  .no-data {
    @apply py-2 rounded-md;
    border: 1px solid $primary-color;
  }
}
</style>
