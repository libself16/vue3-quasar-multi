<template>
  <q-form @submit.prevent="memberManagementStore.handlerSearchAccountAmount" class="search-form">
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
        <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
        <q-select
          v-model="memberManagementStore.changeType"
          :options="memberManagementStore.changeTypeOptions"
          :placeholder="$t('shareholder_platform.please_select')"
          dense
          emit-value
          map-options
          standout="bg-grey-10 text-white"
          class="search-item-input"
        />
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
    :rows="memberManagementStore.detailRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.detailColumns"
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
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="updated_at_unix" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.updated_at_unix) }}</span>
        </q-td>
        <q-td key="action_type" :props="props">
          <span>{{ memberManagementStore.searchTypeName(props.row.action_type) }}</span>
        </q-td>
        <q-td key="transaction_code" :props="props">
          <span>{{ props.row.transaction_code }}</span>
        </q-td>
        <q-td key="amount" :props="props">
          <span>{{ moneyFormat(props.row.amount) }}</span>
        </q-td>
        <q-td key="before_balance" :props="props">
          <span>{{ moneyFormat(props.row.before_balance) }}</span>
        </q-td>
        <q-td key="after_balance" :props="props">
          <span>{{ moneyFormat(props.row.after_balance) }}</span>
        </q-td>
      </q-tr>
    </template>
    <template #no-data>
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-list v-if="memberManagementStore.detailRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.detailRows"
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
                <div class="expansion-item-label">{{ $t("menu.account") }}</div>
                <div>{{ data.member_account }}</div>
              </div>
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.accountType") }}</div>
                <div>{{ memberManagementStore.searchTypeName(data.action_type) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.amount") }}</div>
                <div>{{ moneyFormat(data.amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.accountChangeTime") }}</div>
                <div>{{ memberManagementStore.parseDate(data.updated_at_unix) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.accountVariableObject") }}</div>
                <div>{{ data.transaction_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.amountBeforeChanges") }}</div>
                <div>{{ moneyFormat(data.before_balance) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.amountAfterChange") }}</div>
                <div>{{ moneyFormat(data.after_balance) }}</div>
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
@import "app/template/set_amuse/assets/css/membershipManagement.scss";
</style>
