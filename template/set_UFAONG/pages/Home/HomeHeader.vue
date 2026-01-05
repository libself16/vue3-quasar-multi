<template>
  <div class="home-header">
    <div class="aside-menu" @click="toggleDrawer"></div>
    <div class="logo-container">
      <img v-if="logoSrc" :src="logoSrc" alt="logo" class="logo" />
    </div>
    <div class="flex items-center">
      <WalletDropdown v-if="isLogin" />
      <LanguageDropdown btnSize="md" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted } from "vue"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { useLogo } from "src/common/composables/useLogo"
import WalletDropdown from "./WalletDropdown.vue"
import { useAuth } from "src/common/hooks/useAuth"

const { getWideLogo, handleLogoList } = useLogo()
const { isLogin } = useAuth()

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})

const toggleDrawer = inject("toggleDrawer") as () => void

onMounted(async () => {
  await handleLogoList()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.home-header {
  @apply flex w-full h-[50px] items-center justify-between;
  @apply sticky top-0 z-10 px-[5px];
  background: $dark-bg;

  .aside-menu {
    @apply w-[30px] h-[30px] cursor-pointer;
    background-image: url("../../assets/images/Header/aside-menu-icon.png");
    background-repeat: no-repeat;
    background-size: contain;
  }

  .logo-container {
    @apply flex justify-center items-center absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo {
    @apply w-full h-auto max-w-[200px] max-h-[40px];
    object-fit: contain;
    object-position: center;
  }
}
</style>
