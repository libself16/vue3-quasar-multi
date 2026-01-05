<template>
  <div class="px-3">
    <div class="history-layout">
      <q-form @submit="handleFormSubmit">
        <!-- 類型設定 -->
        <div>
          <q-btn
            v-for="item in searchTabs"
            :key="item.value"
            :label="$t(item.label)"
            class="btn btn-search-type"
            :class="{ outline: pendingOrderState.query.search_type !== item.value }"
            @click="pendingOrderState.query.search_type = item.value"
          />
        </div>

        <!-- 時間設定 -->
        <div>
          <q-btn
            v-for="item in dayTypeTabs"
            :key="item.value"
            :label="$t(item.label)"
            class="btn btn-search-type"
            :class="{ outline: pendingOrderState.query.dateType !== item.value }"
            @click="pendingOrderState.query.dateType = item.value"
          />
        </div>

        <!-- 提交按鈕, 時間選擇  -->
        <div class="mt-5 mb-10 flex items-center">
          <div v-if="pendingOrderState.query.dateType === REPORT_DATE_TYPE.Enums.CustomDate" class="date-picker-row">
            <label class="mb-2">{{ $t("common.btn.searchDate") }}</label>
            <!-- 開始時間 -->
            <div class="m-4">
              <q-input
                v-model="pendingOrderState.query.start_date"
                bg-color="white"
                outlined
                :label="$t('member.profile.birthday')"
                readonly
                dense
                lazy-rules
                :rules="[Rules.required()]"
              />
              <q-menu>
                <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD" minimal dark color="purple-10" />
              </q-menu>
            </div>
            <div class="mb-2">
              {{ $t("common.btn.to") }}
            </div>
            <!-- 結束時間 -->
            <div class="m-4">
              <q-input
                v-model="pendingOrderState.query.end_date"
                bg-color="white"
                outlined
                :label="$t('member.profile.birthday')"
                readonly
                dense
                lazy-rules
                :rules="[Rules.required()]"
              />
              <q-menu>
                <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD" minimal dark color="purple-10" />
              </q-menu>
            </div>
          </div>
          <q-btn :label="$t('common.btn.submit')" class="btn btn-search-type submit" type="submit" />
        </div>
      </q-form>

      <!-- 歷史紀錄表格 -->
      <div class="mb-5">
        <!-- pc-table -->
        <q-table
          class="history-table"
          color="primary"
          table-class="text-grey-1"
          table-header-class="text-grey-1"
          ref="tableRef"
          :rows="pendingOrderState.list"
          :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 20]"
          :columns="pendingTableColumns"
          row-key="id"
          v-model:pagination="pendingOrderState.pagination"
          :loading="isLoading"
          @request="handleTableRequest"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
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
                {{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <!-- mobile-card -->
        <div class="history-card-container">
          <q-card v-for="item in pendingOrderState.list" :key="item.trans_code" class="history-card">
            <!-- left -->
            <q-card-section class="flex">
              <div class="w-1/2 flex flex-col justify-between">
                <div>
                  <span
                    >{{ $t("modal.type") }} :
                    {{ $t(PENDING_SEARCH_TYPE.I18nKeys[item.order_type as PENDING_SEARCH_TYPE.Enums]) }}</span
                  >
                </div>
                <div>
                  {{ dateformat(item.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}
                </div>
              </div>
              <!-- right -->
              <div class="w-1/2 flex flex-nowrap justify-between">
                <div class="flex items-end p-1 w-1/3">
                  <span>{{ $t("tableHeader.amount") }}</span>
                </div>
                <div class="flex flex-col justify-end p-1 w-1/3">
                  <span>{{ moneyFormat(item.amount, 2) }}</span>
                </div>
                <div class="p-1 w-1/3 flex justify-end items-end">
                  <i class="fa-solid fa-circle-arrow-down cursor-pointer" @click="item.isActive = !item.isActive"></i>
                </div>
              </div>
            </q-card-section>
            <q-card-section v-show="item.isActive" class="ease-linear duration-1000">
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.no") }}</span>
                <span class="w-3/5">{{ item.trans_code }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.cashFlowType") }}</span>
                <span class="w-3/5">{{ getPaymentTypeName(item.payment_type as FUND_METHOD_TYPE.Enums) }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.paymentProvider") }}</span>
                <span class="w-3/5">{{ item.payment_gateway_name }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ currencyHeader }}</span>
                <span class="w-3/5">{{ currencyName(item.currency) }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.amount") }}</span>
                <span class="w-3/5">{{ moneyFormat(item.amount, 2) }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.actualAmount") }}</span>
                <span class="w-3/5">{{ moneyFormat(item.actual_amount, 2) }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.dateOfApplication") }}</span>
                <span class="w-3/5">{{ dateformat(item.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-2/5"> {{ $t("tableHeader.status") }}</span>
                <span class="w-3/5"> {{ $t(PENDING_STATUS.I18nKeys[item.status as PENDING_STATUS.Enums]) }} </span>
              </div>
            </q-card-section>
          </q-card>
          <div class="flex justify-end">
            <q-pagination
              v-model="pendingOrderState.pagination.page"
              :max="pendingOrderState.pagination.totalPage"
              color="white"
              active-color="purple"
              @update:model-value="handlePagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useRule } from "src/common/hooks/useRule"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useCommon } from "src/common/hooks/useCommon"
import {
  REPORT_DATE_TYPE,
  FUND_METHOD_TYPE,
  PENDING_SEARCH_TYPE,
  PENDING_STATUS,
  REPORT_DATE_TYPES
} from "src/common/utils/constants"

const Rules = useRule()
const { moneyFormat } = useCommon()

const {
  isLoading,
  pendingTableColumns,
  pendingOrderState,
  initPendingOrderQuery,
  getPendingOrderList,
  handlePagination,
  handleTableRequest,
  getPaymentTypeName,
  currencyName,
  currencyHeader,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
} = usePendingOrder()

const tableRef = ref()

onMounted(async () => {
  initPendingOrderQuery()
  tableRef.value.requestServerInteraction()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'src/css/modal.sass'
@import 'src/common/css/loading.sass'
@import 'app/template/epicwin/css/table.sass'

.history-layout
  @apply mx-auto mt-10 text-white p-5
  background: $report-table-bg
  max-width: 60.25rem
  border: 1px solid $member-payment-type-border-color
  .date-picker-row
    @apply flex items-center mr-11
    +phone-width
      @apply flex-col items-start
  .history-table
    background: $report-table-bg
    color: #fff
    +phone-width
      display: none
  .history-card-container
    display: none
    +phone-width
      display: block
    .history-card
      @apply mb-5 text-sm
      background: $report-table-bg
      border: 1px solid $member-payment-type-border-color
</style>
