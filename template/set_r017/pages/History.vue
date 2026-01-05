<template>
  <q-form class="history-wrapper" @submit="handlerSubmit" @reset="handleReset">
    <h2 class="history-title">{{ $t("menu.history_records") }}</h2>

    <h3 class="search-title">{{ $t("common.select_category") }}</h3>
    <div class="history-search-row">
      <div class="search-type-btns">
        <template v-for="item in searchTabs" :key="item.value">
          <q-btn
            v-if="item.label !== t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.All])"
            :label="$t(item.label)"
            class="btn-type"
            :class="{ active: historyState.query.search_type === item.value }"
            @click="historyState.query.search_type = item.value"
          />
        </template>
      </div>
    </div>

    <!-- 投注歷史 AI類別 -->
    <template v-if="!!aiAgentStatus && historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory">
      <h3 class="search-title">{{ $t("common.select_ai_type") }}</h3>
      <div class="history-search-row">
        <div class="search-type-btns">
          <q-btn
            v-for="item in aiHistoryTabs"
            :key="item.value"
            :label="$t(item.label)"
            class="btn-type"
            :class="{ active: historyState.query.updated_by === item.value }"
            @click="historyState.query.updated_by = item.value"
          />
        </div>
      </div>
    </template>

    <!-- 投注歷史 幣別 -->
    <template v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory">
      <h3 class="search-title">{{ $t("collaboration.currency") }}</h3>
      <q-select
        v-model="historyState.query.currency_id"
        :options="historyCurrencyList"
        dense
        borderless
        option-label="label"
        option-value="value"
        emit-value
        map-options
        color="white"
        :popup-content-style="{
          backgroundColor: '#1d125d',
          color: '#fff'
        }"
        class="history-currency mb-6"
      />
    </template>

    <h3 class="search-title">{{ $t("common.number_of_days") }}</h3>
    <div class="history-search-row">
      <div class="search-type-btns">
        <q-btn
          v-for="item in dayTypeTabs"
          :key="item.value"
          :label="$t(item.label)"
          class="btn-type"
          :class="{ active: historyState.query.dateType === item.value }"
          @click="historyState.query.dateType = item.value"
        />
      </div>
    </div>

    <h3 class="search-title">{{ $t("common.btn.searchDate") }}</h3>
    <div class="date-input-content">
      <div class="date-picker-row">
        <q-input
          v-model="historyState.query.start_date"
          rounded
          outlined
          dense
          borderless
          lazy-rules
          :rules="[Rules.required()]"
          class="form-input"
          no-error-icon
          hide-bottom-space
          readonly
        >
          <template v-slot:append>
            <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
          </template>
          <q-menu>
            <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" color="date"> </q-date>
          </q-menu>
        </q-input>
        <div class="date-picker-label-to">~</div>
        <q-input
          v-model="historyState.query.end_date"
          rounded
          outlined
          dense
          borderless
          lazy-rules
          :rules="[Rules.required()]"
          class="form-input"
          no-error-icon
          hide-bottom-space
          readonly
        >
          <template v-slot:append>
            <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
          </template>
          <q-menu>
            <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" color="date"> </q-date>
          </q-menu>
        </q-input>
      </div>
    </div>
    <div class="submit-content gap-2">
      <q-btn type="reset" class="btn-reset" :label="$t('common.btn.reset')" />
      <q-btn color="primary" type="submit" class="btn-submit" :label="$t('common.btn.submit')" />
    </div>

    <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="ai-total-area">
      <div class="total-item">
        <div class="total-item-title">{{ $t("menu.validBet") }}</div>
        <div class="total-item-amount">{{ moneyFormat(validBet) }}</div>
      </div>

      <div class="total-item">
        <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
        <div class="total-item-amount">{{ moneyFormat(winLoss) }}</div>
      </div>
    </div>

    <q-table
      v-if="isDesktop"
      square
      hide-pagination
      row-key="id"
      ref="tableRef"
      :rows="historyState.list"
      :rows-per-page-options="[historyState.pagination?.rowsPerPage || 10]"
      :columns="dynamicColumns"
      :loading="isLoading"
      class="custom-table"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="red" />
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
            <span>{{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
          </q-td>
          <q-td key="accountVariableObject" :props="props">
            <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
            <span>{{
              props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
            }}</span>
          </q-td>
          <q-td key="betMethod" :props="props">
            <span>
              {{
                props.row.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                  ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                  : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
              }}
            </span>
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
        {{ $t("tableHeader.no_data") }}
      </template>
    </q-table>
    <div v-else class="history-mobile-list-wrapper">
      <q-list v-if="historyState.list.length" class="mobile-list">
        <div v-for="(history, index) in historyState.list" :key="index" class="w-full">
          <q-expansion-item dense expand-separator class="mobile-item" header-class="mobile-item-header">
            <template v-slot:header>
              <div class="header-item">
                <div class="header-item-title">{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="header-item-value">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
              <div class="header-item">
                <div class="header-item-title">{{ $t("tableHeader.amountAfterChange") }}</div>
                <div class="header-item-value">{{ moneyFormat(history.after_balance) }}</div>
              </div>
              <div class="header-item">
                <div class="header-item-title">{{ $t("tableHeader.currency") }}</div>
                <div class="header-item-value">{{ currencyName(history.currency_code) }}</div>
              </div>
            </template>
            <q-list class="mobile-item-body">
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.accountChangeTime") }}</span>
                <span class="body-item-value">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ currencyHeader }}</span>
                <span class="body-item-value">{{ currencyName(history.currency_code) }}</span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.accountType") }}</span>
                <span class="body-item-value">{{ $t(ACTION_TYPE.I18nKeys[history.action_type ?? 0]) }}</span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.accountVariableObject") }}</span>
                <span class="body-item-value">
                  {{ history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code }}
                </span>
              </q-item>
              <q-item v-if="history.action_type === ACTION_TYPE.Enums.BET" class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.bettingMethod") }}</span>
                <span class="body-item-value">
                  {{
                    history.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                      ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                      : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                  }}
                </span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.amount") }}</span>
                <span class="body-item-value">
                  {{ moneyFormat(history.amount) }}
                </span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                <span class="body-item-value">
                  {{ moneyFormat(history.before_balance) }}
                </span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("tableHeader.amountAfterChange") }}</span>
                <span class="body-item-value">
                  {{ moneyFormat(history.after_balance) }}
                </span>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
      </q-list>
      <div v-else class="mobile-no-data">{{ $t("tableHeader.no_data") }}</div>
    </div>

    <div v-if="historyState.pagination.totalPage > 1" class="custom-pagination">
      <q-pagination
        v-model="historyState.pagination.page"
        :max="historyState.pagination.totalPage"
        :max-pages="4"
        direction-links
        active-color="pagination-active"
        @update:model-value="handlePagination"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick } from "vue"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRule } from "src/common/hooks/useRule"
import {
  ACTION_TYPE,
  REPORT_DATE_TYPES,
  HISTORY_SEARCH_TYPE,
  WALLET_TYPE,
  HISTORY_UPDATED_BY_TYPE
} from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useI18n } from "vue-i18n"

type WalletDropItem = {
  label: string
  value: number
}

const { t } = useI18n()
const Rules = useRule()
const route = useRoute()
const router = useRouter()
const { aiAgentStatus } = useEnv()
const { moneyFormat } = useCommon()
const { isDesktop } = useMediaQuery()
const { inUseWallet, userWalletMap, getWalletLabel } = useUserInfo()
const {
  historyTableColumns,
  aiHistoryTableColumns,
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  currencyHeader,
  currencyName,
  searchTabs,
  handleFormSubmit,
  getHistoryTotal
} = useHistory()

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

const dynamicColumns = computed(() => {
  return historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory
    ? aiHistoryTableColumns.value
    : historyTableColumns.value
})

const aiHistoryTabs = computed(() => {
  return [
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.All]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.All
    },
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.Member
    },
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.Ai
    }
  ]
})

const historyCurrencyList = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = getWalletLabel(cashWallet)
    const value = cashWallet.currency_id
    return { label, value }
  })
})

const tableRef = ref()
const validBet = ref(0)
const winLoss = ref(0)

const handlerSubmit = () => {
  handleFormSubmit()

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    handlerGetHistoryTotal()
  }
}

const handleReset = async () => {
  historyState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.All
  historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.Deposit
  await nextTick()
  await getHistoryList()
}

const handlerGetHistoryTotal = async () => {
  const data = await getHistoryTotal()
  validBet.value = Number(data?.valid_bet_amount_total ?? 0)
  winLoss.value = Number(data?.player_profit ?? 0)
}

const changeBetHistoryTab = async () => {
  const name = route.name

  // ai相關歷史紀錄頁面
  if (name !== "history") {
    if (!aiAgentStatus.value) {
      // AI沒打開就不能進
      router.push({ name: "history" })
      return
    } else {
      // AI有開則切換相對的歷史紀錄tab
      switch (name) {
        case "HistoryMember":
          historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.Member
          break
        case "HistoryAi":
          historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.Ai
          break
        default:
          historyState.query.updated_by = HISTORY_UPDATED_BY_TYPE.Enums.All
          break
      }
    }
  }
}

onMounted(async () => {
  if (route.name !== "history") {
    route.query.search_type = String(HISTORY_SEARCH_TYPE.Enums.BetHistory)
  } else {
    historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.Deposit
  }
  initHistoryQuery()
  historyState.pagination.rowsPerPage = 10
  historyState.query.size = 10

  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    // 配置投注歷史預設的幣別
    historyState.query.currency_id = inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0
  }

  changeBetHistoryTab()

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    // 一開始若直接進投注頁時要打總計api
    await handlerGetHistoryTotal()
  }

  await getHistoryList()
})
</script>

<style lang="scss">
@import "app/template/set_r017/assets/css/_variable.scss";
.q-menu {
  .bg-date {
    background: $gradient01;
  }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/form.scss";
@import "app/template/set_r017/assets/css/table.scss";
@import "app/template/set_r017/assets/css/button.scss";

.history-wrapper {
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
  padding: 1.5rem 0 12.0625rem;

  @include phone-width {
    padding: 0.75rem 0 0.75rem 0.875rem;
  }

  .history-title {
    color: $neutral01;
    font-family: NotoSans;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.6875rem;
    margin-bottom: 0.125rem;
  }

  .date-picker-row {
    .form-input {
      border-radius: 4px;
      border: 2px solid $neutral04;
      background: $secondary06;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    }
    .q-field {
      :deep(.q-field__inner) {
        .q-field__append {
          color: $neutral01;
        }

        .q-field__native {
          color: $neutral01;
        }
      }
    }
  }

  .history-currency {
    width: 5.25rem;
    height: 2.9375rem;
    background-color: $secondary06;
    border-radius: 0.25rem;
    padding: 0.625rem 0.75rem;
    border: 2px solid $neutral04;

    :deep(.q-field__control) {
      height: 100%;
      min-height: unset;
    }

    :deep(.q-field__native) {
      justify-content: center;
      font-size: 1rem;
      line-height: 0;
      min-height: unset;
      color: $neutral01;
    }

    :deep(.q-field__append) {
      height: 100%;
      color: $neutral01;
    }
  }
}

.ai-total-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  @include phone-width {
    flex-direction: column;
    margin: 3rem 0 1.25rem;
    padding-right: 0.875rem;
  }

  .total-item {
    width: calc(50% - 0.375rem);
    padding: 1rem 0;
    border-radius: 0.625rem;
    background-color: $secondary01;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 1px solid $neutral04;

    @include phone-width {
      width: 100%;

      &:first-child {
        margin-bottom: 0.75rem;
      }
    }

    &-title {
      color: $neutral01;
      font-size: 1rem;
      margin-bottom: 0.25rem;

      @include phone-width {
        margin-bottom: 0.6875rem;
      }
    }

    &-amount {
      color: $neutral01;
      font-size: 2rem;
    }
  }
}
</style>
