<template>
  <!-- <div v-if="isAIAllShow" class="ai-all-area" v-draggable> -->
  <!-- 暫時全部正式版都不要有 AI Icon -->
  <div v-if="false" class="ai-all-area" v-draggable>
    <div class="ai-helper-top">
      <q-img :src="aiFunctionCloseImg" loading="lazy" class="btn-close" @click="handleCloseAiIcon()" />
    </div>

    <div class="ai-helper-middle" @click="openContent = !openContent">
      <q-img :src="aiFunctionAgentImg('ai-all')" loading="lazy" class="ai-img" />
    </div>

    <div v-if="aiIconStatus" class="ai-all-content" :style="{ backgroundColor: bgColor }">
      <!-- AI Helper -->
      <div v-if="isAIHelperShow" class="ai-helper-content">
        <div class="ai-helper-top">
          <q-img :src="aiFunctionCloseImg" loading="lazy" class="btn-close" @click="closeAIHelper"></q-img>
        </div>
        <div class="ai-helper-middle" @click="isAIHelperIframeShow = !isAIHelperIframeShow">
          <div class="spinner">
            <div class="spinner1"></div>
          </div>
          <q-img :src="aiFunctionHelperImg" loading="lazy" class="ai-img"></q-img>
          <div v-show="!!isAIHelperNewMessage" class="ai-helper-new-message">
            {{ isAIHelperNewMessage }}
          </div>
        </div>
        <div class="ai-helper-bottom">
          <span class="ai-name">{{ $t("menu.sales_assistant") }}</span>
        </div>
      </div>

      <AIAgent />

      <!-- AI Fans -->
      <div v-if="isAIFansShow" class="ai-helper-content">
        <div class="ai-helper-top">
          <q-img :src="aiFunctionCloseImg" loading="lazy" class="btn-close" @click="closeAIFans"></q-img>
        </div>
        <div class="ai-helper-middle" @click="isAIFansIframeShow = !isAIFansIframeShow">
          <div class="spinner">
            <div class="spinner1"></div>
          </div>
          <q-img :src="aiFunctionFansImg" loading="lazy" class="ai-img"></q-img>
        </div>
        <div class="ai-helper-bottom">
          <span class="ai-name">AI Fans</span>
        </div>
      </div>

      <!-- AI RPG -->
      <div v-if="isAIRpgShow" class="ai-helper-content">
        <div class="ai-helper-top">
          <q-img :src="aiFunctionCloseImg" loading="lazy" class="btn-close" @click="closeAIRpg"></q-img>
        </div>
        <div class="ai-helper-middle" @click="isAIRpgIframeShow = !isAIRpgIframeShow">
          <div class="spinner">
            <div class="spinner1"></div>
          </div>
          <q-img :src="aiFunctionRpgImg" loading="lazy" class="ai-img"></q-img>
        </div>
        <div class="ai-helper-bottom">
          <span class="ai-name">AI RPG</span>
        </div>
      </div>
    </div>
  </div>

  <AIHelper :account="account" />
  <AIFans :account="account" />
  <AIRpg />
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import AIRpg from "./Rpg.vue"
import AIFans from "./Fans.vue"
import AIAgent from "./Agent.vue"
import AIHelper from "./Helper.vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useAIHelperStore } from "src/stores/aiHelperStore"
import { useAIRpgEvent } from "src/common/hooks/useAIRpgEvent"
import { useAIFansEvent } from "src/common/hooks/useAIFansEvent"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"

const { envData } = useEnv()
const { aiFunctionHelperImg, aiFunctionCloseImg, aiFunctionRpgImg, aiFunctionFansImg, aiFunctionAgentImg } =
  useSiteImg()
const aiHelperStore = useAIHelperStore()
const { isAIHelperShow, isAIHelperIframeShow, isAIHelperNewMessage, closeAIHelper } = useAIHelperEvent()
const { isAIRpgShow, isAIRpgIframeShow, closeAIRpg } = useAIRpgEvent()
const { isAIFansShow, isAIFansIframeShow, closeAIFans } = useAIFansEvent()

const props = defineProps({
  account: {
    type: String,
    required: true,
    default: ""
  },
  bgColor: {
    type: String,
    default: "#fff"
  }
})

const closeAiIcon = ref(false)
const openContent = ref(false)

const isAIAllShow = computed(() => {
  if (closeAiIcon.value) return false

  const env = envData()

  return isAIHelperShow.value || env.ai_agent
})

const aiIconStatus = computed(() => {
  return openContent.value && !isAIHelperIframeShow.value && !isAIRpgIframeShow.value && !isAIFansIframeShow.value
})

const handleCloseAiIcon = () => {
  closeAiIcon.value = true
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.ai-all-area {
  width: 5rem;
  z-index: 10000;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // 預設位置（如果沒有保存的位置）
  &:not([style*="left"]) {
    bottom: 20%;
    left: calc(100vw - 6rem);
  }

  .ai-helper-top {
    @apply w-full flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-helper-middle {
    @apply relative cursor-pointer flex justify-center;
    width: 4.375rem;
    height: 4.375rem;

    .ai-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }

    .ai-helper-new-message {
      position: absolute;
      top: 0.3125rem;
      right: 0;
      width: 0.7rem;
      height: 0.7rem;
      background-color: #ff0000;
      border-radius: 50%;
      z-index: 11;
      color: #fff;
      font-size: 12px;
      width: 20px;
      height: 20px;
      text-align: center;
    }
  }

  .ai-all-content {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    border-radius: 0.625rem;
    padding: 0.625rem;
    position: absolute;
    bottom: -6rem;
    right: 5.5rem;
    box-shadow: 0px 0px 10px 0px #ffffff99;

    &::after {
      content: "";
      position: absolute;
      right: -0.2625rem;
      bottom: 20%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 0.3rem solid transparent;
      border-bottom: 0.3rem solid transparent;
      border-left: 0.3625rem solid v-bind(bgColor);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      z-index: 1;
    }

    .ai-helper-content {
      @apply flex flex-col justify-center items-center;
      width: 5rem;
      z-index: 10000;

      .ai-helper-top {
        @apply w-full flex justify-end items-center;
        .btn-close {
          @apply w-6 h-6 cursor-pointer;
        }
      }

      .ai-helper-middle {
        @apply relative cursor-pointer flex justify-center;
        width: 4.625rem;
        height: 4.625rem;

        .spinner {
          position: absolute;
          left: 0;
          top: 0;

          background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
          width: 4.625rem;
          height: 4.625rem;
          animation: spinning 1.7s linear infinite;
          text-align: center;
          border-radius: 50px;
          filter: blur(1px);
          box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);

          .spinner1 {
            background-color: rgb(36, 36, 36);
            width: 4.625rem;
            height: 4.625rem;
            border-radius: 50px;
            filter: blur(10px);
          }

          @keyframes spinning {
            to {
              transform: rotate(360deg);
            }
          }
        }

        .ai-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3.21875rem;
        }
      }

      .ai-helper-bottom {
        @apply flex justify-center items-center relative z-10;
        margin-top: 0.4375rem;

        .ai-name {
          padding: 0.125rem 0.375rem;
          background: #000;
          border-radius: 62.4375rem;
          font-family: NotoSans;
          font-weight: 700;
          font-size: 0.75rem;
          line-height: 1.1875rem;
          color: #fff;
          white-space: nowrap;
        }
      }

      &.active {
        visibility: hidden;
      }
    }
  }
}
</style>
