<template>
  <HeaderTitleBack titleI18n="menu.transactionHistory" v-bind="HTBConfig">
    <div class="transaction-history-wrapper px-[10px] pt-4 pb-20">
      <q-form class="columns" @submit="handleFormSubmit">
        <div class="search-type-content">
          <q-btn v-for="money in searchTabs" :key="money.value" :label="$t(money.label)"
            :class="{ active: historyState.query.search_type === money.value }"
            @click="historyState.query.search_type = money.value" class="btn-history" unelevated no-caps />
        </div>
        <div class="search-type-content my-4">
          <q-btn v-for="date in dayTypeTabs" :key="date.value" :label="$t(date.label)"
            :class="{ active: historyState.query.dateType === date.value }"
            @click="historyState.query.dateType = date.value" class="btn-history" unelevated no-caps />
        </div>
        <!-- Custom Date Select Time -->
        <div class="columns" v-if="historyState.query.dateType === REPORT_DATE_TYPE.Enums.CustomDate">
          <p class="time-label mt-4">{{ $t("common.btn.searchDate") }}</p>
          <q-input v-model="historyState.query.start_date" placeholder="Choose Date" bg-color="white" outlined readonly
            lazy-rules :rules="[Rules.required()]" @click="showStartDatePicker">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showStartDatePicker" />
            </template>
          </q-input>
          <q-dialog v-model="isShowStartDatePicker" position="standard">
            <q-card class="q-pa-none">
              <q-date v-model="historyState.query.start_date" class="calendar-content w-full" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" flat />
                </div>
              </q-date>
            </q-card>
          </q-dialog>
          <p class="time-label">{{ $t("common.btn.to") }}</p>
          <q-input v-model="historyState.query.end_date" placeholder="Choose Date" bg-color="white" outlined readonly
            lazy-rules :rules="[Rules.required()]" @click="showEndDatePicker">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showEndDatePicker" />
            </template>
          </q-input>
          <q-dialog v-model="isShowEndDatePicker" position="standard">
            <q-card class="q-pa-none">
              <q-date v-model="historyState.query.end_date" class="calendar-content w-full" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" flat />
                </div>
              </q-date>
            </q-card>
          </q-dialog>
        </div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
      <TransactionHistoryList :moneyHistoryStateList="historyState.list" />
      <Pagination v-if="historyState.pagination.totalPage" v-model="historyState.pagination.page"
        :total-pages="historyState.pagination.totalPage" @change="handlePagination" />
    </div>
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useHistory } from "src/common/composables/useHistory"
import { useRule } from "src/common/hooks/useRule"
import { REPORT_DATE_TYPE } from "src/common/utils/constants"
import TransactionHistoryList from "./TransactionHistoryList.vue"
import Pagination from "../../components/Pagination/Index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useHTBConfig } from "app/template/set_6M88/hooks/useHTBConfig"

const { HTBConfig } = useHTBConfig()
const Rules = useRule()

const {
  historyState,
  isLoading,
  initHistoryQuery,
  getHistoryList,
  handlePagination,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
} = useHistory()
const isShowStartDatePicker = ref(false)
const isShowEndDatePicker = ref(false)

const showStartDatePicker = () => {
  isShowStartDatePicker.value = true
}

const showEndDatePicker = () => {
  isShowEndDatePicker.value = true
}

onMounted(async () => {
  initHistoryQuery()
  await getHistoryList()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.search-type-content {
  @apply flex flex-wrap gap-[10px];
}

.btn-history {
  @apply min-w-[140px] h-[38px] rounded-md font-bold;
  border: 1px solid $secondary;
  border-radius: 1.5625rem;
  transition: all 0.3s ease;
  color: $secondary;

  &.active,
  &:hover {
    background: $gradient-to-bottom;
    color: $dark;
  }
}

.time-label {
  @apply text-base font-semibold mb-2;
  color: $primary;
}
</style>
