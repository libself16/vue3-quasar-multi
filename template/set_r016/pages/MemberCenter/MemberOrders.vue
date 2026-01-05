<template>
  <q-form class="order-wrapper" @submit="handleFormSubmit">
    <BackBtn />
    <div class="order-content">
      <h2 class="order-title">{{ $t("menu.order") }}</h2>
      <div class="search-type-btns">
        <q-btn
          v-for="item in searchTabs"
          :key="item.value"
          :label="$t(item.label)"
          class="btn-type"
          :class="{ active: pendingOrderState.query.search_type === item.value }"
          @click="pendingOrderState.query.search_type = item.value"
        />
      </div>
      <div class="date-type-btns">
        <q-radio
          v-for="item in dayTypeTabs"
          :key="item.value"
          v-model="pendingOrderState.query.dateType"
          :val="item.value"
          :label="$t(item.label)"
          class="radio-type"
        />
      </div>
      <div class="date-input-content">
        <label class="date-input-content-title">{{ $t("common.btn.searchDate") }}</label>
        <div class="date-picker-row">
          <q-input
            v-model="pendingOrderState.query.start_date"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            :rules="[Rules.required()]"
            class="form-input"
            no-error-icon
            hide-bottom-space
          >
            <template v-slot:append>
              <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
            </template>
            <q-menu>
              <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD" color="date"> </q-date>
            </q-menu>
          </q-input>
          <div class="date-picker-label-to">{{ $t("common.btn.to") }}</div>

          <q-input
            v-model="pendingOrderState.query.end_date"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            :rules="[Rules.required()]"
            class="form-input"
            no-error-icon
            hide-bottom-space
          >
            <template v-slot:append>
              <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
            </template>
            <q-menu>
              <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD" color="date"> </q-date>
            </q-menu>
          </q-input>

          <q-btn type="submit" class="btn-submit hide-hover" :label="$t('common.btn.search')" />
        </div>
      </div>

      <q-table
        v-if="isDesktop"
        square
        hide-pagination
        row-key="id"
        ref="tableRef"
        :rows="pendingOrderState.list"
        :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 10]"
        :columns="tableCulumns"
        :loading="isLoading"
        class="custom-table custom-scroll-container"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="red" />
        </template>
        <template #body="props">
          <q-tr>
            <q-td key="type" :props="props">
              {{ $t(PENDING_SEARCH_TYPE.I18nKeys[props.row.order_type as PENDING_SEARCH_TYPE.Enums]) }}
            </q-td>
            <q-td key="no" :props="props">
              {{ props.row.trans_code }}
            </q-td>
            <q-td key="cashFlowType" :props="props">
              {{ getPaymentTypeName(props.row.payment_type) }}
            </q-td>
            <q-td key="paymentProvider" :props="props">
              {{ props.row.payment_gateway_name }}
            </q-td>
            <q-td key="currency" :props="props">
              {{ currencyName(props.row.currency) }}
            </q-td>

            <q-td key="amount" :props="props">
              {{ moneyFormat(props.row.amount, 2) }}
            </q-td>
            <q-td key="actualAmount" :props="props">
              {{ moneyFormat(props.row.actual_amount, 2) }}
            </q-td>
            <q-td key="dateOfApplication" :props="props">
              {{ dateformat(props.row.submit_date, "YYYY-MM-DD HH:mm:ss") }}
            </q-td>
            <q-td key="status" :props="props">
              <span
                class="status-text"
                :class="{
                  confirmed: props.row.status === PENDING_STATUS.Enums.confirmed,
                  rejected: props.row.status === PENDING_STATUS.Enums.rejected,
                  cancel: props.row.status === PENDING_STATUS.Enums.cancel
                }"
              >
                {{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}
              </span>
            </q-td>
            <q-td key="cancel" :props="props" class="cancel">
              <q-btn
                :disabled="props.row.status !== PENDING_STATUS.Enums.Pending"
                class="column-btn"
                @click="pendingOrderCancel(props.row)"
                :label="$t('tableHeader.cancel')"
              />
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          {{ $t("tableHeader.no_data") }}
        </template>
      </q-table>

      <div v-else class="mobile-list-wrapper">
        <q-list v-if="pendingOrderState.list.length" class="mobile-list">
          <div v-for="(history, index) in pendingOrderState.list" :key="index" class="w-full">
            <div class="mobile-item-top">
              <div class="mobile-item-top-left">{{ currencyName(history.currency) }}</div>
              <div class="mobile-item-top-right">
                {{ dateformat(history.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}
              </div>
            </div>
            <q-expansion-item dense dense-toggle expand-separator class="mobile-item" header-class="mobile-item-header">
              <template v-slot:header>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("tableHeader.status") }}</div>
                  <div
                    class="header-item-value status-text"
                    :class="{
                      confirmed: history.status === PENDING_STATUS.Enums.confirmed,
                      rejected: history.status === PENDING_STATUS.Enums.rejected,
                      cancel: history.status === PENDING_STATUS.Enums.cancel
                    }"
                  >
                    {{ $t(PENDING_STATUS.I18nKeys[history.status as PENDING_STATUS.Enums]) }}
                  </div>
                  <div class="header-item-title secound-row">{{ $t("tableHeader.type") }}</div>
                  <div class="header-item-value">
                    {{ $t(PENDING_SEARCH_TYPE.I18nKeys[history.order_type as PENDING_SEARCH_TYPE.Enums]) }}
                  </div>
                </div>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("tableHeader.amount") }}</div>
                  <div class="header-item-value">{{ moneyFormat(history.amount) }}</div>

                  <div class="header-item-title secound-row">{{ $t("tableHeader.cashFlowType") }}</div>
                  <div class="header-item-value">
                    {{ getPaymentTypeName(history.payment_type as FUND_METHOD_TYPE.Enums) }}
                  </div>
                </div>
              </template>
              <q-list class="mobile-item-body">
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.no") }}</span>
                  <span class="body-item-value"> {{ history.trans_code }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.paymentProvider") }}</span>
                  <span class="body-item-value"> {{ history.payment_gateway_name }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.dateOfApplication") }}</span>
                  <span class="body-item-value">
                    {{ dateformat(history.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}
                  </span>
                </q-item>
                <div class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.cancel") }}</span>
                  <span>
                    <q-btn
                      :disabled="history.status !== PENDING_STATUS.Enums.Pending"
                      class="column-btn"
                      @click="pendingOrderCancel(history as any)"
                      :label="$t('tableHeader.cancel')"
                    />
                  </span>
                </div>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>
        <div v-else class="mobile-no-data">{{ $t("tableHeader.no_data") }}</div>
      </div>

      <div v-if="pendingOrderState.pagination.totalPage > 1" class="custom-pagination">
        <q-pagination
          v-model="pendingOrderState.pagination.page"
          :max="pendingOrderState.pagination.totalPage"
          direction-links
          icon-prev="fa-solid fa-caret-left"
          icon-next="fa-solid fa-caret-right"
          active-color="pagination-active"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { QTableProps } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useCommon } from "src/common/hooks/useCommon"
import { PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES, FUND_METHOD_TYPE } from "src/common/utils/constants"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const Rules = useRule()
const { moneyFormat } = useCommon()
const { isDesktop } = useMediaQuery()

const {
  isLoading,
  pendingTableColumns,
  pendingOrderState,
  initPendingOrderQuery,
  getPendingOrderList,
  handlePagination,
  getPaymentTypeName,
  currencyName,
  searchTabs,
  handleFormSubmit,
  pendingOrderCancel
} = usePendingOrder()

const tableCulumns = computed<QTableProps["columns"]>(() => [
  ...(pendingTableColumns.value || []),
  {
    name: "cancel",
    field: "cancel",
    align: "center",
    label: t("tableHeader.cancel")
  }
])

const dayTypeTabs = computed(() => [
  {
    label: REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays],
    value: REPORT_DATE_TYPES.Enums.LastSevenDays
  },
  {
    label: REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastForuteenDays],
    value: REPORT_DATE_TYPES.Enums.LastForuteenDays
  },
  {
    label: REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays],
    value: REPORT_DATE_TYPES.Enums.LastThirtyDays
  }
])

const tableRef = ref()

const handleCancelBet = (row: any) => {
  console.log(row)
}

onMounted(async () => {
  initPendingOrderQuery()
  pendingOrderState.query.search_type = PENDING_SEARCH_TYPE.Enums.All
  pendingOrderState.pagination.rowsPerPage = 10
  pendingOrderState.query.size = 10
  await getPendingOrderList()
})
</script>

<style lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
.q-menu {
  .bg-date {
    background-color: $primary04;
  }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.order-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .order-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .order-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .column-btn {
      @include fontStyle();
      padding: 0.25rem 0.625rem;
      min-height: auto;
      border-radius: 0.625rem;
      background: $neutral01;
      color: $primary04;

      &:disabled {
        color: $neutral05;
        opacity: 1 !important;
      }

      @include phone-width {
        padding: 0.375rem 0.625rem;
      }
    }

    :deep(.date-input-content) {
      .date-picker-row {
        .q-icon {
          color: $neutral06 !important;
        }
      }
    }
  }
}
</style>
