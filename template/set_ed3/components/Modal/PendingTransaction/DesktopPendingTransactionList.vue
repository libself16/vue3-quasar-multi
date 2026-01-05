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
            <th>{{ $t("tableHeader.cancel") }}</th>
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
            <td>
              <q-btn
                :disabled="cancelBtnDisable(pending)"
                class="btn-cancel"
                @click="emitCancelPending(pending)"
                :label="$t('tableHeader.cancel')"
              />
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
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_STATUS } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"

defineProps<{ moneyPendingStateList: Response.MoneyPending[] }>()
// 修改 emit 定義
const emit = defineEmits<{
  (e: "cancelPending", pending: Response.MoneyPending): void
}>()

const hasValidData = (list: Response.MoneyPending[]): boolean => {
  return list.length > 0 && list[0].trans_code !== ""
}

const { moneyFormat } = useCommon()
const { cancelBtnDisable, currencyName, getPaymentTypeName } = usePendingOrder()

// 修改 emitCancelPending 函數
const emitCancelPending = (pending: Response.MoneyPending) => {
  emit("cancelPending", pending)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";

.desktop-pending-transaction-list {
  margin: 1rem 0;

  .table-wrapper {
    @apply max-w-full overflow-x-auto;
  }

  .pending-table {
    @apply w-full;
    background: $primary-color-light;
    border: 1px solid $primary-color;
    border-collapse: separate;
    border-spacing: 0;

    thead {
      background: $history-search-wrapper-bg;
    }

    th,
    td {
      padding: 0.75rem;
      font-size: 0.875rem;
    }

    th {
      @apply border-r border-b text-white;
      border-color: $green10;
      background: #023c2d;

      &:last-child {
        @apply border-r-0;
      }
    }

    td {
      @apply border-r;
      border-color: $green10;
      background: $green03;

      &:last-child {
        @apply border-r-0;
      }
    }
  }

  .no-data {
    @apply py-2 rounded-md;
    border: 1px solid $green04;
  }
}

.btn-cancel {
  background: $gradient03;
  color: $green10;
}
</style>
