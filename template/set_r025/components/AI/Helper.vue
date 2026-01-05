<template>
  <template v-if="isAIHelperShow">
    <div class="ai-helper-content" :class="{ active: isAIHelperIframeShow }" v-draggable>
      <div class="ai-helper-top">
        <q-img :src="svgIcon('close-black')" loading="lazy" class="btn-close" @click="closeAIHelper"></q-img>
      </div>
      <div class="ai-helper-middle" @click="isAIHelperIframeShow = !isAIHelperIframeShow">
        <div class="spinner">
          <div class="spinner1"></div>
        </div>
        <q-img :src="aiIcon('helper2')" loading="lazy" class="ai-img"></q-img>
        <div v-show="!!isAIHelperNewMessage" class="ai-helper-new-message">
          {{ isAIHelperNewMessage }}
        </div>
      </div>
      <div class="ai-helper-bottom">
        <span class="ai-name">AI {{ $t("menu.sales_assistant") }}</span>
      </div>
    </div>
    <div class="iframe-content" :class="{ active: isAIHelperIframeShow }">
      <q-btn class="absolute top-7 right-2" flat rounded size="lg" @click="isAIHelperIframeShow = false">X</q-btn>
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        ref="aiHelperIframeRef"
        allow="camera; microphone"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
      ></iframe>
    </div>
  </template>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { svgIcon, aiIcon } = useSiteImg()
const {
  iframeOrigin,
  iframeUrl,
  isAIHelperShow,
  isAIHelperIframeShow,
  aiHelperIframeRef,
  isAIHelperNewMessage,
  closeAIHelper
} = useAIHelperEvent()
const { userInfo2 } = useUserInfo()

watch(
  () => userInfo2.value?.account,
  (newVal: string) => {
    iframeUrl.value = `https://cs.aimate.am/widget/assistant.html?user_id=f6e6a2c3-63aa-4328-8576-c3c2930bc280?player_id=${newVal}`
  }
)

onMounted(() => {
  iframeOrigin.value = "https://cs.aimate.am"

  if (userInfo2.value?.account) {
    iframeUrl.value = `https://cs.aimate.am/widget/assistant.html?user_id=f6e6a2c3-63aa-4328-8576-c3c2930bc280?player_id=${userInfo2.value.account}`
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.ai-helper-content {
  @apply fixed flex flex-col justify-center items-center;
  width: 5rem;
  z-index: 10000;
  top: 9.375rem;
  left: calc(100vw - 6rem);

  @include iphone-width() {
    top: 5rem;
  }

  .ai-helper-top {
    @apply w-full flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-helper-middle {
    @apply relative cursor-pointer flex justify-center relative;
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

  .ai-helper-bottom {
    @apply flex justify-center items-center z-10;
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

.iframe-content {
  @apply fixed;
  width: 30.1875rem;
  height: 37.5rem;
  max-width: 90vw;
  max-height: 81vh !important;
  z-index: 10001;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  transition: transform 0.3s ease;

  &.active {
    transform: translate(0%, -50%);
  }

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
