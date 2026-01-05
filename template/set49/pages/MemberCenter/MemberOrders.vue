<template>
  <BannerMember />
  <div class="member-history-layout">
    <div class="member-history-content">
      <div class="custom-table">
        <div class="form-title-content-wrap">
          <div class="form-title-content">
            <div class="color-label"></div>
            <div class="title">{{ $t("menu.order") }}</div>
          </div>
          <div class="history-wrap">
            <q-form class="history-content-all" @submit="handleFormSubmit">
              <div class="btn-group">
                <q-btn
                  v-for="item in searchTabs"
                  :key="item.value"
                  :label="$t(item.label)"
                  class="btn btn-green"
                  :class="{ active: pendingOrderState.query.search_type === item.value }"
                  @click="pendingOrderState.query.search_type = item.value"
                />
              </div>
              <div class="date-group mt-8 mb-4 ml-2">
                <div v-for="item in dayTypeTabs" :key="item.value" class="date">
                  <label>
                    <input
                      type="radio"
                      class="option-input radio"
                      name="example"
                      :class="{ active: pendingOrderState.query.dateType === item.value }"
                      :checked="pendingOrderState.query.dateType === item.value"
                      @click="pendingOrderState.query.dateType = item.value"
                    />
                  </label>
                  <div class="body-balance">
                    <span>{{ $t(item.label) }}</span>
                  </div>
                </div>
              </div>
              <!-- 提交按鈕, 時間選擇  -->
              <div class="date-form">
                <p class="date-picker-label">{{ $t("common.btn.searchDate") }}</p>
                <div class="date-picker-row">
                  <!-- 開始時間 -->
                  <div class="date-input date-input-from">
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
                            <q-date
                              v-model="pendingOrderState.query.start_date"
                              mask="YYYY-MM-DD"
                              dark
                              color="warning"
                              @update:model-value="
                                pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.CustomDate
                              "
                            >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="warning" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="date-picker-label-to">{{ $t("common.btn.to") }}</div>
                  <!-- 結束時間 -->
                  <div class="date-input">
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
                            <q-date
                              v-model="pendingOrderState.query.end_date"
                              mask="YYYY-MM-DD"
                              dark
                              color="warning"
                              @update:model-value="
                                pendingOrderState.query.dateType = REPORT_DATE_TYPES.Enums.CustomDate
                              "
                            >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="warning" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="submit-btn-wrapper">
                    <q-btn
                      :class="$q.platform.is.desktop ? 'submit_active' : ''"
                      :label="$t('common.btn.submit')"
                      class="submit-btn ml-2"
                      type="submit"
                    />
                  </div>
                </div>
              </div>
            </q-form>
          </div>
        </div>
        <!-- pc table -->
        <q-table
          v-if="!isMobile"
          bordered
          class="inbox-table custom-scroll-container !mt-0"
          color="primary"
          table-class="text-grey-1"
          table-header-class="text-grey-1 border-b border-white"
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
              <q-td key="upload" :props="props" class="custom-td">
                <q-btn
                  :disabled="
                    props.row.status === PENDING_STATUS.Enums.cancel ||
                    pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Withdrawal
                  "
                  class="column-btn"
                  @click="handleUploadDetail(props.row.trans_code)"
                  :label="$t('tableHeader.uploadDetail')"
                />
              </q-td>
              <q-td key="cancel" :props="props" class="custom-td">
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
        <div v-else class="expansion-menu">
          <q-list v-if="pendingOrderState.list.length">
            <q-expansion-item
              v-for="(pending, index) in pendingOrderState.list"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section>
                  <div class="expansion-item-no">
                    <span>{{ $t("tableHeader.no") }}</span>
                    <span>{{ pending.trans_code }}</span>
                  </div>
                  <div class="expansion-header">
                    <div>
                      <span>{{ $t("tableHeader.status") }}</span>
                      <span>
                        {{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}
                      </span>
                    </div>
                    <div class="">
                      <span>{{ $t("tableHeader.type") }}</span>
                      <span>{{
                        $t(PENDING_SEARCH_TYPE.I18nKeys[pending.order_type as PENDING_SEARCH_TYPE.Enums])
                      }}</span>
                    </div>
                    <div class="">
                      <span>{{ $t("tableHeader.cashFlowType") }}</span>
                      <span>{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</span>
                    </div>
                    <div class="">
                      <span>{{ currencyHeader }}</span>
                      <span>{{ currencyName(pending.currency) }}</span>
                    </div>
                    <div class="">
                      <span>{{ $t("tableHeader.amount") }}</span>
                      <span>{{ moneyFormat(pending.amount, 2) }}</span>
                    </div>
                  </div>
                </q-item-section>
              </template>
              <q-card>
                <q-card-section class="expansion-card-section">
                  <div class="expansion-detail">
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.paymentProvider") }}</span>
                      <span>{{ pending.payment_gateway_name }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ currencyHeader }}</span>
                      <span>{{ currencyName(pending.currency) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.amount") }}</span>
                      <span>{{ moneyFormat(pending.amount, 2) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.actualAmount") }}</span>
                      <span>{{ moneyFormat(pending.actual_amount, 2) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.dateOfApplication") }}</span>
                      <span>{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.uploadDetail") }}</span>
                      <span>
                        <q-btn
                          :disabled="
                            pending.status === PENDING_STATUS.Enums.cancel ||
                            pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Withdrawal
                          "
                          class="column-btn"
                          @click="handleUploadDetail(pending.trans_code)"
                          :label="$t('tableHeader.uploadDetail')"
                        />
                      </span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.cancel") }}</span>
                      <span>
                        <q-btn
                          :disabled="cancelBtnDisable(pending)"
                          class="column-btn"
                          @click="pendingOrderCancel(pending as any)"
                          :label="$t('tableHeader.cancel')"
                        />
                      </span>
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
      </div>
      <!-- pagination -->
      <div v-if="pendingOrderState.pagination.totalPage" class="flex justify-end mt-7 pagination">
        <q-pagination
          v-model="pendingOrderState.pagination.page"
          :max="pendingOrderState.pagination.totalPage"
          direction-links
          color="grey-1"
          text-color="white"
          active-text-color="dark"
          active-color="amber-5"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </div>
  <DepositDetailUpload ref="depositDetailUploadRef" />
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import BannerMember from "app/template/set49/components/BannerMember.vue"
import { QTableProps } from "quasar"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"

const Rules = useRule()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)
const { t } = useI18n()

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
  handleFormSubmit,
  pendingOrderCancel
} = usePendingOrder()

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
const depositDetailUploadRef = ref()

const handleCancelBet = (row: any) => {
  console.log(row)
}

const handleUploadDetail = (transCode: string) => {
  depositDetailUploadRef.value.openDialog(transCode)
}

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

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
// @import 'src/css/table.sass'
@import 'src/css/form.sass'
@import 'app/template/set49/assets/css/menu.sass'
@import 'app/template/set49/assets/css/style.sass'
@import 'app/template/set49/assets/css/_variable.scss'

//捲軸底色
/* Webkit 滚动条样式 */
.custom-scroll-container::-webkit-scrollbar
  width: 40px
  height: 20px
.custom-scroll-container::-webkit-scrollbar-thumb
  background: #3498db
  border-radius: 5px

.custom-scroll-container::-webkit-scrollbar-track
  background: #f1f1f1

/* Firefox 滚动条样式 */
.custom-scroll-container
  scrollbar-color: #FFC002 #1c1e22
  scrollbar-width: thin

.column-btn
  width: 60px
  padding: 4px
  border-radius: 0.5rem
  text-wrap: balance
  background: #FFC002
  color: #24262B
  font-size: 0.8rem
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  +iphone-width
    width: 50px
    padding: 2px
    font-size: 0.6rem
    font-weight: 700
    line-height: normal
    text-transform: uppercase


.custom-table
  @apply mt-10 text-white rounded-lg
  +iphone-width
    @apply p-4 pt-0 mt-0
  :deep(.q-table__card)
    @apply px-[2.8125rem]
    box-shadow: none
    border-radius: 0
    background: $primary-modal-bg
  :deep(.q-table)
    tr
      border-bottom: 1px solid rgba(255, 255, 255, 0.5)
    background: $primary-modal-bg
    th
      @apply text-left text-white font-bold text-base
      border-bottom: 2px solid rgba(225, 225, 225, 0.3)
    td
      text-align: left
      border-bottom: 1px solid rgba(225, 225, 225, 0.3)
  :deep(.q-table__bottom)
    background: $primary-modal-bg
.member-history-content
  @apply pb-4 rounded-lg
  background: #3E0303
  max-width: 75rem
  margin: 0 auto 4rem auto
  margin-top: 6.0625rem
  +iphone-width
    margin-top: 2rem
  .form-title-content-wrap
    background: $primary-modal-bg
    border-radius: 0.5rem 0.5rem 0 0
    padding: 2.5rem
    padding-bottom: 0
    +iphone-width
      border-radius: 0.5rem
      padding: .5rem
      margin-bottom: .5rem
      background: none
  .history-content-all
    @apply px-10 pt-8 pb-4
    width: 100%
    background: $primary-modal-bg
    h4
      font-weight: bold
      margin-bottom: 30px
    .date-group
      +setFlex(start, center)
      flex-wrap: wrap
      gap: 1rem
      .date
        display: flex
        gap: .5rem
        .option-input
          -webkit-appearance: none
          -moz-appearance: none
          -ms-appearance: none
          -o-appearance: none
          appearance: none
          top: .15rem
          right: 0
          bottom: 0
          left: 26%
          height: 15px
          width: 15px
          transition: all 0.15s ease-out 0s
          border-radius: 0.5rem
          background: #cbd1d8
          color: #fff
          cursor: pointer
          display: inline-block
          margin-right: 0.5rem
          outline: none
          position: relative
          border: 3px solid transparent
        .option-input:checked
          background: $primary-btn-bg
          border-color: #cbd1d8
    .btn-group
      display: flex
      flex-wrap: wrap
      gap: 15px
      .btn
        width: 140px
        padding: 6px
        border-radius: .5rem
        +iphone-width
          width: 110px
      .btn-green
        border: 1px solid #fff
        background: rgba(#fff, .1)
        &:hover
          border: 1px solid #FFC002
          background: rgba(#fff, .1)
        &.active, &:focus
          border: 1px solid #FFC002
          background: rgba(#FFC002, .1)
          color: #ffc002
  .carousel
    .carousel__viewport
      li
        padding-right: .625rem
.unread
  color: red
.amount
  color: #6FCF97
.member-history-content-mb
  width: 85%
  margin: 1rem auto
  padding: 1rem 1.25rem
  background: $primary-modal-bg
  border-radius: .5rem
  overflow: scroll
  scrollbar-width: none
  ::-webkit-scrollbar
    display: none
  .content
    +setFlex
    color: #fff
    margin-bottom: .5rem
    cursor: pointer
    img
      width: 20%
      height: auto
      margin-right: 1rem
    .content-item
      +setFlex(start, start)
      flex-direction: column
      width: 70%
      .title
        font-size: 1rem
        font-weight: 900
        margin-bottom: .3125rem
      .member, .date, .amount
        font-size: .75rem
      .member
        color: rgba(#fff, .7)
        font-weight: 700
      .date
        color: rgba(#fff, .15)
        margin-top: .3125rem
        .expansion-menu
  font-size: 12px
.expansion-header
  display: flex
  flex-direction: row
  +setFlex(space-between, center)
  font-size: 12px
  div
    display: flex
    flex-direction: column
    +setFlex(center, center)
.expansion-item-no
  margin-bottom: 0.5rem
  border-bottom: 1px solid rgba(#fff, .5)
.expansion-card-section
  background: $third-bg
.expansion-detail
  padding-top: 20px
  background: $third-bg
  color: #fff
  border-radius: 5px
  width: 100%
  padding: 5px
  font-size: 12px
  font-weight: bold
  .expansion-item
    margin: 0.5rem 0
    +setFlex(start, center)
    span
      width: 50%
      margin-right: .25rem
      &:nth-child(2)
        text-align: start


:deep(.q-pagination)
  .q-pagination__content
    .q-btn
      .q-btn__content
        .q-icon
          color: #FFC002!important

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important

.custom-pagination
  background: #3E0303
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set49/assets/css/_variable.scss";

.form-title-content {
  @include iphone-width {
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-bottom: 2rem;
  }
}

.date-form {
  @apply flex flex-col mt-6;

  .date-picker-row {
    @apply flex items-center;

    @include iphone-width {
      @apply flex-col items-center;
    }
  }

  .date-input {
    @apply w-full;
  }

  .date-picker-label {
    @apply mr-4 mb-4 uppercase;
    color: $menu-default-color;
  }

  .date-picker-label-to {
    @apply flex items-center mx-4 uppercase;
    color: $menu-default-color;

    @include iphone-width {
      display: none;
    }
  }

  .submit-btn-wrapper {
    .submit-btn {
      @apply w-[10.125rem] h-[2.5rem] ml-[1.5rem] mb-5 rounded-lg text-black;
      background: $primary-color;
    }
  }
}
</style>
