<template>
  <div class="desktop-referral-wrapper">
    <div class="referral-content">
      <div class="content-title">
        <div class="agent-details">
          <span class="agent">{{ $t("menu.memberAgent") }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="currency-select">
          <span>{{ $t("common.btn.currency") }}</span>
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
      </div>
      <!-- Summary -->
      <div class="referral-summary-wrapper">
        <div class="referral-summary">
          <div class="summary-item">
            <div class="summary-item-title">{{ $t("menu.players") }}</div>
            <div class="summary-item-value">{{ moneyFormat(referralSummaryData?.member_count) }}</div>
          </div>
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
        <p class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</p>
        <div class="referral-code-button">
          <span>{{ referralInfoData?.code }}</span>
          <div>
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
      <q-btn v-if="showingSubDetails" flat dense @click="handleBack" class="back-btn">
        <div class="row items-center">
          <img :src="backBtnImg" class="back-btn-img" />
          {{ t("common.btn.back") }}
        </div>
      </q-btn>
      <!-- Table -->
      <template v-if="activeTab === 'setting'">
        <SettingTable />
      </template>
      <template v-else>
        <template v-if="showingSubDetails">
          <SubDetailsTable :statement-id="selectedStatementId" />
        </template>
        <template v-else>
          <DetailsTable @show-sub-details="handleShowSubDetails" />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import SettingTable from "./Components/DesktopSettingTable.vue"
import DetailsTable from "./Components/DesktopDetailsTable.vue"
import SubDetailsTable from "./Components/DesktopSubDetailsTable.vue"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useI18n } from "vue-i18n"
import { useCommon } from "src/common/hooks/useCommon"
import { useRoute, useRouter } from "vue-router"

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { copyMessage, moneyFormat } = useCommon()
const { userWalletMap, getWalletLabel, getUserWalletList } = useUserInfo()
const { fetchReferralInfo, referralInfoData, fetchReferralSummary, referralSummaryData } = useReferral()
const { backBtnImg, referralBannerImg } = useSiteImg()
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

const handleBack = () => {
  showingSubDetails.value = false
  selectedStatementId.value = 0
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

.desktop-referral-wrapper {
  width: 100%;
  max-width: 87.5rem;
  margin: 0 auto;

  @include pad-large-width {
    display: none;
  }

  .referral-banner {
    @apply flex justify-center items-center w-full py-[3.75rem];
  }

  .referral-content {
    @apply my-[2.5rem];

    .content-title {
      @apply font-bold mb-[1.25rem] p-4 rounded-lg;
      background: var(--neutral-01);
    }

    .interesting {
      @apply text-[.75rem] uppercase;
      color: var(--primary-09);
    }

    .agent-details {
      @apply text-[1.5rem];
      color: var(--secondary-01);
    }

    .details {
      color: var(--black-01);
    }
  }

  .currency-select {
    @apply flex items-center gap-[0.75rem] mt-[1.5rem];

    @include pad-large-width() {
      @apply flex-row items-start mt-[3rem];
    }

    .currency-select-title {
      @apply text-[1.25rem] font-semibold;
      color: var(--secondary-01);
    }

    :deep(.q-btn-dropdown) {
      @apply text-white shadow-none;
      border-radius: 2rem;
      border: 1px solid var(--neutral-03);
      background: var(--neutral-04);
      color: var(--secondary-01);

      &::before {
        display: none;
      }
    }
  }

  .referral-summary {
    @apply flex justify-between;

    .summary-item {
      @apply flex flex-col items-center justify-center w-[19rem] h-[5rem] mt-[1.5rem];
      background: var(--primary-01);
      color: #fff;
      border-radius: 3.125rem;

      .summary-item-value {
        @apply text-3xl font-bold;
      }
    }
  }

  .summary-tips {
    @apply flex justify-center mt-[1.25rem] text-[.875rem];

    :deep(.text-interval) {
      @apply font-semibold text-[1.125rem];
      color: var(--emotional-danger-02);
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col mt-[1.5rem] items-center justify-center p-3;
    background-color: var(--primary-04);
    border-radius: 0.75rem;
    border: 1px solid var(--primary-01);

    .referral-code-title {
      @apply text-[1.25rem] font-semibold;
    }

    .referral-code-button {
      @apply flex w-[18.75rem] h-[3rem] items-center justify-between mt-3 px-[1.25rem];
      background: var(--primary-01);
      color: var(--text-01);
      border-radius: 0.25rem;
    }
  }

  .referral-table-tabs {
    @apply flex justify-start mt-[2rem];

    :deep(.q-tab) {
      @apply rounded-[1.5rem] mr-[1.25rem];
      @apply w-auto h-[3.125rem] px-[1.5rem] capitalize;
      border: 1px solid var(--neutral-03);
      background: var(--neutral-04);
    }

    :deep(.q-tab--active) {
      color: #fff;
      background: var(--primary-01);
    }

    :deep(.q-tab__indicator) {
      display: none;
    }
  }

  .back-btn {
    @apply rounded-[3.125rem] text-[1.25rem];
    background: var(--primary-04);
    color: var(--primary-01);
    border: 1px solid var(--primary-01);
    padding: 0.5rem 0.75rem;
    margin-top: 1.25rem;

    .back-btn-img {
      @apply w-[1.25rem] h-[1.0625rem] mr-2;
    }
  }
}
</style>
