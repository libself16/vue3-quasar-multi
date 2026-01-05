<template>
  <q-card class="card-wrapper">
    <q-card-section>
      <div class="card-header">
        <div class="card-header-title">
          <span class="title-icon"></span>
          <span class="title-text">{{ $t("ai.auto_bet_setting") }} 4</span>
        </div>
        <div class="toggle-btn-container">
          <div class="toggle-btn" :class="{ active: isActive }">
            <span class="btn-circle" :class="{ 'translate-x-[1.25rem]': isActive }"></span>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="flex flex-col gap-1">
          <span class="item-title">{{ $t("ai.product") }}</span>
          <div class="product-img-wrapper">
            <q-img :src="kaGamingImg" class="product-img" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="item-title">{{ $t("ai.betting_items") }}</span>
          <div class="flex gap-1">
            <span class="item-text">Golden Dragon</span>
            <span class="item-text">JACKPOT</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <template v-for="(condition, index) in conditions" :key="index">
          <div class="card-disk">
            <div class="card-disk-item">
              <span class="item-title">{{ $t("ai.condition_type") }} {{ index + 1 }}</span>
              <span v-if="condition.mode === 'RANGE'" class="item-text">
                {{ $t("ai.jackpot") }} {{ $t("ai.between") }} {{ condition.min }} ~ {{ condition.max }}
              </span>
              <span v-else-if="condition.mode === 'GREATER'" class="item-text">
                {{ $t("ai.jackpot") }} {{ $t("ai.greater_than") }} {{ condition.value }}
              </span>
              <span v-else-if="condition.mode === 'LESS'" class="item-text">
                {{ $t("ai.jackpot") }} {{ $t("ai.greater_than") }} {{ condition.value }}
              </span>
            </div>
            <div class="card-disk-item">
              <span class="item-title">{{ $t("ai.round_count") }}</span>
              <span class="item-text">50</span>
            </div>
            <div class="card-disk-item">
              <span class="item-title">{{ $t("member.withdrawal.amount") }}</span>
              <span class="item-balance">400</span>
            </div>
          </div>
          <q-separator class="separator" vertical />
        </template>
      </div>
      <div class="desktop-edit-btn">
        <q-btn class="edit-btn" :label="$t('common.btn.edit')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSiteImg } from "src/common/hooks/useSiteImg"

const { kaGamingImg } = useSiteImg()

const emit = defineEmits(["edit-condition"])

const isActive = ref(true)

const conditions = ref([
  {
    mode: "RANGE",
    min: "30,000",
    max: "80,000"
  },
  {
    mode: "GREATER",
    value: "80,000"
  },
  {
    mode: "LESS",
    value: "30,000"
  }
])
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
