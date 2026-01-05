<template>
  <HeaderTitleBack
    titleI18n="menu.pendingTransaction"
    v-bind="HTBConfig"
  >
    <section class="px-2 pt-4 pb-20">
      <q-form @submit="handleFormSubmit">
        <div class="search-type-content">
          <q-btn
            v-for="money in searchTabs"
            :key="money.value"
            :label="$t(money.label)"
            :class="{ active: pendingOrderState.query.search_type === money.value }"
            @click="pendingOrderState.query.search_type = money.value"
            class="btn-history"
            unelevated
            />
        </div>
        <div class="search-type-content my-4">
          <q-btn
            v-for="date in dayTypeTabs"
            :key="date.value"
            :label="$t(date.label)"
            :class="{ active: pendingOrderState.query.dateType === date.value }"
            @click="pendingOrderState.query.dateType = date.value"
            class="btn-history"
            unelevated
          />
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
        <q-btn unelevated flat class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
      <PendingTransactionList :moneyPendingStateList="pendingOrderState.list" @refresh="getPendingOrderList" />
      <Pagination
        v-if="pendingOrderState.pagination.totalPage"
        v-model="pendingOrderState.pagination.page"
        :total-pages="pendingOrderState.pagination.totalPage"
        @change="handlePagination"
      />
    </section>
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useHTBConfig } from "app/template/set_6M88/hooks/useHTBConfig"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useRule } from "src/common/hooks/useRule"
import { REPORT_DATE_TYPE } from "src/common/utils/constants"
import Pagination from "../../components/Pagination/Index.vue"
import PendingTransactionList from "./PendingTransactionList.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
const Rules = useRule()

const { HTBConfig } = useHTBConfig()
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

onMounted(async () => {
  initPendingOrderQuery()
  await getPendingOrderList()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";
</style>
