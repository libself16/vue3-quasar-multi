<template>
  <q-form class="search-form" @submit="handleSubmit" v-if="activeTableTab">
    <!-- Filter Date -->
    <div
      class="content-filter-date"
      v-if="
        activeTableTab.value === 'teamData' ||
        activeTableTab.value === 'myReport' ||
        activeTableTab.value === 'newReport'
      "
    >
      <q-radio
        v-for="item in SHAREHOLDER_DATE_TYPE_TABS"
        :key="item.value"
        v-model="shareholderState.query.dateType"
        :val="item.value"
        :label="item.label"
        class="content-filter-date-item"
      />
    </div>

    <div class="custom-wrapper">
      <!-- Custom Date -->
      <div
        class="content-custom date-wrapper"
        v-if="activeTableTab.value === 'myReport' || activeTableTab.value === 'newReport'"
      >
        <div>{{ $t("shareholder_platform.retrieval_date") }}</div>
        <div class="custom-input-wrapper">
          <q-input
            v-model="displayStartDate"
            :placeholder="$t('tableHeader.startDate')"
            bg-color="white"
            outlined
            @click="showStartDatePicker"
            class="custom-date-input"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showStartDatePicker" />
            </template>
          </q-input>
          <q-dialog v-model="isShowStartDatePicker" position="standard">
            <q-card class="q-pa-none">
              <q-date
                v-model="displayStartDate"
                class="calendar-content w-full"
                mask="YYYY-MM-DD"
                :options="dateOptions"
                color="date-picker"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" flat />
                </div>
              </q-date>
            </q-card>
          </q-dialog>
          <span v-if="isMobile">{{ $t("common.to") }}</span>
          <q-input
            v-model="displayEndDate"
            :placeholder="$t('tableHeader.endDate')"
            bg-color="white"
            outlined
            @click="showEndDatePicker"
            class="custom-date-input"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showEndDatePicker" />
            </template>
          </q-input>
          <q-dialog v-model="isShowEndDatePicker" position="standard">
            <q-card class="q-pa-none">
              <q-date
                v-model="displayEndDate"
                class="calendar-content w-full"
                mask="YYYY-MM-DD"
                :options="dateOptions"
                color="date-picker"
              >
              </q-date>
            </q-card>
          </q-dialog>
        </div>
      </div>

      <!-- 會員帳號 -->
      <div class="content-custom" v-if="activeTableTab.value === 'myReportDetail'">
        <div>{{ $t("shareholder_platform.account") }}</div>
        <div class="custom-input-wrapper">
          <q-select
            bg-color="white"
            outlined
            v-model="shareholderState.query.account"
            :options="accountList"
            class="custom-select-input"
          >
          </q-select>
        </div>
      </div>

      <!-- 查詢 -->
      <div class="content-custom">
        <div class="custom-input-wrapper">
          <q-btn class="search-btn" @click="handleSubmit">{{ $t("common.btn.search") }}</q-btn>
        </div>
      </div>
    </div>

    <!-- 切換幣別 -->
    <div
      class="mt-[1.25rem]"
      v-if="
        activeTableTab.value === 'myReport' ||
        activeTableTab.value === 'newReport' ||
        activeTableTab.value === 'teamData'
      "
    >
      <ChangeCurrency />
    </div>
    <div class="flex justify-end" v-if="activeTableTab.value === 'myReportDetail'">
      <q-btn
        icon="reply"
        class="back-btn"
        :label="$t('common.btn.back')"
        @click="setActiveTableTab(SHAREHOLDER_TABLE_TABS[1])"
      >
      </q-btn>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import dayjs from "dayjs"
import { useDateFormatter } from "src/common/composables/useDateFormatter"
import { useShareholder } from "src/common/composables/useShareholder"
import { REPORT_DATE_TYPES } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import ChangeCurrency from "./ChangeCurrency.vue"

const $q = useQuasar()
const { t } = useI18n()
const { isMobile } = useMediaQuery()
const {
  SHAREHOLDER_DATE_TYPE_TABS,
  shareholderState,
  teamOverViewState,
  fetchYesterdayReport,
  fetchMyReportSummaryMe,
  fetchMyReportSummaryDownline,
  fetchMyReportDetail,
  fetchTimeRangeTeamOverView,
  fetchTeamOverView,
  myReportDetailData,
  activeTableTab,
  setActiveTableTab,
  SHAREHOLDER_TABLE_TABS
} = useShareholder()
const { formatToISO } = useDateFormatter()

const isShowStartDatePicker = ref(false)
const isShowEndDatePicker = ref(false)

const displayStartDate = ref("")
const displayEndDate = ref("")

const dateOptions = (date: string) => {
  const today = dayjs()
  const checkDate = dayjs(date)

  const diffDays = today.diff(checkDate, "day")

  return diffDays >= 0 && diffDays <= 62
}

const showStartDatePicker = () => {
  isShowStartDatePicker.value = true
}

const showEndDatePicker = () => {
  isShowEndDatePicker.value = true
}

const accountList = computed(() => {
  return myReportDetailData.value?.list.map((item) => item.member_account)
})

const handleSubmit = () => {
  if (activeTableTab.value.value === "teamData") {
    teamOverViewState.query.start_time = formatToISO(displayStartDate.value)
    teamOverViewState.query.end_time = formatToISO(displayEndDate.value, true)
    fetchTimeRangeTeamOverView()
    fetchTeamOverView()
  } else if (activeTableTab.value.value === "myReportDetail") {
    fetchMyReportDetail()
  } else if (activeTableTab.value.value === "myReport") {
    const start = dayjs(displayStartDate.value)
    const end = dayjs(displayEndDate.value)

    const diff = end.diff(start, "day")

    if (diff > 31) {
      $q.notify({
        type: "negative",
        position: "top",
        message: `${t("common.alarm.date_range_exceeds_31_days")}`,
        icon: "warning",
        timeout: 1000
      })
      return
    }

    if (diff < 0) {
      $q.notify({
        type: "negative",
        position: "top",
        message: `${t("common.alarm.end_date_is_earlier_than_start_date")}`,
        icon: "warning",
        timeout: 1000
      })
      return
    }
    shareholderState.query.start_time = formatToISO(displayStartDate.value)
    shareholderState.query.end_time = formatToISO(displayEndDate.value, true)
    shareholderState.query.offset = 0

    fetchMyReportSummaryMe()
    fetchMyReportSummaryDownline()
  } else {
    shareholderState.query.start_time = formatToISO(displayStartDate.value)
    shareholderState.query.end_time = formatToISO(displayEndDate.value, true)
    fetchYesterdayReport()
  }
}

const formatDateToYMD = (d: dayjs.Dayjs): string => {
  return d.format("YYYY-MM-DD")
}

const updateDates = (newDateType: REPORT_DATE_TYPES.Enums) => {
  const today = dayjs()
  let startDate = today
  let endDate = today

  switch (newDateType) {
    case REPORT_DATE_TYPES.Enums.Yesterday:
      startDate = today.subtract(1, "day")
      endDate = today.subtract(1, "day")
      break
    case REPORT_DATE_TYPES.Enums.LastSevenDays:
      startDate = today.subtract(7, "day")
      endDate = today.subtract(1, "day")
      break
    case REPORT_DATE_TYPES.Enums.LastForuteenDays:
      startDate = today.subtract(14, "day")
      endDate = today.subtract(1, "day")
      break
    case REPORT_DATE_TYPES.Enums.LastThirtyDays:
      startDate = today.subtract(30, "day")
      endDate = today.subtract(1, "day")
      break
    default:
      break
  }
  displayStartDate.value = formatDateToYMD(startDate)
  displayEndDate.value = formatDateToYMD(endDate)
}

watch(
  () => shareholderState.query.dateType,
  (newVal) => {
    if (newVal !== undefined) {
      updateDates(newVal)
    }
  }
)

onMounted(() => {
  if (shareholderState.query.dateType !== undefined) {
    updateDates(shareholderState.query.dateType)
  } else {
    const defaultDateType = REPORT_DATE_TYPES.Enums.LastSevenDays
    shareholderState.query.dateType = defaultDateType
    updateDates(defaultDateType)
  }
})
</script>

<style lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";

.bg-date-picker {
  background-color: $primary04;
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.content-filter-date {
  @apply flex items-center gap-[0.625rem];

  :deep(.q-radio__inner--truthy) {
    color: $primary06;
  }

  @include phone-width() {
    @apply flex-wrap mb-[1.25rem] gap-[.375rem];
  }
}

.custom-wrapper {
  @apply flex gap-2 items-end;

  @include phone-width() {
    @apply w-full flex-col;
  }
}

.content-custom {
  @apply mt-[1.25rem];

  :deep(.q-field__control),
  :deep(.q-field__marginal) {
    @apply h-[2.5rem] rounded-[.625rem] min-h-[auto];
  }

  @include phone-width() {
    @apply w-full mt-0;
    &.date-wrapper {
      .custom-input-wrapper {
        @apply flex flex-row items-center;
      }
    }
  }
}

.custom-input-wrapper {
  @apply flex gap-[.375rem] mt-[.375rem];

  .custom-date-input :deep(.q-field__native) {
    cursor: pointer;
  }

  .custom-select-input :deep(.q-field__native) {
    min-height: auto;
  }

  @include phone-width() {
    @apply flex-col gap-[.375rem];
  }
}

.search-btn {
  @apply min-w-[5rem] min-h-[2.5rem] rounded-[.625rem];
  color: $neutral01;
  background: $gradient01;

  @include phone-width() {
    @apply w-full;
  }
}

.back-btn {
  @apply min-w-[5rem] min-h-[2.5rem] rounded-[.625rem] bg-white;
  color: $primary09;

  @include phone-width() {
    @apply mt-[1.25rem];
  }
}
</style>
