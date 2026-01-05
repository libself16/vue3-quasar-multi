<template>
  <div class="referral-table">
    <template v-if="rows && rows.length > 0">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        class="referral-table-content"
        hide-bottom
        :pagination="{
          rowsPerPage: referralPagination.size,
          sortBy: null
        }"
      >
        <template #body-cell-billing_cycle="props">
          <q-td :props="props">
            {{ dateformat(props.row.billing_start) }} ~ {{ dateformat(props.row.billing_end) }}
          </q-td>
        </template>
        <template #body-cell-details="props">
          <q-td :props="props">
            <q-btn flat dense class="table-setting-btn" @click.stop="handleDetailsClick(props.row)">
              {{ t("menu.details") }}
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="(page) => handlePagination(page, 'statement')"
        />
      </div>
    </template>
    <template v-else>
      <div class="referral-no-data-container">
        <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { useI18n } from "vue-i18n"
import { dateformat } from "src/common/utils/dayjsUtils"
import Pagination from "app/template/okbet_red/components/Pagination/Index.vue"
import * as Response from "src/api/response.type"

const $q = useQuasar()
const { t } = useI18n()
const { fetchReferralStatementList, referralStatementListData, referralPagination, handlePagination } = useReferral()
const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const currentPage = ref(1)

const emit = defineEmits(["show-sub-details"])
const rows = computed(() => referralStatementListData.value?.list ?? [])
const totalPages = computed(() => {
  const total = referralStatementListData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const revenueColumns = computed(() => {
  const currencyIds = new Set<string>()
  rows.value.forEach((row) => {
    Object.keys(row.revenues).forEach((id) => {
      currencyIds.add(id)
    })
  })

  return Array.from(currencyIds).map((id) => {
    const numId = Number(id)
    const currencyCode = currencyIdMap.value?.[numId]?.code ?? id

    return {
      name: `revenue_${id}`,
      field: (row: any) => row.revenues[id] || "-",
      format: (val: any, row: any) => {
        const value = row.revenues[id]
        if (!value && value !== 0) return "-"
        return moneyFormat(value)
      },
      label: currencyCode,
      align: "center" as const
    }
  })
})

const columns = computed(() => {
  const baseColumns = [
    { name: "billing_date", field: "billing_date", label: t("menu.settlementDate"), align: "center" as const },
    { name: "billing_cycle", field: "billing_cycle", label: t("menu.settlementRange"), align: "center" as const },
    { name: "cashback_count", field: "cashback_count", label: t("menu.directMemberCount"), align: "center" as const }
  ]

  const detailsColumn = {
    name: "details",
    field: "details",
    align: "center" as const,
    label: t("menu.function"),
    format: () => t("menu.details"),
    classes: "table-setting-btn"
  }

  return [...baseColumns, ...revenueColumns.value, detailsColumn]
})

const handleDetailsClick = (row: Response.ReferralStatementList["list"][number]) => {
  emit("show-sub-details", row.statement_id)
}

onMounted(async () => {
  $q.loading.show()
  await fetchReferralStatementList()
  await getAvailCurrencyList()
  $q.loading.hide()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet_red/assets/css/referral.scss";
</style>
