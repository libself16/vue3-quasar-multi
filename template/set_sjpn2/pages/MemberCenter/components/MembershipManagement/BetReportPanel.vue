<template>
  <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
    <div class="search-form-row">
      <div class="search-item">
        <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
        <q-input
          v-model="memberManagementStore.memberAccount"
          :placeholder="$t('placeholder.pleaseEnterUserAccount')"
          dense
          standout="bg-grey-10 text-white"
          class="search-item-input"
        />
      </div>

      <div class="search-item">
        <div class="search-item-label">{{ $t("member.profile.date") }}</div>
        <q-input
          v-model="memberManagementStore.formattedDateRange"
          :placeholder="$t('placeholder.pleaseSelectDate')"
          readonly
          dense
          standout="bg-grey-10 text-white"
          class="search-item-input date"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" />
          </template>
          <q-menu ref="menuRef">
            <q-date v-model="memberManagementStore.dateRange" mask="YYYY-MM-DD" range minimal @range-end="hideMenu" />
          </q-menu>
        </q-input>
      </div>

      <q-btn
        :label="$t('common.btn.searchBtn')"
        color="black"
        text-color="white"
        unelevated
        class="search-btn"
        type="submit"
      />
    </div>
  </q-form>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-[#222222] text-white"
    table-header-class="bg-black text-white"
    :rows="memberManagementStore.betReportRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.betReportColumns"
    row-key="id"
    hide-pagination
    flat
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span class="cursor-pointer" @click="memberManagementStore.searchAccountBetReport(props.row.userAccount)">
            {{ props.row.member_account }}
          </span>
        </q-td>
        <q-td key="bet_count" :props="props">
          <span>{{ props.row.bet_count }}</span>
        </q-td>
        <q-td key="win_count" :props="props">
          <span>{{ props.row.win_count }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet_amount) }}</span>
        </q-td>
        <q-td key="payout" :props="props">
          <span>{{ moneyFormat(props.row.payout) }}</span>
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="profit_rate" :props="props">
          <span>{{ `${props.row.profit_rate}%` }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>{{ props.row.bonus }}</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="memberManagementStore.betReportRows?.length" #bottom-row>
      <q-tr class="page-total">
        <q-td>{{ $t("menu.pageTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryList" :key="index">{{ item }}</q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td>{{ $t("menu.searchTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryTotalList" :key="index">{{ item }}</q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-list v-if="memberManagementStore.betReportRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.betReportRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("menu.userAccount") }}</div>
                <div class="cursor-pointer" @click="memberManagementStore.searchAccountBetReport(data.member_account)">
                  {{ data.member_account }}
                </div>
              </div>
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("member.referralRebate.profit") }}</div>
                <div>{{ moneyFormat(data.profit) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.bettingAmount") }}</div>
                <div>{{ moneyFormat(data.bet_amount) }}</div>
              </div>
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.validBetAmount") }}</div>
                <div>{{ moneyFormat(data.valid_bet_amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.orderQuantity") }}</div>
                <div>{{ data.bet_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.winningNumber") }}</div>
                <div>{{ data.win_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("common.payout") }}</div>
                <div>{{ moneyFormat(data.payout) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.profitRatio") }}</div>
                <div>{{ `${data.profit_rate}%` }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.activityBonus") }}</div>
                <div>{{ data.bonus }}</div>
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
  <div v-if="memberManagementStore.totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      direction-links
      push
      color="pagination"
      icon-prev="keyboard_double_arrow_left"
      icon-next="keyboard_double_arrow_right"
      @update:model-value="memberManagementStore.handleChangePage"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { moneyFormat } = useCommon()
const { isMobile } = useMediaQuery()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss" scoped>
@import "app/template/set_sjpn2/assets/css/membershipManagement.scss";
</style>
