<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="t('menu.history')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="transaction-history-wrapper">
      <q-form class="columns" @submit="handleFormSubmit">
        <div class="history-search-wrapper">
          <div class="search-type-content">
            <q-btn
              v-for="money in searchTabs"
              :key="money.value"
              :label="$t(money.label)"
              :class="{ active: historyState.query.search_type === money.value }"
              @click="historyState.query.search_type = money.value"
              class="btn-history"
            />
          </div>
          <div class="search-type-content search-type-time">
            <q-btn
              v-for="date in dayTypeTabs"
              :key="date.value"
              :label="$t(date.label)"
              :class="{ active: historyState.query.dateType === date.value }"
              @click="historyState.query.dateType = date.value"
              class="btn-history"
            />
          </div>
        </div>
        <!-- Custom Date Select Time -->
        <div class="columns" v-if="historyState.query.dateType === REPORT_DATE_TYPE.Enums.CustomDate">
          <p class="time-label mt-2">{{ $t("common.btn.searchDate") }}</p>
          <q-input
            v-model="historyState.query.start_date"
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
              <q-date v-model="historyState.query.start_date" class="calendar-content w-full" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" flat />
                </div>
              </q-date>
            </q-card>
          </q-dialog>
          <p class="time-label">{{ $t("common.btn.to") }}</p>
          <q-input
            v-model="historyState.query.end_date"
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
      <MobileHistoryList v-if="isLargeTablet" :moneyHistoryStateList="historyState.list" />
      <DesktopHistoryList v-else :moneyHistoryStateList="historyState.list" />
      <Pagination
        v-if="historyState.pagination.totalPage"
        v-model="historyState.pagination.page"
        :total-pages="historyState.pagination.totalPage"
        @change="handlePagination"
      />
    </div>
  </ModalBase>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAuth } from "src/common/hooks/useAuth"
import { useHistory } from "src/common/composables/useHistory"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { REPORT_DATE_TYPE } from "src/common/utils/constants"
import ModalBase from "../ModalBase.vue"
import Pagination from "../../Pagination/Index.vue"
import MobileHistoryList from "./MobileHistoryList.vue"
import DesktopHistoryList from "./DesktopHistoryList.vue"

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
const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const eventbus = injectStrict(EventBusKey)
const { isLogin } = useAuth()
const modalShow = ref(false)
const isShowStartDatePicker = ref(false)
const isShowEndDatePicker = ref(false)
const { isLargeTablet } = useMediaQuery()

const showStartDatePicker = () => {
  isShowStartDatePicker.value = true
}

const showEndDatePicker = () => {
  isShowEndDatePicker.value = true
}

const fetchHistoryList = async () => {
  if (isLogin.value) {
    $q.loading.show()
    initHistoryQuery()
    await getHistoryList()
    $q.loading.hide()
  }
}

onMounted(() => {
  eventbus.on("openHistory", (show: boolean) => {
    modalShow.value = show
    fetchHistoryList()
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";
@import "app/template/set_paisa24/assets/css/form.scss";
</style>
