<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="text-white"
    table-header-class="text-white"
    :rows="memberManagementStore.betRecordQueryRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.betRecordQueryColumns"
    row-key="id"
    hide-pagination
    flat
    class="bet-record-query-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchBetRecordQuery" class="search-form">
        <div class="search-form-row">
          <div class="search-item bet-record-report">
            <div class="search-item-label bet-record-report">{{ $t("tableHeader.betNumber") }}</div>
            <q-input
              v-model="memberManagementStore.betNumber"
              :placeholder="$t('placeholder.pleaseEnterBetNumber')"
              dense
              standout="text-black"
              class="search-item-input account bet-record-report"
            />
          </div>

          <div class="search-item bet-record-report">
            <div class="search-item-label bet-record-report">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account bet-record-report"
            />
          </div>
        </div>

        <div class="search-form-row">
          <div class="search-item bet-record-report">
            <div class="search-item-label">{{ $t("member.profile.date") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input date border-b-gray-300 border-b"
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
                />
              </q-menu>
            </q-input>
          </div>

          <div class="search-item bet-record-report">
            <q-checkbox v-model="memberManagementStore.settlementDate" size="xs" color="primary" />
            {{ $t("menu.settlementDate") }}
          </div>

          <div class="search-item bet-record-report">
            <q-checkbox v-model="memberManagementStore.betDate" size="xs" color="primary" />
            {{ $t("member.membershipManagement.betDate") }}
          </div>

          <q-btn
            :label="$t('common.btn.search')"
            text-color="white"
            unelevated
            class="search-btn bet-record-report"
            type="submit"
          />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="wager_code" :props="props">
          <span>{{ props.row.wager_code }}</span>
        </q-td>
        <q-td key="gaming_site" :props="props">
          <span>-</span>
        </q-td>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="created_at" :props="props">
          <span>{{ dateformat(props.row.created_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
        </q-td>
        <q-td key="settled_at" :props="props">
          <span>{{ dateformat(props.row.settled_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
        </q-td>
        <q-td key="status" :props="props">
          <span>{{ props.row.status_title }}</span>
        </q-td>
        <q-td key="channel_code" :props="props">
          <span>{{ props.row.channel_code }}</span>
        </q-td>
        <q-td key="product_title" :props="props">
          <span>{{ props.row.product_title }}</span>
        </q-td>
        <q-td key="game_title" :props="props">
          <span>{{ props.row.game_title }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet_amount) }}</span>
        </q-td>
        <q-td key="payout" :props="props">
          <span
            @click="
              memberManagementStore.handlerGetMemberAgentWagerDetail(props.row.wager_code, props.row.product_code)
            "
            >{{ moneyFormat(props.row.payout) }}</span
          >
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>-</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="memberManagementStore.betRecordQueryRows?.length" #bottom-row>
      <q-tr class="page-total">
        <q-td>{{ $t("menu.pageTotal") }}</q-td>
        <q-td v-for="i in 8" :key="i">-</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betRecordQuerySummaryList" :key="index">{{ item }}</q-td>
        <q-td>-</q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td>{{ $t("menu.searchTotal") }}</q-td>
        <q-td v-for="i in 8" :key="i">-</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betRecordQuerySummaryTotalList" :key="index">
          {{ item }}
        </q-td>
        <q-td>-</q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span class="no-data">{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchBetRecordQuery" class="search-form">
      <div class="search-form-row mb-5">
        <div class="search-item">
          <div class="search-item-label">{{ $t("tableHeader.betNumber") }}</div>
          <q-input
            v-model="memberManagementStore.betNumber"
            :placeholder="$t('placeholder.pleaseEnterBetNumber')"
            dense
            standout="text-black"
            class="search-item-input account"
          />
        </div>

        <div class="search-item">
          <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout="text-black"
            class="search-item-input account"
          />
        </div>
      </div>

      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label">{{ $t("tableHeader.startDate") }}</div>
          <q-input
            v-model="memberManagementStore.formattedStartDate"
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
          <div class="search-item-label">{{ $t("tableHeader.endDate") }}</div>
          <q-input
            v-model="memberManagementStore.formattedEndDate"
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

        <div class="search-item checkbox">
          <div class="flex items-center">
            <q-checkbox v-model="memberManagementStore.settlementDate" size="xs" color="primary" />
            {{ $t("menu.settlementDate") }}
          </div>

          <div class="flex items-center">
            <q-checkbox v-model="memberManagementStore.betDate" size="xs" color="primary" />
            {{ $t("member.membershipManagement.betDate") }}
          </div>
        </div>

        <q-btn
          :label="$t('common.btn.search')"
          text-color="white"
          unelevated
          class="search-btn bet-record-report"
          type="submit"
        />
      </div>
    </q-form>
    <q-list v-if="memberManagementStore.betRecordQueryRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.betRecordQueryRows"
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
                <div class="text-gray">{{ data.member_account }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("member.referralRebate.profit") }}</div>
                <div class="text-gray">{{ moneyFormat(data.profit) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.bettingAmount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.bet_amount) }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.validBetAmount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.valid_bet_amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="!bg-[#cd2e2b] !p-5">
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.betNumber") }}</div>
                <div class="text-right">{{ data.wager_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.register.gaming_site") }}</div>
                <div class="text-right">-</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.bettingTime") }}</div>
                <div class="text-right">{{ dateformat(data.created_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.referralRebate.settlementTime") }}</div>
                <div class="text-right">{{ dateformat(data.settled_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.status") }}</div>
                <div class="text-right">{{ data.status_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.bettingSource") }}</div>
                <div class="text-right">{{ data.channel_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.product") }}</div>
                <div class="text-right">{{ data.product_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("common.games") }}</div>
                <div class="text-right">{{ data.game_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("common.payout") }}</div>
                <div
                  class="text-right"
                  @click="memberManagementStore.handlerGetMemberAgentWagerDetail(data.wager_code, data.product_code)"
                >
                  {{ moneyFormat(data.payout) }}
                </div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.activityBonus") }}</div>
                <div class="text-right">-</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="q-expansion-item flex justify-center items-center !bg-transparent !mb-0">
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
      color="white"
      active-color="active-pagination"
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
import { dateformat } from "src/common/utils/dayjsUtils"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (memberManagementStore.dateRange === "") return ""
    return `${memberManagementStore.dateRange} 00:00:00 ${t("common.btn.to")} ${
      memberManagementStore.dateRange
    } 23:59:59`
  } else {
    if (!memberManagementStore.dateRange.from || !memberManagementStore.dateRange.to) return ""
    return `${memberManagementStore.dateRange.from} 00:00:00 ${t("common.btn.to")} ${
      memberManagementStore.dateRange.to
    } 23:59:59`
  }
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss" scoped>
@import "app/template/okbet_red/assets/css/membershipManagement.scss";
</style>
