<template>
  <div class="referral-table" style="overflow-x: auto" v-if="!isMobile">
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
      <!-- 自定義表頭 -->
      <template v-slot:header>
        <!-- 第一行表頭 -->
        <q-tr>
          <q-th v-for="(base, key) in baseColumns" :key="key" rowspan="2" class="text-center bg-green">{{
            base.label
          }}</q-th>
          <q-th :colspan="revenueColumns.length" class="text-center bg-green">返傭金額(含所有下載)</q-th>
          <q-th rowspan="2" class="text-center bg-green">功能</q-th>
        </q-tr>
        <!-- 第二行子表頭 -->
        <q-tr>
          <q-th
            v-for="(currency, key) in revenueColumns"
            :key="key"
            class="special-column text-center bg-light-green"
            >{{ currency.label }}</q-th
          >
        </q-tr>
      </template>
      <template #no-data>
        <div class="no-data-container">
          <img v-if="getWideLogo" :src="getWideLogo()" />
          <span>{{ $t("tableHeader.no_data") }}</span>
        </div>
      </template>
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
        :max-pages="totalPages"
        @update:model-value="(page) => handlePagination(page, 'statement')"
      />
    </div>
  </div>
  <div class="m-referral-table" v-else>
    <q-list>
      <q-expansion-item v-for="(item, index) in rows" :key="index" dense dense-toggle expand-separator>
        <template v-slot:header>
          <q-item-section class="expansion-header af-ref-col">
            <div>
              <span
                >{{ $t("menu.settlementRange") }}
                <span class="re-col-user">
                  {{ dateformat(item.billing_start) }} ~ {{ dateformat(item.billing_end) }}
                </span>
              </span>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="table-ref">
              <table>
                <tbody>
                  <tr v-for="(currency, key) in revenueColumns" :key="key">
                    <td>
                      <div class="ref-tbl-in">{{ currency.label }}</div>
                    </td>
                    <td>{{ currency.field(item) }}</td>
                  </tr>
                  <tr>
                    <td><div class="ref-tbl-in">詳情</div></td>
                    <td>
                      <a
                        @click.stop="handleDetailsClick(item)"
                        class="af-search"
                        data-toggle="modal"
                        data-target="#referral-1"
                      >
                        <i class="fas fa-cog"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import Pagination from "app/template/set33_BLUE/components/Pagination/Index.vue"
import { useQuasar } from "quasar"
import * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useReferral } from "src/common/composables/useReferral"
import { useCommon } from "src/common/hooks/useCommon"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, defineEmits, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { t } = useI18n()
const { fetchReferralStatementList, referralStatementListData, referralPagination, handlePagination } = useReferral()
const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const currentPage = ref(0)
const { width } = useWindowSize()
let isMobile = ref(false)

const emit = defineEmits(["show-sub-details"])
const rows = computed(() => referralStatementListData.value?.list ?? [])
const totalPages = computed(() => {
  const total = referralStatementListData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const revenueColumns = computed(() => {
  const currencyColumn: any = ref([])

  for (const key in currencyIdMap.value) {
    if (Object.prototype.hasOwnProperty.call(currencyIdMap.value, key)) {
      const currencyCode = currencyIdMap.value[key as any]
      currencyColumn.value.push({
        name: `revenue_${key}`,
        field: (row: any) => row.revenues[key] || "-",
        format: (val: any, row: any) => {
          const value = row.revenues[key]
          if (!value && value !== 0) return "-"
          return moneyFormat(value)
        },
        label: currencyCode.code,
        align: "center" as const
      })
    }
  }

  return currencyColumn.value
})

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

const columns = computed(() => {
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

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
@import "app/template/set33_BLUE/assets/css/referral.scss";

.expansion-header {
  div span {
    text-align: left;
  }
}
</style>
