<template>
  <div class="new-report-table">
    <div class="data-table-wrapper">
      <ShareholderDesktopTable
        v-if="!isMobile"
        :rows="yesterdayReportTableRows"
        :columns="yesterdayReportTableColumns"
        :active-table-tab="activeTableTab"
      />
      <ShareholderMobileCard v-else :rows="yesterdayReportTableRows" :columns="yesterdayReportTableColumns" />
    </div>
    <div v-if="yesterdayReportTableRows.length > 0" class="total-data-wrapper">
      <div class="data-item">{{ $t("shareholder_platform.total_revenue") }}</div>
      <div class="data-item">
        <!-- <span class="data-item-label">{{ $t("shareholder_platform.platform_turnover") }}</span> -->
        <span class="data-item-value">{{ yesterdayReportTotals.total_turnover.toLocaleString() }}</span>
      </div>
      <div class="data-item">
        <!-- <span class="data-item-label">{{ $t("shareholder_platform.bonus_expense") }}</span> -->
        <span class="data-item-value">{{ yesterdayReportTotals.total_prize_amount.toLocaleString() }}</span>
      </div>
      <div class="data-item">
        <!-- <span class="data-item-label">{{ $t("shareholder_platform.net_profit") }}</span> -->
        <span class="data-item-value">{{ yesterdayReportTotals.total_profit.toLocaleString() }}</span>
      </div>
    </div>
    <!-- <div v-else-if="isMobile" class="shareholder-no-data-container">
      <span>{{ $t("common.btn.no_update") }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useShareholder } from "src/common/composables/useShareholder"
import ShareholderDesktopTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/Components/ShareholderDesktopTable.vue"
import ShareholderMobileCard from "app/template/set_r016/pages/HomePage/ShareholderPlatform/Components/ShareholderMobileCard.vue"

const { isMobile } = useMediaQuery()
const {
  fetchYesterdayReport,
  yesterdayReportTableColumns,
  yesterdayReportTableRows,
  yesterdayReportTotals,
  activeTableTab
} = useShareholder()

onMounted(async () => {
  await fetchYesterdayReport()
  console.log("fetchYesterdayReport", yesterdayReportTableRows.value)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/shareholder.scss";

.new-report-table {
  @apply flex flex-col;

  .total-data-wrapper {
    @apply flex p-[.75rem] items-center gap-4 mt-[.625rem] rounded-[.625rem];
    background: $primary06;

    .data-item {
      @apply flex flex-1 flex-col gap-1 text-center;
      color: $neutral01;

      &-label {
        color: $primary02;
      }
    }

    @include phone-width() {
      @apply items-center;

      .data-item {
        @apply text-[0.625rem];
      }
    }
  }
}
</style>
