<template>
  <div class="desktop-referral-wrapper">
    <div class="referral-banner">
      <q-img class="referral-banner-image" fit="fill" :src="referralBannerImg" />
    </div>
    <div class="referral-content">
      <div class="content-title">
        <div class="interesting">{{ $t("menu.interesting") }}</div>
        <div class="agent-details">
          <span class="agent">{{ $t("menu.agent") }}</span>
          <span class="details">{{ $t("menu.details") }}</span>
        </div>
      </div>
      <div class="currency-select">
        <span>{{ $t("menu.statistics") }}</span>
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
      <!-- Summary -->
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
        <p class="referral-code-title">{{ $t("menu.referralCode") }}</p>
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
        <q-btn v-if="showingSubDetails" flat dense @click="handleBack" class="back-btn">
          <div class="row items-center">
            <img :src="backBtnImg" class="back-btn-img" />
            {{ t("common.btn.back") }}
          </div>
        </q-btn>
      </div>
      <!-- Table -->
      <div class="referral-table">
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
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
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
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.desktop-referral-wrapper {
  @apply block w-[61.25rem];
  margin: 1.25rem auto 2.5rem auto;

  @include phone-width {
    display: none;
  }

  .referral-banner {
    @apply flex justify-center items-center w-full py-[3.75rem];
  }

  .referral-content {
    @apply my-[2.5rem];

    .content-title {
      @apply font-extrabold mb-[1.25rem];
    }

    .interesting {
      @apply text-[.75rem] uppercase;
      color: $text-soft-periwinkle-color;
    }

    .agent-details {
      @apply text-[1.75rem];
      color: $primary-color;
    }

    .details {
      @apply font-semibold;
      color: $text-dark-color;
    }
  }

  .currency-select {
    @apply flex flex-col;

    :deep(.q-btn-dropdown) {
      @apply w-[12.5rem] h-[3.125rem] mt-[1.125rem];
    }
  }

  .referral-summary {
    @apply flex justify-between;

    .summary-item {
      @apply flex flex-col items-center justify-center w-[19rem] h-[5rem] mt-[2.5rem];
      background: $primary-color;
      color: $text-light-color;
      border-radius: 3.125rem;
    }
  }

  .summary-tips {
    @apply flex justify-center mt-[1.25rem] text-[.875rem];

    :deep(.text-interval) {
      @apply font-semibold text-[1.125rem];
      color: $primary-color;
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col mt-[2.5rem];

    .referral-code-title {
      @apply text-[1.25rem] font-semibold;
    }

    .referral-code-button {
      @apply flex w-[18.75rem] h-[3rem] items-center justify-between rounded-[.625rem] mt-[1.25rem];
      @apply px-[1.25rem] cursor-pointer;
      background: $primary-red02;
      color: $text-light-color;
    }
  }

  .referral-table-tabs {
    @apply flex justify-between mt-[5rem];

    :deep(.q-tab) {
      @apply rounded-[1.5rem] mr-[1.25rem];
      @apply w-auto h-[3.125rem] px-[1.5rem] capitalize;
      border: 1px solid $border-gray-color;
      background: $background-pale-silver-color;
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
