<template>
  <section class="transaction-history-wrapper">
    <div class="page-title">{{ $t("menu.order") }}</div>
    <q-form class="columns" @submit="handleFormSubmit">
      <div class="history-search-wrapper">
        <div class="search-type-content">
          <q-btn
            v-for="money in searchTabs"
            :key="money.value"
            :label="$t(money.label)"
            :class="{ active: pendingOrderState.query.search_type === money.value }"
            @click="pendingOrderState.query.search_type = money.value"
            class="btn-history"
          />
        </div>
        <div class="search-type-content search-type-time">
          <q-btn
            v-for="date in dayTypeTabs"
            :key="date.value"
            :label="$t(date.label)"
            :class="{ active: pendingOrderState.query.dateType === date.value }"
            @click="pendingOrderState.query.dateType = date.value"
            class="btn-history date-type-btn"
          />
        </div>
      </div>
      <!-- Custom Date Select Time -->
      <div class="columns" v-if="pendingOrderState.query.dateType === REPORT_DATE_TYPE.Enums.CustomDate">
        <!-- Start Date -->
        <p class="time-label mt-4">{{ $t("common.btn.searchDate") }}</p>
        <q-input
          v-model="pendingOrderState.query.start_date"
          placeholder="Choose Date"
          bg-color="white"
          outlined
          readonly
          lazy-rules
          :rules="[Rules.required()]"
          @click="showStartDatePicker"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showStartDatePicker" />
          </template>
        </q-input>
        <q-dialog v-model="isShowStartDatePicker" position="standard">
          <q-card class="q-pa-none">
            <q-date v-model="pendingOrderState.query.start_date" class="calendar-content w-full" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" flat />
              </div>
            </q-date>
          </q-card>
        </q-dialog>
        <!-- End Date -->
        <p class="time-label">{{ $t("common.btn.to") }}</p>
        <q-input
          v-model="pendingOrderState.query.end_date"
          placeholder="Choose Date"
          bg-color="white"
          outlined
          readonly
          lazy-rules
          :rules="[Rules.required()]"
          @click="showEndDatePicker"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showEndDatePicker" />
          </template>
        </q-input>
        <q-dialog v-model="isShowEndDatePicker" position="standard">
          <q-card class="q-pa-none">
            <q-date v-model="pendingOrderState.query.end_date" class="calendar-content w-full" mask="YYYY-MM-DD">
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
    <MobilePendingTransactionList v-if="isLargeTablet" :moneyPendingStateList="pendingOrderState.list" />
    <DesktopPendingTransactionList v-else :moneyPendingStateList="pendingOrderState.list" />
    <Pagination
      v-if="pendingOrderState.pagination.totalPage"
      v-model="pendingOrderState.pagination.page"
      :total-pages="pendingOrderState.pagination.totalPage"
      @change="handlePagination"
    />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useRule } from "src/common/hooks/useRule"
import { REPORT_DATE_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import Pagination from "app/template/set_DBO88/components/Pagination/Index.vue"
import DesktopPendingTransactionList from "./DesktopPendingTransactionList.vue"
import MobilePendingTransactionList from "./MobilePendingTransactionList.vue"

const Rules = useRule()
const $q = useQuasar()
const { isLogin } = useAuth()
const { isLargeTablet } = useMediaQuery()
const {
  isLoading,
  pendingOrderState,
  initPendingOrderQuery,
  getPendingOrderList,
  handlePagination,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
} = usePendingOrder()

const isShowStartDatePicker = ref(false)
const isShowEndDatePicker = ref(false)

const showStartDatePicker = () => {
  isShowStartDatePicker.value = true
}

const showEndDatePicker = () => {
  isShowEndDatePicker.value = true
}

const fetchPendingTransactionList = async () => {
  if (isLogin.value) {
    $q.loading.show()
    initPendingOrderQuery()
    await getPendingOrderList()
    $q.loading.hide()
  }
}

onMounted(() => {
  fetchPendingTransactionList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/form.scss";
@import "app/template/set_DBO88/assets/css/text.scss";
</style>
