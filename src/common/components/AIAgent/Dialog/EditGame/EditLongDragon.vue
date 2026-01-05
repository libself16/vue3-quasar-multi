<template>
  <div class="bet-item-container mb-[.75rem]">
    <span class="bet-item-title">{{ $t("ai.product") }}</span>
    <div class="product-img-wrapper">
      <q-img :src="aiLiveCasinoImg" class="product-img" />
    </div>
  </div>
  <div class="bet-item-container">
    <span class="bet-item-title">{{ $t("ai.betting_items") }}</span>
    <div class="flex gap-1">
      <span class="bet-item-text">{{ $t(`ai.${gameName.toLowerCase()}`) }}</span>
      <span class="bet-item-text"
        >{{ $t(`ai.${patternData.pattern_type.toLowerCase()}`) }} {{ patternData.rule.required_count }}
        {{ $t("ai.times") }}</span
      >
    </div>
  </div>
  <q-separator class="separator" />
  <div class="setting-input-container">
    <div class="betting-disk-container flex flex-col flex-1 gap-[.25rem]">
      <span class="bet-item-title">{{ $t("ai.betting_disk") }}</span>
      <q-btn-dropdown
        :label="translateBetAreaIndex(selectedBettingDisk?.value || 0)"
        outlined
        menu-anchor="bottom middle"
        menu-self="bottom middle"
      >
        <q-list :data-theme="props.theme">
          <q-item
            v-for="item in bettingDiskOptions"
            :key="item.value"
            clickable
            v-close-popup
            @click="changeBettingDisk(item)"
            :class="{ 'active-item': item.value === bettingDisk }"
          >
            <q-item-section>
              <q-item-label>{{ translateBetAreaIndex(item.value) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="dialog-amount">
      <span class="bet-item-title">{{ $t("member.withdrawal.amount") }}</span>
      <q-input v-model="amount" outlined inputmode="decimal" :placeholder="$t('ai.enter_amount')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useAiAgent } from "src/common/hooks/useAiAgent"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import { useSiteImg } from "src/common/hooks/useSiteImg"

const { aiLiveCasinoImg } = useSiteImg()

const props = defineProps<{
  patternIndex: number
  theme: string
}>()

const emit = defineEmits(["close"])

const aiAgentStore = useAIAgentStore()
const { translateBetAreaIndex } = useAiAgent()

const patternData = computed(() => aiAgentStore.getPattern(props.patternIndex))
const productName = computed(() => patternData.value.product_name)
const gameName = computed(() => patternData.value.game_name)

const bettingDiskOptions = computed(() => {
  const indices = patternData.value.rule.bet_area_indices || []
  return indices.map((index) => ({
    value: index
  }))
})

const bettingDisk = ref(patternData.value.rule.agent_bet_area_index)
const amount = ref(patternData.value.rule.agent_bet_chip)

const selectedBettingDisk = computed(() => {
  return bettingDiskOptions.value.find((item) => item.value === bettingDisk.value)
})

const changeBettingDisk = (item: { value: number }) => {
  bettingDisk.value = item.value
  aiAgentStore.updatePatternBettingDisk(props.patternIndex, item.value)
}

watch(amount, (newValue) => {
  aiAgentStore.updatePatternBettingAmount(props.patternIndex, newValue)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/common/css/AIAgent/theme.scss";
@import "src/common/css/AIAgent/agent.scss";
</style>
