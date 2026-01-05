<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :title-i18n="PENDING_SEARCH_TYPE.I18nTitle[pendingOrderState.query.search_type]"
    variant="redBlack"
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
                  <q-date
                    v-model="pendingOrderState.query.start_date"
                    mask="YYYY-MM-DD"
                    minimal
                    color="primary"
                    text-color="black"
                  />
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
                  <q-date
                    v-model="pendingOrderState.query.end_date"
                    mask="YYYY-MM-DD"
                    minimal
                    color="primary"
                    text-color="black"
                  />
                </q-menu>
              </q-input>
            </div>
          </div>
          <q-btn color="primary" text-color="black" type="submit" class="btn-submit">{{
            $t("common.btn.search")
          }}</q-btn>
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
                  <div class="flex justify-between pr-2">
                    <div class="flex flex-col">
                      <span class="title">{{ $t("tableHeader.status") }}</span>
                      <span class="text">{{
                        $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums])
                      }}</span>
                    </div>
                    <q-btn
                      v-if="pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Deposit"
                      color="primary"
                      @click="handleUploadDetail(pending.trans_code)"
                      :label="$t('tableHeader.uploadDetail')"
                    />
                  </div>
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
      <h2 class="pc-order-title">{{ $t("menu.order") }}</h2>
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
        :columns="filteredPendingTableColumns"
        row-key="id"
        v-model:pagination="pendingOrderState.pagination"
        :loading="isLoading"
        hide-pagination
        wrap-cells
        @request="handleTableRequest"
        flat
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <!-- 時間選擇 -->
        <template #top>
          <div class="flex items-center w-full text-base">
            <p class="mr-1 text-white font">{{ $t("member.profile.date") }}:</p>
            <q-btn
              flat
              square
              class="min-h-0 p-0 capitalize border-b border-solid hide-hover text-white border-b-[#D25C5C] date-font"
              :icon-right="datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'"
              >{{ pendingOrderState.query.start_date }} {{ $t("common.btn.to") }} {{ pendingOrderState.query.end_date }}
              <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
                <q-date
                  v-model="datePickerValue"
                  range
                  mask="YYYY-MM-DD"
                  color="primary"
                  text-color="black"
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
              toggle-text-color="black"
              text-color="white"
              class="toggle-date-picker h-9 font"
              :options="dayTypeTabs"
            />
            <div class="flex items-center">
              <q-btn
                color="primary"
                text-color="black"
                type="submit"
                class="text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font"
                >{{ $t("common.btn.search") }}</q-btn
              >
              <q-btn
                outline
                color="white"
                type="reset"
                class="ml-2 text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font"
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
            <q-td
              key="upload"
              :props="props"
              class="custom-td"
              v-if="pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Deposit"
            >
              <q-btn
                color="primary"
                @click="handleUploadDetail(props.row.trans_code)"
                :label="$t('tableHeader.uploadDetail')"
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
          color="white"
          active-color="active-pagination"
          icon-prev="arrow_left"
          icon-next="arrow_right"
        />
      </div>
    </q-form>
  </div>
  <DepositDetailUpload ref="depositDetailUploadRef" />
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import { QTableProps, useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useLogo } from "src/common/composables/useLogo"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"

const $q = useQuasar()
const { t } = useI18n()
const { moneyFormat } = useCommon()
const { memberImg } = useSiteImg()
const { getWideLogo } = useLogo()
const {
  isLoading,
  pendingTableColumns,
  pendingOrderState,
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
    name: "upload",
    field: "upload",
    align: "center",
    label: t("tableHeader.uploadDetail")
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

const depositDetailUploadRef = ref()

const handleUploadDetail = (transCode: string) => {
  depositDetailUploadRef.value.openDialog(transCode)
}

const filteredPendingTableColumns = computed(() => {
  return pendingOrderState.query.search_type !== PENDING_SEARCH_TYPE.Enums.Deposit
    ? tableCulumns.value?.filter((item) => item.name !== "upload")
    : tableCulumns.value
})

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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/button.scss";
@import "app/template/okbet_redBlack/assets/css/reports.scss";

.type-tabs {
  font-family: OpenSans;
}

.pc-order-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  border-radius: 20px;
  padding: 70px 45px 0px;
  .pc-order-title {
    font-family: NotoSansTC;
    font-weight: 800;
    font-size: 50px;
    line-height: 100%;
    color: #fff4f4;
  }
}

.h5-order-container {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @include phone-width {
    margin-top: 0.625rem;
  }
}

.font {
  font-family: OpenSans;
}

:deep(.date-font > .q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row) {
  font-family: serif;
}

@media screen and (max-width: 768px) {
  :deep(.btn-submit > .q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row) {
    font-family: Helvetica;
  }
}

:deep(.q-table > thead > tr > th),
.custom-td {
  font-family: OpenSans;
}

:deep(.date-input-item > .text) {
  font-family: Helvetica !important;
}

.btn-submit {
  font-family: Helvetica;
}

.title,
.text,
.footer {
  font-family: Helvetica;
}
</style>
