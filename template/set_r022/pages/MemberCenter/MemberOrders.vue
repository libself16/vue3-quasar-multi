<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" title-i18n="menu.order">
    <div class="h5-order-area">
      <div class="top-area">
        <div class="type-area">
          <div class="w-full flex flex-nowrap">
            <template v-for="item in searchTabs" :key="item.value">
              <q-btn
                :label="$t(item.label)"
                class="type-area-btn"
                :class="{ active: pendingOrderState.query.search_type === item.value }"
                @click="pendingOrderState.query.search_type = item.value"
              />
            </template>
          </div>
        </div>

        <div class="date-select-area">
          <q-tabs
            v-model="pendingOrderState.query.dateType"
            :outside-arrows="false"
            :mobile-arrows="false"
            class="date-tabs-area"
          >
            <q-tab v-for="item in dayTypeTabs" :key="item.value" :name="item.value" class="date-tab">
              {{ $t(item.label) }}
            </q-tab>
          </q-tabs>

          <div class="custom-date">
            <div class="custom-date-item">
              <div class="custom-date-text">{{ $t("tableHeader.startDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.start_date"
                readonly
                class="custom-date-input"
                :class="{ active: startDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="startDatePickerShow = true" @hide="startDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD" minimal color="primary" />
                </q-menu>
              </q-input>
            </div>
            <div class="custom-date-item right">
              <div class="custom-date-text">{{ $t("tableHeader.endDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.end_date"
                readonly
                class="custom-date-input"
                :class="{ active: endDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="endDatePickerShow = true" @hide="endDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD" minimal color="primary" />
                </q-menu>
              </q-input>
            </div>
          </div>

          <div class="search-btn-area">
            <q-btn outline class="reset-btn" @click="handleReset()">
              {{ $t("common.btn.reset") }}
            </q-btn>
            <q-btn class="search-btn" @click="handleSubmit()">
              {{ $t("common.btn.search") }}
            </q-btn>
          </div>
        </div>
      </div>

      <div class="data-table">
        <!-- 卡片列表 -->
        <q-scroll-area
          v-if="pendingOrderState.list.length"
          @scroll="handleScroll"
          :visible="false"
          ref="scrollAreaRef"
          class="h-full"
        >
          <q-expansion-item
            v-for="(pending, index) in pendingOrderState.list"
            :key="index"
            switch-toggle-side
            dense
            dense-toggle
            default-opened
            expand-icon="keyboard_arrow_down"
            class="data-expansion-item"
          >
            <template v-slot:header>
              <q-item-section class="title-section">
                <div class="title">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
                <div class="text">{{ moneyFormat(pending.actual_amount, 2) }}</div>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.no") }}</div>
                <div class="text link" @click="handleUploadDetail(pending.trans_code, true)">
                  {{ pending.trans_code }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.cashFlowType") }}</div>
                <div class="text">{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.paymentProvider") }}</div>
                <div class="text">{{ pending.payment_gateway_name }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ currencyHeader }}</div>
                <div class="text">{{ currencyName(pending.currency) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.amount") }}</div>
                <div class="text">{{ moneyFormat(pending.amount, 2) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.actualAmount") }}</div>
                <div class="text">{{ moneyFormat(pending.actual_amount, 2) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.dateOfApplication") }}</div>
                <div class="text">{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </q-card-section>
              <q-card-section class="status">
                <div class="title">{{ $t("tableHeader.status") }}</div>
                <div class="text">{{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.uploadDetail") }}</div>
                <div class="text">
                  <q-btn
                    :disabled="pending.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
                    color="primary"
                    class="column-btn"
                    @click="handleUploadDetail(pending.trans_code, false)"
                    :label="$t('tableHeader.uploadDetail')"
                  />
                </div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.cancel") }}</div>
                <div class="text">
                  <q-btn
                    :disabled="cancelBtnDisable(pending)"
                    color="primary"
                    class="column-btn"
                    @click="pendingOrderCancel(pending as any)"
                    :label="$t('tableHeader.cancel')"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <div class="data-footer">
            {{ $t("member.mail.noMoreDataToDisplay") }}
          </div>
        </q-scroll-area>
        <div v-else class="no-data-area">
          <img :src="resultImages('history/no-data.png')" alt="" />
          <div class="no-data-text">{{ $t("tableHeader.no_data") }}</div>
        </div>
      </div>
    </div>
  </HeaderTitleBack>

  <div v-else class="pc-order-area">
    <div class="top-area">
      <div class="title">{{ $t("menu.order") }}</div>

      <div class="type-area">
        <template v-for="item in searchTabs" :key="item.value">
          <q-btn
            :label="$t(item.label)"
            class="type-area-btn"
            :class="{ active: pendingOrderState.query.search_type === item.value }"
            @click="pendingOrderState.query.search_type = item.value"
          />
        </template>
      </div>

      <div class="date-select-area">
        <div class="flex items-center justify-start">
          <q-tabs
            v-model="pendingOrderState.query.dateType"
            :outside-arrows="false"
            :mobile-arrows="false"
            class="date-tabs-area"
          >
            <q-tab v-for="item in dayTypeTabs" :key="item.value" :name="item.value" class="date-tab">
              {{ $t(item.label) }}
            </q-tab>
          </q-tabs>

          <div class="custom-date">
            <p class="mr-1 font">{{ $t("member.profile.date") }}:</p>
            <q-btn
              flat
              square
              class="custom-date-select"
              :icon-right="datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'"
            >
              {{ pendingOrderState.query.start_date }} {{ $t("common.btn.to") }} {{ pendingOrderState.query.end_date }}
              <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
                <q-date
                  v-model="datePickerValue"
                  range
                  mask="YYYY-MM-DD"
                  color="primary"
                  minimal
                  @range-end="hideMenu"
                  @update:model-value="handleDateRangePick"
                />
              </q-menu>
            </q-btn>
          </div>
        </div>

        <div class="search-btn-area">
          <q-btn outline class="reset-btn" @click="handleReset()">
            {{ $t("common.btn.reset") }}
          </q-btn>
          <q-btn class="search-btn" @click="handleSubmit()">
            {{ $t("common.btn.search") }}
          </q-btn>
        </div>
      </div>
    </div>

    <div class="data-table">
      <q-table
        class="custom-scroll-container table-list"
        :rows="pendingOrderState.list"
        :rows-per-page-options="[pendingOrderState.pagination?.rowsPerPage || 10]"
        :columns="tableCulumns"
        row-key="id"
        v-model:pagination="pendingOrderState.pagination"
        :loading="isLoading"
        hide-pagination
        @request="handleTableRequest"
        flat
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #body="props">
          <q-tr>
            <q-td key="type" :props="props" class="custom-td" width="100px">
              {{ $t(PENDING_SEARCH_TYPE.I18nKeys[props.row.order_type as PENDING_SEARCH_TYPE.Enums]) }}
            </q-td>
            <q-td key="no" :props="props" class="custom-td" width="100px">
              <a @click="handleUploadDetail(props.row.trans_code, true)" class="link">{{ props.row.trans_code }}</a>
            </q-td>
            <q-td key="cashFlowType" :props="props" class="custom-td" width="100px">
              {{ getPaymentTypeName(props.row.payment_type) }}
            </q-td>
            <q-td key="paymentProvider" :props="props" class="custom-td" width="100px">
              {{ props.row.payment_gateway_name }}
            </q-td>
            <q-td key="currency" :props="props" class="custom-td" width="100px">
              {{ currencyName(props.row.currency) }}
            </q-td>

            <q-td key="amount" :props="props" class="custom-td" width="100px">
              {{ moneyFormat(props.row.amount, 2) }}
            </q-td>
            <q-td key="actualAmount" :props="props" class="custom-td" width="100px">
              {{ moneyFormat(props.row.actual_amount, 2) }}
            </q-td>
            <q-td key="dateOfApplication" :props="props" class="custom-td" width="100px">
              {{ dateformat(props.row.submit_date, "YYYY-MM-DD HH:mm:ss") }}
            </q-td>
            <q-td key="status" :props="props" class="custom-td" width="100px">
              {{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}
            </q-td>
            <q-td key="upload" :props="props" class="custom-td">
              <q-btn
                :disabled="props.row.status === PENDING_STATUS.Enums.cancel || !uploadSwitch"
                class="column-btn"
                @click="handleUploadDetail(props.row.trans_code, false)"
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
          <div class="no-data-area">
            <img :src="resultImages('history/no-data.png')" alt="" />
            <div class="no-data-text">{{ $t("tableHeader.no_data") }}</div>
          </div>
        </template>
      </q-table>
    </div>
    <div v-if="pendingOrderState.pagination.totalPage" class="flex justify-end q-pa-md custom-pagination">
      <q-pagination
        v-model="pendingOrderState.pagination.page"
        :max="pendingOrderState.pagination.totalPage"
        :max-pages="5"
        :boundary-numbers="false"
        @update:model-value="handlePagination"
        direction-links
        flat
        active-design="flat"
        color="deep-grey"
        active-color="blue-8"
        icon-prev="arrow_left"
        icon-next="arrow_right"
      />
    </div>
  </div>

  <DepositDetailUpload ref="depositDetailUploadRef" />
  <WithdrawalDetailUpload ref="withdrawalDetailUploadRef" />
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { QTableProps } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnvInfoStore } from "src/stores/envStore"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import WithdrawalDetailUpload from "./components/WithdrawalDetailUpload.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"

const { t } = useI18n()
const { resultImages } = useSiteImg()
const { moneyFormat } = useCommon()
const { isLargeTablet } = useMediaQuery()
const { envInfo } = useEnvInfoStore()
const {
  isLoading,
  cancelBtnDisable,
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

const uploadSwitch = computed(() => Boolean(envInfo.upload_details))

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
const startDatePickerShow = ref(false)
const endDatePickerShow = ref(false)
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

watch(
  () => pendingOrderState.query.search_type,
  async () => {
    await nextTick()
    await getPendingOrderList()
  }
)

onMounted(async () => {
  if (isLargeTablet.value) {
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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";
@import "app/template/set_r022/assets/css/reports.scss";

//捲軸底色
/* Webkit 滚动条样式 */
.custom-scroll-container::-webkit-scrollbar {
  width: 40px;
  height: 20px;
}

.custom-scroll-container::-webkit-scrollbar-thumb {
  background: var(--primary-01);
  border-radius: 5px;
}

.custom-scroll-container::-webkit-scrollbar-track {
  background: var(--neutral-04);
  border-radius: 5px;
}

/* Firefox 滚动条样式 */
.custom-scroll-container {
  scrollbar-color: var(--primary-01) var(--neutral-04);
  scrollbar-width: thin;
}

.pc-order-area {
  width: 100%;
  max-width: 87.5rem;
  padding: 1.525rem 0 10%;
  margin: 0 auto;
}

.h5-order-area {
  width: 100%;
  height: 100%;
  background: var(--bg-main-bg);
}
</style>
