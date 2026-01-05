<template>
  <div class="member-history-layout">
    <div class="member-history-content">
      <div class="custom-table">
        <div class="history-wrap">
          <q-form class="history-content-all" @submit="handleFormSubmit">
            <div class="btn-group btn-group-divider">
              <q-btn
                v-for="item in searchTabs"
                :key="item.value"
                :label="$t(item.label)"
                class="btn btn-square"
                :class="{ active: historyState.query.search_type === item.value }"
                @click="historyState.query.search_type = item.value"
              />
            </div>
            <div class="btn-group mt-4">
              <q-btn
                v-for="item in dayTypeTabs"
                :key="item.value"
                :label="item.label"
                class="btn btn-rounded"
                :class="{ active: historyState.query.dateType === item.value, isDesktop: $q.platform.is.desktop }"
                @click="historyState.query.dateType = item.value"
              />
            </div>

            <!-- 提交按鈕, 時間選擇  -->
            <div class="form-group">
              <div
                v-if="historyState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate"
                class="date-picker-row form-item"
              >
                <label class="form-item-label">{{ $t("common.btn.searchDate") }}</label>
                <!-- 開始時間 -->
                <div>
                  <q-input
                    v-model="historyState.query.start_date"
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
                          <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" dark>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="form-item-label">
                  {{ $t("common.btn.to") }}
                </div>
                <!-- 結束時間 -->
                <div>
                  <q-input
                    v-model="historyState.query.end_date"
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
                          <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" dark>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <!-- 錢包類型 -->
            <div class="btn-group mt-4">
              <q-btn
                v-for="item in walletTypeTabs"
                :key="item.value"
                :label="item.label"
                class="btn btn-rounded"
                :class="{
                  active: historyState.query.wallet_types.includes(item.value),
                  isDesktop: $q.platform.is.desktop
                }"
                @click="handleWalleyTypeClick(item.value)"
              />
              <div class="btn"></div>
              <div class="btn"></div>
            </div>
            <div class="form-group">
              <div class="submit-btn-wrap">
                <q-btn
                  :class="$q.platform.is.desktop ? 'submit_active' : ''"
                  :label="$t('common.btn.submit')"
                  class="btn submit-btn"
                  type="submit"
                />
              </div>
            </div>
          </q-form>
        </div>
        <!-- pc table -->
        <q-table
          v-if="!isMobile"
          class="inbox-table"
          color="primary"
          table-class="bg-black text-white"
          table-header-class="bg-black text-white"
          ref="tableRef"
          :rows="historyState.list"
          :rows-per-page-options="[historyState.pagination?.rowsPerPage || 20]"
          :columns="historyTableColumns"
          row-key="id"
          v-model:pagination="historyState.pagination"
          :loading="isLoading"
          hide-pagination
          wrap-cells
          @request="handleTableRequest"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
          <template #body="props">
            <q-tr>
              <q-td key="accountChangeTime" :props="props" width="18%">
                <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
              </q-td>
              <q-td key="pointType" :props="props">
                <span>{{ $t(WALLET_TYPE.I18nKeys[props.row.wallet_type as WALLET_TYPE.Enums]) }}</span>
              </q-td>
              <q-td key="accountType" :props="props">
                <span>{{ $t(actionType.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
              </q-td>
              <q-td key="accountVariableObject" :props="props">
                <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
                <span class="text-orange">{{
                  props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
                }}</span>
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
            <span>{{ $t("tableHeader.no_data") }}</span>
          </template>
        </q-table>
        <!-- mobile table -->
        <div v-else class="expansion-menu">
          <q-list v-if="historyState.list.length">
            <q-expansion-item
              v-for="(history, index) in historyState.list"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div>
                    <span class="text-white">
                      {{
                        $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0]) +
                        ":" +
                        history.action_target
                      }}
                    </span>
                    <span class="text-yellow">{{ moneyFormat(history.amount, 2) }}</span>
                  </div>
                  <div>
                    <span class="text-white">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                    <span class="text-white">{{ $t("tableHeader.balance") }}</span>
                    <span class="af-his-ttl">{{ moneyFormat(history.after_balance, 2) }}</span>
                  </div>
                </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <div class="expansion-detail">
                    <div>
                      <span class="af-his-type"> {{ $t("tableHeader.accountVariableObject") }}</span>
                      <p>
                        <span class="af-his-type"> {{ history.action_target }}</span>
                        [
                        <span class="text-orange">{{
                          history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code
                        }}</span>
                        ]
                      </p>
                    </div>
                    <div>
                      <span class="af-his-type">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                      <span class="af-his-ttl">{{ moneyFormat(history.before_balance, 2) }}</span>
                    </div>
                    <div>
                      <span class="af-his-type">{{ $t("tableHeader.pointType") }}</span>
                      <span class="af-his-ttl">{{ $t(WALLET_TYPE.I18nKeys[history.wallet_type]) }}</span>
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
      <div v-if="historyState.pagination.totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
        <q-pagination
          v-model="historyState.pagination.page"
          :max="historyState.pagination.totalPage"
          direction-links
          push
          color="pagination"
          icon-prev="keyboard_double_arrow_left"
          icon-next="keyboard_double_arrow_right"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QTableProps, useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useWindowSize } from "@vueuse/core"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { ACTION_TYPE, REPORT_DATE_TYPES, HISTORY_SEARCH_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { onMounted, ref, watch, computed } from "vue"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)

const {
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  handleTableRequest,
  currencyName,
  dayTypeTabs,
  walletTypeTabs,
  handleWalleyTypeClick,
  handleFormSubmit
} = useHistory()

const searchTabs = computed(() => [
  {
    label: HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.BetHistory],
    value: HISTORY_SEARCH_TYPE.Enums.BetHistory
  }
])

const historyTableColumns = computed<QTableProps["columns"]>(() => [
  {
    name: "accountChangeTime",
    field: "accountChangeTime",
    align: "center",
    label: t("tableHeader.accountChangeTime")
  },
  { name: "pointType", field: "pointType", align: "center", label: t("tableHeader.pointType") },
  { name: "accountType", field: "accountType", align: "center", label: t("tableHeader.accountType") },
  {
    name: "accountVariableObject",
    field: "accountVariableObject",
    align: "center",
    label: t("tableHeader.accountVariableObject")
  },
  { name: "amount", field: "amount", align: "center", label: t("tableHeader.amount") },
  {
    name: "amountBeforeChanges",
    field: "amountBeforeChanges",
    align: "center",
    label: t("tableHeader.amountBeforeChanges")
  },
  {
    name: "amountAfterChange",
    field: "amountAfterChange",
    align: "center",
    label: t("tableHeader.amountAfterChange")
  }
])

const tableRef = ref()
const actionType = ACTION_TYPE

onMounted(async () => {
  historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.BetHistory
  initHistoryQuery()
  await getHistoryList()
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
@import 'src/css/table.sass'
@import 'src/css/form.sass'
@import 'app/template/set_sjpn2/assets/css/menu.sass'
@import 'app/template/set_sjpn2/assets/css/pagination.sass'

.custom-table
  @apply mt-10 p-10 text-white rounded-lg
  +iphone-width
  @apply p-4
  :deep(.q-table__card)
    box-shadow: none
  ::v-deep(.q-table)
    tbody
      tr
        border: 1px solid #E2B854
      td
        border: 1px solid #E2B854
  ::v-deep(.q-table__bottom)
    @apply flex justify-center items-center
    border: 1px solid #E2B854
    background-color: #1c1e22
    color: #ffffffb3
.member-history-content
  max-width: 62.5rem
  margin: 0 auto 4rem auto
  +iphone-width
    padding-top: 0
  .date-form
    display: flex
    +setFlex(start, center)
    +phone-width
      flex-direction: column
      +setFlex(start, start)
    .date-picker-row
      @apply flex items-center mr-11 mt-5
      +phone-width
        @apply flex-col items-start
      .date-picker-label
        @apply mr-4 mb-4
        +iphone-width
          @apply ml-0
      .date-picker-label-to
        @apply mx-4 mb-4
        +iphone-width
          @apply mx-0
  .form-title-content-wrap
    background: #1C1E22
    border-radius: 0.5rem 0.5rem 0 0
    padding: 2.5rem
    +iphone-width
      border-radius: 0.5rem
      padding: .5rem
      margin-bottom: .5rem
  .history-content-all
    background: #000
    border-radius: 3px
    width: 100%
    margin-bottom: 2rem
    padding: 2rem
    +iphone-width
      padding: 1.4rem
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
          z-index: 1000
          border: 3px solid transparent
        .option-input:checked
          background: #652DCC
          border-color: #cbd1d8
    .btn-group-divider
      padding-bottom: 1.5rem
      border-bottom: 1px solid #777777
    .btn-group
      display: flex
      flex-wrap: wrap
      +setFlex(center, center)
      gap: 15px
      +iphone-width
        gap: 10px
      &.walletType
        @apply justify-start
      .btn
        width: 140px
        padding: 6px
        border-radius: .5rem
        +iphone-width
          width: 130px
      .btn-square
        border: 1px solid #777777
        background: #000
        &.active, &:focus, &:hover
          border: 2px solid #ED772E
          color: #ED772E
      .btn-rounded
        border: 1px solid #777777
        background: #000
        border-radius: 10rem
        &.active
          border: 2px solid #ED772E
          color: #ED772E
        &.isDesktop
          &:focus, &:hover
            border: 2px solid #ED772E
            color: #ED772E
    .form-group
      .form-item
        +setFlex(flex-start, center)
        flex-wrap: wrap
        margin: 1rem 0 0.2rem 4.5rem
        width: 100%
        gap: 20px
        +iphone-width
          gap: 0px
        :deep(.q-field__control)
          margin-top: 1vw
        +phone-width
          +setFlex(flex-start, flex-start)
          flex-direction: column
          margin: 1rem 0 0 1rem
        &-label
          margin-bottom: 1vw
          color: #000
          +iphone-width
            margin: 0
      .submit-btn-wrap
        display: block
        +setFlex(center, center)
        .form-label
          width: 150px
        .date-from
          +setFlex
          gap: 20px
          .q-field__control
            height: 20px !important
      .submit-btn
        color: #fff
        font-size: 18px
        padding: 8px 20px
        width: 300px
        margin-top: 1rem
        background: #000
        border: 1px solid #ED772E
        border-radius: 5px
        font-weight: bold
        +iphone-width
          width: 100%
      .submit_active
        &:hover
          background: #021c2d
  .carousel
    .carousel__viewport
      li
        padding-right: .625rem
.unread
  color: red
.amount
  color: #99cc0d
.text-orange
  color: #ED772E
.member-history-content-mb
  width: 85%
  margin: 1rem auto
  padding: 1rem 1.25rem
  background: #1C1E22
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
    .text-yellow
      color: #FFF042
    div
      +setFlex(space-between, center)
      &:first-child
        margin-top: 10px
      &:nth-child(2)
        margin: 10px 0
  .expansion-header-currency
    display: flex
    flex-direction: column
    gap: 10px
    background: #A68638
    border-radius: 50px
    padding: 5px
    img
      height: 4vw
      width: 4vw
      margin: 0px auto
  .expansion-detail
    padding-top: 20px
    background: #1F1F1F
    color: #fff
    border-radius: 5px
    padding: 5px
    font-size: 12px
    font-weight: bold
    div
      display: flex
      flex-direction: column
      &:first-child
        margin-top: 10px
      &:nth-child(2)
        margin: 10px 0
::v-deep(.q-table__container)
  +pad-width
    margin: 0 10px
.pagination
  +pad-width
    margin: 10px
  +iphone-width
    margin-right: 12px
</style>
