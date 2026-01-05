<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" title-i18n="menu.history">
    <div class="h5-history-area">
      <div class="top-area">
        <div class="type-area">
          <div class="w-full flex flex-nowrap">
            <template v-for="item in searchTabs" :key="item.value">
              <q-btn
                v-if="item.label !== t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.All])"
                :label="$t(item.label)"
                class="type-area-btn"
                :class="{ active: historyState.query.search_type === item.value }"
                @click="historyState.query.search_type = item.value"
              />
            </template>
          </div>
        </div>

        <!-- 投注歷史 幣別 -->
        <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="currency-area">
          <span class="font-semibold text-xl mr-2.5">{{ $t("collaboration.currency") }}</span>
          <q-select
            v-model="historyState.query.currency_id"
            :options="bettingHistoryCurrencyList"
            rounded
            dense
            borderless
            option-label="label"
            option-value="value"
            emit-value
            map-options
            class="currency-select"
          />
        </div>

        <div class="date-select-area">
          <q-tabs
            v-model="historyState.query.dateType"
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
                v-model="historyState.query.start_date"
                readonly
                class="custom-date-input"
                :class="{ active: startDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="startDatePickerShow = true" @hide="startDatePickerShow = false">
                  <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" minimal color="primary" />
                </q-menu>
              </q-input>
            </div>
            <div class="custom-date-item right">
              <div class="custom-date-text">{{ $t("tableHeader.endDate") }}</div>
              <q-input
                outlined
                v-model="historyState.query.end_date"
                readonly
                class="custom-date-input"
                :class="{ active: endDatePickerShow }"
              >
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
                <q-menu @show="endDatePickerShow = true" @hide="endDatePickerShow = false">
                  <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" minimal color="primary" />
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

      <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="ai-total-area">
        <div class="total-item">
          <div class="total-item-title">{{ $t("menu.validBet") }}</div>
          <div class="total-item-amount">{{ moneyFormat(validBetAmount) }}</div>
        </div>

        <div class="total-item">
          <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
          <div class="total-item-amount">{{ moneyFormat(winLossAmount) }}</div>
        </div>
      </div>

      <div class="data-table">
        <q-scroll-area
          v-if="historyState.list.length"
          @scroll="handleScroll"
          :visible="false"
          ref="scrollAreaRef"
          class="h-full"
        >
          <q-expansion-item
            v-for="(history, index) in historyState.list"
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
                <div class="title">{{ $t("tableHeader.timeNumber") }} : {{ history.id }}</div>
                <div class="mr-2 text">{{ moneyFormat(history.amount) }}</div>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="text">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ currencyHeader }}</div>
                <div class="text">{{ currencyName(history.currency_code) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.accountType") }}</div>
                <div class="text">
                  {{ $t(ACTION_TYPE.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0]) }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.accountVariableObject") }}</div>
                <div
                  class="text link"
                  @click="
                    handleUploadDetail(
                      history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code,
                      history.action_type
                    )
                  "
                >
                  <p v-if="history.action_target">{{ history.action_target }}</p>
                  {{ history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code }}
                </div>
              </q-card-section>
              <q-card-section v-if="!!aiAgentStatus && history.action_type === ACTION_TYPE.Enums.BET">
                <div class="title">{{ $t("tableHeader.bettingMethod") }}</div>
                <div class="text">
                  {{
                    history.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                      ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                      : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                  }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.amountBeforeChanges") }}</div>
                <div class="text">{{ moneyFormat(history.before_balance) }}</div>
              </q-card-section>
              <q-card-section>
                <div class="title">{{ $t("tableHeader.amountAfterChange") }}</div>
                <div class="text">{{ moneyFormat(history.after_balance) }}</div>
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

  <div v-else class="pc-history-area">
    <div class="top-area">
      <div class="title">{{ $t("menu.history") }}</div>

      <div class="type-area">
        <template v-for="item in searchTabs" :key="item.value">
          <q-btn
            v-if="item.label !== t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.All])"
            :label="$t(item.label)"
            class="type-area-btn"
            :class="{ active: historyState.query.search_type === item.value }"
            @click="historyState.query.search_type = item.value"
          />
        </template>
      </div>

      <!-- 投注歷史 幣別 -->
      <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="currency-area">
        <span class="font-semibold text-xl mr-2.5">{{ $t("collaboration.currency") }}</span>
        <q-select
          v-model="historyState.query.currency_id"
          :options="bettingHistoryCurrencyList"
          rounded
          dense
          borderless
          option-label="label"
          option-value="value"
          emit-value
          map-options
          class="currency-select"
        />
      </div>

      <div class="date-select-area">
        <div class="flex items-center justify-start">
          <q-tabs
            v-model="historyState.query.dateType"
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
              {{ historyState.query.start_date }} {{ $t("common.btn.to") }} {{ historyState.query.end_date }}
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
      <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="ai-total-area">
        <div class="total-item">
          <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
          <div class="total-item-amount">{{ moneyFormat(winLossAmount) }}</div>
        </div>

        <div class="total-item">
          <div class="total-item-title">{{ $t("menu.validBet") }}</div>
          <div class="total-item-amount">{{ moneyFormat(validBetAmount) }}</div>
        </div>
      </div>

      <q-table
        v-model:pagination="historyState.pagination"
        :rows="historyState.list"
        :rows-per-page-options="[historyState.pagination?.rowsPerPage || 10]"
        :columns="dynamicColumns"
        :loading="isLoading"
        row-key="id"
        hide-pagination
        wrap-cells
        flat
        class="table-list"
        @request="handleTableRequest"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #body="props">
          <q-tr>
            <q-td class="custom-td" key="accountChangeTime" :props="props" width="15%">
              <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </q-td>
            <q-td class="custom-td" key="currency" :props="props">
              <span>{{ currencyName(props.row.currency_code) }}</span>
            </q-td>
            <q-td class="custom-td" key="accountType" :props="props">
              <span>{{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
            </q-td>
            <q-td class="custom-td" key="accountVariableObject" :props="props">
              <p v-if="props.row.action_target">
                {{ props.row.action_target }}
              </p>
              <span
                class="link"
                @click="
                  handleUploadDetail(
                    props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code,
                    props.row.action_type
                  )
                "
              >
                {{
                  props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
                }}
              </span>
            </q-td>
            <q-td class="custom-td" key="betMethod" :props="props">
              <span>
                {{
                  props.row.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                    ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                    : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                }}
              </span>
            </q-td>
            <q-td class="custom-td" key="amount" :props="props">
              <span>{{ moneyFormat(props.row.amount, 2) }}</span>
            </q-td>
            <q-td class="custom-td" key="amountBeforeChanges" :props="props">
              <span>{{ moneyFormat(props.row.before_balance) }}</span>
            </q-td>
            <q-td class="custom-td" key="amountAfterChange" :props="props">
              <span>{{ moneyFormat(props.row.after_balance) }}</span>
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
    <div v-if="historyState.pagination.totalPage" class="flex justify-end q-pa-md custom-pagination">
      <q-pagination
        v-model="historyState.pagination.page"
        :max="historyState.pagination.totalPage"
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
import { onMounted, ref, computed, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useHistory } from "src/common/composables/useHistory"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"
import WithdrawalDetailUpload from "./components/WithdrawalDetailUpload.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import {
  ACTION_TYPE,
  REPORT_DATE_TYPES,
  HISTORY_SEARCH_TYPE,
  WALLET_TYPE,
  HISTORY_UPDATED_BY_TYPE
} from "src/common/utils/constants"

const { t } = useI18n()
const route = useRoute()
const { aiAgentStatus } = useEnv()
const { moneyFormat } = useCommon()
const { isLargeTablet } = useMediaQuery()
const { resultImages } = useSiteImg()
const { inUseWallet } = useUserInfo()
const {
  historyState,
  isLoading,
  dynamicColumns,
  bettingHistoryCurrencyList,
  searchTabs,
  validBetAmount,
  winLossAmount,
  currencyHeader,
  handleDateRangePick,
  initHistoryQuery,
  getHistoryList,
  handleTableRequest,
  handlePagination,
  handleScroll,
  currencyName,
  getHistoryTotal,
  handlerChangeBetHistoryTab
} = useHistory()

const menuRef = ref()
const scrollAreaRef = ref()
const datePickerShow = ref(false)
const depositDetailUploadRef = ref()
const startDatePickerShow = ref(false)
const endDatePickerShow = ref(false)
const withdrawalDetailUploadRef = ref()
const datePickerValue = ref({ from: historyState.query.start_date, to: historyState.query.end_date })

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

const hideMenu = () => {
  menuRef.value.hide()
}

const handleSubmit = async () => {
  historyState.pagination.page = 1
  getHistoryList()
  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    await getHistoryTotal()
  }
  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const handleReset = async () => {
  historyState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  await nextTick()
  await getHistoryList()
}

const handleUploadDetail = (transCode: string | undefined, actionType: number | undefined) => {
  switch (actionType) {
    case ACTION_TYPE.Enums.DEPOSIT:
      depositDetailUploadRef.value.openDialog(transCode, true)
      break
    case ACTION_TYPE.Enums.WITHDRAWAL:
      withdrawalDetailUploadRef.value.openDialog(transCode, true)
      break
  }
}

onMounted(async () => {
  if (isLargeTablet.value) {
    // 要search type, 但不要page
    initHistoryQuery()
    historyState.query.offset = 0
    historyState.pagination.page = 1
    historyState.query.size = 15
    historyState.pagination.rowsPerPage = 15
    historyState.pagination.rowsNumber = 15
  } else {
    if (route.name !== "history") {
      route.query.search_type = String(HISTORY_SEARCH_TYPE.Enums.BetHistory)
    } else {
      historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.Deposit
    }
    historyState.query.size = 10
    historyState.pagination.rowsPerPage = 10
    historyState.pagination.rowsNumber = 10
    // 需要在最後查詢query search type，因為沒有all，並且rowsNumber改動會驅動handlePagination
    initHistoryQuery()
  }

  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    // 配置投注歷史預設的幣別
    historyState.query.currency_id = inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0
  }

  handlerChangeBetHistoryTab()

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    // 一開始若直接進投注頁時要打總計api
    await getHistoryTotal()
  }

  await getHistoryList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/reports.scss";

.pc-history-area {
  width: 100%;
  max-width: 87.5rem;
  padding: 1.525rem 0 10%;
  margin: 0 auto;
}

.h5-history-area {
  width: 100%;
  height: 100%;
  background: var(--bg-main-bg);
}
</style>
