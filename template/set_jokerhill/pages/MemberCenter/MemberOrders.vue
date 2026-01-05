<template>
  <BannerMember />
  <div class="container">
    <div class="form-title-content">
      <img :src="svgIcon('member-title-icon')" />
      <div class="title">{{ $t("menu.order") }}</div>
    </div>
    <div class="history-container">
      <div class="history-area">
        <q-form class="history-form" @submit="handleFormSubmit">
          <div class="tab-area">
            <button
              type="button"
              class="tab-button"
              v-for="item in searchTabs"
              :key="item.value"
              :class="{ active: pendingOrderState.query.search_type === item.value }"
              @click="pendingOrderState.query.search_type = item.value"
            >
              {{ t(item.label) }}
            </button>
          </div>
          <div class="radio-area">
            <div
              v-for="item in dateTypesWithoutCustomDate"
              :key="item.value"
              class="date"
              @click="pendingOrderState.query.dateType = item.value"
            >
              <label>
                <input
                  type="radio"
                  class="option-input radio"
                  name="example"
                  :class="{ active: pendingOrderState.query.dateType === item.value }"
                  :checked="pendingOrderState.query.dateType === item.value"
                />
              </label>
              <div class="body-balance">
                <span>{{ $t(item.label) }}</span>
              </div>
            </div>
          </div>
          <div class="date-area">
            <div class="start-date-area">
              <span>{{ $t("common.btn.searchDate").replace(" :", "") }}</span>
              <div>
                <q-input
                  v-model="pendingOrderState.query.start_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD">
                          <div class="items-center justify-end row">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="to-area">
              <span>TO</span>
            </div>
            <div class="end-date-area">
              <span></span>
              <div>
                <q-input
                  v-model="pendingOrderState.query.end_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD">
                          <div class="items-center justify-end row">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="submit-button-area">
              <button type="submit" class="submit-button">
                {{ $t("common.btn.submit") }}
              </button>
            </div>
          </div>
        </q-form>
      </div>
      <div class="table-area">
        <q-table
          v-if="!isMobile"
          class="inbox-table"
          color="primary"
          table-class="text-grey-1 custom-table"
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
                <span>
                  {{ $t(PENDING_SEARCH_TYPE.I18nKeys[props.row.order_type as PENDING_SEARCH_TYPE.Enums]) }}
                </span>
              </q-td>
              <q-td key="no" :props="props" width="15%">
                <span>{{ props.row.trans_code }}</span>
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
        <div v-else class="expansion-menu">
          <q-list v-if="pendingOrderState.list.length">
            <q-expansion-item
              v-for="(pending, index) in pendingOrderState.list"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon=""
              class="expansion-item-outer"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-in">
                    <div class="expansion-top-header">
                      <span>{{ t("tableHeader.no") }}</span>
                      <span>{{ pending.trans_code }}</span>
                    </div>
                    <div class="expansion-header-in-left">
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.status") }}</span>
                        <span>{{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.type") }}</span>
                        <span>{{
                          $t(PENDING_SEARCH_TYPE.I18nKeys[pending.order_type as PENDING_SEARCH_TYPE.Enums])
                        }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.cashFlowType") }}</span>
                        <span>{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.currency") }}</span>
                        <span>{{ currencyName(pending.currency) }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.amount") }}</span>
                        <span>{{ moneyFormat(pending.amount, 2) }}</span>
                      </div>
                    </div>
                    <div class="expansion-header-in-right">
                      <div class="his-r-wrap">
                        <!-- <div class="his-l">
                          <span class="af-his-bln">{{ $t("tableHeader.balance") }}</span>
                        </div>
                        <div class="his-r">
                          <div class="his-amt txt-red">{{ moneyFormat(history.amount) }}</div>
                          <div class="his-amt">{{ moneyFormat(history.after_balance) }}</div>
                        </div>
                        <div class="his-currency">
                          {{ currencyName(history.currency_code) }}
                        </div> -->
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </template>
              <q-card class="expansion-detail">
                <q-card-section>
                  <div class="detail-line"></div>
                  <div class="detail">
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
          <div v-else class="flex items-center justify-center q-expansion-item">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>
        <!--h5 end-->
        <div v-if="pendingOrderState.pagination.totalPage" class="flex justify-end mt-7 custom-pagination">
          <q-pagination
            v-model="pendingOrderState.pagination.page"
            :max="pendingOrderState.pagination.totalPage"
            direction-links
            push
            color="pagination"
            active-design="push"
            active-color="red"
            @update:model-value="handlePagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { QTableProps } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useReport } from "src/common/composables/useReport"
import { useCommon } from "src/common/hooks/useCommon"
import {
  ACTION_TYPE,
  BANNER_POSITION,
  FUND_METHOD_TYPE,
  PENDING_SEARCH_TYPE,
  PENDING_STATUS
} from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
let isMobile = ref(false)
const { width } = useWindowSize()
const { handleBannerList } = useBanner()
const actionType = ACTION_TYPE
const { dateTypesWithoutCustomDate, moneyHistorySearchTypes } = useReport()
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
  pendingOrderCancel,
  currencyHeader,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
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

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
  initPendingOrderQuery()
  getPendingOrderList()
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
@import "../../assets/css/form.sass"

.column-btn
  width: 60px
  padding: 4px
  color: #fff
  border-radius: 4px
  background: #6288D2
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

.container
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 80%
  margin: 0 auto
  +iphone-width
    width: 100%
  .title-area
    display: flex
    justify-content: left
    width: 100%
    margin: 10px 0
    .title
      color: #14141499
      display: flex
      align-items: center
      &:before
        content: ''
        display: inline-block
        width: 20px
        height: 20px
        background-image: url("app/template/set_jokerhill/assets/images/home/title-icon1.png")
        background-size: contain
        background-repeat: no-repeat
        margin: 0 10px
  .history-container
    background: #FFFFFF
    border-radius: 20px
    display: flex
    flex-direction: column
    justify-content: center
    width: 100%
    padding-top: 30px
    .history-area
      width: 100%
      height: auto
      margin: 0 10px
      display: flex
      +iphone-width
        margin: 0
      .history-form
        width: 70%
        margin: 0 auto
        +iphone-width
          width: 100%
          margin: 0 5px
        .tab-area
          display: flex
          flex-direction: row
          justify-content: flex-start
          width: 100%
          margin-bottom: 20px
          white-space: nowrap
          +iphone-width
            flex-wrap: wrap
          .tab-button
            background-color: transparent
            border: 1px solid #6288D2
            color: #14141466
            border-radius: 8px
            width: 140px
            height: 36px
            margin-right: 10px
            cursor: pointer
            +iphone-width
              border: 1px solid #14141466
              width: 30vw
              margin-bottom: 10px
            &:hover
              background-color: #1414141A
            &.active
              background-color: #6288D2
              color: #fff
              +iphone-width
                border: 1px solid #6288D2
        .radio-area
          +setFlex(start, center)
          flex-wrap: wrap
          gap: 1rem
          margin: 10px 0
          +iphone-width
            gap: .5rem
          .date
            display: flex
            gap: .5rem
            cursor: pointer
            .option-input
              appearance: none
              top: .15rem
              right: 0
              bottom: 0
              left: 26%
              height: 20px
              width: 20px
              transition: all 0.15s ease-out 0s
              border: 1px solid #6288D2
              border-radius: 1rem
              cursor: pointer
              display: inline-block
              margin-right: 0.5rem
              outline: none
              position: relative
              &::before
                content: ''
                position: absolute
                top: 50%
                left: 50%
                width: 10px
                height: 10px
                border-radius: 50%
                background: #6288D2
                transform: translate(-50%, -50%)
                opacity: 0
                transition: opacity 0.15s ease-out
              &:checked::before
                opacity: 1
            .body-balance
              span
                color: #14141466
        .date-area
          display: flex
          flex-direction: row
          +iphone-width
            flex-direction: column
          div
            margin: 0 5px
            span
              text-transform: uppercase
              color: #14141466
            &:not(.to-area)
              span
                margin-left: 10px
            &.to-area
              margin-top: 50px
              +iphone-width
                display: none
            div
              :deep(.q-field__control)
                border: 1px solid #6288D2
                border-style: solid
                &:before
                  border-style: unset
                  border-color: unset
              :deep(.q-icon)
                color: #6288D2 !important
          .submit-button-area
            margin-top: 40px
            +iphone-width
              display: flex
              justify-content: center
            .submit-button
              background-color: #6288D2
              color: #fff
              font-weight: bold
              border-radius: 8px
              width: 200px
              height: 36px
              margin-right: 10px
              cursor: pointer
              text-transform: uppercase
    .table-area
      width: 90%
      margin: 3.25rem auto

:deep(.q-table)
  border: none
  th
    border-bottom: 1px solid #141414B3
    color: #6288D2 !important
  td
    span
      color: #14141466
    .q-btn
      span
        color: #fff

.inbox-table
  box-shadow: unset

:deep(.text-white)
  color: #14141466 !important

:deep(.bg-red)
  background: #6288D2 !important
  color: #fff !important

:deep(.q-pagination .pagination)
  background-color: red !important
  color: white !important

:deep(.q-pagination__content button::before)
  border-bottom: unset !important

:deep(.q-btn::before)
  box-shadow: unset

.inbox-table
  border-bottom: 1px solid #000

.q-expansion-item
  +iphone-width
    border: 1px solid #6288D2
    border-radius: 4px
    margin-bottom: 10px

.expansion-header-in-left
  +iphone-width
    display: flex
    justify-content: center
    width: 100%
    .mobile-header-item
      +iphone-width
        // flex: 1
        margin: 0 10px
        max-width: 20%
        box-sizing: border-box
        text-align: center
        display: flex
        flex-direction: column
        align-items: flex-start
        span
          width: 100%
          margin-bottom: 4px
          font-size: 12px
          &:first-child
            color: #6288D2
          &:last-child
            color: #1c1e2280

.expansion-detail
  background: #A2B3D6
  font-size: 0.8rem

.detail
  +iphone-width
    display: flex
    flex-direction: column
  .expansion-item
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 5px
    span:first-child
      color: #FFFFFFB3
      flex: 1
    span:last-child
      color: #FFFFFF
      text-align: left
      width: 200px

.expansion-top-header
  display: flex
  flex-direction: row
  margin: 5px 0
  border-bottom: 0.5px solid #6288D2
  padding-bottom: 5px
  span
    font-size: 12px
    &:first-child
      color: #6288D2
      margin-right: 10px
    &:last-child
      color: #1c1e2280

:deep(.q-expansion-item__toggle-icon)
  margin-top: 30px
</style>
