<template>
  <div class="tab-pane fade" id="pending" role="tabpanel">
    <div class="pending-transaction">
      <q-form @submit="handleFormSubmit">
        <div class="af-in-content af-history-wrap">
          <div class="af-in-content-all">
            <div class="af-history af-btn-green">
              <div class="btn-group-toggle btn-gender">
                <q-btn
                  v-for="item in searchTabs"
                  :key="item.value"
                  :label="$t(item.label)"
                  class="btn af-btn-hst hide-hover capitalize"
                  :class="{ active: pendingOrderState.query.search_type === item.value }"
                  @click="pendingOrderState.query.search_type = item.value"
                />
              </div>
            </div>
            <div class="af-history">
              <div class="btn-group-toggle btn-gender">
                <q-btn
                  v-for="item in dayTypeTabs"
                  :key="item.value"
                  :label="$t(item.label)"
                  class="btn af-btn-hst hide-hover capitalize"
                  :class="{ active: pendingOrderState.query.dateType === item.value }"
                  @click="pendingOrderState.query.dateType = item.value"
                />
              </div>
            </div>

            <div id="select-date" class="form-group">
              <div class="form-item">
                <template v-if="pendingOrderState.query.dateType === REPORT_DATE_TYPES.Enums.CustomDate">
                  <label class="form-style-lb">{{ $t("common.btn.searchDate") }}</label>
                  <div class="date-from">
                    <div class="af-dater">
                      <div class="datepicker date input-group">
                        <q-input
                          outlined
                          v-model="pendingOrderState.query.start_date"
                          readonly
                          class="form-control pr-0 form-date-input"
                          :class="{ active: StartDatePickerShow }"
                        >
                          <template v-slot:append>
                            <q-icon name="fas fa-calendar" />
                          </template>
                          <q-menu @show="StartDatePickerShow = true" @hide="StartDatePickerShow = false">
                            <q-date
                              v-model="pendingOrderState.query.start_date"
                              mask="YYYY-MM-DD"
                              minimal
                              dark
                              color="date"
                            />
                          </q-menu>
                        </q-input>
                      </div>
                    </div>
                    <span class="uppercase"> {{ $t("common.btn.to") }}</span>
                    <div class="af-dater">
                      <div class="datepicker date input-group">
                        <q-input
                          outlined
                          v-model="pendingOrderState.query.end_date"
                          readonly
                          class="form-control pr-0 form-date-input"
                          :class="{ active: EndDatePickerShow }"
                        >
                          <template v-slot:append>
                            <q-icon name="fas fa-calendar" />
                          </template>
                          <q-menu @show="EndDatePickerShow = true" @hide="EndDatePickerShow = false">
                            <q-date
                              v-model="pendingOrderState.query.end_date"
                              mask="YYYY-MM-DD"
                              minimal
                              dark
                              color="date"
                            />
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
      <div class="tranc-table">
        <div class="pay-status">
          <div id="accordion-1" class="in-col">
            <q-list v-if="pendingOrderState.list.length">
              <q-expansion-item
                v-for="(pending, index) in pendingOrderState.list"
                :key="index"
                v-model="pending.isActive"
                dense
                dense-toggle
                expand-separator
                expand-icon-toggle
                hide-expand-icon
                class="card"
              >
                <template v-slot:header>
                  <q-item-section class="card-header">
                    <div class="pen-top">
                      <div class="pen-code">
                        <span class="pen-ttl text-nowrap">{{ $t("tableHeader.no") }}:</span> {{ pending.trans_code }}
                      </div>
                      <div class="pentop-l">
                        <div class="pen-l">
                          <p>
                            <span class="pen-ttl">{{ $t("tableHeader.status") }}: </span>
                            <span
                              :class="{
                                'pen-suc': pending.status === PENDING_STATUS.Enums.confirmed,
                                'pen-unsuc': pending.status === PENDING_STATUS.Enums.rejected
                              }"
                              >{{ $t(PENDING_STATUS.I18nKeys[pending.status as PENDING_STATUS.Enums]) }}</span
                            >
                          </p>
                          <div class="pen-time">
                            <span class="pen-ttl">{{ $t("tableHeader.cashFlowType") }} :</span
                            >{{ getPaymentTypeName(pending.payment_type as FUND_METHOD_TYPE.Enums) }}
                          </div>
                        </div>
                        <div class="pen-r">
                          <p class="txt-org">
                            <span class="pen-ttl">{{ $t("tableHeader.type") }}:</span>
                            {{ $t(PENDING_SEARCH_TYPE.I18nKeys[pending.order_type as PENDING_SEARCH_TYPE.Enums]) }}
                          </p>
                          <div class="pen-time">
                            <small>{{ currencyName(pending.currency) }}</small>
                            <span class="txt-org bg-txt ml-1">{{ moneyFormat(pending.amount, 2) }} </span>
                          </div>
                        </div>
                      </div>
                      <div class="penttop-r">
                        <a
                          class="btnmr-if collapsed keychainify-checked"
                          role="button"
                          @click="pending.isActive = !pending.isActive"
                        >
                          More Info
                          <div class="btn-if"><i class="fas fa-info-circle"></i></div>
                        </a>
                      </div>
                    </div>
                  </q-item-section>
                </template>
                <div class="card-body p-5">
                  <div class="table-pen">
                    <table class="table">
                      <tbody>
                        <tr>
                          <th colspan="2">{{ $t("menu.transactionDetails") }}</th>
                        </tr>
                        <tr>
                          <td>{{ $t("tableHeader.paymentProvider") }}</td>
                          <td>{{ pending.payment_gateway_name }}</td>
                        </tr>
                        <tr>
                          <td>{{ currencyHeader }}</td>
                          <td>{{ currencyName(pending.currency) }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("tableHeader.amount") }}</td>
                          <td>{{ moneyFormat(pending.amount, 2) }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("tableHeader.actualAmount") }}</td>
                          <td>{{ moneyFormat(pending.actual_amount, 2) }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("tableHeader.dateOfApplication") }}</td>
                          <td>{{ dateformat(pending.submit_date ?? "", "YYYY-MM-DD HH:mm:ss") }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("tableHeader.cancel") }}</td>
                          <td>
                            <q-btn
                              :disabled="cancelBtnDisable(pending)"
                              class="column-btn"
                              @click="pendingOrderCancel(pending as any)"
                              :label="$t('tableHeader.cancel')"
                            />
                          </td>
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

            <!-- pagination -->
            <div class="af-pag my-4">
              <q-pagination
                v-if="pendingOrderState.pagination.totalPage"
                v-model="pendingOrderState.pagination.page"
                :max="pendingOrderState.pagination.totalPage"
                direction-links
                outline
                color="pagination"
                active-color="pagination-active"
                icon-prev="keyboard_double_arrow_left"
                icon-next="keyboard_double_arrow_right"
                @update:model-value="handlePagination"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useCommon } from "src/common/hooks/useCommon"
import { FUND_METHOD_TYPE, PENDING_SEARCH_TYPE, PENDING_STATUS, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { nextTick, onMounted, ref } from "vue"

const { moneyFormat } = useCommon()

const {
  cancelBtnDisable,
  pendingOrderState,
  resetPendingOrderQuery,
  getPendingOrderList,
  getPaymentTypeName,
  currencyName,
  pendingOrderCancel,
  currencyHeader,
  searchTabs,
  dayTypeTabs
} = usePendingOrder()

const StartDatePickerShow = ref(false)
const EndDatePickerShow = ref(false)

const handleFormSubmit = () => {
  pendingOrderState.pagination.page = 1
  getPendingOrderList({ cahceQuery: false, isLazyLoad: false })
}

const handlePagination = (page: number) => {
  pendingOrderState.pagination.page = page
  getPendingOrderList({ cahceQuery: false, isLazyLoad: false })
}

onMounted(async () => {
  resetPendingOrderQuery()
  await nextTick()
  handleFormSubmit()
})
</script>

<style lang="scss" scoped>
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/pending.css";
@import "app/template/set_royalslot88/assets/css/history.css";
@import "app/template/set_royalslot88/assets/css/bank.css";
@import "app/template/set_royalslot88/assets/css/table.scss";
@import "app/template/set_royalslot88/assets/css/card.scss";
@import "app/template/set_royalslot88/assets/css/pagination.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.column-btn {
  width: 60px;
  padding: 4px;
  border-radius: 5rem;
  color: #fff;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  background: #aa1e74;
  box-shadow: 0px 0px 4px 0px #fff inset;
}
</style>
