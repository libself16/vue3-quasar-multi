<template>
  <div>
    <!-- 我的報表 -->
    <ShareholderDesktopTable
      :rows="myReportSummaryTableRows"
      :columns="myReportSummaryTableColumns"
      :active-table-tab="activeTableTab"
      :handle-virtual-scroll="handleMyreportSummaryScroll"
      :rowsPerPageProp="0"
      use-virtual-scroll
      class="my-report-wrapper"
    />
    <!-- 我的報表(總計) -->
    <!-- <div class="summary-title">
      {{ $t("shareholder_platform.settlement") }}
      <span class="summary-tip">
        ( {{ $t("shareholder_platform.counting") }}：{{ myReportSummaryTableRows.length }})
      </span>
    </div>
    <ShareholderDesktopTable
      :rows="myReportSummaryTableRows"
      :columns="myReportSummaryTableColumns"
      :active-table-tab="activeTableTab"
      :handle-virtual-scroll="handleMyreportSummaryScroll"
      :rowsPerPageProp="0"
      use-virtual-scroll
      class="my-report-summary-wrapper"
      hide-header
    /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue"
import { QTableProps } from "quasar"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { MyReportTableColumnType, useShareholder } from "src/common/composables/useShareholder"
import ShareholderDesktopTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/Components/ShareholderDesktopTable.vue"
import { useI18n } from "vue-i18n"
import type * as Response from "src/api/response.type"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const {
  fetchMyReportSummaryMe,
  fetchMyReportSummaryDownline,
  fetchMyReportDetail,
  myReportMe,
  myReportDownline,
  myReporSummarytMe,
  myReporSummarytDownline,
  myReportTableColumns,
  myReportSummaryTableColumns,
  myReportDetailData,
  myReportDetailTableColumns,
  myReportDetailId,
  handleMyReportRowClick,
  activeTableTab
} = useShareholder()
const myReportTableRows = computed(() => {
  if (myReportMe.value?.list && myReportDownline.value?.list) {
    return [...myReportMe.value.list, ...myReportDownline.value.list]
  }
  if (myReportMe.value?.list) {
    return [...myReportMe.value.list]
  }
  if (myReportDownline.value?.list) {
    return [...myReportDownline.value.list]
  }
  return []
})
const myReportSummaryTableRows = computed(() => {
  if (myReporSummarytMe.value?.list && myReporSummarytDownline.value?.list) {
    return [...myReporSummarytMe.value.list, ...myReporSummarytDownline.value.list]
  }
  if (myReporSummarytMe.value?.list) {
    return [...myReporSummarytMe.value.list]
  }
  if (myReporSummarytDownline.value?.list) {
    return [...myReporSummarytDownline.value.list]
  }
  return []
})

const handleMyreportSummaryScroll: QTableProps["onVirtualScroll"] = (detail) => {
  if (detail.direction === "increase") {
    fetchMyReportSummaryDownline(true)
  }
}

onMounted(async () => {
  await fetchMyReportSummaryMe()
  await fetchMyReportSummaryDownline()
})

// watch(
//   () => myReportDetailId.value,
//   async (newId) => {
//     if (newId) {
//       await fetchMyReportDetail()
//     }
//   },
//   { immediate: true }
// )
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.my-report-wrapper {
  :deep(.q-table__container) {
    height: 33rem;

    @include phone-width {
      height: 27rem;
    }

    .q-table__middle {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}

.summary-title {
  @apply mt-10;
  @include fontStyle(1.625rem, 700, 1.875rem);
  color: $primary04;

  @include phone-width {
    @apply mt-5;
    @include fontStyle(1rem, 700, 1.125rem);
  }
  .summary-tip {
    @include fontStyle(0.75rem, 400, 0.875rem);
  }
}
.my-report-summary-wrapper {
  :deep(.q-table__container) {
    height: 12rem;

    .q-table__middle {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
