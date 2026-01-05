<template>
  <div class="condition-wrapper">
    <q-card class="condition-card">
      <q-card-section class="row items-center pb-0 header-section">
        <div class="dialog-title">{{ $t("common.btn.edit") }}</div>
        <q-space />
        <q-btn icon="close" class="dialog-close-btn" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="content-section">
        <EditLongDragon
          v-if="patternType === 'LONGDRAGON'"
          :pattern-index="patternIndex"
          :theme="theme"
          @close="handleClose"
        />
        <EditSingleJump
          v-if="patternType === 'SINGLEJUMP'"
          :pattern-index="patternIndex"
          :theme="theme"
          @close="handleClose"
        />
        <EditRTP v-if="patternType === 'RTP'" :pattern-index="patternIndex" :theme="theme" @close="handleClose" />
      </q-card-section>
      <q-card-section class="footer-section">
        <q-btn @click="handleClose" class="confirm-btn" :label="$t('common.btn.confirm')" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"
import EditSingleJump from "src/common/components/AIAgent/Dialog/EditGame/EditSingleJump.vue"
import EditLongDragon from "src/common/components/AIAgent/Dialog/EditGame/EditLongDragon.vue"
import EditRTP from "src/common/components/AIAgent/Dialog/EditGame/EditRTP.vue"

defineProps<{
  patternType: string
  patternIndex: number
  theme: string
}>()

const emit = defineEmits(["close"])

const handleClose = () => {
  emit("close")
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/common/css/AIAgent/theme.scss";
@import "src/common/css/AIAgent/agent.scss";

.condition-card {
  @apply flex flex-col max-w-[37.5rem] mx-auto;

  @include phone-width() {
    @apply w-full h-full;
  }
}

.header-section {
  @apply sticky top-0 z-10;
}

.content-section {
  @apply flex-1 overflow-y-auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.footer-section {
  @apply sticky bottom-0 z-10;
}

.dialog-title {
  @apply font-bold text-[1.5rem];
  color: var(--neutral01);
}

.dialog-close-btn {
  color: var(--neutral01);
}

.confirm-btn {
  @apply w-full rounded-[.5rem];
  background: var(--primary01);
  color: var(--btn01);
}
</style>
