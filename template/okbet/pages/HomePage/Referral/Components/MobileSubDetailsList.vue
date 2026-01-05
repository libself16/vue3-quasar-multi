<template>
  <div class="mobile-details-list">
    <div class="list-wrapper" v-if="referralStatementDetailData?.list?.length">
      <q-card class="mobile-page-total-card">
        <q-card-section class="page-total-header">
          <p>{{ $t("menu.pageTotal") }}</p>
        </q-card-section>
        <q-card-section class="page-total-content">
          <div class="page-total-item">
            <span class="page-total-title">{{ $t("menu.directMemberCount") }}</span>
            <span>{{ pageSummary.cashback_count }}</span>
          </div>
          <div v-for="(item, currencyCode) in pageSummary.revenue_total" :key="currencyCode" class="page-total-item">
            <span class="page-total-title">{{ getCurrencyCode(Number(currencyCode)) }}</span>
            <span>{{ moneyFormat(item) }}</span>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="mobile-page-total-card">
        <q-card-section class="page-total-header">
          <p>{{ $t("menu.searchTotal") }}</p>
        </q-card-section>
        <q-card-section class="page-total-content">
          <div class="page-total-item">
            <span class="page-total-title">{{ $t("menu.directMemberCount") }}</span>
            <span>{{ referralStatementDetailTotalData?.cashback_count }}</span>
          </div>
          <div
            v-for="(item, currencyCode) in referralStatementDetailTotalData?.revenue_total"
            :key="currencyCode"
            class="page-total-item"
          >
            <span class="page-total-title">{{ getCurrencyCode(Number(currencyCode)) }}</span>
            <span>{{ moneyFormat(item) }}</span>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="list-item" v-for="(item, index) in referralStatementDetailData.list" :key="index">
        <q-card-section class="list-item-section">
          <q-expansion-item class="expansion-wrapper">
            <template v-slot:header>
              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("menu.userAccount") }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ item.member_account }}</q-item-label>
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
                <q-img :src="mobileBackBtnImg" @click="handleBack()" class="mobile-back-btn-img" lazy-load />
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
          @update:model-value="(page: number) => handlePagination(page, 'statementDetail', props.statementId, 20)"
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
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import Pagination from "app/template/okbet/components/Pagination/Index.vue"

const props = defineProps<{
  statementId: number
}>()

const emit = defineEmits<{
  back: []
}>()

const {
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
const { mobileBackBtnImg } = useSiteImg()
const pageSummary = computed(
  () =>
    referralStatementDetailData.value?.page_summary ?? {
      cashback_count: 0,
      revenue_total: {}
    }
)

const totalPages = computed(() => {
  const total = referralStatementDetailData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const getCurrencyCode = (currencyId: number) => {
  return currencyIdMap.value?.[currencyId]?.code ?? currencyId
}

const handleBack = () => {
  emit("back")
}

onMounted(async () => {
  await handlePagination(currentPage.value, "statementDetail", props.statementId, 20)
  await fetchReferralStatementDetailTotal(props.statementId)
  await getAvailCurrencyList()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/referral.scss";

.mobile-page-total-card {
  @apply mb-3;
  border: 1px solid $primary-color;

  .page-total-header {
    @apply text-center font-bold;
    background: $secondary-color;
    color: $text-light-color;
  }

  .page-total-content {
    @apply p-4;

    .page-total-item {
      @apply flex font-bold py-[.5rem] px-2;
      border-bottom: 1px solid rgba($border-dark-color, 0.1);

      span {
        @apply w-1/2;

        &:last-child {
          @apply text-right;
        }
      }
    }
  }
}
</style>
