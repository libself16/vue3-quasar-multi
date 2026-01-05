<template>
  <div class="mobile-details-list">
    <div class="list-wrapper" v-if="referralStatementListData?.list?.length">
      <q-card class="list-item" v-for="(item, index) in referralStatementListData.list" :key="index">
        <q-card-section class="list-item-section">
          <div class="list-item-range">
            <span class="range-title">{{ $t("menu.settlementRange") }}</span>
            <span> {{ dateformat(item.billing_start) }} ~ {{ dateformat(item.billing_end) }} </span>
          </div>
          <q-separator class="list-item-separator" />
          <q-expansion-item class="expansion-wrapper">
            <template v-slot:header>
              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("menu.settlementDate") }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ item.billing_date }}</q-item-label>
              </q-item-section>

              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("menu.directMemberCount") }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ item.cashback_count }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="revenue-wrapper">
                <div v-for="(revenueValue, currencyCode) in item.revenues" :key="currencyCode" class="revenue-item">
                  <span class="revenue-currency">{{ getCurrencyCode(Number(currencyCode)) }}</span>
                  <span>{{ moneyFormat(revenueValue) }}</span>
                </div>
                <q-img
                  :src="mobileExpansionDetailImg"
                  @click="handleDetailsClick(item.statement_id)"
                  class="expansion-detail-img"
                  lazy-load
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="(page: number) => handlePagination(page, 'statement', undefined, 20)"
        />
      </div>
    </div>
    <div v-else class="referral-no-data-container">
      <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits } from "vue"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { dateformat } from "src/common/utils/dayjsUtils"
import Pagination from "app/template/okbet_blackGold/components/Pagination/Index.vue"

const { referralStatementListData, referralPagination, handlePagination } = useReferral()
const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const { mobileExpansionDetailImg } = useSiteImg()
const currentPage = ref(1)

const emit = defineEmits(["show-sub-details"])
const totalPages = computed(() => {
  const total = referralStatementListData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const getCurrencyCode = (currencyId: number) => {
  return currencyIdMap.value?.[currencyId]?.code ?? currencyId
}

const handleDetailsClick = (statementId: number) => {
  emit("show-sub-details", statementId)
}

onMounted(async () => {
  await handlePagination(currentPage.value, "statement", undefined, 20)
  await getAvailCurrencyList()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/referral.scss";
</style>
