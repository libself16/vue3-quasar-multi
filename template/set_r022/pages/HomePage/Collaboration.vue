<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" title-i18n="collaboration.title">
    <div class="collaboration">
      <div class="collaboration-content">
        <!-- Currency -->
        <div class="currency-select">
          <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
          <q-btn-dropdown
            rounded
            :label="collaborationCurrencyCode"
            menu-anchor="bottom middle"
            menu-self="bottom middle"
            :loading="isLoading"
            class="currency-select-btn"
          >
            <q-list>
              <q-item
                v-for="item in currencyDropdown"
                :key="item.value"
                class="dropdownList"
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
                {{ $t("collaboration.active_members_this_period") }}
              </div>
              <div class="summary-value">{{ moneyFormat(collaborationState?.active_member_count) }}</div>
            </div>
            <div class="summary-content">
              <div class="summary-title">
                {{ $t("collaboration.total_valid_bet_amount_this_period") }}
              </div>
              <div class="summary-value">{{ moneyFormat(collaborationState?.valid_bet_amount) }}</div>
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

        <div>
          <!--  Tabs -->
          <div class="proxy-tabs">
            <q-tabs v-model="activeTab" align="left">
              <q-tab name="invitationDetails" :label="$t('collaboration.invitation_details')" />
              <q-tab name="commissionDetails" :label="$t('collaboration.commission_details')" />
            </q-tabs>
          </div>
          <!-- Search content -->
          <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
            <q-tab-panel name="invitationDetails">
              <div class="table-content">
                <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                <div class="member-number">
                  <div class="label">{{ $t("collaboration.member_account") }}</div>
                  <q-input
                    :placeholder="$t('collaboration.member_account')"
                    borderless
                    dense
                    v-model="accountNumber"
                    class="w-full md:w-auto"
                  ></q-input>
                </div>
                <div class="actions">
                  <div class="currency-action">
                    <div class="currency-select">
                      <div class="currency-select-title">{{ $t("collaboration.status") }}</div>
                      <q-btn-dropdown
                        rounded
                        :label="$t(invitationsStatusCode)"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            class="dropdownList"
                            v-for="item in invitationsStatusDropdown"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeInvitationsStatus(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="currency-action">
                    <div class="currency-select">
                      <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
                      <q-btn-dropdown
                        rounded
                        :label="collaborationCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            class="dropdownList"
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
                  <q-btn class="search-btn" @click="handleGetInvitations">{{ $t("common.btn.search") }}</q-btn>
                </div>
                <div class="tables">
                  <q-table
                    :rows="invitationsData.list"
                    :columns="invitationsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    v-if="invitationsData.list.length > 0"
                    :grid="true"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="member_account" :props="props">
                          {{ props.row.member_account }}
                        </q-td>
                        <q-td key="deposit_count" :props="props">
                          {{ moneyFormat(props.row.deposit_count) }}
                        </q-td>
                        <q-td key="currency_id" :props="props">
                          {{ props.row.currency_id }}
                        </q-td>
                        <q-td key="deposit_amount" :props="props">
                          {{ moneyFormat(props.row.deposit_amount) }}
                        </q-td>
                        <q-td key="valid_bet_amount" :props="props">
                          {{ moneyFormat(props.row.valid_bet_amount) }}
                        </q-td>
                        <q-td key="status" :props="props">
                          <div
                            :class="{
                              achieved:
                                props.row.status === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
                              not_achieved:
                                props.row.status === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED]
                            }"
                          >
                            {{ $t(props.row.status) }}
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <div class="card-title">
                          <div class="card-title-item">
                            <span class="text-sm">{{ $t("collaboration.member_account") }}</span>
                            <span class="card_head_content text-xs">{{ props.row.member_account }}</span>
                          </div>
                          <div class="card-title-item">
                            <span class="text-sm">{{ $t("collaboration.deposit_count") }}</span>
                            <span class="card_head_content text-xs">{{ moneyFormat(props.row.deposit_count) }}</span>
                          </div>
                          <q-btn
                            class="arrow-down-icon"
                            round
                            flat
                            dense
                            :icon="props.row.showDetail ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                            @click="props.row.showDetail = !props.row.showDetail"
                          />
                        </div>
                        <q-slide-transition v-show="props.row.showDetail">
                          <div class="card-detail">
                            <template v-for="col in props.cols" :key="col.name">
                              <div
                                v-if="!['member_account', 'status', 'deposit_count'].includes(col.name)"
                                class="row-item"
                              >
                                <div class="label">
                                  {{ col.label }}
                                </div>
                                <div class="value">
                                  <template v-if="col.name === 'deposit_amount' || col.name === 'valid_bet_amount'">
                                    {{ moneyFormat(col.value) }}
                                  </template>
                                  <template v-else>{{ col.value }}</template>
                                </div>
                              </div>
                              <div v-if="col.name === 'status'" class="row-item">
                                <div class="label">
                                  {{ col.label }}
                                </div>
                                <div class="value">
                                  <div
                                    :class="{
                                      achieved:
                                        col.value === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
                                      not_achieved:
                                        col.value === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED]
                                    }"
                                  >
                                    {{ $t(col.value) }}
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </q-slide-transition>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <q-pagination
                    v-model="invitationsData.pagination.page"
                    :max="invitationsData.pagination.total"
                    class="r-pagination"
                    color="grey-7"
                    direction-links
                    @update:model-value="handleInvitationsDataPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="commissionDetails">
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
                              <q-date class="text-white bg-[#0C1A43]" range v-model="selectedDate" mask="YYYY-MM-DD">
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
                      <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
                      <q-btn-dropdown
                        rounded
                        :label="collaborationCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            class="dropdownList"
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

                  <q-btn class="search-btn" @click="handleGetRebates">{{ $t("common.btn.search") }}</q-btn>
                </div>
                <div class="tables">
                  <q-table
                    v-if="rebateDate.list.length > 0"
                    :rows="rebateDate.list"
                    :columns="rebateDateTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    :table-row-class-fn="tableRowClass"
                    :grid="true"
                  >
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <div class="card-title">
                          <div class="card-title-item">
                            <span class="text-sm">{{ $t("collaboration.settlement_time") }}</span>
                            <span class="card_head_content text-xs">{{ props.row.settled_time }}</span>
                          </div>
                          <div class="card-title-item">
                            <span class="text-sm">{{ $t("collaboration.achieved_active_member_count") }}</span>
                            <span class="card_head_content text-xs">{{
                              moneyFormat(props.row.active_member_count)
                            }}</span>
                          </div>
                          <q-btn
                            class="arrow-down-icon"
                            round
                            flat
                            dense
                            :icon="props.row.showDetail ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                            @click="props.row.showDetail = !props.row.showDetail"
                          />
                        </div>
                        <q-slide-transition v-show="props.row.showDetail">
                          <div class="card-detail">
                            <template v-for="col in props.cols" :key="col.name">
                              <div v-if="!['settled_time', 'active_member_count'].includes(col.name)" class="row-item">
                                <div class="label">
                                  {{ col.label }}
                                </div>
                                <div class="value">
                                  <template v-if="col.name === 'valid_bet_amount' || col.name === 'rebate_amount'">
                                    {{ moneyFormat(col.value) }}
                                  </template>
                                  <template v-else>{{ col.value }}</template>
                                </div>
                              </div>
                            </template>
                          </div>
                        </q-slide-transition>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>

                  <q-pagination
                    v-model="rebateDate.pagination.page"
                    :max="rebateDate.pagination.total"
                    class="r-pagination"
                    color="grey-7"
                    direction-links
                    @update:model-value="handleRebateDatePagination"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <q-dialog v-model="showTip" persistent>
        <q-card class="rule-dialog">
          <q-card-section class="row items-center q-pb-none pl-6">
            <div class="text-h6">{{ collaborationState.title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="p-6">
            <div v-html="collaborationState.detail"></div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </HeaderTitleBack>
  <div class="collaboration">
    <div class="collaboration-content">
      <!-- <img :src="collaborationState.banner" alt="" /> -->
      <div class="title text-nowrap">
        <span>{{ $t("collaboration.title1") }}</span>
        <span :class="{ 'ml-2': !['zh-tw', 'zh-cn'].includes(locale) }">{{ $t("collaboration.title2") }}</span>
        <img class="cursor-pointer w-5 ml-1" :src="collaborationImg('tip_btn')" alt="" @click="handleShowTip" />
      </div>

      <!-- Currency -->
      <div class="currency-select">
        <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
        <q-btn-dropdown
          rounded
          :label="collaborationCurrencyCode"
          menu-anchor="bottom middle"
          menu-self="bottom middle"
          :loading="isLoading"
        >
          <q-list>
            <q-item
              v-for="item in currencyDropdown"
              :key="item.value"
              class="dropdownList"
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
              {{ $t("collaboration.active_members_this_period") }}
            </div>
            <div class="summary-value">{{ moneyFormat(collaborationState?.active_member_count) }}</div>
          </div>
          <div class="summary-content">
            <div class="summary-title">
              {{ $t("collaboration.total_valid_bet_amount_this_period") }}
            </div>
            <div class="summary-value">{{ moneyFormat(collaborationState?.valid_bet_amount) }}</div>
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

      <div>
        <!--  Tabs -->
        <div class="proxy-tabs">
          <q-tabs v-model="activeTab" align="left">
            <q-tab name="invitationDetails" :label="$t('collaboration.invitation_details')" />
            <q-tab name="commissionDetails" :label="$t('collaboration.commission_details')" />
          </q-tabs>
        </div>
        <!-- Search content -->
        <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
          <q-tab-panel name="invitationDetails">
            <div class="table-content">
              <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
              <div class="member-number">
                <div class="label">{{ $t("collaboration.member_account") }}</div>
                <q-input
                  :placeholder="$t('collaboration.member_account')"
                  borderless
                  dense
                  v-model="accountNumber"
                  class="w-full md:w-auto"
                ></q-input>
              </div>
              <div class="actions">
                <div class="currency-action">
                  <div class="currency-select">
                    <div class="currency-select-title">{{ $t("collaboration.status") }}</div>
                    <q-btn-dropdown
                      rounded
                      :label="$t(invitationsStatusCode)"
                      menu-anchor="bottom middle"
                      menu-self="bottom middle"
                      :loading="isLoading"
                      class="w-full md:w-auto"
                    >
                      <q-list>
                        <q-item
                          class="dropdownList"
                          v-for="item in invitationsStatusDropdown"
                          :key="item.value"
                          clickable
                          v-close-popup
                          @click="changeInvitationsStatus(item)"
                        >
                          <q-item-section>
                            <q-item-label>{{ item.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </div>
                <div class="currency-action">
                  <div class="currency-select">
                    <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
                    <q-btn-dropdown
                      rounded
                      :label="collaborationCurrencyCode"
                      menu-anchor="bottom middle"
                      menu-self="bottom middle"
                      :loading="isLoading"
                      class="w-full md:w-auto"
                    >
                      <q-list>
                        <q-item
                          v-for="item in currencyDropdown"
                          class="dropdownList"
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
                <q-btn class="search-btn" @click="handleGetInvitations">{{ $t("common.btn.search") }}</q-btn>
              </div>
              <div class="tables">
                <q-table
                  :rows="invitationsData.list"
                  :columns="invitationsTableColumns"
                  hide-bottom
                  :pagination="{ rowsPerPage: 0 }"
                  v-if="invitationsData.list.length > 0"
                  :grid="false"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="member_account" :props="props">
                        {{ props.row.member_account }}
                      </q-td>
                      <q-td key="deposit_count" :props="props">
                        {{ moneyFormat(props.row.deposit_count) }}
                      </q-td>
                      <q-td key="currency_id" :props="props">
                        {{ props.row.currency_id }}
                      </q-td>
                      <q-td key="deposit_amount" :props="props">
                        {{ moneyFormat(props.row.deposit_amount) }}
                      </q-td>
                      <q-td key="valid_bet_amount" :props="props">
                        {{ moneyFormat(props.row.valid_bet_amount) }}
                      </q-td>
                      <q-td key="status" :props="props">
                        <div
                          :class="{
                            achieved: props.row.status === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
                            not_achieved:
                              props.row.status === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED]
                          }"
                        >
                          {{ $t(props.row.status) }}
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:item="props">
                    <q-card class="w-full">
                      <div class="card-title">
                        <div class="card-title-item">
                          <span class="text-sm">{{ $t("collaboration.member_account") }}</span>
                          <span class="card_head_content text-xs">{{ props.row.member_account }}</span>
                        </div>
                        <div class="card-title-item">
                          <span class="text-sm">{{ $t("collaboration.deposit_count") }}</span>
                          <span class="card_head_content text-xs">{{ props.row.deposit_count }}</span>
                        </div>
                        <q-btn
                          class="arrow-down-icon"
                          round
                          flat
                          dense
                          :icon="props.row.showDetail ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                          @click="props.row.showDetail = !props.row.showDetail"
                        />
                      </div>
                      <q-slide-transition v-show="props.row.showDetail">
                        <div class="card-detail">
                          <template v-for="col in props.cols" :key="col.name">
                            <div
                              v-if="!['member_account', 'status', 'deposit_count'].includes(col.name)"
                              class="row-item"
                            >
                              <div class="label">
                                {{ col.label }}
                              </div>
                              <div class="value">
                                {{ col.value }}
                              </div>
                            </div>
                            <div v-if="col.name === 'status'" class="row-item">
                              <div class="label">
                                {{ col.label }}
                              </div>
                              <div class="value">
                                <div
                                  :class="{
                                    achieved:
                                      col.value === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.ACHIEVED],
                                    not_achieved:
                                      col.value === INVITATION_STATUS.I18nKeys[INVITATION_STATUS.Enums.NOT_ACHIEVED]
                                  }"
                                >
                                  {{ $t(col.value) }}
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </q-slide-transition>
                    </q-card>
                  </template>
                </q-table>
                <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                <q-pagination
                  v-model="invitationsData.pagination.page"
                  :max="invitationsData.pagination.total"
                  class="r-pagination"
                  color="grey-7"
                  direction-links
                  @update:model-value="handleInvitationsDataPagination"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="commissionDetails">
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
                            <q-date class="text-white bg-[#0C1A43]" range v-model="selectedDate" mask="YYYY-MM-DD">
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
                    <div class="currency-select-title">{{ $t("common.btn.currency") }}</div>
                    <q-btn-dropdown
                      rounded
                      :label="collaborationCurrencyCode"
                      menu-anchor="bottom middle"
                      menu-self="bottom middle"
                      :loading="isLoading"
                      class="w-full md:w-auto"
                    >
                      <q-list>
                        <q-item
                          v-for="item in currencyDropdown"
                          class="dropdownList"
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

                <q-btn class="search-btn" @click="handleGetRebates">{{ $t("common.btn.search") }}</q-btn>
              </div>
              <div class="tables">
                <q-table
                  v-if="rebateDate.list.length > 0"
                  :rows="rebateDate.list"
                  :columns="rebateDateTableColumns"
                  hide-bottom
                  :pagination="{ rowsPerPage: 0 }"
                  :table-row-class-fn="tableRowClass"
                  :grid="false"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="settled_time" :props="props">
                        {{ props.row.settled_time }}
                      </q-td>
                      <q-td key="active_member_count" :props="props">
                        {{ moneyFormat(props.row.active_member_count) }}
                      </q-td>
                      <q-td key="currency_id" :props="props">
                        {{ props.row.currency_id }}
                      </q-td>
                      <q-td key="valid_bet_amount" :props="props">
                        {{ moneyFormat(props.row.valid_bet_amount) }}
                      </q-td>
                      <q-td key="level" :props="props">
                        {{ props.row.level }}
                      </q-td>
                      <q-td key="rebate_amount" :props="props">
                        {{ moneyFormat(props.row.rebate_amount) }}
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:item="props">
                    <q-card class="w-full">
                      <div class="card-title">
                        <div class="card-title-item">
                          <span class="text-sm">{{ $t("collaboration.settlement_time") }}</span>
                          <span class="card_head_content text-xs">{{ props.row.settled_time }}</span>
                        </div>
                        <div class="card-title-item">
                          <span class="text-sm">{{ $t("collaboration.achieved_active_member_count") }}</span>
                          <span class="card_head_content text-xs">
                            {{ moneyFormat(props.row.active_member_count) }}
                          </span>
                        </div>
                        <q-btn
                          class="arrow-down-icon"
                          round
                          flat
                          dense
                          :icon="props.row.showDetail ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                          @click="props.row.showDetail = !props.row.showDetail"
                        />
                      </div>
                      <q-slide-transition v-show="props.row.showDetail">
                        <div class="card-detail">
                          <template v-for="col in props.cols" :key="col.name">
                            <div v-if="!['settled_time', 'active_member_count'].includes(col.name)" class="row-item">
                              <div class="label">
                                {{ col.label }}
                              </div>
                              <div class="value">
                                <template v-if="col.name === 'valid_bet_amount' || col.name === 'rebate_amount'">
                                  {{ moneyFormat(col.value) }}
                                </template>
                                <template v-else>{{ col.value }}</template>
                              </div>
                            </div>
                          </template>
                        </div>
                      </q-slide-transition>
                    </q-card>
                  </template>
                </q-table>
                <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>

                <q-pagination
                  v-model="rebateDate.pagination.page"
                  :max="rebateDate.pagination.total"
                  class="r-pagination"
                  color="grey-7"
                  direction-links
                  @update:model-value="handleRebateDatePagination"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <q-dialog v-model="showTip" persistent>
      <q-card class="rule-dialog">
        <q-card-section class="row items-center q-pb-none pl-6">
          <div class="text-h6">{{ collaborationState.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="p-6">
          <div v-html="collaborationState.detail"></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <FooterArea />
</template>

<style scoped lang="scss">
@import "app/template/set_r022/assets/css/collaboration.scss";
</style>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useCollaboration } from "src/common/composables/useCollaboration"
import { onMounted, ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { INVITATION_STATUS } from "src/common/utils/constants"
import FooterArea from "app/template/set_r022/components/Footer/Index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { locale } = useI18n()

const router = useRouter()
const { isLogin } = useAuth()
const { isLargeTablet } = useMediaQuery()
const { copyMessage, moneyFormat } = useCommon()
const { collaborationImg } = useSiteImg()

const {
  handleShareReferralCode,
  tableRowClass,
  activeTab,
  showTip,
  handleShowTip,
  isLoading,
  currencyDropdown,
  changeCurrency,
  collaborationCurrencyCode,
  initCollaborationCurrency,
  collaborationState,
  referralCode,
  handleGetCollaborationVisibility,
  handleGetCollaboration,
  accountNumber,
  changeInvitationsStatus,
  handleGetInvitations,
  invitationsStatusDropdown,
  invitationsStatusCode,
  initCollaborationDate,
  selectedDate,
  displayDate,
  handleGetRebates,
  invitationsTableColumns,
  invitationsData,
  handleInvitationsDataPagination,
  rebateDate,
  rebateDateTableColumns,
  handleRebateDatePagination
} = useCollaboration()

onMounted(async () => {
  console.log(locale.value)
  if (isLogin.value) {
    await initCollaborationDate()
    await initCollaborationCurrency()
    await handleGetCollaborationVisibility()
    await handleGetCollaboration()
    await handleGetInvitations()
    await handleGetRebates()
  } else {
    router.push({ path: "/" })
  }
})
</script>
