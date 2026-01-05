<template>
  <HeaderTitleBack titleI18n="menu.referralDetails">
    <div class="mobile-referral-wrapper">
      <div class="referral-banner">
        <q-img class="referral-banner-image" fit="fill" :src="referralBannerImg" />
      </div>
      <div class="referral-content">
        <div class="content-title">
          <div class="agent-details">
            <span class="agent">{{ $t("menu.agent") }}</span>
            <span class="details">{{ $t("menu.details") }}</span>
          </div>
        </div>
        <div class="currency-select">
          <span class="statistics">{{ $t("menu.statistics") }}</span>
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
        <div class="referral-summary-wrapper">
          <div class="referral-summary">
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("menu.players") }}</div>
              <div class="summary-item-value">{{ referralSummaryData?.member_count }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("menu.validBet") }}</div>
              <div class="summary-item-value">{{ referralSummaryData?.total_valid_betted_amount }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("menu.winLoss") }}</div>
              <div class="summary-item-value">{{ referralSummaryData?.total_profit }}</div>
            </div>
          </div>
          <div class="summary-tips">
            <div class="summary-tips-text" v-html="summaryTips"></div>
          </div>
        </div>
        <!-- Referral Code -->
        <div class="referral-code-wrapper">
          <span class="referral-code-title">{{ $t("menu.referralCode") }}</span>
          <div class="referral-code-button" @click="copyReferralCode">
            <span>{{ referralInfoData?.code }}</span>
            <i class="fa-solid fa-copy"></i>
          </div>
        </div>
        <!-- Referral Table Tabs -->
        <div class="referral-table-tabs">
          <q-tabs v-model="activeTab" align="left">
            <q-tab name="setting" :label="$t('menu.referralSetting')" />
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
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import FooterNav from "app/template/okbet_redBlack/components/Footer/FooterNav.vue"
import MobileSettingList from "app/template/okbet_redBlack/pages/HomePage/Referral/Components/MobileSettingList.vue"
import MobileDetailsList from "app/template/okbet_redBlack/pages/HomePage/Referral/Components/MobileDetailsList.vue"
import MobileSubDetailsList from "app/template/okbet_redBlack/pages/HomePage/Referral/Components/MobileSubDetailsList.vue"

const $q = useQuasar()
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

const copyReferralCode = () => {
  navigator.clipboard.writeText(referralInfoData.value?.code || "")
  $q.notify({
    message: t("common.alarm.copySuccess"),
    color: "green",
    position: "top"
  })
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
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.mobile-referral-wrapper {
  @apply px-[0.625rem];

  .referral-content {
    @apply mt-[1.75rem];
  }

  .agent-details {
    @apply flex text-base font-bold gap-2;
    color: $text-night-sky-color;
  }

  .currency-select {
    @apply flex flex-col gap-2 mt-[.625rem];

    .statistics {
      @apply text-base font-bold;
      color: $text-night-sky-color;
    }

    :deep(.q-btn-dropdown) {
      @apply w-[7.9375rem] h-[2rem] mt-[.5rem];
      background: $background-pale-silver-color;
    }
  }

  .referral-summary {
    @apply flex justify-evenly;

    .summary-item {
      @apply flex flex-col items-center justify-center mt-[2rem];
      @apply w-[12rem] h-[4rem] rounded-[3rem];
      background: $primary-red01;
      color: $white-color;

      @include iphone-width {
        @apply w-[7rem] h-[3.375rem];
      }
    }
  }

  .summary-tips {
    @apply flex justify-center mt-[1.25rem] text-[.75rem] font-bold;

    :deep(.text-interval) {
      @apply text-[1rem];
      color: $primary-color;
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col items-center mt-[2rem];

    .referral-code-title {
      @apply flex text-[1rem] font-semibold;
    }

    .referral-code-button {
      @apply flex w-[18.75rem] h-[3rem] items-center justify-between rounded-[.625rem] mt-[0.5rem];
      @apply px-[1.25rem] cursor-pointer;
      background: $primary-red02;
      color: $text-light-color;
    }
  }

  .referral-table-tabs {
    @apply flex justify-between mt-[2.5rem];

    :deep(.q-tab) {
      @apply rounded-[1.5rem] mr-[1.25rem];
      @apply w-auto h-[3.125rem] px-[1.5rem] capitalize;
      border: 1px solid $border-gray-color;
      background: $background-pale-silver-color;
      @include iphone-width {
        @apply max-w-[12.5rem] flex-wrap h-auto pt-[0.5rem] pb-[0.5rem] rounded-[2rem];
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
      }
    }

    :deep(.q-tab--active) {
      color: $text-light-color;
      background: $primary-color;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }

    .back-btn {
      @apply w-[12.5rem] h-[3.125rem] rounded-[3.125rem] bg-[#DCDCDE];
      @apply text-[1.25rem];

      .back-btn-img {
        @apply w-[1.25rem] h-[1.0625rem] mr-2;
      }
    }
  }
}
</style>
