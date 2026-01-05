<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_share_custom"
    use-title
    :title="$t('menu.history')"
    max-width="1480px"
    height="calc(100vh - 100px)"
  >
    <q-form @submit="handleFormSubmit">
      <div class="af-in-content af-history-wrap">
        <div class="af-in-content-all">
          <div class="af-history af-btn-green">
            <div class="btn-group-toggle btn-gender" data-toggle="buttons">
              <q-btn
                v-for="item in searchTabs"
                :key="item.value"
                :label="$t(item.label)"
                class="btn af-btn-hst hide-hover capitalize"
                :class="{ active: historyState.query.search_type === item.value }"
                @click="historyState.query.search_type = item.value"
              />
            </div>
          </div>
          <div class="af-history">
            <div class="btn-group-toggle btn-gender" data-toggle="buttons">
              <q-btn
                v-for="item in dayTypeTabs"
                :key="item.value"
                :label="$t(item.label)"
                class="btn af-btn-hst hide-hover capitalize"
                :class="{ active: historyState.query.dateType === item.value }"
                @click="historyState.query.dateType = item.value"
              />
            </div>
          </div>

          <div id="select-date" class="form-group">
            <div class="form-item">
              <template v-if="historyState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate">
                <label class="form-style-lb">{{ $t("common.btn.searchDate") }}</label>
                <div class="date-from">
                  <div class="af-dater">
                    <div class="datepicker date input-group">
                      <q-input
                        outlined
                        v-model="historyState.query.start_date"
                        readonly
                        class="form-control pr-0 form-date-input"
                        :class="{ active: StartDatePickerShow }"
                      >
                        <template v-slot:append>
                          <q-icon name="fas fa-calendar" />
                        </template>
                        <q-menu @show="StartDatePickerShow = true" @hide="StartDatePickerShow = false">
                          <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" minimal dark color="date" />
                        </q-menu>
                      </q-input>
                    </div>
                  </div>
                  <span class="uppercase"> {{ $t("common.btn.to") }}</span>
                  <div class="af-dater">
                    <div class="datepicker date input-group">
                      <q-input
                        outlined
                        v-model="historyState.query.end_date"
                        readonly
                        class="form-control pr-0 form-date-input"
                        :class="{ active: EndDatePickerShow }"
                      >
                        <template v-slot:append>
                          <q-icon name="fas fa-calendar" />
                        </template>
                        <q-menu @show="EndDatePickerShow = true" @hide="EndDatePickerShow = false">
                          <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" minimal dark color="date" />
                        </q-menu>
                      </q-input>
                    </div>
                  </div>
                </div>
              </template>
              <div class="btn-all-af-2">
                <button class="submit_btn uppercase">{{ $t("common.btn.submit") }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>
    <!-- pc -->
    <div class="tranc-table d-show">
      <div class="table-responsive">
        <q-table
          :rows="historyState.list"
          :rows-per-page-options="[10]"
          :columns="historyTableColumns"
          row-key="id"
          :loading="isLoading"
          hide-pagination
          separator="none"
          flat
          width="100%"
        >
          <template v-slot:loading>
            <q-inner-loading showing dark color="accent" />
          </template>

          <template #body="props">
            <q-tr>
              <q-td key="accountChangeTime" :props="props" width="20%">
                <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
              </q-td>
              <q-td key="currency" :props="props" width="8%">
                <span>{{ currencyName(props.row.currency_code) }}</span>
              </q-td>
              <q-td key="accountType" :props="props" width="8%">
                <span>{{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
              </q-td>
              <q-td key="accountVariableObject" :props="props" width="20%">
                <p v-if="props.row.action_target && props.row.action_target !== 'unknown'">
                  {{ props.row.action_target }}
                </p>
                <span>{{
                  props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
                }}</span>
              </q-td>
              <q-td key="amount" :props="props" width="9%">
                <span>{{ moneyFormat(props.row.amount, 2) }}</span>
              </q-td>
              <q-td key="amountBeforeChanges" :props="props" width="10%">
                <span>{{ moneyFormat(props.row.before_balance, 2) }}</span>
              </q-td>
              <q-td key="amountAfterChange" :props="props" width="10%">
                <span>{{ moneyFormat(props.row.after_balance, 2) }}</span>
              </q-td>
            </q-tr>
          </template>
          <template #no-data>
            <span>{{ $t("tableHeader.no_data") }}</span>
          </template>
        </q-table>
      </div>
    </div>
    <!-- h5 -->
    <div class="tranc-table m-show">
      <div class="pay-status">
        <div id="accordion-1" class="in-col in-history">
          <q-list v-if="historyState.list.length">
            <q-expansion-item
              v-for="(history, index) in historyState.list"
              :key="index"
              dense
              dense-toggle
              expand-separator
              hide-expand-icon
              class="card"
            >
              <template v-slot:header>
                <q-item-section class="card-header">
                  <div class="af-history-table-wrap">
                    <div class="af-history-l">
                      <div class="af-his-top">
                        <span class="af-his-type"
                          >{{ $t(ACTION_TYPE.I18nKeys[history.action_type as any as ACTION_TYPE.Enums]) }}：</span
                        >
                        <span class="af-his-ttl">{{ history.action_target }}</span>
                      </div>
                      <div class="af-his-bottom">{{ dateformat(history.updated_at || "", "YYYY-MM-DD HH:mm:ss") }}</div>
                    </div>
                    <div class="af-history-r">
                      <div class="af-his-r-wrap">
                        <div class="af-his-1">
                          <span class="af-his-bln">{{ $t("tableHeader.balance") }}</span>
                        </div>
                        <div class="af-his-2">
                          <div class="af-his-amt af-txt-grn">{{ `${moneyFormat(history.amount, 2)}` }}</div>
                          <div class="af-his-amt">{{ moneyFormat(history.after_balance, 2) }}</div>
                        </div>
                        <div class="af-his-3">
                          <div class="af-history-crc">
                            <div class="af-his-cnt">{{ currencyName(history.currency_code) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </template>
              <div class="card-body p-5">
                <div class="table-pen">
                  <table>
                    <tbody>
                      <tr>
                        <td>{{ $t("tableHeader.accountVariableObject") }}</td>
                        <td>
                          <p v-if="history.action_target && history.action_target !== 'unknown'">
                            {{ history.action_target }}
                          </p>
                          [<span class="txt-blue">{{
                            history.action_type === ACTION_TYPE.Enums.BET
                              ? history.wager_code
                              : history.transaction_code
                          }}</span
                          >]
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("tableHeader.amountBeforeChanges") }}</td>
                        <td>{{ moneyFormat(history.before_balance, 2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </q-expansion-item>
          </q-list>
          <div v-else class="card">
            <div class="card-header text-center">
              {{ $t("tableHeader.no_data") }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <div class="af-pag my-4">
      <q-pagination
        v-if="historyState.pagination.totalPage"
        v-model="historyState.pagination.page"
        :max="historyState.pagination.totalPage"
        direction-links
        outline
        color="pagination"
        active-color="pagination-active"
        icon-prev="keyboard_double_arrow_left"
        icon-next="keyboard_double_arrow_right"
        @update:model-value="handlePagination"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { QTableProps } from "quasar"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { ACTION_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"
import ModalBase from "./modalBase.vue"

const { t } = useI18n()
const { moneyFormat } = useCommon()
const {
  historyState,
  isLoading,
  resetHistoryQuery,
  getHistoryList,
  currencyHeader,
  currencyName,
  searchTabs,
  dayTypeTabs
} = useHistory()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const StartDatePickerShow = ref(false)
const EndDatePickerShow = ref(false)

const historyTableColumns = computed<QTableProps["columns"]>(() => [
  {
    name: "accountChangeTime",
    field: "accountChangeTime",
    align: "center",
    label: t("tableHeader.accountChangeTime")
  },
  { name: "currency", field: "currency", align: "center", label: currencyHeader.value },
  { name: "accountType", field: "accountType", align: "center", label: t("tableHeader.accountType") },
  {
    name: "accountVariableObject",
    field: "accountVariableObject",
    align: "center",
    label: t("tableHeader.accountVariableObject")
  },
  { name: "amount", field: "amount", align: "right", label: t("tableHeader.amount") },
  {
    name: "amountBeforeChanges",
    field: "amountBeforeChanges",
    align: "right",
    label: t("tableHeader.amountBeforeChanges")
  },
  {
    name: "amountAfterChange",
    field: "amountAfterChange",
    align: "right",
    label: t("tableHeader.amountAfterChange")
  }
])

const handleFormSubmit = () => {
  historyState.pagination.page = 1
  getHistoryList({ cahceQuery: false, isLazyLoad: false })
}

const handlePagination = (page: number) => {
  historyState.pagination.page = page
  getHistoryList({ cahceQuery: false, isLazyLoad: false })
}

onMounted(() => {
  eventbus.on("openHistory", async (show: boolean) => {
    modalShow.value = show
    if (show) {
      resetHistoryQuery()
      await nextTick()
      handleFormSubmit()
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/pending.css";
@import "app/template/set_royalslot88/assets/css/history.css";
@import "app/template/set_royalslot88/assets/css/bank.css";
@import "app/template/set_royalslot88/assets/css/table.scss";
@import "app/template/set_royalslot88/assets/css/card.scss";
@import "app/template/set_royalslot88/assets/css/pagination.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
