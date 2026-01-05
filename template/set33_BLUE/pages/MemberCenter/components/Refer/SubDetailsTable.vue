<template>
  <div class="referral-table" v-if="!isMobile">
    <BackBtn @back="goBack()" />
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
      <!-- 自定義表頭 -->
      <template v-slot:header>
        <!-- 第一行表頭 -->
        <q-tr>
          <q-th v-for="(base, key) in baseColumns" :key="key" rowspan="2" class="text-center bg-green">{{
            base.label
          }}</q-th>
          <q-th :colspan="currencyColumns.length" class="text-center bg-green">返傭金額(含所有下載)</q-th>
        </q-tr>
        <!-- 第二行子表頭 -->
        <q-tr>
          <q-th
            v-for="(currency, key) in currencyColumns"
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
      <template #bottom-row>
        <!-- 本頁總計 -->
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
        <!-- 搜尋結果總計 -->
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
      </template>
    </q-table>
    <div class="referral-pagination-wrapper">
      <Pagination
        v-model="currentPage"
        :total-pages="totalPages"
        :max-pages="3"
        @update:model-value="(page: number) => handlePagination(page, 'statementDetail', props.statementId)"
      />
    </div>
  </div>
  <div class="m-referral-table" v-else>
    <BackBtn @back="goBack()" />
    <q-list>
      <q-expansion-item dense dense-toggle expand-separator>
        <template v-slot:header>
          <q-item-section class="expansion-header af-ref-col">
            <div>
              <span>{{ t("menu.pageTotal") }} </span>
            </div>
            <span
              >{{ $t("menu.directMemberCount") }}
              <span class="re-col-user">{{ pageSummary.cashback_count }}</span>
            </span>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="table-ref">
              <table>
                <tbody>
                  <tr v-for="currencyItem in currencyColumns" :key="currencyItem.id">
                    <td>
                      <div class="ref-tbl-in">{{ currencyItem.label }}</div>
                    </td>
                    <td>
                      {{
                        pageSummary.revenue_total[currencyItem.name.replace("currency_", "")]
                          ? moneyFormat(pageSummary.revenue_total[currencyItem.name.replace("currency_", "")])
                          : "-"
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item dense dense-toggle expand-separator>
        <template v-slot:header>
          <q-item-section class="expansion-header af-ref-col">
            <div>
              <span>{{ t("menu.pageTotal") }}</span>
            </div>
            <div>
              <span
                >{{ $t("menu.directMemberCount") }}
                <span class="re-col-user">{{ totalRows.cashback_count }}</span>
              </span>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="table-ref">
              <table>
                <tbody>
                  <tr v-for="currencyItem in currencyColumns" :key="currencyItem.id">
                    <td>
                      <div class="ref-tbl-in">{{ currencyItem.label }}</div>
                    </td>
                    <td>
                      {{
                        totalRows.revenue_total[currencyItem.name.replace("currency_", "")]
                          ? moneyFormat(totalRows.revenue_total[currencyItem.name.replace("currency_", "")])
                          : "-"
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item v-for="(rowData, index) in rows" :key="index" dense dense-toggle expand-separator>
        <template v-slot:header>
          <q-item-section class="expansion-header af-ref-col">
            <div>
              <span
                >{{ $t("menu.userAccount") }}
                <span class="re-col-user">{{ rowData.member_account }}</span>
              </span>
            </div>
            <div>
              <span
                >{{ $t("menu.directMemberCount") }}
                <span class="re-col-user">{{ rowData.cashback_count }}</span>
              </span>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="table-ref">
              <table>
                <tbody>
                  <tr v-for="currencyItem in currencyColumns" :key="currencyItem.id">
                    <td>
                      <div class="ref-tbl-in">{{ currencyItem.label }}</div>
                    </td>
                    <td>{{ `${currencyItem.field(rowData)}` }}</td>
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
import BackBtn from "app/template/set33_BLUE/components/BackBtn/Index.vue"
import Pagination from "app/template/set33_BLUE/components/Pagination/Index.vue"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useReferral } from "src/common/composables/useReferral"
import { useCommon } from "src/common/hooks/useCommon"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

interface ReferralRow {
  member_account: string
  cashback_count: number
  revenues: {
    [key: string]: string
  }
}

interface RevenueTotalData {
  [key: string]: string
}

const props = defineProps<{
  statementId: number
}>()

const emit = defineEmits(["back"])

const goBack = () => {
  emit("back", false)
}

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
const currentPage = ref(0)
let isMobile = ref(false)
const { width } = useWindowSize()

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
  const currencyColumn: any = ref([])

  for (const key in currencyIdMap.value) {
    if (Object.prototype.hasOwnProperty.call(currencyIdMap.value, key)) {
      const currencyCode = currencyIdMap.value[key as any]

      currencyColumn.value.push({
        name: `currency_${key}`,
        field: (row: ReferralRow) => row.revenues[key] || "-",
        format: (val: string) => {
          if (!val || val === "-") return "-"
          return moneyFormat(val)
        },
        label: currencyCode.code,
        align: "center" as const
      })
    }
  }
  return currencyColumn.value
})

const baseColumns = [
  { name: "member_account", field: "member_account", label: t("menu.userAccount"), align: "center" as const },
  { name: "cashback_count", field: "cashback_count", label: t("menu.directMemberCount"), align: "center" as const }
]

const columns = computed(() => {
  return [...baseColumns, ...currencyColumns.value]
})

onMounted(async () => {
  $q.loading.show()
  await fetchReferralStatementDetail(props.statementId)
  await fetchReferralStatementDetailTotal(props.statementId)
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
</style>
