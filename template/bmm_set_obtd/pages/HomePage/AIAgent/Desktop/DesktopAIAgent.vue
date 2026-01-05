<template>
  <section class="desktop-agent-wrapper">
    <div class="desktop-agent-container">
      <div class="agent-title">
        <span class="agent-title-ai">AI</span>
        <span>{{ $t("ai.agent_text") }}</span>
      </div>
      <div class="currency-container mb-[1.25rem]">
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
        <div class="setting-input-container">
          <div class="setting-input-item">
            <span>{{ $t("ai.stop_loss") }}：</span>
            <q-input
              v-model="storeConfig.daily_stop_loss"
              class="setting-input"
              filled
              inputmode="decimal"
              :placeholder="$t('ai.enter_amount')"
            />
            <span class="setting-input-tips">{{ $t("ai.daily_loss_limit") }}</span>
          </div>
          <div class="setting-input-item">
            <span>{{ $t("ai.take_profit") }}：</span>
            <q-input
              v-model="storeConfig.daily_stop_profit"
              class="setting-input"
              filled
              inputmode="decimal"
              :placeholder="$t('ai.enter_amount')"
            />
            <span class="setting-input-tips">{{ $t("ai.no_zero_input") }}</span>
          </div>
        </div>
      </div>
      <q-separator class="separator" />
      <div class="button-container mt-1">
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
      <div class="setting-bet-card-container">
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
    </div>
    <BettingDialog v-model:openBettingDialog="openBettingDialog" :theme="theme" />
    <q-dialog v-model="openEditDialog" maximized :data-theme="theme">
      <EditDialog
        :pattern-type="selectedPattern.patternType"
        :pattern-index="selectedPattern.patternIndex"
        :theme="theme"
        @close="closeEditDialog"
      />
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import LongDragon from "src/common/components/AIAgent/ConditionCard/Desktop/LongDragon.vue"
import SingleJump from "src/common/components/AIAgent/ConditionCard/Desktop/SingleJump.vue"
// import RTP from "src/common/components/AIAgent/ConditionCard/Desktop/RTP.vue"
import MockGameFirst from "src/common/components/AIAgent/ConditionCard/Desktop/MockGameFirst.vue"
import MockGameSecond from "src/common/components/AIAgent/ConditionCard/Desktop/MockGameSecond.vue"
import MockGameThird from "src/common/components/AIAgent/ConditionCard/Desktop/MockGameThird.vue"
import BettingDialog from "src/common/components/AIAgent/Dialog/BettingDialog.vue"
import EditDialog from "src/common/components/AIAgent/Dialog/EditDialog.vue"
import * as Request from "src/api/request.type"

const { userWalletMap, getWalletLabel, getUserWalletList, inUseWallet, isLoading, setUserActiveWallet } = useUserInfo()
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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/agent.scss";

.desktop-agent-wrapper {
  background: $background-pale-silver-color;
}

.desktop-agent-container {
  @apply flex flex-col max-w-[81.25rem] mx-auto py-[2.5rem];
}

.agent-title {
  @apply flex gap-1 text-[1.75rem] font-semibold;

  .agent-title-ai {
    color: $primary-color;
  }
}

.currency-select-label {
  @apply mr-[.625rem] text-[1.25rem] font-semibold;
}

.currency-select-dropdown {
  @apply w-[12.5rem] h-[2.9375rem];
}

.setting-input-item {
  @apply flex flex-col gap-[.25rem];

  :deep(.q-field--outlined .q-field__control) {
    @apply w-[18.75rem] h-[3.5rem] rounded-[.25rem];
    background: $background-light-color;
  }
}

.setting-bet-card-container {
  @apply flex flex-col gap-[.625rem];
}

.setting-input-container {
  :deep(.q-field__control) {
    @apply w-[18.75rem] h-[3.5rem];
    background: $background-light-color;
  }
}

.button-container {
  @apply flex justify-center mb-[1.25rem];

  .button-group {
    @apply flex gap-[.625rem] w-[31.25rem];
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
</style>
