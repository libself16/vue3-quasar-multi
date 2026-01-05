<template>
  <HeaderTitleBack titleI18n="menu.memberAgent" variant="setR022">
    <div class="mobile-referral-wrapper">
      <div class="referral-content">
        <div class="currency-select flex items-center gap-2.5">
          <span class="statistics">{{ $t("common.btn.currency") }}</span>
          <q-btn-dropdown rounded :label="selectedLabel" menu-anchor="bottom middle" menu-self="bottom middle">
            <q-list>
              <q-item
                v-for="item in walletDropdown"
                :key="item.value"
                clickable
                v-close-popup
                @click="changeCurrency(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="summary-tips">
          <div class="summary-tips-text" v-html="summaryTips"></div>
        </div>
        <div class="referral-summary-wrapper">
          <div class="summary-item">
            <div class="summary-item-title">{{ $t("menu.players") }}</div>
            <div class="summary-item-value">{{ moneyFormat(referralSummaryData?.member_count) }}</div>
          </div>
          <div class="referral-summary">
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("menu.validBet") }}</div>
              <div class="summary-item-value">{{ moneyFormat(referralSummaryData?.total_valid_betted_amount) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("menu.winLoss") }}</div>
              <div class="summary-item-value">{{ moneyFormat(referralSummaryData?.total_profit) }}</div>
            </div>
          </div>
        </div>
        <!-- Referral Code -->
        <div class="referral-code-wrapper">
          <span class="referral-code-title">{{ $t("menu.referralCode") }}</span>
          <div class="referral-code-button">
            <span>{{ referralInfoData?.code }}</span>
            <div class="copy-icon">
              <q-icon
                name="share"
                @click="handleShareReferralCode"
                class="cursor-pointer mr-4 hover:opacity-50"
                size="xs"
              />
              <q-icon
                name="content_copy"
                class="cursor-pointer hover:opacity-50"
                size="xs"
                @click="copyMessage(referralInfoData?.code ?? '')"
              />
            </div>
          </div>
        </div>
        <!-- Referral Table Tabs -->
        <div class="referral-table-tabs">
          <q-tabs v-model="activeTab" align="left">
            <q-tab name="setting" :label="$t('menu.referralSettings')" />
            <q-tab name="details" :label="$t('menu.referralDetails')" />
          </q-tabs>
        </div>
        <!-- Referral List -->
        <div class="referral-list">
          <template v-if="activeTab === 'setting'">
            <MobileSettingList />
          </template>
          <template v-else>
            <template v-if="showingSubDetails">
              <MobileSubDetailsList :statement-id="selectedStatementId" @back="showingSubDetails = false" />
            </template>
            <template v-else>
              <MobileDetailsList @show-sub-details="handleShowSubDetails" />
            </template>
          </template>
        </div>
      </div>
      <FooterNav />
    </div>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useReferral } from "src/common/composables/useReferral"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import FooterNav from "app/template/set_r022/components/Footer/FooterNav.vue"
import MobileSettingList from "app/template/set_r022/pages/HomePage/Referral/Components/MobileSettingList.vue"
import MobileDetailsList from "app/template/set_r022/pages/HomePage/Referral/Components/MobileDetailsList.vue"
import MobileSubDetailsList from "app/template/set_r022/pages/HomePage/Referral/Components/MobileSubDetailsList.vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useRoute, useRouter } from "vue-router"

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { copyMessage, moneyFormat } = useCommon()
const { userWalletMap, getWalletLabel, getUserWalletList } = useUserInfo()
const { fetchReferralInfo, referralInfoData, fetchReferralSummary, referralSummaryData } = useReferral()
const { referralBannerImg } = useSiteImg()
const { t } = useI18n()
const activeCurrencyId = ref("")
const tabState = ref("setting")
const activeTab = computed({
  get: () => tabState.value,
  set: (val) => {
    tabState.value = val
    if (val === "setting") {
      showingSubDetails.value = false
      selectedStatementId.value = 0
    }
  }
})
const showingSubDetails = ref(false)
const selectedStatementId = ref<number>(0)

type WalletDropItem = {
  label: string
  value: string
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${getWalletLabel(cashWallet)}`
    const value = String(cashWallet.currency_id)
    return { label, value }
  })
})

const selectedItem = ref<WalletDropItem | null>(null)
const selectedLabel = computed(() => {
  return selectedItem.value?.label || walletDropdown.value[0]?.label || "Dropdown Button"
})

const changeCurrency = async (item: WalletDropItem) => {
  selectedItem.value = item
  activeCurrencyId.value = item.value
  await fetchReferralSummary(item.value)
}

const summaryTips = computed(() => {
  return t("menu.summaryTips", { interval: `<span class="text-interval">10</span>` })
})

const handleShareReferralCode = () => {
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      referral_code: referralInfoData.value?.code
    }
  })

  copyMessage(window.location.href)
}

const handleShowSubDetails = (statementId: number) => {
  selectedStatementId.value = statementId
  showingSubDetails.value = true
}

onMounted(async () => {
  $q.loading.show()
  await getUserWalletList()
  await fetchReferralInfo()
  if (walletDropdown.value.length > 0) {
    selectedItem.value = walletDropdown.value[0]
    activeCurrencyId.value = walletDropdown.value[0].value
    await fetchReferralSummary(walletDropdown.value[0].value)
  }
  $q.loading.hide()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.mobile-referral-wrapper {
  background: var(--bg-main-bg);
  padding: 1.875rem 0.75rem 0;

  .agent-details {
    @apply flex text-base font-bold gap-2;
    color: var(--secondary-01);
  }

  .currency-select {
    .statistics {
      @apply text-base font-bold;
      color: var(--secondary-01);
    }

    :deep(.q-btn-dropdown) {
      width: 12.5rem;
      height: 2.9375rem;
      border-radius: 2rem;
      border: 1px solid var(--neutral-03);
      background: var(--neutral-04);
      color: var(--secondary-01);
      box-shadow: none;

      &::before {
        display: none;
      }
    }
  }

  .referral-summary {
    @apply flex justify-evenly gap-2.5 mt-2.5;
  }

  .summary-item {
    @apply flex flex-col items-center justify-center p-2 rounded-[6.25rem] flex-1;
    background: var(--primary-01);
    color: #fff;

    .summary-item-value {
      @apply text-2xl font-bold;
    }
  }

  .summary-tips {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0.625rem 0;

    :deep(.text-interval) {
      @apply text-[1rem];
      color: var(--emotional-danger-02);
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col items-center mt-2.5;
    background-color: var(--primary-04);
    border-radius: 0.75rem;
    border: 1px solid var(--primary-01);
    padding: 1.25rem 2.0625rem;

    .referral-code-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.125rem;
    }

    .referral-code-button {
      width: 100%;
      height: 3rem;
      background: var(--primary-01);
      color: var(--text-01);
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8125rem 0.75rem;

      .copy-icon {
        :deep(.q-icon) {
          color: var(--text-01);
          opacity: 1;
        }
      }
    }
  }

  .referral-table-tabs {
    @apply flex justify-between;
    margin-top: 1.875rem;

    :deep(.q-tab) {
      border-radius: 3.125rem;
      margin-right: 0.625rem;
      padding: 0.625rem 1.25rem;
      background: var(--primary-07);
      color: var(--neutral-09);

      @include pad-large-width {
        @apply max-w-[12.5rem] flex-wrap h-auto pt-[0.5rem] pb-[0.5rem] rounded-[2rem];
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
      }
    }

    :deep(.q-tab--active) {
      color: var(--text-01);
      background: var(--primary-01);
    }

    :deep(.q-tab__indicator) {
      display: none;
    }

    .back-btn {
      @apply w-[12.5rem] h-[3.125rem] rounded-[3.125rem];
      @apply text-[1.25rem];
      background: var(--primary-04);
      color: var(--primary-01);
      border: 1px solid var(--primary-01);

      .back-btn-img {
        @apply w-[1.25rem] h-[1.0625rem] mr-2;
      }
    }
  }
}
</style>
