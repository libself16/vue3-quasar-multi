<template>
  <div
    id="member-summary-content"
    class="w-full h-full rounded-lg p-5 phone:p-0 flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <!-- 標題、幣別 -->
    <div id="member-summary-header" class="flex items-center justify-between gap-[.625rem]">
      <div
        id="member-summary-header-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)] flex items-center gap-2 flex-1"
      >
        <span> {{ $t("menu.summary") }}</span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-pointer hidden phone:!block"
        >
          <path
            d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
            class="fill-[var(--icon-02)]"
          />
        </svg>
        <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
          <MemberNav module="module2" />
        </q-menu>
      </div>
      <div id="member-summary-currency-h5" class="hidden phone:!block">
        <q-select
          standout
          v-model="summaryQueryForm.currency_id"
          :options="currencies"
          map-options
          emit-value
          class="member-summary-select-currency"
          dropdown-icon="expand_more"
          rounded
          outlined
          dense
          borderless
          no-error-icon
          hide-bottom-space
          @update:model-value="getMemberSummary"
          :disable="isLoading"
          :dark="isDark"
          color="select"
        />
      </div>
    </div>

    <!-- 查詢時間 -->
    <div id="member-summary-search-time-wrapper" class="flex flex-col gap-[.375rem]">
      <div
        id="member-summary-search-time-title"
        class="font-[NotoSansTC] font-bold text-[.875rem] leading-[1.0625rem] text-[var(--text-03)]"
      >
        {{ $t("member.summary.query_time") }}
      </div>
      <div
        id="member-summary-search-time-content"
        class="cursor-pointer flex w-fit items-center justify-between gap-[.625rem] py-[.625rem] px-4 min-w-[12.5rem] phone:w-full bg-[var(--input-dropdown-bg-01)] border-[2px] border-[var(--input-dropdown-text-03)] shadow-[0_2px_4px_0_#00000080]"
        @click="handleDialogShow"
      >
        <div class="font-[NotoSansTC] font-bold text-[1rem] leading-[1.1875rem] text-[var(--input-dropdown-text-01)]">
          {{ summaryQueryForm.start_time }} ~ {{ summaryQueryForm.end_time }}
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.501 10C17.8926 10 18.0904 10.0004 18.2129 10.1221C18.3342 10.2446 18.334 10.4411 18.334 10.833V15C18.334 16.5717 18.334 17.3564 17.8457 17.8447C17.3574 18.3331 16.5726 18.333 15.001 18.333H5.00098C3.42931 18.333 2.64458 18.3331 2.15625 17.8447C1.66792 17.3564 1.66797 16.5717 1.66797 15V10.833C1.66797 10.4419 1.66775 10.2446 1.78906 10.1221C1.91156 10.0004 2.10848 10 2.50098 10H17.501ZM14.167 1.5C14.7193 1.5 15.167 1.94772 15.167 2.5V4.16797C16.6285 4.16857 17.3749 4.18445 17.8457 4.65527C18.334 5.14361 18.334 5.92833 18.334 7.5C18.334 7.8925 18.3346 8.08941 18.2129 8.21191C18.0904 8.33358 17.8926 8.33301 17.501 8.33301H2.50098C2.10848 8.33301 1.91156 8.33358 1.78906 8.21191C1.6674 8.08941 1.66797 7.89167 1.66797 7.5C1.66797 5.92833 1.66792 5.14361 2.15625 4.65527C2.62697 4.18455 3.37308 4.16858 4.83398 4.16797V2.5C4.83398 1.94782 5.28185 1.50018 5.83398 1.5C6.38627 1.5 6.83398 1.94772 6.83398 2.5V4.16699H13.167V2.5C13.167 1.94793 13.615 1.50035 14.167 1.5Z"
            fill="currentColor"
            class="fill-[var(--icon-03)]"
          />
        </svg>
      </div>
    </div>

    <!-- 在線時間、幣別 -->
    <div id="member-summary-onlinetime-currency-wrapper" class="flex items-center justify-between">
      <div
        id="member-summary-onlinetime"
        class="font-[PingFangTC] font-normal text-[.875rem] leading-[1.25rem] text-[var(--text-01)]"
      >
        {{ $t("member.summary.current_online_time") }}：
        <span class="font-medium text-[var(--text-04)]">{{ onlineTime }}</span>
      </div>
      <div id="member-summary-currency-pc" class="phone:hidden">
        <q-select
          standout
          v-model="summaryQueryForm.currency_id"
          :options="currencies"
          map-options
          emit-value
          class="member-summary-select-currency"
          dropdown-icon="expand_more"
          rounded
          outlined
          dense
          borderless
          no-error-icon
          hide-bottom-space
          @update:model-value="getMemberSummary"
          :disable="isLoading"
          :dark="isDark"
          color="select"
        />
      </div>
    </div>

    <!-- 總覽資訊 -->
    <div
      id="member-summary-info-wrapper"
      class="flex flex-nowrap items-stretch gap-1 phone:gap-[.625rem] padXl:flex-wrap"
    >
      <section
        id="member-summary-info-left"
        class="flex-none w-[16.125rem] padXl:w-full padXl:grid padXl:grid-cols-2 phone:grid-cols-1 gap-1"
      >
        <div
          id="member-summary-info-left-content"
          class="p-[.625rem] flex flex-col gap-[.625rem] rounded-lg bg-[var(--card-bg-01)]"
        >
          <div
            id="member-summary-info-left-title"
            class="font-[NotoSansTC] font-medium text-[.75rem] leading-[.875rem] text-[var(--card-text-01)]"
          >
            {{ $t("menu.deposit") }}/{{ $t("menu.withdrawal") }}
          </div>

          <div id="member-summary-info-left-value" class="flex gap-5 py-[.0625rem]">
            <q-circular-progress
              id="member-summary-info-left-circle"
              :value="depositWithdrawRate"
              :thickness="0.3"
              size="5.625rem"
              color="deposit-withdraw-rate-color"
              track-color="deposit-withdraw-rate-track-color"
            />

            <div id="member-summary-info-deposit-withdraw" class="flex flex-col gap-[.625rem]">
              <div id="member-summary-info-deposit-wrapper" class="flex items-center gap-[.375rem]">
                <div
                  id="id=member-summary-info-deposit-border"
                  class="w-[.1875rem] h-[2.25rem] rounded-[.125rem] bg-[var(--bg-15)]"
                ></div>
                <div id="member-summary-info-deposit-content">
                  <div
                    id="member-summary-info-deposit-title"
                    class="font-[NotoSansTC] font-normal text-[.75rem] leading-[.875rem] text-[var(--card-text-03)]"
                  >
                    {{ $t("menu.deposit") }}
                  </div>
                  <div
                    id="member-summary-info-deposit-value"
                    class="font-[NotoSansTC] font-medium text-[1rem] leading-[1.1875rem] text-[var(--card-text-02)]"
                  >
                    {{ moneyFormat(memberSummary.deposit || 0) }}
                  </div>
                </div>
              </div>
              <div id="member-summary-info-withdraw-wrapper" class="flex items-center gap-[.375rem]">
                <div
                  id="id=member-summary-info-withdraw-border"
                  class="w-[.1875rem] h-[2.25rem] rounded-[.125rem] bg-[var(--bg-16)]"
                ></div>
                <div id="member-summary-info-withdraw-content">
                  <div
                    id="member-summary-info-withdraw-title"
                    class="font-[NotoSansTC] font-normal text-[.75rem] leading-[.875rem] text-[var(--card-text-03)]"
                  >
                    {{ $t("menu.withdrawal") }}
                  </div>
                  <div
                    id="member-summary-info-withdraw-value"
                    class="font-[NotoSansTC] font-medium text-[1rem] leading-[1.1875rem] text-[var(--card-text-02)]"
                  >
                    {{ moneyFormat(memberSummary.withdraw || 0) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-col gap-1 hidden padXl:!flex phone:!hidden">
          <div
            v-for="(info, index) in infoBets"
            :key="`info-bets-${index}`"
            :id="`info-bets-${index}`"
            class="py-[.375rem] px-[.625rem] flex flex-col gap-[.375rem] rounded-lg bg-[var(--card-bg-01)]"
            :class="info.class"
          >
            <div
              id="card-title"
              class="font-[NotoSansTC] font-medium text-[.75rem] leading-[1.5rem] text-[var(--card-text-01)]"
            >
              {{ info.label }}
            </div>
            <div
              id="card-value"
              class="font-[NotoSansTC] font-bold text-[1.25rem] leading-[1.5rem] text-[var(--card-text-02)]"
            >
              {{ moneyFormat(info.value) }}
            </div>
          </div>
        </div>
      </section>

      <section
        id="member-summary-info-right"
        class="w-full grid gap-1 phone:gap-[.625rem] grid-cols-3 padXl:grid-cols-4 phone:grid-cols-2"
      >
        <div
          v-for="info in infoCards"
          :key="info.label"
          :id="`info-cards-${info.label}`"
          class="py-[.375rem] px-[.625rem] flex flex-col gap-[.375rem] rounded-lg bg-[var(--card-bg-01)]"
          :class="info.class"
        >
          <div
            id="card-title"
            class="font-[NotoSansTC] font-medium text-[.75rem] leading-[1.5rem] text-[var(--card-text-01)]"
          >
            {{ info.label }}
          </div>
          <div
            id="card-value"
            class="font-[NotoSansTC] font-bold text-[1.25rem] leading-[1.5rem] text-[var(--card-text-02)]"
          >
            {{ moneyFormat(info.value) }}
          </div>
        </div>
      </section>
    </div>

    <div
      id="member-summary-chart"
      ref="memberSummaryChartRef"
      class="w-full h-[15.625rem] rounded-xl py-3 bg-[var(--card-bg-01)] phone:hidden"
    ></div>
    <!-- 登出按鈕 -->
    <div id="member-summary-btns">
      <button
        :class="`
        w-full p-[.625rem] rounded mt-[.625rem]
        font-[NotoSans] font-bold text-[.75rem] leading-[1rem] text-[var(--btn-text-01)]
        bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]
        `"
        @click="logout"
      >
        {{ $t("menu.logout") }}
      </button>
    </div>
  </div>
  <q-dialog v-model="dialog" transition-show="fade" transition-hide="fade" class="member-summary-dialog-wrapper">
    <q-card
      id="member-summary-dialog-content"
      class="w-[34rem] py-4 px-5 rounded-xl bg-[var(--dialog-bg)] flex flex-col gap-8"
    >
      <q-card-section id="member-summary-dialog-header" class="p-0 relative flex items-center justify-center">
        <div
          id="member-summary-dialog-title"
          class="font-[NotoSansTC] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--dialog-text-01)]"
        >
          {{ $t("member.summary.query_time") }}
        </div>
        <div id="member-summary-dialog-close-btn" class="absolute right-0 top-0 cursor-pointer" @click="dialog = false">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.1318 5.3042C17.6066 4.81203 18.3768 4.81197 18.8516 5.3042C19.3263 5.79653 19.3261 6.59502 18.8516 7.0874L13.6318 12.5005L18.8516 17.9126C19.3262 18.4049 19.3262 19.2035 18.8516 19.6958C18.3768 20.1882 17.6066 20.1881 17.1318 19.6958L12 14.3735L6.86816 19.6958C6.39338 20.1881 5.62319 20.1881 5.14844 19.6958C4.67384 19.2034 4.67387 18.4049 5.14844 17.9126L10.3682 12.5005L5.14844 7.0874C4.67397 6.59502 4.67376 5.79645 5.14844 5.3042C5.62314 4.81193 6.39338 4.81207 6.86816 5.3042L12 10.6265L17.1318 5.3042Z"
              class="fill-[var(--icon-03)]"
            />
          </svg>
        </div>
      </q-card-section>
      <q-card-section id="member-summary-dialog-body" class="p-0 w-full flex flex-col gap-[.625rem]">
        <div
          id="member-summary-dialog-search-time-btns"
          class="flex flex-nowrap items-center gap-[.625rem] w-full overflow-x-auto"
        >
          <button
            v-for="item in searchTimeTypes"
            :key="item.value"
            :id="`member-summary-dialog-search-time-btn-${item.value}`"
            class="p-[.625rem] rounded-[6.25rem] px-5 py-1 flex-1 font-[NotoSans] font-bold text-[.875rem] leading-[1.0625rem] text-[var(--tab-text-01)] bg-[var(--tab-bg-04)]"
            :class="{
              'bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]':
                tempSummaryQueryForm.tiemType === item.value
            }"
            @click="handleSearchTimeType(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
        <div
          id="member-summary-dialog-search-time"
          class="cursor-pointer w-full flex items-center justify-between py-[.625rem] px-4 bg-[var(--input-dropdown-bg-01)] border-[2px] border-[var(--input-dropdown-text-03)] shadow-[0_2px_4px_0_#00000080]"
        >
          <div class="font-[NotoSansTC] font-bold text-[1rem] leading-[1.1875rem] text-[var(--input-dropdown-text-01)]">
            {{ tempSummaryQueryForm.startTime }} ~ {{ tempSummaryQueryForm.endTime }}
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.501 10C17.8926 10 18.0904 10.0004 18.2129 10.1221C18.3342 10.2446 18.334 10.4411 18.334 10.833V15C18.334 16.5717 18.334 17.3564 17.8457 17.8447C17.3574 18.3331 16.5726 18.333 15.001 18.333H5.00098C3.42931 18.333 2.64458 18.3331 2.15625 17.8447C1.66792 17.3564 1.66797 16.5717 1.66797 15V10.833C1.66797 10.4419 1.66775 10.2446 1.78906 10.1221C1.91156 10.0004 2.10848 10 2.50098 10H17.501ZM14.167 1.5C14.7193 1.5 15.167 1.94772 15.167 2.5V4.16797C16.6285 4.16857 17.3749 4.18445 17.8457 4.65527C18.334 5.14361 18.334 5.92833 18.334 7.5C18.334 7.8925 18.3346 8.08941 18.2129 8.21191C18.0904 8.33358 17.8926 8.33301 17.501 8.33301H2.50098C2.10848 8.33301 1.91156 8.33358 1.78906 8.21191C1.6674 8.08941 1.66797 7.89167 1.66797 7.5C1.66797 5.92833 1.66792 5.14361 2.15625 4.65527C2.62697 4.18455 3.37308 4.16858 4.83398 4.16797V2.5C4.83398 1.94782 5.28185 1.50018 5.83398 1.5C6.38627 1.5 6.83398 1.94772 6.83398 2.5V4.16699H13.167V2.5C13.167 1.94793 13.615 1.50035 14.167 1.5Z"
              class="fill-[var(--icon-03)]"
            />
          </svg>

          <q-menu @show="handleTimeMenuShow">
            <q-date
              v-model="qDateModel"
              range
              mask="YYYY-MM-DD"
              minimal
              color="date"
              :options="limitRange"
              @range-start="onStartSelected"
              @update:model-value="handleDateRangeModelValue"
              :dark="isDark"
            />
          </q-menu>
        </div>
      </q-card-section>
      <q-card-section id="member-summary-dialog-footer" class="p-0">
        <button
          :class="`
        w-full p-[.625rem] rounded
        font-[NotoSans] font-bold text-[.75rem] leading-[1rem] text-[var(--btn-text-01)]
        bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]
        `"
          :disabled="isLoading"
          @click="handleTimeSearch"
        >
          {{ $t("common.btn.search") }}
        </button>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, computed, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useQuasar, QDateProps } from "quasar"
import dayjs from "dayjs"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useOnlineTime } from "src/common/composables/useOnlineTime"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useCommon } from "src/common/hooks/useCommon"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { useGlobalStore } from "src/stores/globalStore"
import * as echarts from "echarts"
import type { ECharts, EChartsOption } from "echarts"
import { getToday, getLastOrOverDay } from "src/common/utils/dayjsUtils"
import MemberNav from "src/common/components/MemberNav/Index.vue"
import type * as Request from "src/api/request.type"

enum searchTimeTypeEnum {
  TODAY = "today",
  LAST_3_DAYS = "last3days",
  LAST_7_DAYS = "last7days"
}

const SubtractDays: Record<searchTimeTypeEnum, number> = {
  [searchTimeTypeEnum.TODAY]: 0,
  [searchTimeTypeEnum.LAST_3_DAYS]: -2,
  [searchTimeTypeEnum.LAST_7_DAYS]: -6
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const $q = useQuasar()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const { handleLogout } = useAuth()
const { isLoading, memberSummary, handleGetMemberSummary, activeWalletCurrencyId } = useUserInfo()
const { calcOnlineTime } = useOnlineTime(ref(undefined))
const { currencyOptions } = useCurrency()
const { moneyFormat, preciseAdd, calculatePercentage, getCssVar, hexToRgba } = useCommon()
const { nowLang } = useLanguage()
const { isDark } = useEnv()
const globalStore = useGlobalStore()

const onlineTime = computed(() => calcOnlineTime(memberSummary.value.login_at))

const currencies = computed(() => {
  return currencyOptions.value.map((item) => {
    return {
      label: item.label,
      value: `${item.value}`
    }
  })
})
const infoBets = computed(() => [
  {
    label: t("member.summary.number_of_bets"),
    value: memberSummary.value.bet_count || 0,
    class: ""
  },
  {
    label: t("member.summary.bet_amount"),
    value: memberSummary.value.bet_amount || 0,
    class: ""
  }
])
const infoCards = computed(() => [
  {
    label: t("member.summary.number_of_bets"),
    value: memberSummary.value.bet_count || 0,
    class: "padXl:hidden phone:block"
  },
  {
    label: t("member.summary.bet_amount"),
    value: memberSummary.value.bet_amount || 0,
    class: "padXl:hidden phone:block"
  },
  {
    label: t("member.summary.valid_amount"),
    value: memberSummary.value.valid_bet || 0,
    class: ""
  },
  {
    label: t("member.summary.payout"),
    value: memberSummary.value.prize || 0,
    class: ""
  },
  {
    label: t("member.summary.profit"),
    value: memberSummary.value.profit || 0,
    class: ""
  },
  {
    label: t("member.summary.event_bonus"),
    value: memberSummary.value.bonus || 0,
    class: ""
  }
])
const searchTimeTypes = computed(() => [
  {
    label: t("common.btn.today2"),
    value: searchTimeTypeEnum.TODAY
  },
  {
    label: `3${t("common.btn.days")}`,
    value: searchTimeTypeEnum.LAST_3_DAYS
  },
  {
    label: `7${t("common.btn.days")}`,
    value: searchTimeTypeEnum.LAST_7_DAYS
  }
])
const depositWithdrawRate = computed(() => {
  const deposit = memberSummary.value.deposit || 0
  const withdraw = memberSummary.value.withdraw || 0
  const total = preciseAdd(deposit, withdraw)
  return calculatePercentage(deposit, total)
})

const tempSummaryQueryForm = reactive<{
  startTime: string
  endTime: string
  tiemType: searchTimeTypeEnum
}>({
  startTime: getToday(),
  endTime: getToday(),
  tiemType: searchTimeTypeEnum.TODAY
})
const summaryQueryForm = reactive<Request.GetMemberSummary>({
  currency_id: activeWalletCurrencyId.value ? `${activeWalletCurrencyId.value}` : currencies.value[0].value,
  start_time: getToday(),
  end_time: getToday()
})

const dialog = ref(false)
const qDateModel = ref({ from: getToday(), to: getToday() })

const handleDialogShow = () => {
  tempSummaryQueryForm.tiemType = searchTimeTypeEnum.TODAY
  tempSummaryQueryForm.startTime = getToday()
  tempSummaryQueryForm.endTime = getToday()
  dialog.value = true
}

const handleSearchTimeType = (type: searchTimeTypeEnum) => {
  tempSummaryQueryForm.tiemType = type
  tempSummaryQueryForm.startTime = getLastOrOverDay(SubtractDays[type])
  tempSummaryQueryForm.endTime = getToday()
  qDateModel.value = {
    from: getLastOrOverDay(SubtractDays[type]),
    to: getToday()
  }
}

const handleTimeSearch = async () => {
  summaryQueryForm.start_time = tempSummaryQueryForm.startTime
  summaryQueryForm.end_time = tempSummaryQueryForm.endTime
  dialog.value = false
  await getMemberSummary()
}

const handleTimeMenuShow = () => {
  qDateModel.value = { from: "", to: "" }
}

const handleDateRangeModelValue: QDateProps["onUpdate:modelValue"] = (value, reason) => {
  if (!value) return

  if (reason === "add-day") {
    tempSummaryQueryForm.startTime = value
    tempSummaryQueryForm.endTime = value
    return
  }

  if (reason === "add-range") {
    tempSummaryQueryForm.startTime = value.from
    tempSummaryQueryForm.endTime = value.to
  }
}

const onStartSelected: QDateProps["onRangeStart"] = (val) => {
  if (val) {
    qDateModel.value = {
      from: `${val.year}-${String(val.month).padStart(2, "0")}-${String(val.day).padStart(2, "0")}`,
      to: ""
    }
    return
  }

  qDateModel.value = { from: "", to: "" }
}

const limitRange: QDateProps["options"] = (dateStr) => {
  if (!qDateModel.value || !qDateModel.value.from) return true

  const date = dayjs(dateStr)
  const start = dayjs(qDateModel.value.from)
  const diff = date.diff(start, "day")

  return diff >= -6 && diff <= 6
}

const memberSummaryChartRef = ref<HTMLDivElement | null>(null)
let summaryChartInstance: ECharts | null = null

const resizeSummaryChart = () => {
  summaryChartInstance?.resize()
}

const buildSummaryChartOption = (): EChartsOption => {
  const categories = memberSummary.value.metrics.map((item) => dayjs(item.date).format("YYYY-MM-DD"))
  const depositSeries = memberSummary.value.metrics.map((item) => Number(item.deposit))
  const withdrawSeries = memberSummary.value.metrics.map((item) => Number(item.withdraw))
  const buildGradient = (start: string, end: string) =>
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: start },
      { offset: 1, color: end }
    ])

  const depositColor = getCssVar("--bg-15")
  const withdrawColor = getCssVar("--bg-16")
  const textColor = getCssVar("--text-01")
  const yLineColor = getCssVar("--bg-line-03")

  const option = {
    backgroundColor: "transparent",
    // 圖例設定
    legend: {
      data: [t("menu.deposit"), t("menu.withdrawal")],
      top: 12,
      right: 16,
      icon: "circle",
      itemHeight: 10,
      textStyle: {
        color: textColor,
        fontSize: 12
      }
    },
    grid: {
      left: 34,
      right: 34,
      top: 55,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
      axisLabel: {
        color: textColor
      },

      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor
      },
      splitLine: {
        lineStyle: {
          color: yLineColor,
          type: "dashed"
        }
      }
    },
    series: [
      {
        name: t("menu.deposit"),
        type: "line",
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: depositColor
        },
        lineStyle: {
          width: 2,
          color: depositColor
        },
        areaStyle: {
          color: buildGradient(hexToRgba(depositColor, 0.35), hexToRgba(depositColor, 0.05))
        },
        data: depositSeries
      },
      {
        name: t("menu.withdrawal"),
        type: "line",
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: withdrawColor
        },
        lineStyle: {
          width: 2,
          color: withdrawColor
        },
        areaStyle: {
          color: buildGradient(hexToRgba(withdrawColor, 0.35), hexToRgba(withdrawColor, 0.05))
        },
        data: withdrawSeries
      }
    ]
  } as EChartsOption

  return option
}

const renderSummaryChart = async () => {
  await nextTick()
  if (!memberSummaryChartRef.value) return

  if (!summaryChartInstance) {
    summaryChartInstance = echarts.init(memberSummaryChartRef.value)
    window.addEventListener("resize", resizeSummaryChart)
  }

  summaryChartInstance.setOption(buildSummaryChartOption(), true)
}

const logout = async () => {
  await handleLogout()
  router.push({ name: globalStore.globalState.logoutRouteName })

  if (isTelegramMiniApp.value) closeMiniApp()

  $q.notify({
    type: "positive",
    message: t("common.alarm.logoutSuccess"),
    position: "top",
    timeout: 1000
  })
}

const initMemberSummaryFromQuery = () => {
  const query = route.query
  if (query.currency_id && typeof query.currency_id === "string") {
    summaryQueryForm.currency_id = query.currency_id
  }
  if (query.start_time && typeof query.start_time === "string") {
    summaryQueryForm.start_time = dayjs(query.start_time).format("YYYY-MM-DD")
  }
  if (query.end_time && typeof query.end_time === "string") {
    summaryQueryForm.end_time = dayjs(query.end_time).format("YYYY-MM-DD")
  }
}

const getMemberSummary = async () => {
  const paylod: Request.GetMemberSummary = {
    currency_id: summaryQueryForm.currency_id,
    start_time: summaryQueryForm.start_time,
    end_time: summaryQueryForm.end_time
  }
  await handleGetMemberSummary(paylod)
  await renderSummaryChart()
}

watch(
  () => nowLang.value,
  async () => {
    await renderSummaryChart()
  }
)

onMounted(async () => {
  initMemberSummaryFromQuery()
  await getMemberSummary()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeSummaryChart)
  if (summaryChartInstance) {
    summaryChartInstance.dispose()
    summaryChartInstance = null
  }
})
</script>

<style lang="scss">
.member-summary-dialog-wrapper {
  .q-dialog__backdrop {
    @apply bg-[var(--bg-17)];
  }
  .q-dialog__inner {
    @apply phone:p-4;
  }
}
</style>

<style scoped lang="scss">
.member-summary-select-currency {
  :deep(.q-field__control) {
    @apply py-1 px-5 rounded-[6.25rem] min-h-[1.6875rem] h-[1.6875rem];
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);

    &::before {
      border-color: transparent !important;
    }

    &::after {
      border-color: transparent !important;
    }

    .q-field__native {
      @apply font-[NotoSans] font-bold text-[.875rem] leading-[1.1875rem] text-[var(--text-01)] capitalize h-[1.1875rem] min-h-0 p-0;
    }

    .q-field__append {
      @apply text-[var(--icon-01)] pl-1 h-[1.1875rem];

      .q-select__dropdown-icon {
        @apply w-4 h-4;
      }
    }
  }
}

#member-summary-info-left-circle {
  :deep(.q-circular-progress__svg) {
    .text-deposit-withdraw-rate-color {
      @apply text-[var(--bg-15)];
    }
    .text-deposit-withdraw-rate-track-color {
      @apply text-[var(--bg-16)];
    }
  }
}
</style>
