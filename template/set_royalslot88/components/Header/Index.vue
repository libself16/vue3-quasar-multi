<template>
  <div>
    <q-header elevated class="header-wrapper">
      <BasicHeader @open-side-menu="openSideMenu" />
    </q-header>
    <MobileHeaderNav />
    <SideMenuDialog :is-open="isSideMenuOpen" @update:is-open="isSideMenuOpen = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import BasicHeader from "./components/BasicHeader.vue"
import MobileHeaderNav from "./components/MobileHeaderNav.vue"
import SideMenuDialog from "./components/SideMenuDialog.vue"

const isSideMenuOpen = ref(false)

const openSideMenu = () => {
  isSideMenuOpen.value = true
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.header-wrapper {
  @apply flex flex-col top-0 z-10 h-[8.4vw] w-full text-white fixed;
  @apply bg-cover md:bg-contain;
  background-color: rgb(0, 0, 0) !important;
  background-image: url(../../assets/images/header/top-bg.png);
  background-position: center center;
  background-repeat: no-repeat;
  filter: drop-shadow(rgb(0, 0, 0) 0rem 0.8125rem 0.625rem);

  @include pad-width {
    @apply h-[16vw];
  }
}

@media (orientation: landscape) {
  @include pad-width {
    .header-wrapper {
      height: 8vw;
    }
  }
}
</style>
