<template>
  <div class="condition-type-wrapper">
    <div class="bet-item-container mb-[.75rem]">
      <span class="bet-item-title">{{ $t("ai.product") }}</span>
      <span class="bet-item-text">{{ productName }}</span>
    </div>
    <div class="bet-item-container">
      <span class="bet-item-title">{{ $t("ai.betting_items") }}</span>
      <div class="flex gap-1">
        <span class="bet-item-text">{{ $t(`ai.${gameName.toLowerCase()}`) }}</span>
        <span class="bet-item-text">{{ $t(`ai.${patternData.pattern_type.toLowerCase()}`) }}</span>
      </div>
    </div>
    <template v-for="(item, index) in patternData.rule.conditions" :key="index">
      <q-separator class="separator" />
      <div class="condition-type-container">
        <span class="bet-item-title">{{ $t("ai.condition_type") }}</span>
        <div v-if="item.mode === 'RANGE'" class="flex gap-[.25rem] items-center">
          {{ $t("ai.rtp") }} {{ $t("ai.between") }}
          <q-input
            :model-value="displayValue(item.min)"
            @update:model-value="(val) => updateValue(val, item, 'min')"
            outlined
            inputmode="decimal"
            suffix="%"
          />
          ~
          <q-input
            :model-value="displayValue(item.max)"
            @update:model-value="(val) => updateValue(val, item, 'max')"
            outlined
            inputmode="decimal"
            suffix="%"
          />
        </div>
        <div v-else-if="item.mode === 'GREATER'" class="flex gap-[.25rem] items-center">
          {{ $t("ai.rtp") }} {{ $t("ai.greater_than") }}
          <q-input
            :model-value="displayValue(item.value)"
            @update:model-value="(val) => updateValue(val, item, 'value')"
            outlined
            inputmode="decimal"
            suffix="%"
          />
        </div>
        <div v-else-if="item.mode === 'LESS'" class="flex gap-[.25rem] items-center">
          {{ $t("ai.rtp") }} {{ $t("ai.less_than") }}
          <q-input
            :model-value="displayValue(item.value)"
            @update:model-value="(val) => updateValue(val, item, 'value')"
            outlined
            inputmode="decimal"
            suffix="%"
          />
        </div>
      </div>
      <div class="setting-input-container">
        <div class="betting-disk-container flex flex-col flex-1 gap-[.25rem]">
          <span class="bet-item-title">{{ $t("ai.betting_disk") }}</span>
          <q-btn-dropdown
            :label="translateBetAreaIndex(item.agent_bet_area_index || 0)"
            outlined
            menu-anchor="bottom middle"
            menu-self="bottom middle"
          >
            <q-list :data-theme="props.theme">
              <q-item
                v-for="option in getBettingDiskOptions(item)"
                :key="option.value"
                clickable
                v-close-popup
                @click="changeBettingDisk(item, option)"
                :class="{ 'active-item': option.value === item.agent_bet_area_index }"
              >
                <q-item-section>
                  <q-item-label>{{ translateBetAreaIndex(option.value) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="dialog-amount">
          <span class="bet-item-title">{{ $t("member.withdrawal.amount") }}</span>
          <q-input v-model="item.agent_bet_chip" outlined inputmode="decimal" :placeholder="$t('ai.enter_amount')" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAiAgent } from "src/common/hooks/useAiAgent"
import { useAIAgentStore } from "src/stores/useAIAgentStore"

const props = defineProps<{
  patternIndex: number
  theme: string
}>()

const aiAgentStore = useAIAgentStore()
const { translateBetAreaIndex } = useAiAgent()

const patternData = computed(() => aiAgentStore.getPattern(props.patternIndex))
const productName = computed(() => patternData.value.product_name)
const gameName = computed(() => patternData.value.game_name)

const getBettingDiskOptions = (conditionItem: any) => {
  const indices = conditionItem?.bet_area_indices || []
  return indices.map((index: number) => ({
    value: index
  }))
}

const changeBettingDisk = (conditionItem: any, selectedOption: { value: number }) => {
  conditionItem.agent_bet_area_index = selectedOption.value
}

const displayValue = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  return isNaN(num) ? 0 : Math.round(num * 100)
}

const updateValue = (val: string | number | null, item: any, prop: string) => {
  if (val === null || val === "") {
    item[prop] = "0"
    return
  }

  const num = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(num)) {
    item[prop] = "0"
    return
  }

  const newValue = num / 100
  item[prop] = typeof item[prop] === "string" ? String(newValue.toFixed(2)) : newValue
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/common/css/AIAgent/theme.scss";
@import "src/common/css/AIAgent/agent.scss";

.condition-type-wrapper {
  @apply flex flex-col;
}

.condition-type-container {
  @apply flex flex-col flex-1 gap-[.25rem];

  :deep(.q-field--outlined .q-field__control) {
    @apply w-[3.4375rem] h-[2.125rem] rounded-[.25rem];
    background: var(--white-color);
  }

  :deep(.q-field__suffix) {
    padding: 0;
  }
}
</style>
