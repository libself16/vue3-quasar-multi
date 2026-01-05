<template>
  <BannerMember />
  <div class="container">
    <div class="form-title-content">
      <img :src="svgIcon('member-title-icon')" />
      <div class="title">{{ $t("menu.history") }}</div>
    </div>
    <div class="history-container">
      <div class="history-area">
        <q-form class="history-form" @submit="handleFormSubmit">
          <div class="tab-area">
            <button
              type="button"
              class="tab-button"
              v-for="item in moneyHistorySearchTypes"
              :key="item.value"
              :class="{ active: historyState.query.search_type === item.value }"
              @click="historyState.query.search_type = item.value"
            >
              {{ t(item.label) }}
            </button>
          </div>
          <div class="radio-area">
            <div
              v-for="item in dateTypesWithoutCustomDate"
              :key="item.value"
              class="date"
              @click="historyState.query.dateType = item.value"
            >
              <label>
                <input
                  type="radio"
                  class="option-input radio"
                  name="example"
                  :class="{ active: historyState.query.dateType === item.value }"
                  :checked="historyState.query.dateType === item.value"
                />
              </label>
              <div class="body-balance">
                <span>{{ $t(item.label) }}</span>
              </div>
            </div>
          </div>
          <div class="date-area">
            <div class="start-date-area">
              <span>{{ $t("common.btn.searchDate").replace(" :", "") }}</span>
              <div>
                <q-input
                  v-model="historyState.query.start_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="historyState.query.start_date" mask="YYYY-MM-DD">
                          <div class="items-center justify-end row">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="to-area">
              <span>TO</span>
            </div>
            <div class="end-date-area">
              <span></span>
              <div>
                <q-input
                  v-model="historyState.query.end_date"
                  placeholder="Choose Date"
                  class="form-input"
                  bg-color="white"
                  outlined
                  readonly
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="historyState.query.end_date" mask="YYYY-MM-DD">
                          <div class="items-center justify-end row">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="submit-button-area">
              <button type="submit" class="submit-button">
                {{ $t("common.btn.submit") }}
              </button>
            </div>
          </div>
        </q-form>
      </div>
      <div class="table-area">
        <q-table
          v-if="!isMobile"
          class="inbox-table"
          color="primary"
          table-class="text-grey-1 custom-table"
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
                <span class="text-blue">{{
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
        <div v-else class="expansion-menu">
          <q-list v-if="historyState.list.length">
            <q-expansion-item
              v-for="(history, index) in historyState.list"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon=""
              class="expansion-item-outer"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-in">
                    <div class="expansion-header-in-left">
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.accountChangeTime") }}</span>
                        <span>{{ history.updated_at }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.amountAfterChange") }}</span>
                        <span>{{ history.after_balance }}</span>
                      </div>
                      <div class="mobile-header-item">
                        <span>{{ t("tableHeader.currency") }}</span>
                        <span>{{ history.currency_code }}</span>
                      </div>
                    </div>
                    <div class="expansion-header-in-right">
                      <div class="his-r-wrap">
                        <!-- <div class="his-l">
                          <span class="af-his-bln">{{ $t("tableHeader.balance") }}</span>
                        </div>
                        <div class="his-r">
                          <div class="his-amt txt-red">{{ moneyFormat(history.amount) }}</div>
                          <div class="his-amt">{{ moneyFormat(history.after_balance) }}</div>
                        </div>
                        <div class="his-currency">
                          {{ currencyName(history.currency_code) }}
                        </div> -->
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </template>
              <q-card class="expansion-detail">
                <q-card-section>
                  <div class="detail-line"></div>
                  <div class="detail">
                    <div class="expansion-item">
                      <span> {{ $t("tableHeader.timeNumber") }}</span>
                      <span>{{ history.id }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.accountChangeTime") }}</span>
                      <span>{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ currencyHeader }}</span>
                      <span>{{ currencyName(history.currency_code) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.accountType") }}</span>
                      <span>{{
                        $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0])
                      }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.accountVariableObject") }}</span>
                      <span>{{
                        history.action_type === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code
                      }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.amount") }}</span>
                      <span>{{ moneyFormat(history.amount) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.amountBeforeChanges") }}</span>
                      <span>{{ moneyFormat(history.before_balance) }}</span>
                    </div>
                    <div class="expansion-item">
                      <span>{{ $t("tableHeader.amountAfterChange") }}</span>
                      <span>{{ moneyFormat(history.after_balance) }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div v-else class="flex items-center justify-center q-expansion-item">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>
        <!--h5 end-->
        <div v-if="historyState.pagination.totalPage" class="flex justify-end mt-7 custom-pagination">
          <q-pagination
            v-model="historyState.pagination.page"
            :max="historyState.pagination.totalPage"
            direction-links
            push
            color="pagination"
            active-design="push"
            active-color="red"
            @update:model-value="handlePagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useHistory } from "src/common/composables/useHistory"
import { useReport } from "src/common/composables/useReport"
import { useCommon } from "src/common/hooks/useCommon"
import { ACTION_TYPE, BANNER_POSITION } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
let isMobile = ref(false)
const { width } = useWindowSize()
const { handleBannerList } = useBanner()
const actionType = ACTION_TYPE
const { dateTypesWithoutCustomDate, moneyHistorySearchTypes } = useReport()
const {
  historyTableColumns,
  historyState,
  isLoading,
  handlePagination,
  handleTableRequest,
  currencyName,
  currencyHeader,
  handleFormSubmit
} = useHistory()

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
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
@import "../../assets/css/form.sass"

.container
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 80%
  margin: 0 auto
  +iphone-width
    width: 100%
  .title-area
    display: flex
    justify-content: left
    width: 100%
    margin: 10px 0
    .title
      color: #14141499
      display: flex
      align-items: center
      &:before
        content: ''
        display: inline-block
        width: 20px
        height: 20px
        background-image: url("app/template/set_jokerhill/assets/images/home/title-icon1.png")
        background-size: contain
        background-repeat: no-repeat
        margin: 0 10px
  .history-container
    background: #FFFFFF
    border-radius: 20px
    display: flex
    flex-direction: column
    justify-content: center
    width: 100%
    padding: 2rem 2.6875rem
    .history-area
      width: 100%
      height: auto
      margin: 0 10px
      display: flex
      +iphone-width
        margin: 0
      .history-form
        width: 70%
        margin: 0 auto
        +iphone-width
          width: 100%
          margin: 0 5px
        .tab-area
          display: flex
          flex-direction: row
          justify-content: flex-start
          width: 100%
          margin-bottom: 20px
          white-space: nowrap
          +iphone-width
            flex-wrap: wrap
          .tab-button
            background-color: transparent
            border: 1px solid #6288D2
            color: #14141466
            border-radius: 8px
            width: 140px
            height: 36px
            margin-right: 10px
            cursor: pointer
            +iphone-width
              border: 1px solid #14141466
              width: 30vw
              margin-bottom: 10px
            &:hover
              background-color: #1414141A
            &.active
              background-color: #6288D2
              color: #fff
              +iphone-width
                border: 1px solid #6288D2
        .radio-area
          +setFlex(start, center)
          flex-wrap: wrap
          gap: 1rem
          margin: 10px 0
          +iphone-width
            gap: .5rem
          .date
            display: flex
            gap: .5rem
            cursor: pointer
            .option-input
              appearance: none
              top: .15rem
              right: 0
              bottom: 0
              left: 26%
              height: 20px
              width: 20px
              transition: all 0.15s ease-out 0s
              border: 1px solid #6288D2
              border-radius: 1rem
              cursor: pointer
              display: inline-block
              margin-right: 0.5rem
              outline: none
              position: relative
              &::before
                content: ''
                position: absolute
                top: 50%
                left: 50%
                width: 10px
                height: 10px
                border-radius: 50%
                background: #6288D2
                transform: translate(-50%, -50%)
                opacity: 0
                transition: opacity 0.15s ease-out
              &:checked::before
                opacity: 1
            .body-balance
              span
                color: #14141466
        .date-area
          display: flex
          flex-direction: row
          +iphone-width
            flex-direction: column
          div
            margin: 0 5px
            span
              text-transform: uppercase
              color: #14141466
            &:not(.to-area)
              span
                margin-left: 10px
            &.to-area
              margin-top: 50px
              +iphone-width
                display: none
            div
              :deep(.q-field__control)
                border: 1px solid #6288D2
                border-style: solid
                &:before
                  border-style: unset
                  border-color: unset
              :deep(.q-icon)
                color: #6288D2 !important
          .submit-button-area
            margin-top: 40px
            +iphone-width
              display: flex
              justify-content: center
            .submit-button
              background-color: #6288D2
              color: #fff
              font-weight: bold
              border-radius: 8px
              width: 200px
              height: 36px
              margin-right: 10px
              cursor: pointer
              text-transform: uppercase
    .table-area
      width: 80%
      margin: 3.25rem auto

:deep(.q-table)
  border: none
  th
    border-bottom: 1px solid #141414B3
    color: #6288D2 !important
  td
    span
      color: #14141466 !important

.inbox-table
  box-shadow: unset

:deep(.text-white)
  color: #14141466 !important

:deep(.bg-red)
  background: #6288D2 !important
  color: #fff !important

:deep(.q-pagination .pagination)
  background-color: red !important
  color: white !important

:deep(.q-pagination__content button::before)
  border-bottom: unset !important

:deep(.q-btn::before)
  box-shadow: unset

.inbox-table
  border-bottom: 1px solid #000

.q-expansion-item
  +iphone-width
    border: 1px solid #6288D2
    border-radius: 4px
    margin-bottom: 10px

.expansion-header-in-left
  +iphone-width
    display: flex
    .mobile-header-item
      +iphone-width
        display: flex
        flex-direction: column
        align-items: flex-start
        margin-right: 25px
        span
          width: 100%
          margin-bottom: 4px
          font-size: 12px
          &:first-child
            color: #6288D2
          &:last-child
            color: #1c1e2280

.expansion-detail
  background: #A2B3D6

.detail
  +iphone-width
    display: flex
    flex-direction: column
  .expansion-item
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 5px
    span:first-child
      color: #FFFFFFB3
      flex: 1
    span:last-child
      color: #FFFFFF
      text-align: left
      width: 200px
</style>
