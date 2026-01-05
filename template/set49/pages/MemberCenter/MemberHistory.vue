<template>
  <BannerMember />
  <div class="member-history-layout">
    <div class="member-history-content">
      <div class="custom-table">
        <div class="form-title-content-wrap">
          <div class="form-title-content mb-5">
            <div class="color-label"></div>
            <div class="title">{{ $t("menu.history") }}</div>
          </div>
          <div class="history-wrap">
            <q-form class="history-content-all" @submit="handleFormSubmit">
              <div class="btn-group">
                <q-btn
                  v-for="item in searchTabs"
                  :key="item.value"
                  :label="$t(item.label)"
                  class="btn btn-green"
                  :class="{ active: historyState.query.search_type === item.value }"
                  @click="historyState.query.search_type = item.value"
                />
              </div>
              <div class="date-group mt-8 mb-4 ml-2">
                <div v-for="item in dayTypeTabs" :key="item.value" class="date">
                  <label>
                    <input
                      type="radio"
                      class="option-input radio"
                      name="example"
                      :class="{ active: historyState.query.dateType === item.value }"
                      :checked="historyState.query.dateType === item.value"
                      @click="historyState.query.dateType = item.value"
                    />
                  </label>
                  <div class="body-balance">
                    <span>{{ $t(item.label) }}</span>
                  </div>
                </div>
              </div>
              <!-- 提交按鈕, 時間選擇  -->
              <div class="date-form">
                <label class="my-3 date-picker-label">{{ $t("common.btn.searchDate") }}</label>
                <div class="date-picker-row">
                  <!-- 開始時間 -->
                  <div class="date-input date-input-from !mr-0">
                    <q-input
                      v-model="historyState.query.start_date"
                      placeholder="Choose Date"
                      bg-color="white"
                      dense
                      outlined
                      readonly
                      hide-bottom-space
                      lazy-rules
                      :rules="[Rules.required()]"
                      style="width: 100%"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD" dark color="warning">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="warning" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="date-picker-label-to mx-4">{{ $t("common.btn.to") }}</div>
                  <!-- 結束時間 -->
                  <div class="date-input !ml-0">
                    <q-input
                      v-model="historyState.query.end_date"
                      placeholder="Choose Date"
                      bg-color="white"
                      dense
                      outlined
                      readonly
                      hide-bottom-space
                      lazy-rules
                      :rules="[Rules.required()]"
                      style="width: 100%"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD" dark color="warning">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="warning" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="action-btns">
                    <q-btn
                      :class="$q.platform.is.desktop ? 'submit_active' : ''"
                      :label="$t('common.btn.submit')"
                      class="submit-btn"
                      type="submit"
                    />
                  </div>
                </div>
              </div>
            </q-form>
          </div>
          <!-- pc table -->
          <q-table
            v-if="!isMobile"
            class="inbox-table"
            color="primary"
            table-class="text-grey-1"
            table-header-class="text-grey-1"
            ref="tableRef"
            :rows="historyState.list"
            :rows-per-page-options="[historyState.pagination?.rowsPerPage || 20]"
            :columns="historyTableColumns"
            row-key="id"
            v-model:pagination="historyState.pagination"
            :loading="isLoading"
            hide-pagination
            wrap-cells
            flat
            @request="handleTableRequest"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
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
                  <span>{{ $t(actionType.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
                </q-td>
                <q-td key="accountVariableObject" :props="props">
                  <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
                  <span>{{
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
                    <div class="">
                      <span class="title">{{ $t("tableHeader.accountChangeTime") }}</span>
                      <span>{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                    </div>
                    <div class="">
                      <span class="title">{{ $t("tableHeader.amountAfterChange") }}</span>
                      <span>{{ moneyFormat(history.after_balance) }}</span>
                    </div>
                    <div class="">
                      <span class="title">{{ currencyHeader }}</span>
                      <span>{{ currencyName(history.currency_code) }}</span>
                    </div>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section class="expansion-card-section">
                    <div class="expansion-detail">
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.timeNumber") }}</span>
                        <span>{{ history.id }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.accountChangeTime") }}</span>
                        <span>{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ currencyHeader }}</span>
                        <span>{{ currencyName(history.currency_code) }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.accountType") }}</span>
                        <span>{{
                          $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0])
                        }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.accountVariableObject") }}</span>
                        <span>{{
                          history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code
                        }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.amount") }}</span>
                        <span>{{ moneyFormat(history.amount) }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                        <span>{{ moneyFormat(history.before_balance) }}</span>
                      </div>
                      <div class="expansion-item">
                        <span class="title">{{ $t("tableHeader.amountAfterChange") }}</span>
                        <span>{{ moneyFormat(history.after_balance) }}</span>
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
          <!-- pagination -->
          <div v-if="historyState.pagination.totalPage" class="flex justify-end mt-7 pagination">
            <q-pagination
              v-model="historyState.pagination.page"
              :max="historyState.pagination.totalPage"
              direction-links
              color="grey-1"
              text-color="white"
              active-text-color="dark"
              active-color="amber-5"
              @update:model-value="handlePagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import BannerMember from "app/template/set49/components/BannerMember.vue"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { ACTION_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { onMounted, ref, watch, computed } from "vue"

const Rules = useRule()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)

const {
  historyTableColumns,
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  handleTableRequest,
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
const actionType = ACTION_TYPE

onMounted(async () => {
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
@import 'app/template/set49/assets/css/menu.sass'
@import 'app/template/set49/assets/css/style.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.inbox-table
  @apply mt-5
.custom-table
  @apply mt-10 text-white rounded-lg
  +iphone-width
    @apply p-4 pt-0 mt-0
  :deep(.q-table__card),
  :deep(.q-table),
  :deep(.q-table__bottom)
    background: $primary-modal-bg
  :deep(.q-table)
    th
      border-color: rgba(255, 255, 255, 0.5)
    tbody
      tr
        &:last-child td
          border-bottom-width: 0.0625rem
          border-color: rgba(255, 255, 255, 0.5)
.member-history-content
  max-width: 62.5rem
  margin: 0 auto
  +iphone-width
    padding-top: 0
  .date-form
    display: flex
    flex-direction: column
    +phone-width
      flex-direction: column
      +setFlex(start, start)
    .date-picker-label
      color: rgba(255, 255, 255, 0.7)
      text-transform: uppercase
      font-size: 1rem
      +iphone-width
    .date-picker-row
      @apply flex items-center w-full
      +phone-width
        @apply flex-col items-start
      .date-picker-label-to
        color: rgba(255, 255, 255, 0.7)
        text-transform: uppercase
        font-size: 1rem
        +iphone-width
          visibility: hidden
      .date-input
        flex: 1
        +pad-width
          width: 100%
        +iphone-width
          width: 100%
      .date-input-from
        margin-right: 0.5rem
  .form-title-content-wrap
    background: $primary-modal-bg
    border-radius: 0.75rem
    padding: 2.5rem
    +iphone-width
      border-radius: 0.5rem
      padding: .5rem
      margin-bottom: .5rem
      background: none
  .expansion-menu
    margin-top: 0.9375rem

  .history-wrap
    border-radius: 0.5rem
    overflow: hidden
  .history-content-all
    background: $primary-modal-bg
    padding: 1.25rem
    width: 100%
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
          border: 3px solid transparent
        .option-input:checked
          background: $primary-btn-bg
          border-color: #cbd1d8
    .btn-group
      display: flex
      flex-wrap: wrap
      gap: 15px
      +iphone-width
        gap: 10px
      .btn
        width: 140px
        padding: 6px
        border-radius: .5rem
        +iphone-width
          width: auto
          padding: 0.3125rem 0.625rem
      .btn-green
        border: 1px solid #fff
        background: rgba(#fff, .1)
        &:hover
          border: 1px solid #FFC002
          background: rgba(#fff, .1)
        &.active, &:focus
          border: 1px solid #FFC002
          background: rgba(#FFC002, .1)
          color: #ffc002
    .action-btns
      margin-top: 0
      margin-left: 1.5rem
      +setFlex(center, center)
      +iphone-width
        margin-top: 1.5rem
        margin-left: auto
        margin-right: auto
      .submit-btn
        color: rgba(0, 0, 0, 0.7)
        min-height: 2.5rem
        line-height: 1.25rem
        font-size: 1.25rem
        padding: 0.5rem 2.5rem

  .carousel
    .carousel__viewport
      li
        padding-right: .625rem
.unread
  color: red
.amount
  color: #6FCF97
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
.expansion-header
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  +setFlex(space-between, start)
  flex: 1 1 100%
  font-size: 0.75rem
  margin-right: -0.75rem
  div
    display: flex
    flex-direction: column
    +setFlex(center, normal)
    width: 33%
    margin-right: 0.625rem
  .title
    color: rgba(255, 255, 255, 0.5)
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
.expansion-card-section
  background: $third-bg
.expansion-detail
  padding-top: 20px
  background: $third-bg
  color: #fff
  border-radius: 5px
  padding: 5px
  font-size: 12px
  font-weight: bold
  .expansion-item
    +setFlex(start, center)
    span
      margin-right: .25rem
      width: 50%
      &:nth-child(2)
        text-align: start
    .title
      color: rgba(255, 255, 255, 0.5)

:deep(.q-pagination)
  .q-pagination__content
    .q-btn
      .q-btn__content
        .q-icon
          color: #FFC002!important

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg
</style>
