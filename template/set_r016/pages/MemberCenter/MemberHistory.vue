<template>
  <q-form class="history-wrapper" @submit="handleFormSubmit">
    <BackBtn />
    <div class="history-content">
      <h2 class="history-title">{{ $t("menu.history") }}</h2>
      <div class="search-type-btns">
        <q-btn
          v-for="item in searchTabs"
          :key="item.value"
          :label="$t(item.label)"
          class="btn-type"
          :class="{ active: historyState.query.search_type === item.value }"
          @click="historyState.query.search_type = item.value"
        />
      </div>
      <div class="date-type-btns">
        <q-radio
          v-for="item in dayTypeTabs"
          :key="item.value"
          v-model="historyState.query.dateType"
          :val="item.value"
          :label="$t(item.label)"
          class="radio-type"
        />
      </div>
      <div class="date-input-content">
        <label class="date-input-content-title">{{ $t("common.btn.searchDate") }}</label>
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
          >
            <template v-slot:append>
              <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
            </template>
            <q-menu>
              <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" color="date"> </q-date>
            </q-menu>
          </q-input>
          <div class="date-picker-label-to">{{ $t("common.btn.to") }}</div>

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
          >
            <template v-slot:append>
              <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>
            </template>
            <q-menu>
              <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" color="date"> </q-date>
            </q-menu>
          </q-input>

          <q-btn type="submit" class="btn-submit hide-hover" :label="$t('common.btn.submit')" />
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
        :columns="historyTableColumns"
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
            <q-td key="amount" :props="props">
              <span
                >{{ moneyFormat(props.row.amount, 2) }}
                {{
                  props.row.action_type === ACTION_TYPE.Enums.REBATE ||
                  props.row.action_type === ACTION_TYPE.Enums.REFERRAL_REBATE
                    ? $t("common.btn.giftCode")
                    : ""
                }}
              </span>
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

      <div v-else class="mobile-list-wrapper">
        <q-list v-if="historyState.list.length" class="mobile-list">
          <div v-for="(history, index) in historyState.list" :key="index" class="w-full">
            <div class="mobile-item-top">
              <div class="mobile-item-top-left">{{ currencyName(history.currency_code) }}</div>
              <div class="mobile-item-top-right">
                {{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}
              </div>
            </div>
            <q-expansion-item dense dense-toggle expand-separator class="mobile-item" header-class="mobile-item-header">
              <template v-slot:header>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("tableHeader.accountType") }}</div>
                  <div class="header-item-value">
                    {{ $t(ACTION_TYPE.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0]) }}
                  </div>
                </div>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("tableHeader.amount") }}</div>
                  <div class="header-item-value">
                    {{ moneyFormat(history.amount) }}
                    {{
                      history.action_type === ACTION_TYPE.Enums.REBATE ||
                      history.action_type === ACTION_TYPE.Enums.REFERRAL_REBATE
                        ? $t("common.btn.giftCode")
                        : ""
                    }}
                  </div>
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
                    <p v-if="history.action_target">{{ history.action_target }}</p>
                    {{ history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code }}
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
          direction-links
          icon-prev="fa-solid fa-caret-left"
          icon-next="fa-solid fa-caret-right"
          active-color="pagination-active"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { ACTION_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"

const Rules = useRule()
const { moneyFormat } = useCommon()
const { isDesktop } = useMediaQuery()

const {
  historyTableColumns,
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  currencyHeader,
  currencyName,
  searchTabs,
  handleFormSubmit
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

const tableRef = ref()

onMounted(async () => {
  initHistoryQuery()
  historyState.pagination.rowsPerPage = 10
  historyState.query.size = 10
  await getHistoryList()
})
</script>

<style lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
.q-menu {
  .bg-date {
    background-color: $primary04;
  }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.history-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .history-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .history-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    :deep(.date-input-content) {
      .date-picker-row {
        .q-icon {
          color: $neutral06 !important;
        }
      }
    }
  }
}
</style>
