<template>
  <div class="transaction-history-list">
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
              <div class="table-title">
                {{ $t("menu.transactionDetails") }}
              </div>
              <div class="flex">
                <div class="item-title blue-label">
                  {{ $t("tableHeader.paymentProvider") }}
                </div>
                <div class="item-content">
                  {{ pending.payment_gateway_name }}
                </div>
              </div>
              <div class="flex odd-bg">
                <div class="item-title blue-label">
                  {{ $t("tableHeader.currency") }}
                </div>
                <div class="item-content">
                  {{ currencyName(pending.currency) }}
                </div>
              </div>
              <div class="flex">
                <div class="item-title blue-label">
                  {{ $t("tableHeader.amount") }}
                </div>
                <div class="item-content">
                  {{ moneyFormat(pending.amount, 2) }}
                </div>
              </div>
              <div class="flex odd-bg">
                <div class="item-title blue-label">
                  {{ $t("tableHeader.actualAmount") }}
                </div>
                <div class="item-content">
                  {{ moneyFormat(pending.actual_amount, 2) }}
                </div>
              </div>
              <div class="flex">
                <div class="item-title blue-label">
                  {{ $t("tableHeader.dateOfApplication") }}
                </div>
                <div class="item-content">
                  {{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="no-data">
      <p class="text-center">
        {{ $t("tableHeader.no_data") }}
      </p>
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
@import "app/template/set_DBO88/assets/css/text.scss";

.transaction-history-list {
  @apply my-4 p-[1.5rem] rounded-[.625rem];
  background: #24262b;

  .no-data {
    @apply py-2 rounded-md;
    border: 1px solid $primary-color;
  }

  .expansion-item {
    @apply rounded-[.625rem];
    background: #191b1e;
    border: 1px solid $primary-color;
    outline: 1px solid $primary-color;
    outline-offset: 2px;
    color: $text-white;

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
    @apply flex flex-col pb-2;

    .header-title {
      @apply flex justify-center items-center text-[.875rem] p-2;
      border-bottom: 1px solid $primary-color;
    }

    .header-content {
      @apply flex p-[.625rem] max-h-[9rem];

      .content-left,
      .content-right {
        @apply flex flex-col w-1/2 gap-[.625rem];
      }

      .content-left {
        border-right: 0.0625rem solid $primary-color;
      }

      .content-right {
        @apply items-end;
      }

      .currency-btn {
        @apply font-bold text-[.75rem] mr-[.25rem];
        background: #e91e2b;
        padding: 0.0625rem 0.3125rem;
        border-radius: 0.125rem;
      }
    }

    .header-bottom {
      @apply flex justify-center text-[.75rem];

      .more-btn {
        @apply flex justify-center items-center w-[5.75rem] h-[1.5rem];
        border-radius: 0.3125rem;
        background: $primary-color;

        @include iphone-width {
          @apply w-[4.5rem] ml-2 mt-1 pr-1;
        }
      }

      &:hover {
        @apply text-white;
      }
    }
  }

  .expansion-card {
    border-top: 0.0625rem solid $primary-color !important;
    background: #191b1e;

    .transaction-table {
      @apply m-4;
      border: 1px solid $primary-color;
    }

    .table-title {
      @apply flex justify-center items-center font-bold text-white p-[.625rem];
      background: $primary-color;
    }

    .odd-bg {
      border-top: 0.0625rem solid $primary-color;
      border-bottom: 0.0625rem solid $primary-color;
    }

    .item-title {
      @apply w-4/12 p-[.625rem];
      border-right: 0.0625rem solid $primary-color;
    }

    .item-content {
      @apply flex w-8/12 items-center p-[.625rem];
    }
  }
}
</style>
