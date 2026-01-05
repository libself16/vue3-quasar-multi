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
            <td class="text-center">
              <q-btn
                :disabled="cancelBtnDisable(pending)"
                class="column-btn"
                @click="cancelOrder(pending as any)"
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
import { defineEmits, defineProps, watch } from "vue"

const props = defineProps<{ moneyPendingStateList: Response.MoneyPending[] }>()

const emits = defineEmits(["cancelOrder"])

const hasValidData = (list: Response.MoneyPending[]): boolean => {
  return list.length > 0 && list[0].trans_code !== ""
}

const { moneyFormat } = useCommon()
const { cancelBtnDisable, currencyName, getPaymentTypeName, pendingOrderCancel } = usePendingOrder()

const cancelOrder = async (order: Response.MoneyPending) => {
  await pendingOrderCancel(order as any)
  emits("cancelOrder")
}

watch(
  () => props.moneyPendingStateList,
  () => {
    console.log("moneyPendingStateList", props.moneyPendingStateList)
  }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.column-btn {
  width: 60px;
  padding: 4px;
  border-radius: 0.5rem;
  text-wrap: balance;
  background: linear-gradient(270deg, #fd857b 0%, #d35861 100%);
  color: #fff;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
}

.desktop-pending-transaction-list {
  margin: 1rem 0;

  .table-wrapper {
    @apply max-w-full overflow-x-auto;
  }

  .pending-table {
    @apply w-full;
    background: $white-color;
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
      border-color: $white-color;
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
  }

  .no-data {
    @apply py-2 rounded-md;
    border: 1px solid $primary-color;
  }
}
</style>
