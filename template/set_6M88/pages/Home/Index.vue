<template>
  <div class="home-layout">
    <HomeHeader />
    <div class="t-body index-bg">
      <Banner />
      <div class="index-box">
        <!-- indexMenu -->
        <div class="index-btm-box">
          <LoginSection />
          <div class="index-link">
            <a @click="onIndexMenuClick(item.name)" v-for="item in indexMenu" :key="item.name">
              <img :src="item.icon" class="link-img" />
              <img :src="result('index/btn-bg.png')" class="link-bg" />
              <span>{{ $t(item.title) }}</span>
            </a>
          </div>
        </div>
      </div>
      <GameList :initial-game-type="Number($route.query.gameType)" />
    </div>
  </div>
  <CurrencySupportDialog />
  <FloatIconCMS />
</template>

<script lang="ts" setup>
import LoginSection from "app/template/set_6M88/pages/Home/components/LoginSection.vue"
import HomeHeader from "app/template/set_6M88/pages/Home/HomeHeader.vue"
import GameList from "app/template/set_6M88/pages/Home/GameList.vue"
import Banner from "app/template/set_6M88/pages/Home/Banner.vue"
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import FloatIconCMS from "app/template/set_6M88/components/FloatIconCMS/Index.vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { onMounted } from "vue"

const router = useRouter()
const { handleCmsList, webInformationTitle, webInformationContent } = useCms()
const { result } = useSiteImg()
const { isLogin } = useAuth()

const indexMenu = [
  {
    icon: result("index/vip.png"),
    title: "menu.vip",
    name: "VIP"
  },
  {
    icon: result("index/deposit.png"),
    title: "common.btn.deposit",
    name: "Deposit"
  },
  {
    icon: result("index/withdraw.png"),
    title: "common.btn.withdraw",
    name: "Withdraw"
  }
  // {
  //   icon: result('index/transfer.png'),
  //   title: "member.bank.BankTransfer",
  //   name: "Transfer"
  // },
]
const onIndexMenuClick = (name: string) => {
  if (!isLogin.value) return router.push({ name: "Login" })
  router.push({ name: name })
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style lang="scss" scoped>
.index-link {
  a {
    max-width: 3.6563rem;
  }
}
</style>
