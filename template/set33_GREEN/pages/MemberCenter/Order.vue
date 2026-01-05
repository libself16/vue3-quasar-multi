<template>
  <div>
    <div class="order-content">
      <div class="order-wrap">
        <q-form class="order-content-all" @submit="handleFormSubmit">
          <div class="af-pending btn-group">
            <q-btn
              v-for="item in searchTabs"
              :key="item.value"
              :label="$t(item.label)"
              class="btn btn-green"
              :class="{ active: pendingOrderState.query.search_type === item.value }"
              @click="pendingOrderState.query.search_type = item.value"
            />
          </div>
          <div class="af-pending btn-group">
            <q-btn
              v-for="item in dayTypeTabs"
              :key="item.value"
              :label="$t(item.label)"
              class="btn btn-green"
              :class="{ active: pendingOrderState.query.dateType === item.value }"
              @click="pendingOrderState.query.dateType = item.value"
            />
          </div>
          <!-- 提交按鈕, 時間選擇  -->
          <div class="form-group">
            <div
              v-if="pendingOrderState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate"
              class="date-picker-row form-item"
            >
              <label class="form-item-label">{{ $t("common.btn.searchDate") }}</label>
              <!-- 開始時間 -->
              <div>
                <q-input
                  v-model="pendingOrderState.query.start_date"
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
                        <q-date v-model="pendingOrderState.query.start_date" color="green" mask="YYYY-MM-DD">
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
                  v-model="pendingOrderState.query.end_date"
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
                        <q-date v-model="pendingOrderState.query.end_date" color="green" mask="YYYY-MM-DD">
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
      :rows="pendingOrderState.list"
      :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 20]"
      :columns="tableCulumns"
      row-key="id"
      v-model:pagination="pendingOrderState.pagination"
      :loading="isLoading"
      hide-pagination
      @request="handleTableRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template #body="props">
        <q-tr>
          <q-td key="type">
            {{ $t(PENDING_SEARCH_TYPE.I18nKeys[props.row.order_type as PENDING_SEARCH_TYPE.Enums]) }}
          </q-td>
          <q-td key="no" :props="props" width="15%" class="custom-td">
            <a @click="handleUploadDetail(props.row.order_type, props.row.trans_code, true)">{{
              props.row.trans_code
            }}</a>
          </q-td>
          <q-td key="cashFlowType" :props="props" width="15%">
            <span>{{ getPaymentTypeName(props.row.payment_type) }}</span>
          </q-td>
          <q-td key="paymentProvider" :props="props">
            <span>{{ props.row.payment_gateway_name }}</span>
          </q-td>
          <q-td key="currency" :props="props">
            <span>{{ currencyName(props.row.currency) }}</span>
          </q-td>
          <q-td key="amount" :props="props">
            <span>{{ moneyFormat(props.row.amount, 2) }}</span>
          </q-td>
          <q-td key="actualAmount" :props="props">
            <span>{{ moneyFormat(props.row.actual_amount, 2) }}</span>
          </q-td>
          <q-td key="dateOfApplication" :props="props">
            <span>{{ dateformat(props.row.submit_date, "YYYY-MM-DD HH:mm:ss") }}</span>
          </q-td>
          <q-td key="status" :props="props">
            <span>{{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}</span>
          </q-td>
          <q-td key="upload" :props="props" class="custom-td" width="100px">
            <q-btn
              :disabled="props.row.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
              class="column-btn"
              @click="handleUploadDetail(props.row.order_type, props.row.trans_code, false)"
              :label="$t('tableHeader.uploadDetail')"
            />
          </q-td>
          <q-td key="cancel" :props="props" class="custom-td" width="100px">
            <q-btn
              :disabled="cancelBtnDisable(props.row)"
              class="column-btn"
              @click="pendingOrderCancel(props.row)"
              :label="$t('tableHeader.cancel')"
            />
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <span>{{ $t("tableHeader.no_data") }}</span>
      </template>
    </q-table>
    <!-- mobile table -->
    <div v-else class="expansion-menu q-pa-sm">
      <q-list v-if="pendingOrderState.list.length">
        <q-expansion-item
          v-for="(pending, index) in pendingOrderState.list"
          :key="index"
          dense
          dense-toggle
          expand-separator
        >
          <template v-slot:header>
            <q-item-section class="expansion-header">
              <div class="header-title">
                <span
                  >{{ `${$t("modal.type")}: ` }}
                  {{ $t(PENDING_SEARCH_TYPE.I18nKeys[pending.order_type as PENDING_SEARCH_TYPE.Enums]) }}</span
                >
              </div>
              <div>
                <span>{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                <span>{{ `${$t("tableHeader.amount")}: ` }}</span>
                <span class="text-title">{{ moneyFormat(pending.amount, 2) }}</span>
              </div>
            </q-item-section>

            <q-item-section side>
              <div class="expansion-header-currency">
                <div class="af-his-cnt">{{ currencyName(pending.currency) }}</div>
              </div>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <div class="expansion-detail">
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.no") }}</div>
                  <div class="text-title custom-td">
                    <a @click="handleUploadDetail(pending.order_type ?? 0, pending.trans_code, true)">{{
                      pending.trans_code
                    }}</a>
                  </div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.cashFlowType") }}</div>
                  <div class="text-title">{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</div>
                </div>
                <div class="expansion-detail-item">
                  <span class="text-type">{{ $t("tableHeader.paymentProvider") }}</span>
                  <span class="text-title">{{ pending.payment_gateway_name }}</span>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ currencyHeader }}</div>
                  <div class="text-title">{{ currencyName(pending.currency) }}</div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.amount") }}</div>
                  <div class="text-title">{{ moneyFormat(pending.amount, 2) }}</div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.actualAmount") }}</div>
                  <div class="text-title">{{ moneyFormat(pending.actual_amount, 2) }}</div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.dateOfApplication") }}</div>
                  <div class="text-title">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.status") }}</div>
                  <div class="text-title">
                    {{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}
                  </div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.uploadDetail") }}</div>
                  <div class="text-title">
                    <q-btn
                      :disabled="pending.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
                      class="column-btn"
                      @click="handleUploadDetail(pending.order_type ?? 0, pending.trans_code, false)"
                      :label="$t('tableHeader.uploadDetail')"
                    />
                  </div>
                </div>
                <div class="expansion-detail-item">
                  <div class="text-type">{{ $t("tableHeader.cancel") }}</div>
                  <div class="text-title">
                    <q-btn
                      :disabled="cancelBtnDisable(pending)"
                      class="column-btn"
                      @click="pendingOrderCancel(pending as any)"
                      :label="$t('tableHeader.cancel')"
                    />
                  </div>
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
    <div v-if="pendingOrderState.pagination.totalPage" class="flex justify-end mt-7 pagination">
      <q-pagination
        v-model="pendingOrderState.pagination.page"
        :max="pendingOrderState.pagination.totalPage"
        direction-links
        push
        color="pagination"
        active-design="push"
        active-color="pagination"
        @update:model-value="handlePagination"
      />
    </div>
  </div>
  <DepositDetailUpload ref="depositDetailUploadRef" />
  <WithdrawalDetailUpload ref="withdrawalDetailUploadRef" />
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { QTableProps } from "quasar"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"
import WithdrawalDetailUpload from "./components/WithdrawalDetailUpload.vue"

const Rules = useRule()
const { envInfo } = useEnvInfoStore()
const { t } = useI18n()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)
const { pendingImg } = useSiteImg()

const {
  isLoading,
  cancelBtnDisable,
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
  handleFormSubmit,
  pendingOrderCancel
} = usePendingOrder()

const tableRef = ref()

const depositDetailUploadRef = ref()
const withdrawalDetailUploadRef = ref()

const uploadSwitch = computed(() => Boolean(envInfo.upload_details))

const handleUploadDetail = (searchType: number, transCode: string, readOnly: boolean) => {
  switch (searchType) {
    case PENDING_SEARCH_TYPE.Enums.Deposit:
      depositDetailUploadRef.value.openDialog(transCode, readOnly)
      break
    case PENDING_SEARCH_TYPE.Enums.Withdrawal:
      withdrawalDetailUploadRef.value.openDialog(transCode, readOnly)
      break
  }
}

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

onMounted(async () => {
  initPendingOrderQuery()
  await getPendingOrderList()
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
@import 'app/template/set33_GREEN/assets/css/table.sass'
@import 'app/template/set33_GREEN/assets/css/menu.sass'
@import 'app/template/set33_GREEN/assets/css/pagination.sass'

// common style
.custom-td
  font-family: OpenSans
  a
    cursor: pointer
    color: #7BFF2A

.column-btn
  padding: 0.25rem 1rem
  color: #fff
  font-size: 0.8rem
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  border-radius: 0.625rem
  background: linear-gradient(180deg, #A9D320 0%, #388312 100%)
  box-shadow: 0px 0px 5px 0px #FFF inset
  +iphone-width
    min-width: 40px
    font-size: 0.6rem

.order-content
  display: flex
  margin-bottom: 20px
  padding: 25px
  width: 100%
  background: rgba(8, 47, 26, 1)
  border-radius: 8px
  border: 1px solid rgba(71, 184, 61, 1)
  .order-content-all
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
        border: 1px solid rgba(71, 184, 61, 1)
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
    position: relative
    .header-title
      position: absolute
      top: 0
      left: 0
    .text-green
      color: #99cc0d
    div
      display: flex
      &:first-child
        margin-top: 10px
      &:nth-child(2)
        margin: 2rem 0 1.5rem
        span:first-child
          margin-right: 5rem
  .expansion-header-currency
    display: flex
    flex-direction: column
    background: #40BE36
    border-radius: 50px
    padding: 5px
    color: #fff
    // margin-top: 1.5625rem
    img
      height: 4vw
      width: 4vw
      margin: 0px auto
  .expansion-detail
    padding-top: 20px
    background: #0A3A20
    color: #fff
    border-radius: 5px
    padding: 5px
    font-size: 12px
    font-weight: bold
    &-item
      +setFlex(flex-start, center)
      flex-wrap: wrap
      .text-type
        width: 30%
        margin: 5px 0
:deep(.q-table__container)
  +pad-width
    margin: 0 10px
.pagination
  +pad-width
    margin: 10px
  +iphone-width
    margin-right: 12px
:deep(.q-td)
  font-size: 0.75rem
  padding: 7px 8px
:deep(th)
  font-size: 0.75rem
  padding: 7px 8px
</style>
