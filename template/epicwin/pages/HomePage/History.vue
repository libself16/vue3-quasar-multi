<template>
  <div class="px-3">
    <div class="history-layout">
      <q-form @submit="handleFormSubmit">
        <!-- 類型設定 -->
        <div>
          <q-btn
            v-for="item in searchTabs"
            :key="item.value"
            :label="item.label"
            class="btn btn-search-type"
            :class="{ outline: historyState.query.search_type !== item.value }"
            @click="historyState.query.search_type = item.value"
          />
        </div>

        <!-- 時間設定 -->
        <div>
          <q-btn
            v-for="item in dayTypeTabs"
            :key="item.value"
            :label="item.label"
            class="btn btn-search-type"
            :class="{ outline: historyState.query.dateType !== item.value }"
            @click="historyState.query.dateType = item.value"
          />
        </div>

        <!-- 提交按鈕, 時間選擇  -->
        <div class="mt-5 mb-10 flex items-center">
          <div v-if="historyState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate" class="date-picker-row">
            <label class="mb-2">{{ $t("common.btn.searchDate") }}</label>
            <!-- 開始時間 -->
            <div class="m-4">
              <q-input
                v-model="historyState.query.start_date"
                bg-color="white"
                outlined
                :label="$t('member.profile.birthday')"
                readonly
                dense
                lazy-rules
                :rules="[Rules.required()]"
              />
              <q-menu>
                <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" minimal color="purple-10" dark />
              </q-menu>
            </div>
            <div class="mb-2">
              {{ $t("common.btn.to") }}
            </div>
            <!-- 結束時間 -->
            <div class="m-4">
              <q-input
                v-model="historyState.query.end_date"
                bg-color="white"
                outlined
                :label="$t('member.profile.birthday')"
                readonly
                dense
                lazy-rules
                :rules="[Rules.required()]"
              />
              <q-menu>
                <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" minimal color="purple-10" dark />
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
          :rows="historyState.list"
          :rows-per-page-options="[historyState.pagination?.rowsPerPage || 20]"
          :columns="historyTableColumns"
          row-key="id"
          v-model:pagination="historyState.pagination"
          :loading="isLoading"
          wrap-cells
          @request="handleTableRequest"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
          <template #body="props">
            <q-tr>
              <q-td key="accountChangeTime" :props="props">
                {{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ currencyName(props.row.currency_code) }}
              </q-td>
              <q-td key="accountType" :props="props">
                {{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}
              </q-td>
              <q-td key="accountVariableObject" :props="props">
                {{ props.row.action_target }}<br />
                <span class="text-blue-500">{{
                  props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
                }}</span>
              </q-td>
              <q-td key="amount" :props="props">
                {{ moneyFormat(props.row.amount, 2) }}
              </q-td>
              <q-td key="amountBeforeChanges" :props="props">
                {{ moneyFormat(props.row.before_balance, 2) }}
              </q-td>
              <q-td key="amountAfterChange" :props="props">
                {{ moneyFormat(props.row.after_balance, 2) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <!-- mobile-card -->
        <div class="history-card-container">
          <q-card v-for="item in historyState.list" :key="item.transaction_code" class="history-card">
            <!-- left -->
            <q-card-section class="w-1/2 p-2">
              <q-card-section>
                <span>{{ $t(ACTION_TYPE.I18nKeys[item.action_type as ACTION_TYPE.Enums]) }}</span>
                <span>
                  <p v-if="item.action_target">{{ item.action_target }}</p>
                  {{ item.action_target }}</span
                >
              </q-card-section>
              <q-card-section>
                {{ dateformat(item.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}
              </q-card-section>
            </q-card-section>
            <!-- right -->
            <q-card-section class="w-1/2 flex flex-nowrap justify-between">
              <q-card-section class="flex items-end p-1 w-1/3">
                <span>{{ $t("tableHeader.balance") }}</span>
              </q-card-section>
              <q-card-section class="flex flex-col justify-between p-1 w-1/3">
                <span>{{ moneyFormat(item.after_balance, 2) }}</span>
                <span>{{ moneyFormat(item.amount, 2) }}</span>
              </q-card-section>
              <q-card-section class="flex flex-col justify-between p-1 w-1/3">
                <span>{{ currencyName(item.currency_code) }}</span>
                <span> {{ currencyName(item.currency_code) }}</span>
              </q-card-section>
            </q-card-section>
          </q-card>
          <div class="flex justify-end">
            <q-pagination
              v-model="historyState.pagination.page"
              :max="historyState.pagination.totalPage"
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
import { useHistory } from "src/common/composables/useHistory"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useCommon } from "src/common/hooks/useCommon"
import { REPORT_DATE_TYPES, ACTION_TYPE } from "src/common/utils/constants"

const Rules = useRule()
const { moneyFormat } = useCommon()

const {
  historyTableColumns,
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  handleTableRequest,
  currencyName,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
} = useHistory()

const tableRef = ref()

onMounted(async () => {
  initHistoryQuery()
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
      @apply flex mb-5 text-sm
      background: $report-table-bg
      border: 1px solid $member-payment-type-border-color
</style>
