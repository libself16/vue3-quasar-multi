<template>
  <div>
    <div class="history-content">
      <div class="history-wrap">
        <q-form class="history-content-all" @submit="handleFormSubmit">
          <div class="af-history btn-group">
            <q-btn
              v-for="item in searchTabs"
              :key="item.value"
              :label="$t(item.label)"
              class="btn btn-green"
              :class="{ active: historyState.query.search_type === item.value }"
              @click="historyState.query.search_type = item.value"
            />
          </div>
          <div class="af-history btn-group">
            <q-btn
              v-for="item in dayTypeTabs"
              :key="item.value"
              :label="$t(item.label)"
              class="btn btn-blue"
              :class="{ active: historyState.query.dateType === item.value }"
              @click="historyState.query.dateType = item.value"
            />
          </div>
          <!-- 提交按鈕, 時間選擇  -->
          <div class="form-group">
            <div
              v-if="historyState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate"
              class="date-picker-row form-item"
            >
              <label class="form-item-label">{{ $t("common.btn.searchDate") }}</label>
              <!-- 開始時間 -->
              <div>
                <q-input
                  v-model="historyState.query.start_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                  :rules="[Rules.required()]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="historyState.query.start_date" color="green" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="green" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="form-item-label">
                {{ $t("common.btn.to") }}
              </div>
              <!-- 結束時間 -->
              <div>
                <q-input
                  v-model="historyState.query.end_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                  :rules="[Rules.required()]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="historyState.query.end_date" color="green" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="green" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="submit-btn-wrap">
              <q-btn
                :class="$q.platform.is.desktop ? 'submit_active' : ''"
                :label="$t('common.btn.submit')"
                class="btn submit-btn"
                type="submit"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <!-- pc table -->
    <q-table
      v-if="!isMobile"
      class="inbox-table"
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
      hide-pagination
      wrap-cells
      @request="handleTableRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr>
          <q-td key="accountChangeTime" :props="props" width="15%">
            <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
          </q-td>
          <q-td key="currency" :props="props">
            <span>{{ currencyName(props.row.currency_code) }}</span>
          </q-td>
          <q-td key="accountType" :props="props">
            <span>{{ $t(actionType.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
          </q-td>
          <q-td key="accountVariableObject" :props="props">
            <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
            <span class="text-blue">{{
              props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
            }}</span>
          </q-td>
          <q-td key="amount" :props="props">
            <span>{{ moneyFormat(props.row.amount, 2) }}</span>
          </q-td>
          <q-td key="amountBeforeChanges" :props="props">
            <span>{{ moneyFormat(props.row.before_balance, 2) }}</span>
          </q-td>
          <q-td key="amountAfterChange" :props="props">
            <span>{{ moneyFormat(props.row.after_balance, 2) }}</span>
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <span>{{ $t("tableHeader.no_data") }}</span>
      </template>
    </q-table>
    <!-- mobile table -->
    <div v-else class="expansion-menu q-pa-sm">
      <q-list v-if="historyState.list.length">
        <q-expansion-item
          v-for="(history, index) in historyState.list"
          :key="index"
          dense
          dense-toggle
          expand-separator
        >
          <template v-slot:header>
            <q-item-section class="expansion-header">
              <div>
                <div>
                  <span class="text-white">
                    {{ $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0]) }}</span
                  >
                  <span class="text-blue">{{ history.action_target }}</span>
                </div>

                <span class="text-green">
                  <span v-if="agentType === AGENT_TYPE.Enums.Cash">{{ `(${history.currency_code})` }}</span>
                  <span>{{ `${moneyFormat(history.amount, 2)}` }}</span>
                </span>
              </div>
              <div>
                <span class="text-blue">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                <span class="text-blue">{{ $t("tableHeader.balance") }}</span>
                <span class="af-his-ttl">{{ moneyFormat(history.after_balance, 2) }}</span>
              </div>
            </q-item-section>

            <!-- <q-item-section side>
              <div class="expansion-header-currency">
                <img :src="historyImg(history.currency_code)" />
                <div class="af-his-cnt">{{ history.currency_code }}</div>
              </div>
            </q-item-section> -->
          </template>
          <q-card>
            <q-card-section>
              <div class="expansion-detail">
                <div>
                  <span class="af-his-type"> {{ $t("tableHeader.accountVariableObject") }}</span>
                  <p>
                    [
                    <span class="text-green">{{
                      history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code
                    }}</span>
                    ]
                  </p>
                </div>
                <div>
                  <span class="af-his-type">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                  <span class="af-his-ttl">{{ moneyFormat(history.before_balance, 2) }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <div v-else class="q-expansion-item flex justify-center items-center">
        <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
      </div>
    </div>

    <!-- pagination -->
    <div v-if="historyState.pagination.totalPage" class="flex justify-end mt-7 pagination">
      <q-pagination
        v-model="historyState.pagination.page"
        :max="historyState.pagination.totalPage"
        direction-links
        push
        color="pagination"
        active-design="push"
        active-color="pagination"
        @update:model-value="handlePagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, onMounted, ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { ACTION_TYPE, AGENT_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"

const Rules = useRule()
const { envData } = useEnv()
const { agentType } = envData()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()

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

const actionType = ACTION_TYPE
let isMobile = ref(false)
const tableRef = ref()

onMounted(async () => {
  initHistoryQuery()
  await getHistoryList()
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="sass">
@import 'src/common/css/_variable.sass'
@import 'src/common/css/loading.sass'
@import 'app/template/set33_BLUE/assets/css/table.sass'
@import 'app/template/set33_BLUE/assets/css/menu.sass'
@import 'app/template/set33_BLUE/assets/css/pagination.sass'
.history-content
  display: flex
  margin-bottom: 20px
  padding: 25px
  width: 100%
  background: #021524
  border-radius: 8px
  border: 1px solid #086eb8
  .history-content-all
    width: 100%
    h4
      font-weight: bold
      margin-bottom: 30px
    .btn-group
      display: flex
      flex-wrap: wrap
      gap: 15px
      margin-bottom: 20px
      .btn
        width: 140px
        padding: 6px
        border-radius: 20px
      .btn-green
        border: 1px solid #96c61e
        &.active, &:hover, &:focus
          background: linear-gradient(to bottom,rgba(169, 211, 32, 1) 0%,rgba(56, 131, 18, 1) 100%)
      .btn-blue
        border: 1px solid #0c9bd5
        &.active, &:hover, &:focus
          background: linear-gradient(to bottom,rgba(16, 183, 243, 1) 0%, rgba(12, 112, 170, 1) 33%, rgba(8, 93, 143, 1) 100%)
    .form-group
      .form-item
        +setFlex(flex-start, center)
        margin-bottom: 20px
        width: 100%
        gap: 20px
        +iphone-width
          gap: 0px
        :deep(.q-field__control)
          margin-top: 1vw
        +iphone-width
          +setFlex(flex-start, flex-start)
          flex-direction: column
          margin: 0
        &-label
          margin-bottom: 1vw
          +iphone-width
            margin: 0
      .submit-btn-wrap
        display: block
        .form-label
          width: 150px
        .date-from
          +setFlex
          gap: 20px
          .q-field__control
            height: 20px !important
      .submit-btn
        color: #fff
        font-size: 18px
        padding: 8px 20px
        width: 150px
        background: linear-gradient(to bottom,rgba(169, 211, 32, 1) 0%,rgba(56, 131, 18, 1) 100%)
        box-shadow: inset 0px 0px 5px #fff
        border-radius: 25px
        font-weight: bold
        +iphone-width
          width: 100%
      .submit_active
        &:hover
          background: #021c2d
.expansion-menu
  font-size: 12px
  .expansion-header
    .text-green
      color: #99cc0d
    div
      +setFlex(space-between, center)
      &:first-child
        margin-top: 5px
      &:nth-child(2)
        margin: 10px 0
  .expansion-header-currency
    display: flex
    flex-direction: column
    gap: 10px
    background: #013150
    border-radius: 50px
    padding: 5px
    img
      height: 4vw
      width: 4vw
      margin: 0px auto
  .expansion-detail
    padding-top: 20px
    background: #08192b
    color: #fff
    border-radius: 5px
    padding: 5px
    font-size: 12px
    font-weight: bold
    div
      display: flex
      flex-direction: column
      &:first-child
        margin-top: 10px
      &:nth-child(2)
        margin: 10px 0
::v-deep(.q-table__container)
  +pad-width
    margin: 0 10px
.pagination
  +pad-width
    margin: 10px
  +iphone-width
    margin-right: 12px
</style>
