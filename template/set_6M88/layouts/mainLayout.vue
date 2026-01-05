<template>
  <main class="app-layout" v-if="isReady">
    <div class="app-container">
      <section class="router-view-container">
        <router-view />
      </section>
      <NavBar />
    </div>
    <ClaimGift />
    <GS1MiniGame />
  </main>
  <LaunchGameDialog />
  <LiveChat />
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import NavBar from "../components/NavBar/Index.vue"
import { useInit } from "src/common/composables/useInit"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import ClaimGift from "src/common/components/ClaimGift/Index.vue"

const { isReady, initialize } = useInit()

onMounted(async () => {
  await initialize()
})
</script>

<style lang="scss">
@import "../assets/css/variable.scss";
@import "../assets/css/style.css";

.app-layout {
  @apply flex flex-col min-h-screen;
  font-family: "Montserrat", sans-serif;
  background-color: $dark-bg;
  color: $color-white;
  font-size: 0.8125rem;
}

.app-container {
  @apply flex flex-col flex-1 w-full m-auto relative;
  max-width: $main-width;
}

.router-view-container {
  @apply overflow-y-auto;
  height: calc(100vh - 55px);

  scrollbar-color: $scroll-color transparent;

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $scroll-color;
    border-radius: 0.1875rem;
  }
}
</style>
