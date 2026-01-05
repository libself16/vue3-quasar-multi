<template>
  <q-card class="card-wrapper">
    <q-card-section>
      <div class="card-header">
        <div class="card-header-title">
          <span class="title-icon"></span>
          <span class="title-text">{{ $t("ai.auto_bet_setting") }} {{ Index + 1 }}</span>
        </div>
        <div class="toggle-btn-container">
          <div class="toggle-btn" :class="{ active: isActive }" @click="isActive = !isActive">
            <span class="btn-circle" :class="{ 'translate-x-[1.25rem]': isActive }"></span>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="flex flex-col gap-1">
          <span class="item-title">{{ $t("ai.product") }}</span>
          <span class="item-text">{{ productName }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="item-title">{{ $t("ai.betting_items") }}</span>
          <div class="flex gap-1">
            <span class="item-text">{{ $t(`ai.${gameName}`) }}</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <template v-for="(condition, index) in conditions" :key="index">
          <div class="card-disk">
            <div class="card-disk-item">
              <span class="item-title">{{ $t("ai.condition_type") }} {{ index + 1 }}</span>
              <span v-if="condition.mode === 'RANGE'" class="item-text">
                {{ $t("ai.rtp") }} {{ $t("ai.between") }} {{ formatPercentage(condition.min) }} ~
                {{ formatPercentage(condition.max) }}
              </span>
              <!-- 大於 -->
              <span v-else-if="condition.mode === 'GREATER'" class="item-text">
                {{ $t("ai.rtp") }} {{ $t("ai.greater_than") }} {{ formatPercentage(condition.value) }}
              </span>
              <!-- 小於 -->
              <span v-else-if="condition.mode === 'LESS'" class="item-text">
                {{ $t("ai.rtp") }} {{ $t("ai.less_than") }} {{ formatPercentage(condition.value) }}
              </span>
            </div>
            <div class="card-disk-item">
              <span class="item-title">{{ $t("ai.betting_disk") }}</span>
              <span class="item-text">{{ translateBetAreaIndex(condition.agent_bet_area_index) }}</span>
            </div>
            <div class="card-disk-item">
              <span class="item-title">{{ $t("member.withdrawal.amount") }}</span>
              <span class="item-balance">{{ condition.agent_bet_chip }}</span>
            </div>
          </div>
          <q-separator class="separator" vertical />
        </template>
      </div>
      <div class="desktop-edit-btn">
        <q-btn @click="handleEdit" class="edit-btn" :label="$t('common.btn.edit')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAiAgent } from "src/common/hooks/useAiAgent"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import * as Response from "src/api/response.type"

const emit = defineEmits(["edit-condition"])
const { formatPercentage, translateBetAreaIndex } = useAiAgent()
const aiAgentStore = useAIAgentStore()

const props = defineProps<{
  Index: number
}>()

const patternData = computed<Response.EnabledPatternList>(() => {
  return aiAgentStore.getPattern(props.Index)
})

const isActive = computed({
  get: () => patternData.value.is_active,
  set: (value) => {
    aiAgentStore.updatePatternActiveStatus(props.Index, value)
  }
})

const productName = computed(() => patternData.value.product_name)
const gameName = computed(() => patternData.value.game_name.toLowerCase())
const conditions = computed(() => patternData.value.rule.conditions)

const handleEdit = () => {
  emit("edit-condition", {
    patternType: patternData.value.pattern_type,
    patternIndex: props.Index
  })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/common/css/AIAgent/theme.scss";
@import "src/common/css/AIAgent/agent.scss";

.card-content {
  @apply flex gap-3 mt-[1.375rem] mb-4;
}

.card-disk {
  @apply flex justify-start gap-3;
}

.card-disk-item {
  @apply flex-grow-0 basis-auto;
}

.item-title {
  @apply text-sm font-bold;
  color: var(--neutral02);
}

.item-text {
  @apply inline-flex py-1 px-2 rounded-[.5rem] justify-center items-center;
  background: var(--neutral04);
  color: var(--neutral01);
}

.item-balance {
  @apply text-[1.5rem] font-bold;
  color: var(--neutral01);
}
</style>
