<template>
  <div v-if="show" class="ai-agent-content">
    <div class="ai-agent-top">
      <q-img :src="aiFunctionCloseImg" loading="lazy" class="btn-close" @click="show = false"></q-img>
    </div>

    <div class="ai-agent-middle" @click="handleAgentClick">
      <div class="spinner">
        <div class="spinner1"></div>
      </div>
      <q-img :src="aiFunctionAgentImg('agent')" loading="lazy" class="ai-img"></q-img>
    </div>

    <div class="ai-agent-bottom">
      <span class="ai-name">{{ $t("ai.agent") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { envData } = useEnv()
const { isLogin } = useAuth()
const { aiFunctionAgentImg, aiFunctionCloseImg } = useSiteImg()

const eventbus = injectStrict(EventBusKey)
const router = useRouter()
const show = ref(false)

const handleAgentClick = () => {
  if (!isLogin.value) {
    eventbus.emit("openLogin", true)
  } else {
    router.push({ name: "AIAgent" })
  }
}

onMounted(() => {
  const env = envData()
  show.value = env.ai_agent ? true : false
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.ai-agent-content {
  @apply z-[10000];
  width: 5rem;

  @include iphone-width() {
    top: 13.4375rem;
  }

  .ai-agent-top {
    @apply w-full flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-agent-middle {
    @apply relative cursor-pointer flex justify-center;
    width: 4.625rem;
    height: 4.625rem;

    .spinner {
      @apply absolute left-0 top-0 w-[4.625rem] h-[4.625rem];
      @apply text-center rounded-[3.125rem];

      background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
      animation: spinning 1.7s linear infinite;
      filter: blur(1px);
      box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);

      .spinner1 {
        @apply w-[4.625rem] h-[4.625rem] rounded-[3.125rem];
        background-color: rgb(36, 36, 36);
        filter: blur(10px);
      }

      @keyframes spinning {
        to {
          transform: rotate(360deg);
        }
      }
    }

    .ai-img {
      @apply absolute top-1/2 left-1/2;
      transform: translate(-50%, -50%);
      width: 3.21875rem;
    }
  }

  .ai-agent-bottom {
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
    }
  }
}
</style>
