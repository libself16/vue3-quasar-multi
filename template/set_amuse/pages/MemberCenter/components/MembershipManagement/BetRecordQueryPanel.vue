<template>
  <q-form
    @submit.prevent="memberManagementStore.handlerSearchBetRecordQuery"
    class="search-form bet-record-query-report"
  >
    <div class="search-form-row">
      <div class="search-item bet-record-report">
        <div class="search-item-label bet-record-report">{{ $t("tableHeader.betNumber") }}</div>
        <q-input
          v-model="memberManagementStore.betNumber"
          :placeholder="$t('placeholder.pleaseEnterBetNumber')"
          dense
          standout="bg-grey-10 text-white"
          class="search-item-input"
        />
      </div>

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
    </div>

    <div class="search-form-row">
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

      <div class="search-item checkbox">
        <div class="checkbox-item">
          <q-checkbox v-model="memberManagementStore.settlementDate" size="xs" />
          {{ $t("menu.settlementDate") }}
        </div>

        <div class="checkbox-item">
          <q-checkbox v-model="memberManagementStore.betDate" size="xs" />
          {{ $t("member.membershipManagement.betDate") }}
        </div>
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
    :rows="memberManagementStore.betRecordQueryRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.betRecordQueryColumns"
    row-key="id"
    hide-pagination
    flat
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
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
          >
            {{ moneyFormat(props.row.payout) }}
          </span>
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
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-list v-if="memberManagementStore.betRecordQueryRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.betRecordQueryRows"
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
                <div>{{ data.member_account }}</div>
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
                <div>{{ $t("tableHeader.betNumber") }}</div>
                <div>{{ data.wager_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("member.register.gaming_site") }}</div>
                <div>-</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.bettingTime") }}</div>
                <div>{{ dateformat(data.created_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("member.referralRebate.settlementTime") }}</div>
                <div>{{ dateformat(data.settled_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.status") }}</div>
                <div>{{ data.status_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.bettingSource") }}</div>
                <div>{{ data.channel_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.product") }}</div>
                <div>{{ data.product_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("common.games") }}</div>
                <div>{{ data.game_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("common.payout") }}</div>
                <div
                  @click="memberManagementStore.handlerGetMemberAgentWagerDetail(data.wager_code, data.product_code)"
                >
                  {{ moneyFormat(data.payout) }}
                </div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.activityBonus") }}</div>
                <div>-</div>
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
import { dateformat } from "src/common/utils/dayjsUtils"

const { moneyFormat } = useCommon()
const { isMobile } = useMediaQuery()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss" scoped>
@import "app/template/set_amuse/assets/css/membershipManagement.scss";
</style>
