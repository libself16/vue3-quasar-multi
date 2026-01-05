<template>
  <main class="app-layout">
    <div class="app-container">
      <HeaderArea />
      <section class="router-view-container">
        <router-view />
      </section>
      <NavBar />
    </div>
  </main>
  <LiveChat />
</template>

<script lang="ts" setup>
import HeaderArea from "../components/Header/Index.vue"
import NavBar from "../components/NavBar/Index.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
</script>

<style lang="scss" scoped>
@import "../assets/css/variable.scss";

.app-layout {
  @apply flex flex-col min-h-screen;
  font-family: "Poppins", sans-serif;
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
