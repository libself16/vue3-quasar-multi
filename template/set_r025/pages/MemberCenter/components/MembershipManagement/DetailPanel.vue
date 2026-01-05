<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.detailRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.detailColumns"
    row-key="id"
    hide-pagination
    flat
    class="detail-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchAccountAmount" class="search-form">
        <div class="search-form-row">
          <div class="search-item">
            <div class="search-item-label">{{ $t("member.profile.date") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout
              class="search-item-input date add-border"
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
        </div>

        <div class="search-form-row">
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

          <div class="search-item">
            <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
            <q-select
              v-model="memberManagementStore.changeType"
              :options="memberManagementStore.changeTypeOptions"
              :placeholder="$t('shareholder_platform.please_select')"
              dense
              emit-value
              map-options
              standout="text-black"
              class="search-item-input type"
            />
          </div>

          <q-btn :label="$t('common.btn.search')" text-color="white" unelevated class="search-btn" type="submit" />
        </div>
      </q-form>
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
    <q-form @submit.prevent="memberManagementStore.handlerSearchAccountAmount" class="search-form">
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
      </div>

      <div class="search-form-row">
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

        <div class="search-item">
          <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
          <q-select
            v-model="memberManagementStore.changeType"
            :options="memberManagementStore.changeTypeOptions"
            :placeholder="$t('shareholder_platform.please_select')"
            dense
            emit-value
            map-options
            standout="text-black"
            class="search-item-input type"
          />
        </div>

        <q-btn :label="$t('common.btn.search')" text-color="white" unelevated class="search-btn" type="submit" />
      </div>
    </q-form>
    <q-list v-if="memberManagementStore.detailRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.detailRows"
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
                <div>{{ $t("menu.account") }}</div>
                <div class="text-gray">{{ data.member_account }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.accountType") }}</div>
                <div class="text-gray">{{ memberManagementStore.searchTypeName(data.action_type) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.amount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="text-right">{{ memberManagementStore.parseDate(data.updated_at_unix) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.accountVariableObject") }}</div>
                <div class="text-right">{{ data.transaction_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.amountBeforeChanges") }}</div>
                <div class="text-right">{{ moneyFormat(data.before_balance) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.amountAfterChange") }}</div>
                <div class="text-right">{{ moneyFormat(data.after_balance) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="q-expansion-item flex justify-center items-center !mb-0">
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
      color="neutral-01"
      active-color="primary"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} 00:00:00 ${t("common.btn.to")} ${
      memberManagementStore.dateRange
    } 23:59:59`
  } else {
    if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
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
@import "app/template/set_r025/assets/css/membershipManagement.scss";
</style>
