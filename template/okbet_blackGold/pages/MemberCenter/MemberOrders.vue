<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :title-i18n="PENDING_SEARCH_TYPE.I18nTitle[pendingOrderState.query.search_type]"
    variant="blackGold"
  >
    <div class="h5-order-container">
      <q-form @submit="handleSubmit">
        <!-- 時間選擇 -->
        <div class="date-picker-container">
          <div class="date-container">
            <div class="date-input-item">
              <div class="text text-white">{{ $t("tableHeader.startDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.start_date"
                readonly
                dark
                class="date-input"
                :class="{ active: StartDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="StartDatePickerShow = true" @hide="StartDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.start_date" mask="YYYY-MM-DD" minimal color="dark" />
                </q-menu>
              </q-input>
            </div>
            <div class="date-input-item right">
              <div class="text text-white">{{ $t("tableHeader.endDate") }}</div>
              <q-input
                outlined
                v-model="pendingOrderState.query.end_date"
                readonly
                dark
                class="date-input"
                :class="{ active: EndDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="EndDatePickerShow = true" @hide="EndDatePickerShow = false">
                  <q-date v-model="pendingOrderState.query.end_date" mask="YYYY-MM-DD" minimal color="dark" />
                </q-menu>
              </q-input>
            </div>
          </div>
          <q-btn color="submit" type="submit" class="btn-submit">{{ $t("common.btn.search") }}</q-btn>
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
                  <span class="title">{{ $t("tableHeader.uploadDetail") }}</span>
                  <span class="text">
                    <q-btn
                      :disabled="
                        pending.status === PENDING_STATUS.Enums.cancel ||
                        pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Withdrawal
                      "
                      class="column-btn bg-gold text-dark"
                      @click="handleUploadDetail(pending.trans_code)"
                      :label="$t('tableHeader.uploadDetail')"
                    />
                  </span>
                </q-card-section>
                <!-- <q-card-section>
                  <span class="title">{{ $t("tableHeader.cancel") }}</span>
                  <span class="text">
                    <q-btn
                      :disabled="cancelBtnDisable(pending)"
                      class="column-btn bg-gold text-dark"
                      @click="pendingOrderCancel(pending as any)"
                      :label="$t('tableHeader.cancel')"
                    />
                  </span>
                </q-card-section> -->
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
      <span class="text-white member-title">{{ $t("menu.order") }}</span>
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
                  color="primary"
                  minimal
                  @range-end="hideMenu"
                  @update:model-value="handleDateRangePick"
                />
              </q-menu>
            </q-btn>
          </div>
          <div class="flex items-center justify-between w-full mt-8 mb-5">
            <div class="btn-toggle-wrap">
              <q-btn-toggle
                v-model="pendingOrderState.query.dateType"
                no-caps
                unelevated
                toggle-color="gold"
                toggle-text-color="dark"
                class="toggle-date-picker h-9 font"
                :options="dayTypeTabs"
              />
            </div>

            <div class="flex items-center">
              <q-btn type="submit" class="text-dark bg-gold font-normal capitalize rounded-lg w-28 h-9 min-h-9 font">{{
                $t("common.btn.search")
              }}</q-btn>
              <q-btn
                outline
                color="gold"
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
            <q-td
              key="status"
              :props="props"
              class="custom-td"
              :class="{ 'text-success': props.row.status === PENDING_STATUS.Enums.confirmed }"
            >
              {{ $t(PENDING_STATUS.I18nKeys[props.row.status as PENDING_STATUS.Enums]) }}
            </q-td>
            <q-td
              key="upload"
              :props="props"
              class="custom-td"
              width="120px"
              v-if="pendingOrderState.query.search_type === PENDING_SEARCH_TYPE.Enums.Deposit"
            >
              <q-btn
                class="bg-gold text-dark"
                @click="handleUploadDetail(props.row.trans_code)"
                :label="$t('tableHeader.uploadDetail')"
              />
            </q-td>
            <q-td key="cancel" :props="props" class="custom-td" width="100px">
              <q-btn
                :disabled="cancelBtnDisable(props.row)"
                class="column-btn bg-gold text-dark"
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
  <DepositDetailUpload ref="depositDetailUploadRef" />
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { useQuasar } from "quasar"
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
  const baseColumns = pendingTableColumns.value || []

  if (pendingOrderState.query.search_type !== PENDING_SEARCH_TYPE.Enums.Deposit) {
    return baseColumns
  }

  return [
    ...baseColumns,
    {
      name: "upload",
      field: "upload",
      align: "center" as const,
      label: t("tableHeader.uploadDetail")
    },
    {
      name: "cancel",
      field: "cancel",
      align: "center" as const,
      label: t("tableHeader.cancel")
    }
  ]
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
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";
@import "app/template/okbet_blackGold/assets/css/reports.scss";

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
  .img-order {
    width: 262px;
    height: auto;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.h5-order-container {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #040404;

  @include phone-width {
    margin-top: 0.625rem;
  }
  :deep(.q-field--outlined) {
    .q-field__control:before {
      border: 1px solid rgba(146, 146, 146, 0.57);
    }
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

.member-title {
  font-size: 50px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.btn-toggle-wrap {
  :deep(.q-btn-group) {
    border: 1px solid rgba(247, 217, 157, 1) !important;
    border-radius: 10px !important;
  }
}

:deep(.bg-gold) {
  background-image: linear-gradient(180deg, #f7d99d 0%, #a48155 100%);
}

.text-gold {
  color: rgba(209, 177, 124, 1);
}

.text-success {
  color: #51e045;
}

:deep(.q-expansion-item) {
  .q-item {
    background: rgba(30, 30, 30, 1) !important;
    .q-icon {
      color: #fff !important;
    }
    .title {
      color: #fff !important;
    }
  }
  border: 1px solid rgba(146, 146, 146, 0.57) !important;
  .q-expansion-item__content {
    .q-card {
      background-color: #040404;
      .text,
      .title {
        color: #fff !important;
      }
    }
  }
}

.report-content .q-scrollarea .footer {
  background: rgba(129, 111, 75, 1);
  color: rgba(0, 0, 0, 0.5);
}
</style>
