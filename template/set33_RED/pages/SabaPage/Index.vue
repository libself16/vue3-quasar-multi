<template>
  <section class="saba-wrapper">
    <q-btn class="back-btn" @click="goToLobby" no-caps>
      <q-img :src="iconSvg('back-to-lobby')" />
      <p>{{ $t("common.btn.goToLobby") }}</p>
    </q-btn>
    <SabaArea />
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useSiteImg } from "app/template/set33_RED/hooks/useSiteImg"
import SabaArea from "src/common/components/SabaArea/Index.vue"

const { iconSvg } = useSiteImg()
const router = useRouter()

const goToLobby = () => {
  router.push({ name: "ProductLobby", params: { gameType: 3 } })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";

.saba-wrapper {
  @apply flex flex-col max-w-[75rem] mx-auto;

  :deep(.q-btn) {
    @apply my-4 rounded-[.5rem] text-base w-[10rem] h-[3.125rem] text-center;
    @apply flex items-center justify-center;

    :deep(.q-btn__content) {
      @apply flex items-center justify-center;
    }
  }

  .back-btn {
    @apply text-black rounded-full;
    background: linear-gradient(180deg, #72d766 0%, #408837 100%), linear-gradient(180deg, #f5e386 0%, #9c7c24 100%);
    box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.45);
    font-family: Inter;

    :deep(.q-img) {
      @apply w-[1.5rem] h-[1.5rem] mr-2;
    }

    @include pad-large-width {
      @apply ml-2 mt-4;
    }
  }

  :deep(.saba-area) {
    @apply mb-8;
  }

  :deep(.rank-board-wrapper) {
    @apply w-full;
  }
}
</style>
