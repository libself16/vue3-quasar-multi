<template>
  <q-card class="card-wrapper">
    <q-card-section>
      <div class="card-header">
        <div class="card-header-title">
          <span class="title-icon"></span>
          <span class="title-text">{{ $t("ai.auto_bet_setting") }} 5</span>
        </div>
        <div class="toggle-btn-container">
          <div class="toggle-btn" :class="{ active: isActive }">
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
          <q-img :src="hotDogGamingImg" class="product-img" />
        </div>
        <span class="item-title">
          {{ $t("ai.betting_items") }}
        </span>
        <div class="flex gap-1">
          <span class="item-text">
            100 {{ $t("ai.round") }}{{ $t("ai.above") }}{{ $t("ai.not_settled") }} 20 {{ $t("ai.multiplier")
            }}{{ $t("ai.bonus") }}
          </span>
        </div>
      </div>

      <q-separator class="separator" />

      <div class="card-disk">
        <div class="card-disk-item">
          <span class="item-title">
            {{ $t("ai.round_count") }}
          </span>
          <span class="item-text"> 50 </span>
        </div>
        <div class="card-disk-item">
          <span class="item-title">
            {{ $t("member.withdrawal.amount") }}
          </span>
          <span class="item-balance"> 400 </span>
        </div>
      </div>
      <q-btn class="card-edit-btn" :label="$t('common.btn.edit')" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSiteImg } from "src/common/hooks/useSiteImg"

const { hotDogGamingImg } = useSiteImg()

const isActive = ref(true)
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
