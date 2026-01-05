<template>
  <div v-if="openBettingDialog" class="betting-dialog-wrapper">
    <q-card class="betting-dialog-card">
      <q-card-section>
        <div class="betting-img-container mb-[1rem]">
          <q-img :src="aiAgentBettingImg" alt="aiAgentBettingImg" class="betting-img" />
          <span class="text-[20px]"
          >
            {{ $t("ai.betting") }}
          </span>
        </div>
        <span class="text-center flex justify-center items-center text-[14px]">{{ $t("ai.leave_tip1") }}</span>
        <span class="text-center mb-[1.875rem] flex justify-center items-center text-[14px]">{{ $t("ai.leave_tip2") }}</span>
        <q-btn class="stop-betting-btn" @click="handleStopBetting">
          {{ $t("ai.stop_betting") }}
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useAIAgentStore } from "src/stores/useAIAgentStore"

const { aiAgentBettingImg } = useSiteImg()
const aiAgentStore = useAIAgentStore()

defineProps<{
  openBettingDialog: boolean
}>()

const emit = defineEmits(["update:openBettingDialog"])

const handleStopBetting = async () => {
  const params = {
    game_type: "LIVE_CASINO",
    product_code: 1149,
    platform: "web",
    currency: "PHP",
    language_code: 1,
    data: {
      status: false,
      agent_configs: [aiAgentStore.currentConfig]
    }
  }
  await aiAgentStore.fetchStopAIAgentBetting(params)
  emit("update:openBettingDialog", false)
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/common/css/AIAgent/theme.scss";
@import "src/common/css/AIAgent/agent.scss";

.betting-dialog-wrapper {
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20vh;
}

.betting-dialog-card {
  @apply rounded-[.75rem];
  background: var(--btn02);
  color: var(--neutral01);
  max-width: 24.375rem;
  width: 80%;
}

.betting-img-container {
  @apply flex flex-col justify-center items-center;
  position: relative;
  overflow: hidden;

  .betting-img {
    @apply block w-[15rem] h-[10rem];
  }

  &::after {
    content: "";
    position: absolute;
    top: -0.3125rem;
    left: 0;
    width: 100%;
    height: 0.125rem;
    background: var(--white-color);
    box-shadow: 0 0 0.125rem var(--white-color), 0 0 0.25rem var(--white-color);
    animation: scan 2.5s infinite linear;
  }
}

@keyframes scan {
  0% {
    top: -0.3125rem;
  }
  100% {
    top: 100%;
  }
}

@keyframes dots {
  0%,
  100% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
}

.betting-img-container span::after {
  content: ".";
  display: inline-block;
  vertical-align: bottom;
  animation: dots 1.5s infinite steps(1, end);
  padding-left: 2px;
}

.stop-betting-btn {
  @apply w-full rounded-[.5rem];
  background: var(--cancel-btn-bg);
  color: var(--white-color);
}
</style>
