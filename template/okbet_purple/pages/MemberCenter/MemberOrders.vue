<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :title-i18n="PENDING_SEARCH_TYPE.I18nTitle[pendingOrderState.query.search_type]"
    variant="purple-dark"
  >
    <div class="h5-order-container">
      <q-form @submit="handleSubmit">
        <!-- 時間選擇 -->
        <div class="date-picker-container">
          <div class="date-container">
            <div class="date-input-item">
              <div class="text">{{ $t("tableHeader.startDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.start_date"
                readonly
                class="date-input"
                :class="{ active: StartDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="StartDatePickerShow = true" @hide="StartDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD" minimal />
                </q-menu>
              </q-input>
            </div>
            <div class="date-input-item right">
              <div class="text">{{ $t("tableHeader.endDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.end_date"
                readonly
                class="date-input"
                :class="{ active: EndDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="EndDatePickerShow = true" @hide="EndDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD" minimal />
                </q-menu>
              </q-input>
            </div>
          </div>
          <q-btn color="submit search-btn" type="submit" class="btn-submit">{{ $t("common.btn.search") }}</q-btn>
        </div>
        <div class="report-content">
          <!-- 卡片列表 -->
          <q-scroll-area
            v-if="pendingOrderState.list.length"
            @scroll="handleScroll"
            :visible="false"
            ref="scrollAreaRef"
          >
            <q-expansion-item
              v-for="(pending, index) in pendingOrderState.list"
              :key="index"
              switch-toggle-side
              dense
              dense-toggle
              default-opened
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section class="title-section">
                  <span class="title">{{ $t("tableHeader.no") }} : {{ pending.trans_code }}</span>
                  <span class="text phone-hide">{{
                    $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums])
                  }}</span>
                </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.cashFlowType") }}</span>
                  <span class="text">{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.paymentProvider") }}</span>
                  <span class="text">{{ pending.payment_gateway_name }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ currencyHeader }}</span>
                  <span class="text">{{ currencyName(pending.currency) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.amount") }}</span>
                  <span class="text">{{ moneyFormat(pending.amount, 2) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.actualAmount") }}</span>
                  <span class="text">{{ moneyFormat(pending.actual_amount, 2) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.dateOfApplication") }}</span>
                  <span class="text">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                </q-card-section>
                <q-card-section class="status">
                  <span class="title">{{ $t("tableHeader.status") }}</span>
                  <span class="text">{{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.cancel") }}</span>
                  <span class="text">
                    <q-btn
                      :disabled="pending.status !== PENDING_STATUS.Enums.Pending"
                      class="column-btn"
                      @click="pendingOrderCancel(pending as any)"
                      :label="$t('tableHeader.cancel')"
                    />
                  </span>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <div class="footer">
              {{ $t("member.mail.noMoreDataToDisplay") }}
            </div>
          </q-scroll-area>
          <!-- no data -->
          <div v-else class="no-data">
            <img :src="memberImg('fund-no-data.png')" alt="no-data" />
            <p>{{ $t("tableHeader.noContent") }}</p>
          </div>
        </div>
      </q-form>
    </div>
  </HeaderTitleBack>
  <div v-else class="pc-order-container">
    <q-form @submit="handleSubmit" @reset="handleReset">
      <p class="pending-title">{{ $t("menu.order") }}</p>
      <!-- 類型切換 -->
      <q-tabs
        v-model="pendingOrderState.query.search_type"
        :outside-arrows="false"
        :mobile-arrows="false"
        class="type-tabs"
      >
        <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
          {{ item.label }}
        </q-tab>
      </q-tabs>
      <!-- 表單 -->
      <q-table
        :rows="pendingOrderState.list"
        :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 10]"
        :columns="tableCulumns"
        row-key="id"
        v-model:pagination="pendingOrderState.pagination"
        :loading="isLoading"
        hide-pagination
        @request="handleTableRequest"
        flat
        class="order-table-container custom-scroll-container"
      >
        <template v-slot:loading>
          <q-inner-loading showing />
        </template>
        <!-- 時間選擇 -->
        <template #top>
          <div class="flex items-center w-full text-base">
            <p class="mr-1 font">{{ $t("member.profile.date") }}:</p>
            <q-btn
              flat
              square
              class="min-h-0 p-0 capitalize border-b border-solid hide-hover border-b-gray-300 date-font"
              :icon-right="datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'"
              >{{ pendingOrderState.query.start_date }} {{ $t("common.btn.to") }} {{ pendingOrderState.query.end_date }}
              <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
                <q-date
                  v-model="datePickerValue"
                  range
                  mask="YYYY-MM-DD"
                  minimal
                  @range-end="hideMenu"
                  @update:model-value="handleDateRangePick"
                />
              </q-menu>
            </q-btn>
          </div>
          <div class="flex items-center justify-between w-full mt-8 mb-5">
            <q-btn-toggle
              v-model="pendingOrderState.query.dateType"
              no-caps
              unelevated
              class="toggle-date-picker h-9 font"
              :options="dayTypeTabs"
            />
            <div class="flex items-center">
              <q-btn
                type="submit"
                class="text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font search-btn"
                >{{ $t("common.btn.search") }}</q-btn
              >
              <q-btn
                outline
                type="reset"
                class="ml-2 text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font reset-btn"
                >{{ $t("common.btn.reset") }}</q-btn
              >
            </div>
          </div>
        </template>
        <!-- table data -->
        <template #body="props">
          <q-tr>
            <q-td key="type" :props="props" class="custom-td">
              {{ $t(PENDING_SEARCH_TYPE.I18nKeys[props.row.order_type as PENDING_SEARCH_TYPE.Enums]) }}
            </q-td>
            <q-td key="no" :props="props" class="custom-td">
              {{ props.row.trans_code }}
            </q-td>
            <q-td key="cashFlowType" :props="props" class="custom-td">
              {{ getPaymentTypeName(props.row.payment_type) }}
            </q-td>
            <q-td key="paymentProvider" :props="props" class="custom-td">
              {{ props.row.payment_gateway_name }}
            </q-td>
            <q-td key="currency" :props="props" class="custom-td">
              {{ currencyName(props.row.currency) }}
            </q-td>

            <q-td key="amount" :props="props" class="custom-td">
              {{ moneyFormat(props.row.amount, 2) }}
            </q-td>
            <q-td key="actualAmount" :props="props" class="custom-td">
              {{ moneyFormat(props.row.actual_amount, 2) }}
            </q-td>
            <q-td key="dateOfApplication" :props="props" class="custom-td">
              {{ dateformat(props.row.submit_date, "YYYY-MM-DD HH:mm:ss") }}
            </q-td>
            <q-td key="status" :props="props" class="custom-td">
              {{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}
            </q-td>
            <q-td key="cancel" :props="props" class="custom-td" width="100px">
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
          <div class="no-data-container">
            <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
            <span>{{ $t("tableHeader.no_data") }}</span>
          </div>
        </template>
      </q-table>
      <div v-if="pendingOrderState.pagination.totalPage" class="flex justify-end q-pa-md custom-pagination">
        <q-pagination
          v-model="pendingOrderState.pagination.page"
          :max="pendingOrderState.pagination.totalPage"
          @update:model-value="handlePagination"
          direction-links
          flat
          active-design="flat"
          color="pagination"
          active-color="active-pagination"
          icon-prev="arrow_left"
          icon-next="arrow_right"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { QTableProps, useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useLogo } from "src/common/composables/useLogo"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, nextTick, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { t } = useI18n()
const { moneyFormat } = useCommon()
const { memberImg } = useSiteImg()
const { getWideLogo } = useLogo()
const {
  isLoading,
  pendingTableColumns,
  pendingOrderState,
  pendingOrderCancel,
  initPendingOrderQuery,
  getPendingOrderList,
  handleDateRangePick,
  handlePagination,
  handleTableRequest,
  handleScroll,
  getPaymentTypeName,
  currencyName,
  currencyHeader
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

const handleSubmit = async () => {
  pendingOrderState.pagination.page = 1
  await getPendingOrderList()
  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const hideMenu = () => {
  menuRef.value.hide()
}

const handleReset = async () => {
  pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  await nextTick()
  await getPendingOrderList()
}

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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";
@import "app/template/okbet_purple/assets/css/reports.scss";

//捲軸底色
/* Webkit 滚动条样式 */
.custom-scroll-container::-webkit-scrollbar {
  width: 40px;
  height: 20px;
}

.custom-scroll-container::-webkit-scrollbar-thumb {
  background: #996aff;
  border-radius: 5px;
}

.custom-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Firefox 滚动条样式 */
.custom-scroll-container {
  scrollbar-color: #996aff #1e1b39;
  scrollbar-width: thin;
}

.column-btn {
  width: 60px;
  padding: 4px;
  border-radius: 0.5rem;
  background: #996aff;
  color: #fff;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
}

.pc-order-container {
  @apply flex w-full;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 20px;
  padding: 70px 45px 0px;
  .q-form {
    width: 100%;
  }
  .pending-title {
    @apply text-[3.125rem] font-extrabold;
    color: $text-light-secondary;
  }
  .order-table-container {
    background-color: $table-content-color !important;
    border: 1px solid $border-dark !important;
    color: $text-light-secondary !important;

    :deep(.q-table__top) {
      .bg-primary {
        background-color: $bg-secondary !important;
      }
    }

    :deep(.q-table thead) {
      color: $text-light-secondary !important;
      border-bottom: 1px solid $text-light-secondary !important;
    }
  }
  .search-btn {
    background-color: $bg-secondary !important;
  }

  :deep(.q-tr) {
    background-color: $bg-dark-secondary !important;
  }
}

.h5-order-container {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: $bg-dark;

  .text {
    color: $text-light-secondary !important;
  }

  .date-input {
    border: 1px solid $bg-secondary !important;
    border-radius: 0.3125rem;
  }

  :deep(.q-field__native) {
    color: $text-light-secondary !important;
  }

  .btn-submit {
    background: $bg-secondary !important;
  }

  @include phone-width {
    margin-top: 0.625rem;
  }

  :deep(.q-expansion-item) {
    border: 2px solid $border-dark !important;
  }

  :deep(.q-expansion-item .q-item) {
    background-color: $bg-dark-secondary !important;

    .q-icon {
      color: $text-light-secondary !important;
    }

    .title {
      color: $text-light-secondary !important;
    }
  }
  :deep(.q-expansion-item__content) {
    .q-card {
      background-color: $bg-dark-secondary !important;
    }
  }
}

.footer {
  background-color: $bg-secondary !important;
  color: $text-light-secondary !important;
}
</style>
