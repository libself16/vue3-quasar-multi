<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-white"
    table-header-class="bg-white"
    :rows="memberManagementStore.agentReportRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.agentReportColumns"
    row-key="id"
    hide-pagination
    flat
    class="agent-report-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchAgentReport" class="search-form">
        <div v-if="memberManagementStore.agentReportCurrencyList?.length > 1" class="search-form-row">
          <div class="search-item agent-report">
            <div class="search-item-label agent-report">
              {{ $t("collaboration.currency") }}
            </div>

            <q-select
              v-model="memberManagementStore.agentReportCurrencyId"
              :options="memberManagementStore.agentReportCurrencyList"
              rounded
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="agent-report-currency"
            />
          </div>
        </div>

        <div class="search-form-row">
          <div class="search-item agent-report">
            <div class="search-item-label">{{ $t("member.profile.date") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input date no-time border-b-gray-300 border-b"
            >
              <template v-slot:append>
                <q-icon
                  :name="memberManagementStore.datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'"
                  class="cursor-pointer"
                />
              </template>
              <q-menu
                ref="menuRef"
                @show="memberManagementStore.datePickerShow = true"
                @hide="memberManagementStore.datePickerShow = false"
              >
                <q-date
                  v-model="memberManagementStore.dateRange"
                  mask="YYYY-MM-DD"
                  range
                  color="primary"
                  minimal
                  @range-end="hideMenu"
                  @update:model-value="memberManagementStore.dateType = -1"
                />
              </q-menu>
            </q-input>
          </div>

          <div class="search-item agent-report">
            <q-btn-toggle
              v-model="memberManagementStore.dateType"
              no-caps
              unelevated
              toggle-color="primary"
              class="toggle-date-picker font"
              :options="memberManagementStore.dayTypeTabs"
            />
          </div>

          <q-btn
            :label="$t('common.btn.search')"
            text-color="white"
            unelevated
            class="search-btn agent-report"
            type="submit"
            :loading="memberManagementStore.isLoading"
          />
        </div>
      </q-form>

      <div class="user-data">
        <div class="team-data-title">{{ $t("member.membershipManagement.selfData") }}</div>

        <div class="top-area">
          <div v-for="(item, index) in memberManagementStore.agentReportTopAreaColumns" :key="index" class="data-area">
            <div class="header-item">{{ item.label }}</div>
            <div class="data-item">{{ item.value }}</div>
          </div>
        </div>

        <div class="bottom-area">
          <div
            v-for="(item, index) in memberManagementStore.agentReportBottomAreaColumns"
            :key="index"
            class="data-area"
            :class="{ 'first-item': !index }"
          >
            <div class="header-item">{{ item.label }}</div>
            <div class="data-item">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>

      <div class="team-data-title">{{ $t("shareholder_platform.teamData") }}</div>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span>
            {{ props.row.member_account }}
          </span>
        </q-td>
        <q-td key="member_count" :props="props">
          <span>{{ moneyFormat(props.row.member_count) }}</span>
        </q-td>
        <q-td key="currency_id" :props="props">
          <span>{{ memberManagementStore.currencyName(props.row.currency_id) }}</span>
        </q-td>
        <q-td key="bet_count" :props="props">
          <span>{{ moneyFormat(props.row.bet_count) }}</span>
        </q-td>
        <q-td key="deposit" :props="props">
          <span>{{ moneyFormat(props.row.deposit) }}</span>
        </q-td>
        <q-td key="withdraw" :props="props">
          <span>{{ moneyFormat(props.row.withdraw) }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet) }}</span>
        </q-td>
        <q-td key="prize" :props="props">
          <span>{{ moneyFormat(props.row.prize) }}</span>
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="rate" :props="props">
          <span>{{ `${props.row.rate}%` }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>{{ moneyFormat(props.row.bonus) }}</span>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span class="no-data">{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchAgentReport" class="search-form">
      <div v-if="memberManagementStore.agentReportCurrencyList?.length > 1" class="search-form-row mb-5">
        <div class="search-item agent-report">
          <div class="search-item-label agent-report">
            {{ $t("collaboration.currency") }}
          </div>

          <q-select
            v-model="memberManagementStore.agentReportCurrencyId"
            :options="memberManagementStore.agentReportCurrencyList"
            rounded
            dense
            borderless
            option-label="label"
            option-value="value"
            emit-value
            map-options
            class="agent-report-currency"
          />
        </div>
      </div>

      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.startDate") }}</div>
          <q-input
            v-model="formattedStartDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            outlined
            standout="bg-grey-10 text-white"
            class="search-item-input date"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date v-model="memberManagementStore.dateRange.from" mask="YYYY-MM-DD" color="primary" minimal />
            </q-menu>
          </q-input>
        </div>

        <div class="search-item">
          <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.endDate") }}</div>
          <q-input
            v-model="formattedEndDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            outlined
            standout="bg-grey-10 text-white"
            class="search-item-input date"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date v-model="memberManagementStore.dateRange.to" mask="YYYY-MM-DD" color="primary" minimal />
            </q-menu>
          </q-input>
        </div>

        <div class="search-item">
          <q-btn-toggle
            v-model="memberManagementStore.dateType"
            no-caps
            unelevated
            toggle-color="primary"
            class="toggle-date-picker font"
            :options="memberManagementStore.dayTypeTabs"
          />
        </div>

        <q-btn
          :label="$t('common.btn.search')"
          text-color="white"
          unelevated
          class="search-btn agent-report"
          type="submit"
          :loading="memberManagementStore.isLoading"
        />
      </div>
    </q-form>

    <div class="user-data">
      <div class="team-data-title">{{ $t("member.membershipManagement.selfData") }}</div>

      <div class="top-area-mobile mb-3">
        <div
          v-for="(item, index) in memberManagementStore.agentReportTopAreaColumns"
          :key="index"
          class="top-area-mobile-item"
        >
          <div class="top-area-mobile-item-label">{{ item.label }}</div>
          <div class="top-area-mobile-item-value">{{ item.value }}</div>
        </div>
      </div>

      <div class="bottom-area-mobile">
        <div
          v-for="(item, index) in memberManagementStore.agentReportBottomAreaColumns"
          :key="index"
          class="bottom-area-mobile-item"
        >
          <div class="bottom-area-mobile-item-label">{{ item.label }}</div>
          <div class="bottom-area-mobile-item-value">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>

    <div class="team-data-title">{{ $t("shareholder_platform.teamData") }}</div>
    <q-list v-if="memberManagementStore.agentReportRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.agentReportRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        class="expansion-item"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-header-item">
                <div>{{ $t("menu.userAccount") }}</div>
                <div class="text-gray" @click="memberManagementStore.searchAccountBetReport(data.member_account)">
                  {{ data.member_account }}
                </div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("member.membershipManagement.teamMember") }}</div>
                <div class="text-gray">{{ moneyFormat(data.member_count) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("member.profile.currency") }}</div>
                <div class="text-gray">{{ memberManagementStore.currencyName(data.currency_id) }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("member.membershipManagement.teamBetNumber") }}</div>
                <div class="text-gray">{{ moneyFormat(data.bet_count) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamDepositAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.deposit) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamWithdrawalAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.withdraw) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamBetAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.bet_amount) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamValidBetAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.valid_bet) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamPayoutAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.prize) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamProfit") }}</div>
                <div class="text-right">{{ moneyFormat(data.profit) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamProfitRatio") }}</div>
                <div class="text-right">{{ `${data.rate}%` }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.membershipManagement.teamActivityBonus") }}</div>
                <div class="text-right">{{ moneyFormat(data.bonus) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div v-else class="q-expansion-item flex justify-center items-center !bg-white !mb-0">
      <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangePage"
      direction-links
      flat
      active-design="flat"
      color="deep-grey"
      active-color="blue-8"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${memberManagementStore.dateRange}`
  } else {
    if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
    return `${memberManagementStore.dateRange.from} ${t("common.btn.to")} ${memberManagementStore.dateRange.to}`
  }
})

const formattedStartDate = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    return memberManagementStore.dateRange
  } else {
    return memberManagementStore.dateRange.from
  }
})

const formattedEndDate = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    return memberManagementStore.dateRange
  } else {
    return memberManagementStore.dateRange.to
  }
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss" scoped>
@import "app/template/okbet/assets/css/membershipManagement.scss";
</style>
