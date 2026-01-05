<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :title-i18n="HISTORY_SEARCH_TYPE.I18nTitle[historyState.query.search_type]"
    variant="purple-dark"
  >
    <div class="h5-history-container">
      <q-form @submit="handleSubmit">
        <div class="date-picker-container">
          <div class="date-container">
            <div class="date-input-item">
              <div class="text">{{ $t("tableHeader.startDate") }}</div>
              <q-input
                outlined
                v-model="historyState.query.start_date"
                readonly
                class="date-input"
                :class="{ active: StartDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="StartDatePickerShow = true" @hide="StartDatePickerShow = false">
                  <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" minimal color="primary" />
                </q-menu>
              </q-input>
            </div>
            <div class="date-input-item right">
              <div class="text">{{ $t("tableHeader.endDate") }}</div>
              <q-input
                outlined
                v-model="historyState.query.end_date"
                readonly
                class="date-input"
                :class="{ active: EndDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="EndDatePickerShow = true" @hide="EndDatePickerShow = false">
                  <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" minimal color="primary" />
                </q-menu>
              </q-input>
            </div>
          </div>
          <q-btn type="submit" class="btn-submit">{{ $t("common.btn.search") }}</q-btn>
        </div>
        <div class="report-content">
          <q-scroll-area v-if="historyState.list.length" @scroll="handleScroll" :visible="false" ref="scrollAreaRef">
            <q-expansion-item
              v-for="(history, index) in historyState.list"
              :key="index"
              switch-toggle-side
              dense
              dense-toggle
              default-opened
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section class="title-section">
                  <span class="title">{{ $t("tableHeader.timeNumber") }} : {{ history.id }}</span>
                  <span class="mr-2 text">{{ moneyFormat(history.amount) }}</span>
                </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountChangeTime") }}</span>
                  <span class="text">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ currencyHeader }}</span>
                  <span class="text">{{ currencyName(history.currency_code) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountType") }}</span>
                  <span class="text">{{
                    $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0])
                  }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountVariableObject") }}</span>
                  <span class="text">
                    <p v-if="history.action_target">{{ history.action_target }}</p>
                    {{ history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code }}
                  </span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                  <span class="text">{{ moneyFormat(history.before_balance) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.amountAfterChange") }}</span>
                  <span class="text">{{ moneyFormat(history.after_balance) }}</span>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <div class="footer">
              {{ $t("member.mail.noMoreDataToDisplay") }}
            </div>
          </q-scroll-area>
          <div v-else class="no-data">
            <img :src="memberImg('fund-no-data.png')" alt="no-data" />
            <p>{{ $t("tableHeader.noContent") }}</p>
          </div>
        </div>
      </q-form>
    </div>
  </HeaderTitleBack>
  <div v-else class="pc-history-container">
    <q-form @submit="handleSubmit" @reset="handleReset">
      <p class="history-title">{{ $t("menu.history") }}</p>
      <!-- 類型切換 -->
      <q-tabs v-model="historyState.query.search_type" :outside-arrows="false" :mobile-arrows="false" class="type-tabs">
        <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
          {{ $t(item.label) }}
        </q-tab>
      </q-tabs>
      <!-- 表單 -->
      <q-table
        :rows="historyState.list"
        :rows-per-page-options="[historyState.pagination?.rowsPerPage || 10]"
        :columns="historyTableColumns"
        row-key="id"
        v-model:pagination="historyState.pagination"
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
              >{{ historyState.query.start_date }} {{ $t("common.btn.to") }} {{ historyState.query.end_date }}
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
            <q-btn-toggle
              v-model="historyState.query.dateType"
              no-caps
              unelevated
              toggle-color="primary"
              class="toggle-date-picker h-9 font"
              :options="dayTypeTabs"
            />
            <div class="flex items-center">
              <q-btn
                color="primary"
                type="submit"
                class="text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font"
                >{{ $t("common.btn.search") }}</q-btn
              >
              <q-btn
                outline
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
            <q-td class="custom-td" key="accountChangeTime" :props="props" width="15%">
              <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </q-td>
            <q-td class="custom-td" key="currency" :props="props">
              <span>{{ currencyName(props.row.currency_code) }}</span>
            </q-td>
            <q-td class="custom-td" key="accountType" :props="props">
              <span>{{ $t(actionType.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
            </q-td>
            <q-td class="custom-td" key="accountVariableObject" :props="props">
              <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
              <span class="text-transaction-code">{{
                props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
              }}</span>
            </q-td>
            <q-td class="custom-td" key="amount" :props="props">
              <span>{{ moneyFormat(props.row.amount, 2) }}</span>
            </q-td>
            <q-td class="custom-td" key="amountBeforeChanges" :props="props">
              <span>{{ moneyFormat(props.row.before_balance, 2) }}</span>
            </q-td>
            <q-td class="custom-td" key="amountAfterChange" :props="props">
              <span>{{ moneyFormat(props.row.after_balance, 2) }}</span>
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
      <div v-if="historyState.pagination.totalPage" class="flex justify-end q-pa-md custom-pagination">
        <q-pagination
          v-model="historyState.pagination.page"
          :max="historyState.pagination.totalPage"
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
import { onMounted, ref, nextTick, computed } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { dateformat } from "src/common/utils/dayjsUtils"
import { ACTION_TYPE, HISTORY_SEARCH_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const $q = useQuasar()
const { t } = useI18n()
const { moneyFormat } = useCommon()
const { getWideLogo } = useLogo()
const { memberImg } = useSiteImg()
const {
  historyTableColumns,
  historyState,
  isLoading,
  handleDateRangePick,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  handleTableRequest,
  handleScroll,
  currencyName,
  currencyHeader
} = useHistory()

const searchTabs = computed(() => [
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Deposit]),
    value: HISTORY_SEARCH_TYPE.Enums.Deposit
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Withdrawal]),
    value: HISTORY_SEARCH_TYPE.Enums.Withdrawal
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.BetHistory]),
    value: HISTORY_SEARCH_TYPE.Enums.BetHistory
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Promotion]),
    value: HISTORY_SEARCH_TYPE.Enums.Promotion
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
const datePickerValue = ref({ from: historyState.query.start_date, to: historyState.query.end_date })
const actionType = ACTION_TYPE

const handleSubmit = () => {
  historyState.pagination.page = 1
  getHistoryList()
  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const hideMenu = () => {
  menuRef.value.hide()
}

const handleReset = async () => {
  historyState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  await nextTick()
  await getHistoryList()
}

onMounted(async () => {
  if ($q.platform.is.mobile) {
    // 要search type, 但不要page
    initHistoryQuery()
    historyState.query.offset = 0
    historyState.pagination.page = 1
    historyState.query.size = 15
    historyState.pagination.rowsPerPage = 15
    historyState.pagination.rowsNumber = 15
  } else {
    historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.Deposit
    historyState.query.size = 10
    historyState.pagination.rowsPerPage = 10
    historyState.pagination.rowsNumber = 10
    // 需要在最後查詢query search type，因為沒有all，並且rowsNumber改動會驅動handlePagination
    initHistoryQuery()
  }
  await getHistoryList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";
@import "app/template/okbet_purple/assets/css/reports.scss";

.type-tabs {
  font-family: OpenSans;
}

.pc-history-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  border-radius: 20px;
  padding: 70px 45px 0px;

  .history-title {
    @apply text-[3.125rem] font-extrabold;
    color: $text-light-secondary;
    text-transform: capitalize;
  }

  :deep(.q-table__top) {
    .bg-primary {
      background-color: $bg-secondary !important;
    }
  }

  :deep(.q-table) {
    border-bottom: 1px solid $text-light-secondary !important;
  }
}

.h5-history-container {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: $text-light-secondary;

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

  @include phone-width {
    margin-top: 0.625rem;
  }

  :deep(.q-table__top) {
    .bg-primary {
      background-color: $bg-secondary !important;
    }
  }

  :deep(.q-table) {
    color: $text-light-secondary !important;
    border-bottom: 1px solid $text-light-secondary !important;
  }

  .btn-submit {
    background-color: $bg-secondary !important;
    color: $text-light-secondary !important;
  }
}

.text-transaction-code {
  color: $bg-secondary !important;
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
