<template>
  <div class="referral-table">
    <template v-if="rows && rows.length > 0">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="member_account"
        class="referral-table-content"
        hide-bottom
        :pagination="{
          rowsPerPage: referralPagination.size,
          sortBy: null
        }"
      >
        <!-- 本頁總計、搜尋結果總計 -->
        <!-- <template #bottom-row>
          <tr>
            <td class="text-center">{{ t("menu.pageTotal") }}</td>
            <td class="text-center">{{ pageSummary.cashback_count }}</td>
            <td v-for="currency in currencyColumns" :key="currency.name" class="text-center">
              {{
                pageSummary.revenue_total[currency.name.replace("currency_", "")]
                  ? moneyFormat(pageSummary.revenue_total[currency.name.replace("currency_", "")])
                  : "-"
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center">{{ t("menu.searchTotal") }}</td>
            <td class="text-center">{{ totalRows.cashback_count }}</td>
            <td v-for="currency in currencyColumns" :key="currency.name" class="text-center">
              {{
                totalRows.revenue_total[currency.name.replace("currency_", "")]
                  ? moneyFormat(totalRows.revenue_total[currency.name.replace("currency_", "")])
                  : "-"
              }}
            </td>
          </tr>
        </template> -->
      </q-table>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="(page: number) => handlePagination(page, 'statementDetail', props.statementId)"
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
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import Pagination from "app/template/okbet_green/components/Pagination/Index.vue"
import { useI18n } from "vue-i18n"

interface ReferralRow {
  member_account: string
  cashback_count: number
  revenues: {
    [key: string]: string
  }
}

const props = defineProps<{
  statementId: number
}>()

const $q = useQuasar()
const { t } = useI18n()
const {
  fetchReferralStatementDetail,
  fetchReferralStatementDetailTotal,
  referralStatementDetailData,
  referralStatementDetailTotalData,
  referralPagination,
  handlePagination
} = useReferral()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const currentPage = ref(1)

const rows = computed(() => referralStatementDetailData.value?.list ?? [])
const pageSummary = computed(
  () =>
    referralStatementDetailData.value?.page_summary ?? {
      cashback_count: 0,
      revenue_total: {}
    }
)
const totalRows = computed(
  () =>
    referralStatementDetailTotalData.value ?? {
      revenue_total: {},
      cashback_count: 0
    }
)
const totalPages = computed(() => {
  const total = referralStatementDetailData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const currencyColumns = computed(() => {
  const currencyIds = new Set<string>()
  rows.value.forEach((row: ReferralRow) => {
    Object.keys(row.revenues).forEach((id) => {
      currencyIds.add(id)
    })
  })

  return Array.from(currencyIds).map((id) => {
    const numId = Number(id)
    const currencyCode = currencyIdMap.value?.[numId]?.code ?? id

    return {
      name: `currency_${id}`,
      field: (row: ReferralRow) => row.revenues[id] || "-",
      format: (val: string) => {
        if (!val || val === "-") return "-"
        return moneyFormat(val)
      },
      label: currencyCode,
      align: "center" as const
    }
  })
})

const columns = computed(() => {
  const baseColumns = [
    { name: "member_account", field: "member_account", label: t("menu.userAccount"), align: "center" as const },
    { name: "cashback_count", field: "cashback_count", label: t("menu.directMemberCount"), align: "center" as const }
  ]

  return [...baseColumns, ...currencyColumns.value]
})

onMounted(async () => {
  $q.loading.show()
  await fetchReferralStatementDetail(props.statementId)
  await fetchReferralStatementDetailTotal(props.statementId)
  await getAvailCurrencyList()
  $q.loading.hide()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet_green/assets/css/referral.scss";
</style>
