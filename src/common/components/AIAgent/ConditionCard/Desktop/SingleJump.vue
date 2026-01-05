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
          <div class="product-img-wrapper">
            <q-img :src="aiLiveCasinoImg" class="product-img" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="item-title">{{ $t("ai.betting_items") }}</span>
          <div class="flex gap-1">
            <span class="item-text">{{ $t(`ai.${patternData.game_name.toLowerCase()}`) }}</span>
            <span class="item-text"
              >{{ $t(`ai.${patternData.pattern_type.toLowerCase()}`) }} {{ patternData.rule.required_count }}
              {{ $t("ai.times") }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-disk">
          <div class="card-disk-item">
            <span class="item-title">{{ $t("ai.betting_disk") }}</span>
            <span class="item-text">{{ translateBetAreaIndex(patternData.rule.agent_bet_area_index) }}</span>
          </div>
          <div class="card-disk-item">
            <span class="item-title">{{ $t("member.withdrawal.amount") }}</span>
            <span class="item-balance">{{ patternData.rule.agent_bet_chip }}</span>
          </div>
        </div>
      </div>
      <div class="desktop-edit-btn">
        <q-btn @click="handleEdit" class="edit-btn" :label="$t('common.btn.edit')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import { useAiAgent } from "src/common/hooks/useAiAgent"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import type * as Response from "src/api/response.type"

const aiAgentStore = useAIAgentStore()
const { translateBetAreaIndex } = useAiAgent()
const { aiLiveCasinoImg } = useSiteImg()

const props = defineProps<{
  Index: number
}>()

const patternData = computed<Response.EnabledPatternList>(() => {
  return aiAgentStore.getPattern(props.Index)
})

const isActive = computed({
  get: () => patternData.value.is_active || false,
  set: (value) => {
    aiAgentStore.updatePatternActiveStatus(props.Index, value)
  }
})

const emit = defineEmits(["edit-condition"])

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
