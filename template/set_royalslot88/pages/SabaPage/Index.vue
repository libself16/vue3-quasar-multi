<template>
  <section class="saba-wrapper">
    <q-btn class="back-btn" @click="goToLobby" no-caps>
      <q-img :src="svgIcon('back-to-lobby')" />
      <p>{{ $t("common.btn.goToLobby") }}</p>
    </q-btn>
    <SabaArea />
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import SabaArea from "src/common/components/SabaArea/Index.vue"

const { svgIcon } = useSiteImg()
const router = useRouter()

const goToLobby = () => {
  router.push({ name: "ProductLobby", params: { gameType: 3 } })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.saba-wrapper {
  @apply flex flex-col max-w-[75rem] mx-auto pt-[10rem];

  @include pad-large-width {
    @apply py-[12rem];
  }

  @include iphone-width {
    @apply py-[3rem];
  }

  :deep(.q-btn) {
    @apply my-4 rounded-[.5rem] text-base w-[10rem] h-[3.125rem] text-center;
    @apply flex items-center justify-center;

    :deep(.q-btn__content) {
      @apply flex items-center justify-center;
    }
  }

  .back-btn {
    @apply rounded-full text-base text-center;
    border: 0.0625rem solid #5831d7;
    background: #148da2;
    box-shadow: 0 0.25rem 0.25rem 0 rgba(255, 255, 255, 0.3) inset, 0 -4px 4px 0 rgba(0, 0, 0, 0.4) inset;
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
}
</style>
