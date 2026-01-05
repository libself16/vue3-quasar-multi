<template>
  <div v-if="show" class="ai-agent-content">
    <div class="ai-agent-top">
      <q-img :src="svgIcon('close-black')" loading="lazy" class="btn-close" @click="show = false"></q-img>
    </div>

    <div class="ai-agent-middle" @click="handleAgentClick">
      <div class="spinner">
        <div class="spinner1"></div>
      </div>
      <q-img :src="aiAgentImg('agent')" loading="lazy" class="ai-img"></q-img>
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
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { envData } = useEnv()
const { isLogin } = useAuth()
const { svgIcon, aiAgentImg } = useSiteImg()

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
  @apply fixed z-[10000] top-[420px];
  width: 7.25rem;
  left: calc(100vw - 8.25rem);

  .ai-agent-top {
    @apply flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-agent-middle {
    @apply relative cursor-pointer flex justify-center;
    @apply w-[7.25rem] h-[8.625rem];

    .spinner {
      @apply absolute left-[0.5rem] bottom-0 w-[6.25rem] h-[6.25rem];
      @apply text-center rounded-[3.125rem];

      background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
      animation: spinning 1.7s linear infinite;
      filter: blur(1px);
      box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);

      .spinner1 {
        @apply w-[6.25rem] h-[6.25rem] rounded-[3.125rem];
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
      @apply absolute bottom-0 left-0;
    }
  }

  .ai-agent-bottom {
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
    }
  }
}
</style>
