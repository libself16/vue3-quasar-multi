<template>
  <div v-if="show" class="ai-helper-content">
    <div class="ai-helper-top">
      <q-img :src="svgIcon('close-black')" loading="lazy" class="btn-close" @click="show = false"></q-img>
    </div>

    <div class="ai-helper-middle" @click="handleHelperClick">
      <div class="spinner">
        <div class="spinner1"></div>
      </div>
      <q-img :src="aiIcon('helper')" loading="lazy" class="ai-img"></q-img>
    </div>

    <div class="ai-helper-bottom">
      <span class="ai-name">AI {{ $t("menu.sales_assistant") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { envData } = useEnv()
const eventbus = injectStrict(EventBusKey)
const { svgIcon, aiIcon } = useSiteImg()
const show = ref(false)

function handleHelperClick() {
  eventbus.emit("openAIHelper", true)
}

onMounted(() => {
  const env = envData()
  show.value = env.ai_helper ? true : false
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.ai-helper-content {
  @apply absolute;
  width: 7.25rem;
  z-index: 10000;
  top: calc(100vh - 12.8125rem);
  left: 1rem;

  .ai-helper-top {
    @apply flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-helper-middle {
    @apply relative cursor-pointer flex justify-center;
    width: 7.25rem;
    height: 8.625rem;

    .spinner {
      position: absolute;
      left: 0.5rem;
      bottom: 0;

      background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
      width: 100px;
      height: 100px;
      animation: spinning 1.7s linear infinite;
      text-align: center;
      border-radius: 50px;
      filter: blur(1px);
      box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);

      .spinner1 {
        background-color: rgb(36, 36, 36);
        width: 100px;
        height: 100px;
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
      bottom: 0;
      left: 0;
    }
  }

  .ai-helper-bottom {
    @apply flex justify-center items-center relative z-10;

    .ai-name {
      padding: 0.25rem 0.75rem;
      background: #000;
      border-radius: 62.4375rem;
      font-family: NotoSans;
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 1.1875rem;
      color: #fff;
      white-space: nowrap;
    }
  }
}
</style>
