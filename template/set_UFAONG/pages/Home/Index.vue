<template>
  <div class="home-wrapper relative">
    <HomeHeader />
    <Banner />
    <!-- <Marquee /> -->
    <div class="login-info">
      <div v-if="!isLogin" class="login-btn" @click="redirectionLoginPage">{{ $t("common.btn.loginAndRegister") }}</div>
      <div v-if="isLogin" class="wallet-info">
        <div @click="redirectionPage('Deposit')" class="deposit-info mr-4">
          <i class="deposit-icon"></i>
          <div class="deposit-text">{{ $t("common.btn.deposit") }}</div>
        </div>
        <div @click="redirectionPage('Withdraw')" class="withdraw-info">
          <i class="withdraw-icon"></i>
          <div class="withdraw-text">{{ $t("common.btn.withdraw") }}</div>
        </div>
      </div>
    </div>
    <GameList :initial-game-type="Number($route.query.gameType)" />
    <AsideMenu />
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import { ref, provide } from "vue"
import HomeHeader from "./HomeHeader.vue"
import Banner from "./Banner.vue"
// import Marquee from "./Marquee.vue"
import GameList from "./GameList.vue"
import AsideMenu from "./AsideMenu.vue"
import { useAuth } from "src/common/hooks/useAuth"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"

const router = useRouter()
const drawerOpen = ref(false)
const { isLogin } = useAuth()

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

provide("drawerOpen", drawerOpen)
provide("toggleDrawer", toggleDrawer)

const redirectionLoginPage = () => {
  router.push({ name: "Login" })
}

const redirectionPage = (link: string) => {
  router.push({ name: link })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.login-info {
  @apply flex w-full max-h-[45px] justify-between px-[10px] mt-3;
}

.login-btn {
  @apply p-[10px] text-black font-bold text-center cursor-pointer;
  border-radius: 1.5625rem;
  width: 40%;
  background: $gradient-to-right;
  white-space: nowrap;
  font-size: 0.9375rem;

  &:hover {
    @apply text-white;
  }
}

.wallet-info {
  @apply flex w-full justify-end items-center cursor-pointer;

  .deposit-info,
  .withdraw-info {
    @apply flex flex-col items-center;
  }

  i {
    @apply flex w-[30px] h-[30px];
    background-repeat: no-repeat;
    background-size: contain;
  }

  .deposit-icon {
    background-image: url("../../assets/images/Home/deposit.png");
  }

  .withdraw-icon {
    background-image: url("../../assets/images/Home/withdraw.png");
  }
}
</style>
