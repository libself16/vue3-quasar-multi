<template>
  <div class="order-area">
    <!-- 類型切換 -->
    <q-tabs
      v-model="pendingOrderState.query.search_type"
      :outside-arrows="false"
      :mobile-arrows="false"
      indicator-color="transparent"
      class="type-tabs"
    >
      <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
        {{ item.label }}
      </q-tab>
    </q-tabs>

    <div class="order-content">
      <div class="order-title">
        <div class="order-title-left flex items-center gap-2">
          {{ $t("menu.order") }}

          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-[var(--icon-02)] cursor-pointer hidden phone:!block"
          >
            <path
              d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
              fill="currentColor"
            />
          </svg>
          <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
            <MemberNav module="module2" />
          </q-menu>
        </div>

        <div class="order-title-right" @click="handleDateDialogShow()">
          <span> {{ pendingOrderState.query.start_date }} ~ {{ pendingOrderState.query.end_date }} </span>

          <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
        </div>
      </div>

      <q-table
        v-if="!isDown.phone"
        ref="tableRef"
        v-model:pagination="pendingOrderState.pagination"
        :rows="pendingOrderState.list"
        :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 10]"
        :columns="tableCulumns"
        row-key="id"
        :loading="isLoading"
        hide-pagination
        flat
        @request="handleTableRequest"
        class="order-table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body="props">
          <q-tr>
            <q-td key="type" :props="props">
              {{ $t(getOrderTypeKey(props.row.order_type)) }}
            </q-td>
            <q-td key="no" :props="props">
              <a @click="handleUploadDetail(props.row.trans_code, true)">{{ props.row.trans_code }}</a>
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
              <span :class="props.row.status === PENDING_STATUS.Enums.Pending ? 'text-pending' : 'text-danger'">
                {{ $t(getStatusKey(props.row.status)) }}
              </span>
            </q-td>
            <q-td key="upload" :props="props">
              <q-btn
                :disabled="props.row.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
                color="primary"
                class="detail-btn"
                @click="handleUploadDetail(props.row.trans_code, false)"
                :label="$t('tableHeader.uploadDetail')"
              />
            </q-td>
            <q-td key="cancel" :props="props">
              <q-btn
                :disabled="cancelBtnDisable(props.row)"
                class="detail-btn"
                color="primary"
                @click="pendingOrderCancel(props.row)"
                :label="$t('tableHeader.cancel')"
              />
            </q-td>
          </q-tr>
        </template>

        <template #no-data>
          <div class="no-data-container">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="no-data-img" />

            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </template>
      </q-table>

      <template v-else>
        <q-list v-if="pendingOrderState.list.length" class="mobile-order-list">
          <div v-for="(pending, index) in pendingOrderState.list" :key="index" class="w-full">
            <q-expansion-item
              dense
              expand-separator
              :header-class="[
                'mobile-item-header',
                pending.status === PENDING_STATUS.Enums.Pending ? 'pending-status' : ''
              ]"
              expand-icon="chevron_right"
              expand-icon-class="no-rotate"
            >
              <template v-slot:header>
                <div class="header-item-left">
                  <div class="currency">{{ currencyName(pending.currency) }}</div>
                  <div class="header-label">
                    <div class="top">{{ pending.trans_code }}</div>
                    <div class="bottom">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
                  </div>
                </div>

                <div class="header-item-right">
                  <div class="top">{{ moneyFormat(pending.actual_amount, 2) }}</div>
                  <div class="bottom">{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</div>
                </div>
              </template>
              <q-list class="mobile-item-body">
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.paymentProvider") }}</span>
                  <span class="body-item-value">{{ pending.payment_gateway_name }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.amount") }}</span>
                  <span class="body-item-value">{{ moneyFormat(pending.amount, 2) }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.status") }}</span>
                  <span
                    class="body-item-value"
                    :class="pending.status === PENDING_STATUS.Enums.Pending ? 'text-pending' : 'text-danger'"
                    >{{ $t(getStatusKey(pending.status)) }}</span
                  >
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.uploadDetail") }}</span>
                  <span class="body-item-value">
                    <q-btn
                      :disabled="pending.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
                      color="primary"
                      class="detail-btn"
                      :label="$t('tableHeader.uploadDetail')"
                      @click="handleUploadDetail(pending.trans_code, false)"
                    />
                  </span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.cancel") }}</span>
                  <span class="body-item-value">
                    <q-btn
                      :disabled="cancelBtnDisable(pending)"
                      color="primary"
                      class="detail-btn"
                      :label="$t('tableHeader.cancel')"
                      @click="pendingOrderCancel(pending)"
                    />
                  </span>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>

        <div v-else class="no-data-container">
          <img :src="orderImg('no-data.svg')" alt="no-data" class="no-data-img" />

          <span>{{ $t("tableHeader.noData") }}</span>
        </div>
      </template>

      <q-pagination
        v-if="pendingOrderState.pagination.totalPage"
        v-model="pendingOrderState.pagination.page"
        :max="pendingOrderState.pagination.totalPage"
        :max-pages="5"
        class="custom-pagination"
        color="grey-7"
        direction-links
        @update:model-value="handlePagination"
      />
    </div>
  </div>

  <DepositDetailUpload ref="depositDetailUploadRef" />
  <WithdrawalDetailUpload ref="withdrawalDetailUploadRef" />
  <DateDialog v-model="dateDialogShow" @reset="handleReset" @submit="handleSubmit" />
</template>
<script lang="ts" setup>
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { QTableProps, useQuasar } from "quasar"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, nextTick, onMounted, provide, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import DepositDetailUpload from "./DepositDetailUpload.vue"
import WithdrawalDetailUpload from "./WithdrawalDetailUpload.vue"
import { useEnvInfoStore } from "src/stores/envStore"
import DateDialog from "./DateDialog.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import MemberNav from "src/common/components/MemberNav/Index.vue"

const $q = useQuasar()
const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const { isDown } = useMediaQuery()
const {
  isLoading,
  cancelBtnDisable,
  pendingTableColumns,
  pendingOrderState,
  pendingOrderCancel,
  initPendingOrderQuery,
  getPendingOrderList,
  handlePagination,
  handleTableRequest,
  getPaymentTypeName,
  currencyName,
  handleDateRangePick
} = usePendingOrder()

const uploadSwitch = computed(() => Boolean(envInfo.upload_details))

// 提供 pendingOrderState 給子組件使用
provide("pendingOrderState", pendingOrderState)
provide("handleDateRangePick", handleDateRangePick)
provide("getPendingOrderList", getPendingOrderList)

// 輔助函數來處理類型轉換
const getOrderTypeKey = (orderType: any) => PENDING_SEARCH_TYPE.I18nKeys[orderType as PENDING_SEARCH_TYPE.Enums]
const getStatusKey = (status: any) => PENDING_STATUS.I18nKeys[status as PENDING_STATUS.Enums]

const tableCulumns = computed<QTableProps["columns"]>(() => [
  ...(pendingTableColumns.value || []),
  {
    name: "upload",
    field: "upload",
    align: "center",
    label: t("tableHeader.uploadDetail")
  },
  {
    name: "cancel",
    field: "cancel",
    align: "center",
    label: t("tableHeader.cancel")
  }
])

const searchTabs = computed(() => [
  {
    label: t(PENDING_SEARCH_TYPE.I18nKeys[PENDING_SEARCH_TYPE.Enums.Deposit]),
    value: PENDING_SEARCH_TYPE.Enums.Deposit
  },
  {
    label: t(PENDING_SEARCH_TYPE.I18nKeys[PENDING_SEARCH_TYPE.Enums.Withdrawal]),
    value: PENDING_SEARCH_TYPE.Enums.Withdrawal
  }
])

const dayTypeTabs = computed(() => [
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
    value: REPORT_DATE_TYPES.Enums.Today
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
    value: REPORT_DATE_TYPES.Enums.Yesterday
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
    value: REPORT_DATE_TYPES.Enums.LastSevenDays
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays]),
    value: REPORT_DATE_TYPES.Enums.LastThirtyDays
  }
])

const menuRef = ref()
const scrollAreaRef = ref()
const datePickerShow = ref(false)
const StartDatePickerShow = ref(false)
const EndDatePickerShow = ref(false)
const datePickerValue = ref({ from: pendingOrderState.query.start_date, to: pendingOrderState.query.end_date })
const dateDialogShow = ref(false)

const handleSubmit = async () => {
  dateDialogShow.value = false
  pendingOrderState.pagination.page = 1
  await getPendingOrderList()
  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const hideMenu = () => {
  menuRef.value.hide()
}

const handleReset = async () => {
  dateDialogShow.value = false
  pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  await nextTick()
  await getPendingOrderList()
}

const depositDetailUploadRef = ref()
const withdrawalDetailUploadRef = ref()

const handleUploadDetail = (transCode: string, readOnly: boolean) => {
  switch (pendingOrderState.query.search_type) {
    case PENDING_SEARCH_TYPE.Enums.Deposit:
      depositDetailUploadRef.value.openDialog(transCode, readOnly)
      break
    case PENDING_SEARCH_TYPE.Enums.Withdrawal:
      withdrawalDetailUploadRef.value.openDialog(transCode, readOnly)
      break
  }
}

const handleDateDialogShow = () => {
  dateDialogShow.value = true
}

watch(
  () => pendingOrderState.query.search_type,
  async () => {
    await nextTick()
    await getPendingOrderList()
  }
)

onMounted(async () => {
  if ($q.platform.is.mobile) {
    // 要取search type 但不要page，所以放前面
    initPendingOrderQuery()
    pendingOrderState.query.offset = 0
    pendingOrderState.pagination.page = 1
    pendingOrderState.query.size = 15
    pendingOrderState.pagination.rowsPerPage = 15
    pendingOrderState.pagination.rowsNumber = 15
  } else {
    pendingOrderState.query.size = 10
    pendingOrderState.pagination.rowsPerPage = 10
    pendingOrderState.pagination.rowsNumber = 10
    // 需要在最後rowsNumber改動會驅動handlePagination
    initPendingOrderQuery()
  }
  await getPendingOrderList()
})
</script>
<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.order-area {
  width: 100%;
  position: relative;

  .type-tabs {
    position: absolute;
    transform: translateY(-100%);
    left: 0;
    z-index: 10;

    :deep(.q-tab) {
      min-width: 6.25rem;
      min-height: auto;
      background: var(--btn-bg-07);
      color: var(--tab-text-01);
      font-size: 0.875rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      padding: 0.5rem 1.25rem;

      @include phone-width {
        min-width: 3.75rem;
      }

      &.q-tab--active {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
      }

      .q-tab__content {
        padding: 0;
      }
    }
  }

  .order-content {
    background-color: var(--bg-11);
    color: var(--text-01);
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    padding: 1.25rem;
    box-shadow: 0px -2px 8px 0px #0000004d;

    @include phone-width {
      margin-top: 2.6875rem;
      padding: 0.625rem;
    }

    .order-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.625rem;

      @include phone-width {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.625rem;
      }

      .order-title-left {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .order-title-right {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        border: 2px solid var(--input-dropdown-text-03);
        color: var(--input-dropdown-text-01);
        background: var(--input-dropdown-bg-01);
        border-radius: 0.25rem;
        padding: 0.65625rem 1rem;
        box-shadow: 0px 2px 4px 0px #00000080;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;

        @include phone-width {
          width: 100%;
          padding: 0.65625rem 1rem;
          justify-content: space-between;
          gap: 0;
        }
      }
    }

    .order-table {
      width: 100%;
      background-color: var(--bg-11);

      :deep(.q-table) {
        border-radius: 0.75rem;

        thead {
          tr {
            background: var(--bg-13);

            th {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 700;
              padding: 0.75rem 0;
              min-width: 5rem;
              max-width: 10.625rem;
              white-space: break-spaces;
            }
          }
        }

        tbody {
          background: var(--bg-14);

          td {
            color: var(--text-03);
            font-size: 0.875rem;
            font-weight: 400;
            padding: 0.75rem 0;
            min-width: 5rem;
            max-width: 10.625rem;
            white-space: break-spaces;
            word-break: break-word;

            .text-danger {
              color: var(--text-06) !important;
              font-weight: 600;
            }

            .text-pending {
              color: var(--text-04) !important;
              font-weight: 600;
            }

            .detail-btn {
              border-radius: 0.25rem;
              font-weight: 700;
              font-size: 0.75rem;
              background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
              color: var(--btn-text-01) !important;
              padding: 0.625rem;
              white-space: nowrap;
            }
          }
        }
      }
    }

    .mobile-order-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      overflow: hidden;

      :deep(.q-item) {
        &.mobile-item-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          background: var(--bg-14);
          padding: 0.625rem;
          border-bottom: 1px solid var(--text-06);

          &.pending-status {
            border-bottom: 1px solid var(--bg-line-05) !important;
          }

          .q-item__section {
            padding: 0;
            margin-left: 0.375rem;

            i {
              transform: none !important;
              transition: none !important;
            }
          }

          .header-item-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.375rem;
            flex: 1;

            .currency {
              height: 1.875rem;
              background: var(--tag-bg-01);
              color: var(--tab-text-01);
              padding: 0.5rem;
              font-size: 0.75rem;
              font-weight: 700;
              border-radius: 0.25rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .header-label,
          .header-item-right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 0.125rem;

            .top {
              color: var(--text-01);
              font-size: 0.875rem;
              font-weight: 700;
              line-height: normal;
            }

            .bottom {
              color: var(--text-03);
              font-size: 0.625rem;
              font-weight: 300;
              line-height: normal;
            }
          }
        }
      }

      :deep(.q-expansion-item__content) {
        background: var(--bg-08);
        padding: 0.625rem;

        .body-item {
          min-height: auto;
          padding: 0.25rem 0.5rem 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-bottom: 1px solid var(--bg-line-02);
          margin-bottom: 0.25rem;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .body-item-title {
            color: var(--text-03);
            font-weight: 400;
          }

          .body-item-value {
            color: var(--text-01);
            font-weight: 700;

            &.text-danger {
              color: var(--text-06) !important;
            }

            &.text-pending {
              color: var(--text-04) !important;
            }

            .detail-btn {
              border-radius: 0.25rem;
              font-weight: 700;
              font-size: 0.75rem;
              background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
              color: var(--btn-text-01) !important;
              padding: 0.625rem;
            }
          }
        }
      }
    }

    .no-data-container {
      @apply w-full flex flex-col justify-center items-center py-40;

      span {
        color: var(--text-03);
        margin-top: 1.25rem;
        font-size: 0.875rem;
        font-weight: 700;
      }

      .no-data-img {
        width: 10rem;
      }
    }

    .custom-pagination {
      margin-top: 0.625rem;
      justify-content: flex-end;

      @include phone-width {
        justify-content: center;
      }

      :deep(.q-pagination__middle) {
        gap: 2px;

        .q-btn {
          background-color: var(--secondary-08);
          color: var(--text-01);
        }
      }

      :deep(.q-btn) {
        border-radius: 0.35rem;
      }

      :deep(.q-icon) {
        color: var(--text-01);
      }

      :deep(.q-btn--standard) {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
        color: var(--text-01) !important;

        &::before {
          display: none;
        }
      }
    }
  }
}
</style>
