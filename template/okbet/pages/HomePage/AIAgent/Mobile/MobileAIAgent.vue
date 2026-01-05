<template>
  <HeaderTitleBack titleI18n="ai.agent">
    <div class="currency-container">
      <!-- 暫時限定只能用 PHP 幣別，隱藏幣別選單 -->
      <!-- <div class="currency-select">
        <span class="currency-select-label">{{ $t("common.btn.currency") }}</span>
        <q-btn-dropdown
          class="currency-select-dropdown"
          rounded
          :label="selectedLabel"
          menu-anchor="bottom middle"
          menu-self="bottom middle"
        >
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
      </div> -->
      <div class="wallet-content">
        <div class="wallet-item">
          <q-img :src="aiAgentBalanceImg" class="balance-img" />
          <span>{{ $t("member.profile.totalBalances") }}</span>
        </div>
        <div class="wallet-item">
          <span class="mr-1">{{ activeWalletLabel }}</span>
          <span class="balance">
            {{ moneyFormat(currentBalance, 2) }}
          </span>
          <q-btn
            icon="fa-solid fa-arrows-rotate"
            class="btn-refresh hide-hover"
            :class="{ active: aiAgentStore.isLoading }"
            @click="refreshData"
          ></q-btn>
        </div>
      </div>
      <div class="setting-input-container">
        <div class="flex flex-1 flex-col gap-[.25rem]">
          <span>{{ $t("ai.stop_loss") }}：</span>
          <q-input
            v-model="storeConfig.daily_stop_loss"
            class="setting-input"
            outlined
            inputmode="decimal"
            :placeholder="$t('ai.enter_amount')"
          />
          <span class="setting-input-tips">{{ $t("ai.daily_loss_limit") }}</span>
        </div>
        <div class="flex flex-1 flex-col gap-[.25rem]">
          <span>{{ $t("ai.take_profit") }}：</span>
          <q-input
            v-model="storeConfig.daily_stop_profit"
            class="setting-input"
            outlined
            inputmode="decimal"
            :placeholder="$t('ai.enter_amount')"
          />
          <span class="setting-input-tips">{{ $t("ai.no_zero_input") }}</span>
        </div>
      </div>
    </div>
    <q-separator class="separator" />
    <div class="auto-bet-container">
      <div class="button-group">
        <q-btn
          class="apply-settings-btn apply-btn"
          @click="applySettings"
          :loading="aiAgentStore.isLoading"
          :disable="aiAgentStore.isLoading"
        >
          {{ $t("ai.apply_settings") }}
        </q-btn>
        <q-btn class="start-betting-btn" @click="startBetting">
          {{ $t("ai.start_betting") }}
        </q-btn>
      </div>
    </div>
    <div class="condition-card-container">
      <template v-for="(item, index) in enabledPatternList" :key="item.pattern_type">
        <SingleJump
          v-if="item.pattern_type === 'SINGLEJUMP'"
          :Index="index"
          @edit-condition="handleEditCondition"
          data-theme="default"
        />
        <LongDragon
          v-else-if="item.pattern_type === 'LONGDRAGON'"
          :Index="index"
          @edit-condition="handleEditCondition"
          data-theme="default"
        />
        <!-- <RTP
          v-else-if="item.pattern_type === 'RTP'"
          :Index="index"
          @edit-condition="handleEditCondition"
          data-theme="default"
        /> -->
      </template>
      <MockGameFirst />
      <MockGameSecond />
      <MockGameThird />
    </div>
    <FooterNav />
    <BettingDialog v-model:openBettingDialog="openBettingDialog" :theme="theme" />
    <q-dialog v-model="openEditDialog" maximized :data-theme="theme">
      <EditDialog
        :pattern-type="selectedPattern.patternType"
        :pattern-index="selectedPattern.patternIndex"
        :theme="theme"
        @close="closeEditDialog"
      />
    </q-dialog>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import FooterNav from "app/template/okbet/components/Footer/FooterNav.vue"
import SingleJump from "src/common/components/AIAgent/ConditionCard/Mobile/SingleJump.vue"
import LongDragon from "src/common/components/AIAgent/ConditionCard/Mobile/LongDragon.vue"
// import RTP from "src/common/components/AIAgent/ConditionCard/Mobile/RTP.vue"
import MockGameFirst from "src/common/components/AIAgent/ConditionCard/Mobile/MockGameFirst.vue"
import MockGameSecond from "src/common/components/AIAgent/ConditionCard/Mobile/MockGameSecond.vue"
import MockGameThird from "src/common/components/AIAgent/ConditionCard/Mobile/MockGameThird.vue"
import BettingDialog from "src/common/components/AIAgent/Dialog/BettingDialog.vue"
import EditDialog from "src/common/components/AIAgent/Dialog/EditDialog.vue"
import * as Request from "src/api/request.type"

const { moneyFormat } = useCommon()
const { userWalletMap, getWalletLabel, inUseWallet, isLoading, setUserActiveWallet, activeWalletLabel } = useUserInfo()
const { aiAgentBalanceImg } = useSiteImg()
const aiAgentStore = useAIAgentStore()

defineProps<{
  theme: string
}>()

const aiAgentConfigs = ref<Request.PostLaunchAI>({
  game_type: "LIVE_CASINO", // 目前只允許LIVE_CASINO
  product_code: 1149, // 目前只允許 1149
  platform: "web",
  currency: "PHP",
  language_code: 1,
  action_type: 0
})

const storeConfig = computed(() => aiAgentStore.currentConfig)
const currentBalance = computed(() => storeConfig.value.balance || "0")
const enabledPatternList = computed(() => storeConfig.value.enabled_pattern_list || [])
const openBettingDialog = ref(false)
const openEditDialog = ref(false)

interface SelectedPattern {
  patternType: string
  patternIndex: number
}

const selectedPattern = ref<SelectedPattern>({
  patternType: "",
  patternIndex: 0
})

type WalletDropItem = {
  label: string
  value: number
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    return { label, value }
  })
})

const selectedItem = ref<WalletDropItem | null>(null)
const selectedLabel = computed(() => {
  return selectedItem.value?.label || walletDropdown.value[0]?.label || "Dropdown Button"
})

const changeCurrency = async (item: WalletDropItem) => {
  selectedItem.value = item
  setUserActiveWallet(item.value)
}

const refreshData = async () => {
  await aiAgentStore.fetchAIAgentConfigs(aiAgentConfigs.value)
}

const startBetting = async () => {
  const params = {
    ...aiAgentConfigs.value,
    data: {
      status: true,
      agent_configs: [storeConfig.value]
    }
  }
  await aiAgentStore.fetchStartAIAgentBetting(params)
  openBettingDialog.value = true
}

const applySettings = async () => {
  const params = {
    ...aiAgentConfigs.value,
    data: {
      status: false,
      agent_configs: [storeConfig.value]
    }
  }
  await aiAgentStore.fetchUpdateAIAgentSettings(params)
}

const handleEditCondition = (pattern: SelectedPattern) => {
  selectedPattern.value = pattern
  openEditDialog.value = true
}

const closeEditDialog = () => {
  openEditDialog.value = false
}

onMounted(async () => {
  if (walletDropdown.value.length > 0) {
    setUserActiveWallet(walletDropdown.value[0].value)
  }
  await aiAgentStore.fetchAIAgentConfigs(aiAgentConfigs.value)
  if (aiAgentStore.aiAgentState.status) {
    openBettingDialog.value = true
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/agent.scss";
@import "app/template/okbet/assets/css/button.scss";

.currency-container {
  @apply flex flex-col px-[.625rem];
}

.currency-select {
  @apply flex gap-[.375rem] items-center;

  .currency-select-label {
    @apply text-[.75rem] font-semibold;
    color: $text-dark-color;
  }

  .currency-select-dropdown {
    background: $background-pale-silver-color;
  }
}

.wallet-content {
  @apply flex justify-between items-center mt-[.625rem] rounded-[.5rem] py-[.625rem] px-[1.875rem];
  background: $bg-linear-gradient01;
  color: $gold-color;

  .wallet-item {
    @apply flex items-center;

    &:first-child {
      @apply gap-[.5rem];
    }

    &:last-child {
      .currency,
      .balance {
        @apply text-[1.25rem];
      }

      :deep(.q-btn) {
        font-size: 0.625rem;
        color: $white-color;

        &:before,
        &:after {
          display: none !important;
        }

        .q-focus-helper {
          display: none !important;
        }

        .q-ripple {
          display: none !important;
        }
      }

      :deep(.q-icon) {
        @apply mt-[.125rem];
      }
    }
  }

  .balance-img {
    @apply w-4 h-4;
  }
}

.auto-bet-container {
  @apply px-[.625rem];

  .button-group {
    @apply flex gap-[.625rem];
  }

  .start-betting-btn,
  .apply-settings-btn {
    @apply flex-1 rounded-[.5rem] min-h-[2.875rem];
    background: $bg-linear-gradient02;
    box-shadow: $box-shadow01;
    color: $white-color;
  }

  .apply-settings-btn {
    background: $apply-btn-bg;
    color: $primary-color;
  }
}

.condition-card-container {
  @apply flex flex-col gap-[1.25rem] px-[.625rem] mt-[1.25rem] pb-[4.5rem];
}
</style>
