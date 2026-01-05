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
      <q-separator class="separator" />

      <div class="card-product">
        <span class="item-title">
          {{ $t("ai.product") }}
        </span>
        <div class="product-img-wrapper">
          <q-img :src="aiLiveCasinoImg" class="product-img" />
        </div>
        <span class="item-title">
          {{ $t("ai.betting_items") }}
        </span>
        <div class="flex gap-1">
          <span class="item-text"> {{ $t(`ai.${patternData.game_name.toLowerCase()}`) }} </span>
          <span class="item-text"
            >{{ $t(`ai.${patternData.pattern_type.toLowerCase()}`) }} {{ patternData.rule.required_count }}
            {{ $t("ai.times") }}</span
          >
        </div>
      </div>

      <q-separator class="separator" />

      <div class="card-disk">
        <div class="card-disk-item">
          <span class="item-title">
            {{ $t("ai.betting_disk") }}
          </span>
          <span class="item-text"> {{ translateBetAreaIndex(patternData.rule.agent_bet_area_index) }} </span>
        </div>
        <div class="card-disk-item">
          <span class="item-title">
            {{ $t("member.withdrawal.amount") }}
          </span>
          <span class="item-balance"> {{ patternData.rule.agent_bet_chip }} </span>
        </div>
      </div>

      <q-btn @click="handleEdit" class="card-edit-btn" :label="$t('common.btn.edit')" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAIAgentStore } from "src/stores/useAIAgentStore"
import { useAiAgent } from "src/common/hooks/useAiAgent"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import type * as Response from "src/api/response.type"

const emit = defineEmits(["edit-condition"])
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

.card-product {
  @apply flex flex-col items-start gap-1;
}

.card-disk {
  @apply flex items-start;
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
