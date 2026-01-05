<template>
  <div class="referral-rebate">
    <BackBtn />
    <div class="referral-rebate-content">
      <div class="title">{{ $t("member.referralRebate.title") }}</div>

      <!-- Currency -->
      <div>
        <div class="currency-item">
          <div class="form-title required">{{ $t("common.btn.currency") }}</div>
          <q-select
            standout
            v-model="referralRebateCurrencyId"
            :options="currencyDropdown"
            map-options
            emit-value
            class="form-input"
            rounded
            outlined
            dense
            borderless
            no-error-icon
            hide-bottom-space
            @update:model-value="changeCurrency"
          />
        </div>
      </div>

      <!-- Summary / referral code -->
      <div class="summary-wrapper">
        <div class="summary">
          <div class="summary-content">
            <div class="summary-title">
              {{ returnReferralRebateSummary.calculate_type === CALCULATE_TYPE.Enums.ValidBet ? $t(CALCULATE_TYPE.I18nKeys[CALCULATE_TYPE.Enums.ValidBet]) : $t(CALCULATE_TYPE.I18nKeys[CALCULATE_TYPE.Enums.WinLose]) }}
            </div>
            <div class="summary-value">{{ moneyFormat(returnReferralRebateSummary?.summary_amount) }}</div>
          </div>
          <div class="summary-content">
            <div class="summary-title">
              {{ $t("member.referralRebate.latestTotalRevenueAmount") }}
            </div>
            <div class="summary-value">{{ moneyFormat(returnReferralRebateSummary?.revenue_amount) }}</div>
          </div>
        </div>
        <div class="referral-code-wrapper">
          <div class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</div>
          <div class="referral-code-row">
            <div class="referral-code">{{ referralCode }}</div>
            <div class="referral-code-btn">
              <q-icon
                name="share"
                @click="handleShareReferralCode"
                class="cursor-pointer mr-1 hover:opacity-50"
                size="xs"
              ></q-icon>
              <q-icon
                name="content_copy"
                class="cursor-pointer hover:opacity-50"
                size="xs"
                @click="copyMessage(referralCode)"
              ></q-icon>
            </div>
          </div>
        </div>
      </div>

      <template v-if="selectedEventId === null || selectedEventId === undefined">
        <div>
          <!--  Tabs -->
          <div class="proxy-tabs">
            <q-btn
              class="hide-hover"
              :class="{ active: activeTab === 'eventStatement' }"
              @click="activeTab = 'eventStatement'"
            >
              {{ $t('member.referralRebate.eventStatement') }}
            </q-btn>
            <q-btn
              class="hide-hover"
              :class="{ active: activeTab === 'revenueDetail' }"
              @click="activeTab = 'revenueDetail'"
            >
              {{ $t('member.referralRebate.revenueDetail') }}
            </q-btn>
          </div>
          <!-- Search content -->
          <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
            <q-tab-panel name="eventStatement">
              <div class="table-content">
                <div class="search-content">
                  <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
                  <div class="search-row">
                    <div class="form-item">
                      <div class="form-title">{{ $t("member.referralRebate.account") }}</div>
                      <q-input
                        standout
                        v-model="accountNumber"
                        :placeholder="$t('member.referralRebate.account')"
                        rounded
                        outlined
                        dense
                        borderless
                        class="form-input"
                        no-error-icon
                        hide-bottom-space
                      >
                      </q-input>
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                      <q-select
                        standout
                        v-model="referralRebateCurrencyId"
                        :options="currencyDropdown"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                        @update:model-value="changeCurrency"
                      />
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("member.referralRebate.gametype") }}</div>
                      <q-select
                        standout
                        v-model="gameTypeId"
                        :options="gameTypeDropdownWithAll"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                      />
                    </div>

                    <q-btn class="hide-hover btn-search" @click="getStatement">{{ $t("common.btn.search") }}</q-btn>
                  </div>
                </div>
                <div class="tables">
                  <q-table
                    :rows="referralRebateStatements.list"
                    :columns="referralRebateStatementsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    v-if="referralRebateStatements.list.length > 0"
                    :grid="$q.platform.is.mobile ? true : false"
                  >
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <template v-for="col in props.cols" :key="col.name">
                          <div v-if="col.name !== 'action'" class="row-item">
                            <div class="label">
                              {{ col.label }}
                            </div>
                            <div class="value">
                              {{ col.value }}
                            </div>
                          </div>

                          <div v-else>
                            <q-btn
                              class="detail-btn"
                              denst
                              flat
                              @click="handleDetailClick(props.row.id)"
                              :label="$t('member.referralRebate.detail')"
                            />
                          </div>
                        </template>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <div v-if="referralRebateStatements.pagination.total > 1" class="custom-pagination">
                    <q-pagination
                      v-model="referralRebateStatements.pagination.page"
                      :max="referralRebateStatements.pagination.total"
                      direction-links
                      icon-prev="fa-solid fa-caret-left"
                      icon-next="fa-solid fa-caret-right"
                      active-color="pagination-active"
                      @update:model-value="handleReferralRebateStatementsPagination"
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="revenueDetail">
              <div class="table-content">
                <div class="search-content">
                  <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
                  <div class="search-row">
                    <div class="form-item">
                      <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                      <q-select
                        standout
                        v-model="referralRebateCurrencyId"
                        :options="currencyDropdown"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                        @update:model-value="changeCurrency"
                      />
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("member.referralRebate.settlementTime") }}</div>
                      <q-input
                        standout
                        v-model="displayDate"
                        :placeholder="$t('member.referralRebate.settlementTime')"
                        rounded
                        outlined
                        dense
                        borderless
                        class="form-input"
                        no-error-icon
                        hide-bottom-space
                      >
                        <q-menu ref="dateRangePickerMenuRef">
                          <q-date v-model="selectedDate" range color="date" />
                        </q-menu>
                      </q-input>
                    </div>

                    <q-btn class="hide-hover btn-search" @click="getEvents">{{ $t("common.btn.search") }}</q-btn>
                  </div>
                </div>
                <div class="tables">
                  <q-table
                    v-if="referralRebateEvents.list.length > 0"
                    :rows="referralRebateEvents.list"
                    :columns="referralRebateEventsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    @row-click="handleEventsRowClick"
                    :table-row-class-fn="tableRowClass"
                    :grid="$q.platform.is.mobile ? true : false"
                  >
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <template v-for="col in props.cols" :key="col.name">
                          <div v-if="col.name !== 'action'" class="row-item">
                            <div class="label">
                              {{ col.label }}
                            </div>
                            <div class="value">
                              {{ col.value }}
                            </div>
                          </div>

                          <div v-else>
                            <q-btn
                              class="detail-btn"
                              denst
                              flat
                              @click="handleDetailClick(props.row.id)"
                              :label="$t('member.referralRebate.detail')"
                            />
                          </div>
                        </template>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <div v-if="referralRebateEvents.pagination.total > 1" class="custom-pagination">
                    <q-pagination
                      v-model="referralRebateEvents.pagination.page"
                      :max="referralRebateEvents.pagination.total"
                      direction-links
                      icon-prev="fa-solid fa-caret-left"
                      icon-next="fa-solid fa-caret-right"
                      active-color="pagination-active"
                      @update:model-value="handleReferralRebateEventsPagination"
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels></div>
      </template>

      <template v-else>
        <div class="mt-[4rem] events-detail-header">
          <q-btn
            class="btn-back"
            :to="{ name: 'ReferralRebate' }"
            :label="$t('common.btn.back')"
            icon="reply"
            @click="changeGameType(gameTypeDropdownWithAll[0])"
          >
          </q-btn>
        </div>
        <div class="table-content events-detail">
          <div class="search-content">
            <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
            <div class="search-row">
              <div class="form-item">
                <div class="form-title">{{ $t("member.referralRebate.account") }}</div>
                <q-input
                  standout
                  v-model="accountNumber"
                  :placeholder="$t('member.referralRebate.account')"
                  rounded
                  outlined
                  dense
                  borderless
                  class="form-input"
                  no-error-icon
                  hide-bottom-space
                >
                </q-input>
              </div>
              <div class="form-item">
                <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                <q-select
                  standout
                  v-model="referralRebateCurrencyId"
                  :options="currencyDropdown"
                  map-options
                  emit-value
                  class="form-select"
                  rounded
                  outlined
                  dense
                  borderless
                  no-error-icon
                  hide-bottom-space
                  @update:model-value="changeCurrency"
                />
              </div>

              <q-btn class="hide-hover btn-search" @click="getEventsStatements(selectedEventId)">{{ $t("common.btn.search") }}</q-btn>
            </div>
          </div>
          <div class="tables">
            <q-table
              :rows="referralRebateEventsStatements.list"
              :columns="referralRebateEventsStatementsTableColumns"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
              v-if="referralRebateEventsStatements.list.length > 0"
              :grid="$q.platform.is.mobile ? true : false"
            >
              <template v-slot:item="props">
                <q-card class="w-full">
                  <template v-for="col in props.cols" :key="col.name">
                    <div v-if="col.name !== 'action'" class="row-item">
                      <div class="label">
                        {{ col.label }}
                      </div>
                      <div class="value">
                        {{ col.value }}
                      </div>
                    </div>

                    <div v-else>
                      <q-btn
                        class="detail-btn"
                        denst
                        flat
                        @click="handleDetailClick(props.row.id)"
                        :label="$t('member.referralRebate.detail')"
                      />
                    </div>
                  </template>
                </q-card>
              </template>
            </q-table>
            <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
            <div v-if="referralRebateEventsStatements.pagination.total > 1" class="custom-pagination">
              <q-pagination
                v-model="referralRebateEventsStatements.pagination.page"
                :max="referralRebateEventsStatements.pagination.total"
                direction-links
                icon-prev="fa-solid fa-caret-left"
                icon-next="fa-solid fa-caret-right"
                active-color="pagination-active"
                @update:model-value="handlereferralRebateEventsStatementsPagination"
              />
            </div>
          </div></div
      ></template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";
@import "app/template/set_r016/assets/css/referral-rebate.scss";
</style>

<script setup lang="ts">
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import { onMounted, ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { CALCULATE_TYPE } from "src/common/utils/constants"
import banner from "app/template/set_r016/assets/images/referral_rebate/bg.jpg"

const router = useRouter()
const { isLogin } = useAuth()
const { copyMessage, moneyFormat } = useCommon()
const { resultImages } = useSiteImg()
const {
  activeTab,
  isLoading,
  selectedEventId,
  accountNumber,
  selectedDate,
  displayDate,
  currencyDropdown,
  gameTypeDropdownWithAll,
  gameTypeId,
  initDetail,
  initReferralRebateDate,
  initReferralRebateCurrency,
  referralCode,
  referralRebateCurrencyId,
  referralRebateSummary,
  returnReferralRebateSummary,
  changeCurrency,
  changeGameType,
  getSummary,
  getStatement,
  getEventsStatements,
  getEvents,
  getReferralCode,
  referralRebateStatements,
  referralRebateStatementsTableColumns,
  referralRebateEventsStatementsTableColumns,
  referralRebateEvents,
  referralRebateEventsStatements,
  referralRebateEventsTableColumns,
  handleReferralRebateEventsPagination,
  handleReferralRebateStatementsPagination,
  handlereferralRebateEventsStatementsPagination,
  handleShareReferralCode,
  handleEventsRowClick,
  handleDetailClick,
  tableRowClass
} = useReferralRebate()

onMounted(async () => {
  if (isLogin.value) {
    initDetail()
    initReferralRebateDate()
    await initReferralRebateCurrency()
    await getReferralCode()
    await getSummary()
    await getStatement()
    await getEvents()
  } else {
    router.push({ path: "/" })
  }
})
</script>
