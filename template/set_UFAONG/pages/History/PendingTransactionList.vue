<template>
  <div class="transaction-history-list mt-4">
    <q-list v-if="hasValidData(moneyPendingStateList)">
      <q-expansion-item
        class="expansion-item"
        v-for="(pending, index) in moneyPendingStateList"
        :key="index"
        dense-toggle
        expand-separator
        expand-icon="none"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="header-title">
              <div>
                {{ $t("tableHeader.no") }}: <span class="font-bold">{{ pending.trans_code }}</span>
              </div>
            </div>
            <div class="header-content">
              <div class="content-left">
                <div>
                  {{ $t("tableHeader.status") }}:
                  <span
                    class="font-bold text-green"
                    :class="{ 'text-red': pending.status === PENDING_STATUS.Enums.rejected }"
                  >
                    {{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}
                  </span>
                </div>
                <div>
                  {{ $t("tableHeader.cashFlowType") }}:
                  <span class="font-bold">
                    {{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}
                  </span>
                </div>
              </div>
              <div class="content-right">
                <div>
                  {{ $t("tableHeader.type") }}:
                  <span class="font-bold">{{
                    $t(PENDING_SEARCH_TYPE.I18nKeys[pending.order_type as PENDING_SEARCH_TYPE.Enums])
                  }}</span>
                </div>
                <div>
                  <span class="currency-btn">{{ currencyName(pending.currency) }}</span>
                  <span class="font-bold">{{ moneyFormat(pending.amount, 2) }}</span>
                </div>
              </div>
            </div>
            <div class="header-bottom">
              <span class="more-btn">
                {{ $t("common.btn.moreInfo") }}
                <q-icon name="fas fa-info-circle" class="ml-2" />
              </span>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <div class="expansion-card">
            <div class="transaction-table">
              <div class="table-title odd-bg">
                {{ $t("menu.transactionDetails") }}
              </div>
              <div class="flex">
                <div class="item-title">
                  {{ $t("tableHeader.paymentProvider") }}
                </div>
                <div class="item-content">
                  {{ pending.payment_gateway_name }}
                </div>
              </div>
              <div class="flex odd-bg text-black">
                <div class="item-title">
                  {{ $t("tableHeader.currency") }}
                </div>
                <div class="item-content">
                  {{ currencyName(pending.currency) }}
                </div>
              </div>
              <div class="flex">
                <div class="item-title">
                  {{ $t("tableHeader.amount") }}
                </div>
                <div class="item-content">
                  {{ moneyFormat(pending.amount, 2) }}
                </div>
              </div>
              <div class="flex odd-bg text-black">
                <div class="item-title">
                  {{ $t("tableHeader.actualAmount") }}
                </div>
                <div class="item-content">
                  {{ moneyFormat(pending.actual_amount, 2) }}
                </div>
              </div>
              <div class="flex">
                <div class="item-title">
                  {{ $t("tableHeader.dateOfApplication") }}
                </div>
                <div class="item-content">
                  {{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}
                </div>
              </div>
              <div class="flex odd-bg text-black">
                <div class="item-title">
                  {{ $t("tableHeader.cancel") }}
                </div>
                <div class="item-content">
                  <q-btn
                    :disabled="cancelBtnDisable(pending)"
                    class="column-btn"
                    @click="cancelOrder(pending as any)"
                    :label="$t('tableHeader.cancel')"
                  />
                </div>
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
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"

defineProps<{ moneyPendingStateList: Response.MoneyPending[] }>()

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
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.column-btn {
  @apply bg-[#434141];
  width: 60px;
  padding: 4px;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
}

.expansion-item {
  ::v-deep(.q-item) {
    padding: 0 !important;
  }
  ::v-deep(.q-item__section--side) {
    padding: 0 !important;
  }
  ::v-deep(.q-icon) {
    width: 0 !important;
  }
}

.expansion-header {
  @apply flex flex-col;

  .header-title {
    @apply flex justify-center items-center text-[14px] pb-[5px];
    border-bottom: 1px solid $primary;
  }

  .header-content {
    @apply flex py-[10px] max-h-[60px];

    .content-left,
    .content-right {
      @apply flex flex-col w-1/2 gap-[10px];
    }

    .content-left {
      border-right: 0.0625rem solid $primary;
    }

    .content-right {
      @apply items-end;
    }

    .currency-btn {
      @apply font-bold text-[12px] text-black mr-[4px];
      background: $gradient-to-bottom;
      padding: 0.0625rem 0.3125rem;
      border-radius: 0.125rem;
    }
  }

  .header-bottom {
    @apply flex justify-center text-black text-[12px];

    .more-btn {
      @apply flex justify-center items-center w-[92px] h-[24px];
      border-radius: 0.3125rem;
      background: $gradient-to-bottom;
    }

    &:hover {
      @apply text-white;
    }
  }
}

.expansion-card {
  @apply mt-2 bg-[#2b2b2b];
  border-top: 0.0625rem solid $primary !important;

  .transaction-table {
    @apply mt-[20px] bg-[#494949];
    border: 0.0625rem solid $primary;
  }

  .odd-bg {
    background: $gradient-to-bottom;
  }

  .table-title {
    @apply flex justify-center items-center font-bold text-black p-[10px];
  }

  .item-title {
    @apply w-4/12 p-[10px];
    border-right: 0.0625rem solid $primary;
  }

  .item-content {
    @apply flex w-8/12 justify-end items-center p-[10px];
  }
}
</style>
