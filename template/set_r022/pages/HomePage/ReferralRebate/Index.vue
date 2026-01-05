<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" title-i18n="member.referralRebate.title">
    <div class="referral-rebate">
      <div class="referral-rebate-content">
        <!-- Currency -->
        <div class="currency-select">
          <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
          <q-btn-dropdown
            rounded
            :label="referralRebateCurrencyCode"
            menu-anchor="bottom middle"
            menu-self="bottom middle"
            :loading="isLoading"
            class="currency-select-btn"
          >
            <q-list>
              <q-item
                v-for="item in currencyDropdown"
                :key="item.value"
                clickable
                v-close-popup
                @click="changeCurrency(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <!-- Summary / referral code -->
        <div class="summary-wrapper">
          <div class="summary">
            <div class="summary-content">
              <div class="summary-title">
                {{ $t("member.referralRebate.latestTotalValidBetAmount") }}
              </div>
              <div class="summary-value">{{ moneyFormat(referralRebateSummary?.valid_bet_amount) }}</div>
            </div>
            <div class="summary-content">
              <div class="summary-title">
                {{ $t("member.referralRebate.latestTotalRevenueAmount") }}
              </div>
              <div class="summary-value">{{ moneyFormat(referralRebateSummary?.revenue_amount) }}</div>
            </div>
          </div>
          <div class="referral-code">
            <div class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</div>
            <q-input class="referral-code-value" v-model="referralCode" dense :borderless="true" readonly>
              <template v-slot:append>
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
              </template>
            </q-input>
          </div>
        </div>

        <template v-if="selectedEventId === null || selectedEventId === undefined">
          <div>
            <!--  Tabs -->
            <div class="proxy-tabs">
              <q-tabs v-model="activeTab" align="left">
                <q-tab name="eventStatement" :label="$t('member.referralRebate.eventStatement')" />
                <q-tab name="revenueDetail" :label="$t('member.referralRebate.revenueDetail')" />
              </q-tabs>
            </div>
            <!-- Search content -->
            <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
              <q-tab-panel name="eventStatement">
                <div class="table-content">
                  <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                  <div class="member-number">
                    <div class="label">{{ $t("member.referralRebate.account") }}</div>
                    <q-input
                      :placeholder="$t('member.referralRebate.account')"
                      borderless
                      dense
                      v-model="accountNumber"
                      class="w-full md:w-auto"
                    ></q-input>
                  </div>
                  <div class="actions">
                    <div class="currency-action">
                      <div class="currency-select">
                        <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                        <q-btn-dropdown
                          rounded
                          :label="referralRebateCurrencyCode"
                          menu-anchor="bottom middle"
                          menu-self="bottom middle"
                          :loading="isLoading"
                          class="w-full md:w-auto"
                        >
                          <q-list>
                            <q-item
                              v-for="item in currencyDropdown"
                              :key="item.value"
                              clickable
                              v-close-popup
                              @click="changeCurrency(item)"
                            >
                              <q-item-section>
                                <q-item-label>{{ item.label }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </div>
                    <div class="gametype-action">
                      <div class="gametype-select">
                        <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                        <q-btn-dropdown
                          rounded
                          borderless
                          :label="$t(gameTypeCode)"
                          menu-anchor="bottom middle"
                          menu-self="bottom middle"
                          :loading="isLoading"
                          class="w-full md:w-auto"
                        >
                          <q-list>
                            <q-item
                              v-for="item in gameTypeDropdownWithAll"
                              :key="item.value"
                              clickable
                              v-close-popup
                              @click="changeGameType(item)"
                            >
                              <q-item-section>
                                <q-item-label>{{ item.label }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </div>
                    <q-btn class="search-btn" @click="() => getStatement(false)">{{ $t("common.btn.search") }}</q-btn>
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
                    <q-pagination
                      v-model="referralRebateStatements.pagination.page"
                      :max="referralRebateStatements.pagination.total"
                      :max-pages="5"
                      class="r-pagination"
                      color="deep-grey"
                      active-color="blue-8"
                      active-design="flat"
                      direction-links
                      @update:model-value="handleReferralRebateStatementsPagination"
                    />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="revenueDetail">
                <div class="table-content">
                  <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                  <div class="actions">
                    <div class="date-action">
                      <div class="date-select">
                        <span class="date-select-title">{{ $t("member.referralRebate.settlementTime") }}</span>

                        <q-input
                          v-model="displayDate"
                          placeholder=""
                          outlined
                          readonly
                          dense
                          class="w-full md:w-auto date-select-input"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date range v-model="selectedDate" mask="YYYY-MM-DD">
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
                    <div class="currency-action">
                      <div class="currency-select">
                        <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                        <q-btn-dropdown
                          rounded
                          :label="referralRebateCurrencyCode"
                          menu-anchor="bottom middle"
                          menu-self="bottom middle"
                          :loading="isLoading"
                          class="w-full md:w-auto"
                        >
                          <q-list>
                            <q-item
                              v-for="item in currencyDropdown"
                              :key="item.value"
                              clickable
                              v-close-popup
                              @click="changeCurrency(item)"
                            >
                              <q-item-section>
                                <q-item-label>{{ item.label }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </div>

                    <q-btn class="search-btn" @click="getEvents">{{ $t("common.btn.search") }}</q-btn>
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

                    <q-pagination
                      v-model="referralRebateEvents.pagination.page"
                      :max="referralRebateEvents.pagination.total"
                      :max-pages="5"
                      class="r-pagination"
                      flat
                      active-design="flat"
                      color="deep-grey"
                      active-color="blue-8"
                      direction-links
                      @update:model-value="handleReferralRebateEventsPagination"
                    />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </template>

        <template v-else>
          <div class="mt-[4rem] events-detail-header">
            <q-btn
              class="back-btn"
              :to="{ name: 'ReferralRebate' }"
              :label="$t('common.btn.back')"
              icon="reply"
              @click="changeGameType(gameTypeDropdownWithAll[0])"
            >
            </q-btn>
          </div>
          <div class="table-content events-detail">
            <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
            <div class="member-number">
              <div class="label">{{ $t("member.referralRebate.account") }}</div>
              <q-input
                :placeholder="$t('member.referralRebate.account')"
                borderless
                dense
                v-model="accountNumber"
                class="w-full md:w-auto"
              ></q-input>
            </div>
            <div class="actions">
              <div class="currency-action">
                <div class="currency-select">
                  <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                  <q-btn-dropdown
                    rounded
                    :label="referralRebateCurrencyCode"
                    menu-anchor="bottom middle"
                    menu-self="bottom middle"
                    :loading="isLoading"
                    class="w-full md:w-auto"
                  >
                    <q-list>
                      <q-item
                        v-for="item in currencyDropdown"
                        :key="item.value"
                        clickable
                        v-close-popup
                        @click="changeCurrency(item)"
                      >
                        <q-item-section>
                          <q-item-label>{{ item.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
              <div class="gametype-action">
                <div class="gametype-select">
                  <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                  <q-btn-dropdown
                    rounded
                    borderless
                    :label="$t(gameTypeCode)"
                    menu-anchor="bottom middle"
                    menu-self="bottom middle"
                    :loading="isLoading"
                    class="w-full md:w-auto"
                  >
                    <q-list>
                      <q-item
                        v-for="item in gameTypeDropdownWithAll"
                        :key="item.value"
                        clickable
                        v-close-popup
                        @click="changeGameType(item)"
                      >
                        <q-item-section>
                          <q-item-label>{{ item.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
              <q-btn class="search-btn" @click="() => selectedEventId && getEventsStatements(selectedEventId, false)">{{
                $t("common.btn.search")
              }}</q-btn>
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
              <q-pagination
                v-model="referralRebateEventsStatements.pagination.page"
                :max="referralRebateEventsStatements.pagination.total"
                :max-pages="5"
                class="r-pagination"
                flat
                active-design="flat"
                color="deep-grey"
                active-color="blue-8"
                direction-links
                @update:model-value="handlereferralRebateEventsStatementsPagination"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </HeaderTitleBack>
  <div class="referral-rebate">
    <div class="referral-rebate-content">
      <div class="title text-nowrap">
        <span>{{ $t("member.referralRebate.title1") }}</span>
        <span :class="{ 'ml-2': !['zh-tw', 'zh-cn'].includes(locale) }">{{ $t("member.referralRebate.title2") }}</span>
      </div>

      <!-- Currency -->
      <div class="currency-select">
        <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
        <q-btn-dropdown
          rounded
          :label="referralRebateCurrencyCode"
          menu-anchor="bottom middle"
          menu-self="bottom middle"
          :loading="isLoading"
        >
          <q-list>
            <q-item
              v-for="item in currencyDropdown"
              :key="item.value"
              clickable
              v-close-popup
              @click="changeCurrency(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <!-- Summary / referral code -->
      <div class="summary-wrapper">
        <div class="summary">
          <div class="summary-content">
            <div class="summary-title">
              {{ $t("member.referralRebate.latestTotalValidBetAmount") }}
            </div>
            <div class="summary-value">{{ moneyFormat(referralRebateSummary?.valid_bet_amount) }}</div>
          </div>
          <div class="summary-content">
            <div class="summary-title">
              {{ $t("member.referralRebate.latestTotalRevenueAmount") }}
            </div>
            <div class="summary-value">{{ moneyFormat(referralRebateSummary?.revenue_amount) }}</div>
          </div>
        </div>
        <div class="referral-code">
          <div class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</div>
          <q-input class="referral-code-value" v-model="referralCode" dense :borderless="true" readonly>
            <template v-slot:append>
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
            </template>
          </q-input>
        </div>
      </div>

      <template v-if="selectedEventId === null || selectedEventId === undefined">
        <div>
          <!--  Tabs -->
          <div class="proxy-tabs">
            <q-tabs v-model="activeTab" align="left">
              <q-tab name="eventStatement" :label="$t('member.referralRebate.eventStatement')" />
              <q-tab name="revenueDetail" :label="$t('member.referralRebate.revenueDetail')" />
            </q-tabs>
          </div>
          <!-- Search content -->
          <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
            <q-tab-panel name="eventStatement">
              <div class="table-content">
                <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                <div class="member-number">
                  <div class="label">{{ $t("member.referralRebate.account") }}</div>
                  <q-input
                    :placeholder="$t('member.referralRebate.account')"
                    borderless
                    dense
                    v-model="accountNumber"
                    class="w-full md:w-auto"
                  ></q-input>
                </div>
                <div class="actions">
                  <div class="currency-action">
                    <div class="currency-select">
                      <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                      <q-btn-dropdown
                        rounded
                        :label="referralRebateCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeCurrency(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="gametype-action">
                    <div class="gametype-select">
                      <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                      <q-btn-dropdown
                        rounded
                        borderless
                        :label="$t(gameTypeCode)"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in gameTypeDropdownWithAll"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeGameType(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <q-btn class="search-btn" @click="() => getStatement(false)">{{ $t("common.btn.search") }}</q-btn>
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
                  <q-pagination
                    v-model="referralRebateStatements.pagination.page"
                    :max="referralRebateStatements.pagination.total"
                    :max-pages="5"
                    class="r-pagination"
                    color="deep-grey"
                    active-color="blue-8"
                    active-design="flat"
                    direction-links
                    @update:model-value="handleReferralRebateStatementsPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="revenueDetail">
              <div class="table-content">
                <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                <div class="actions">
                  <div class="currency-action">
                    <div class="currency-select">
                      <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                      <q-btn-dropdown
                        rounded
                        :label="referralRebateCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeCurrency(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="date-action">
                    <div class="date-select">
                      <span class="date-select-title">{{ $t("member.referralRebate.settlementTime") }}</span>

                      <q-input
                        v-model="displayDate"
                        placeholder=""
                        outlined
                        readonly
                        dense
                        class="w-full md:w-auto date-select-input"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date range v-model="selectedDate" mask="YYYY-MM-DD">
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
                  <q-btn class="search-btn" @click="getEvents">{{ $t("common.btn.search") }}</q-btn>
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

                  <q-pagination
                    v-model="referralRebateEvents.pagination.page"
                    :max="referralRebateEvents.pagination.total"
                    :max-pages="5"
                    class="r-pagination"
                    flat
                    active-design="flat"
                    color="deep-grey"
                    active-color="blue-8"
                    direction-links
                    @update:model-value="handleReferralRebateEventsPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>

      <template v-else>
        <div class="mt-[4rem] events-detail-header">
          <q-btn
            class="back-btn"
            :to="{ name: 'ReferralRebate' }"
            :label="$t('common.btn.back')"
            icon="reply"
            @click="changeGameType(gameTypeDropdownWithAll[0])"
          >
          </q-btn>
        </div>
        <div class="table-content events-detail">
          <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
          <div class="member-number">
            <div class="label">{{ $t("member.referralRebate.account") }}</div>
            <q-input
              :placeholder="$t('member.referralRebate.account')"
              borderless
              dense
              v-model="accountNumber"
              class="w-full md:w-auto"
            ></q-input>
          </div>
          <div class="actions">
            <div class="currency-action">
              <div class="currency-select">
                <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                <q-btn-dropdown
                  rounded
                  :label="referralRebateCurrencyCode"
                  menu-anchor="bottom middle"
                  menu-self="bottom middle"
                  :loading="isLoading"
                  class="w-full md:w-auto"
                >
                  <q-list>
                    <q-item
                      v-for="item in currencyDropdown"
                      :key="item.value"
                      clickable
                      v-close-popup
                      @click="changeCurrency(item)"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
            <div class="gametype-action">
              <div class="gametype-select">
                <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                <q-btn-dropdown
                  rounded
                  borderless
                  :label="$t(gameTypeCode)"
                  menu-anchor="bottom middle"
                  menu-self="bottom middle"
                  :loading="isLoading"
                  class="w-full md:w-auto"
                >
                  <q-list>
                    <q-item
                      v-for="item in gameTypeDropdownWithAll"
                      :key="item.value"
                      clickable
                      v-close-popup
                      @click="changeGameType(item)"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
            <q-btn class="search-btn" @click="() => selectedEventId && getEventsStatements(selectedEventId, false)">{{
              $t("common.btn.search")
            }}</q-btn>
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
            <q-pagination
              v-model="referralRebateEventsStatements.pagination.page"
              :max="referralRebateEventsStatements.pagination.total"
              :max-pages="5"
              class="r-pagination"
              flat
              active-design="flat"
              color="deep-grey"
              active-color="blue-8"
              direction-links
              @update:model-value="handlereferralRebateEventsStatementsPagination"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/referral-rebate.scss";
</style>

<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { locale } = useI18n()
const { isLargeTablet } = useMediaQuery()
const router = useRouter()
const { isLogin } = useAuth()
const { copyMessage, moneyFormat } = useCommon()
const {
  activeTab,
  isLoading,
  selectedEventId,
  accountNumber,
  selectedDate,
  displayDate,
  currencyDropdown,
  gameTypeDropdownWithAll,
  initDetail,
  initReferralRebateDate,
  initReferralRebateCurrency,
  referralCode,
  gameTypeCode,
  referralRebateCurrencyCode,
  referralRebateSummary,
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
  console.log(locale.value)
  if (isLogin.value) {
    initDetail()
    initReferralRebateDate()
    await initReferralRebateCurrency()
    await getReferralCode()
    await getSummary()
    await getStatement(false)
    await getEvents()
  } else {
    router.push({ path: "/" })
  }
})
</script>
