<template>
  <q-header class="flex flex-row items-center justify-between header">
    <div class="items-center mx-auto row global-row">
      <img class="cursor-pointer logo" :src="getWideLogo()" alt="logo" @click="router.push({ name: 'HomePage' })" />
      <!-- <q-img
        class="cursor-pointer"
        :src="logoImg"
        alt="logo"
        spinner-color="white"
        loading="lazy"
        style="max-width: 20vw; height: 100px"
        no-native-menu
        no-spinner
        @click="router.push({ name: 'HomePage' })"
      /> -->
      <q-space />
      <div class="flex toolbar column">
        <div class="flex items-center justify-end mb-1 toolbarTop" v-if="!isLogin">
          <q-btn class="mr-2" rounded color="login" push @click="router.push({ name: 'Login' })">
            {{ $t("common.btn.login") }}
          </q-btn>
          <q-btn class="mr-2 join-button" rounded color="register" push @click="router.push({ name: 'Register' })">
            {{ $t("common.btn.join") }}
          </q-btn>
          <LanguageDropdown class="language-bar" btnSize="md" />
          <q-btn class="mobile-menu-btn" flat @click="drawer = !drawer" round dense icon="menu" />
        </div>
        <div class="flex items-center justify-end mb-1 toolbarTop" v-else>
          <div class="flex items-center self-center user-wallet">
            <div class="user-info-bar">
              <span class="px-1 log-group" @click="$router.push({ name: 'ProfileInbox' })">
                <i class="far fa-envelope msg_head"></i>
              </span>
              <span class="px-1"><i class="fas fa-ellipsis-v three_dot"></i></span>
              <span class="normal-case no-ripple">{{ $t("home.welcome") }}</span>
              <q-btn
                flat
                :ripple="false"
                class="px-1 font-bold normal-case user-name text-yellow no-ripple"
                @click="$router.push({ name: 'ProfileDetail' })"
              >
                {{ userInfo.nickname || userInfo.username }}
              </q-btn>
            </div>
            <WalletDropdown />
          </div>
          <div class="login-toolbar">
            <q-btn class="mr-2 text-xs" rounded color="login" push @click="router.push({ name: 'MemberDeposit' })">{{
              $t("menu.deposit")
            }}</q-btn>
            <q-btn class="mr-2 text-xs" rounded color="login" push @click="router.push({ name: 'ProfileDetail' })">{{
              $t("menu.profile")
            }}</q-btn>
            <q-btn class="mr-2 text-xs" rounded color="register" push @click="logout()">{{
              $t("common.btn.logout")
            }}</q-btn>
            <LanguageDropdown class="language-bar" btnSize="md" />
          </div>
          <q-btn class="mobile-menu-btn" flat @click="drawer = !drawer" round dense icon="menu" />
        </div>
        <div class="flex toolbarBottom" :class="{ 'justify-end': !isLogin, 'justify-start': isLogin }">
          <span class="mr-2 text-grey-5" v-if="!isLogin">
            {{ $t("home.forgot") }}
            <a @click="router.push({ name: 'ForgotPass' })" class="text-white underline cursor-pointer"
              >{{ $t("home.password") }}？</a
            >
          </span>

          <Clock timeFormat="MM/DD/YYYY HH:mm:ss" appendText=" (GMT+8)" />
        </div>
      </div>
    </div>
    <section class="header-menu">
      <div class="mx-auto my-0 container-fluid">
        <div class="main-menu">
          <ul class="nav main-nav">
            <!-- home -->
            <li class="nav-item menuimg" :class="{ active: route.path === '/' }">
              <router-link class="navlink img-home" to="/">
                <span><i class="fas fa-home"></i></span>
              </router-link>
            </li>
            <!-- download -->
            <li class="nav-item menuimg" :class="{ active: route.path === '/AppDownload' }">
              <router-link class="navlink" to="/AppDownload">
                <span>
                  <img :src="menuTabImg('download')" class="img-ivo" alt="" />
                </span>
              </router-link>
            </li>
            <!-- router -->
            <li
              v-for="item in gameTypeState.list"
              :key="item.game_type"
              class="nav-item"
              :class="{
                active: route.params.gameType as any as GAME_TYPE.Enums == item.id
              }"
            >
              <router-link
                class="navlink"
                :to="{
                  name: 'ProductLobby',
                  params: { gameType: item.id }
                }"
              >
                <span>{{ $t(`menu.${item.frontendKey}`) }}</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: route.path === '/Promotion' }">
              <router-link class="navlink" to="/Promotion">
                <span>{{ $t("menu.promotion") }}</span>
              </router-link>
            </li>
            <!-- <li class="nav-item" :class="{ active: route.path === '/Vip' }">
              <router-link class="navlink" to="/Vip">
                <span>VIP</span>
              </router-link>
            </li> -->
          </ul>
        </div>
      </div>
    </section>
  </q-header>
  <!-- nav -->
  <!-- <div v-if="drawer" class="fullscreen"></div> -->
  <q-drawer
    v-model="drawer"
    :show-overlay="true"
    overlay-color="rgba(0, 0, 0, 0.5)"
    overlay
    side="right"
    :width="320"
    :breakpoint="1200"
    class="text-white drawer-bar bg-dark pb-32 sm:pb-44"
  >
    <q-scroll-area class="fit">
      <div class="px-4 py-2 user-info-bar">
        <span v-if="isLogin" class="normal-case no-ripple">{{ $t("home.welcome") }}</span>
        <q-btn
          v-if="isLogin"
          flat
          :ripple="false"
          class="px-1 font-bold normal-case user-name text-yellow no-ripple"
          @click="$router.push({ name: 'ProfileDetail' })"
        >
          {{ userInfo.nickname || userInfo.username }}
        </q-btn>
        <LanguageDropdown class="m-language" btnSize="md" />
      </div>
      <q-list>
        <q-expansion-item v-if="isLogin" expand-separator icon="wallet" :label="$t('menu.myWallet')">
          <q-card>
            <q-list class="text-white bg-dark">
              <template v-for="(menuItem, index) in walletList" :key="index">
                <q-item clickable v-ripple @click="menuLink(menuItem)">
                  <q-item-section avatar> </q-item-section>
                  <q-item-section>
                    {{ $t(`menu.${menuItem.i18n}`) }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card>
        </q-expansion-item>
        <q-expansion-item v-if="isLogin" expand-separator icon="person" :label="$t('menu.myProfile')">
          <q-card>
            <q-list class="text-white bg-dark">
              <template v-for="(menuItem, index) in profileList" :key="index">
                <q-item clickable v-ripple @click="menuLink(menuItem)">
                  <q-item-section avatar> </q-item-section>
                  <q-item-section>
                    {{ $t(`menu.${menuItem.i18n}`) }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card>
        </q-expansion-item>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item clickable v-ripple v-if="!menuItem.isLogin || isLogin" @click="menuLink(menuItem)">
            <q-item-section avatar>
              <div class="custom-icon" :class="`${menuItem.icon}`"></div>
            </q-item-section>
            <q-item-section>
              {{ $t(`menu.${menuItem.i18n}`) }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
import Clock from "src/common/components/Clock.vue"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { GAME_TYPE } from "src/common/utils/constants"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import WalletDropdown from "./components/WalletDropdown.vue"
const { getWideLogo } = useLogo()

const { logoImg, menuTabImg } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { isLogin, handleLogout } = useAuth()
const { userInfo } = useUserInfo()
const { gameTypeState } = useGame()

const drawer = ref(false)

const walletList = ref([
  {
    i18n: "deposit",
    router: "MemberDeposit",
    separator: false
  },
  {
    i18n: "withdrawal",
    router: "MemberWithdrawal",
    separator: false
  }
])

const profileList = ref([
  {
    i18n: "profile",
    router: "ProfileDetail",
    separator: false
  },
  {
    i18n: "bankDetail",
    router: "ProfileBank",
    separator: false
  },
  {
    i18n: "changePassword",
    router: "ProfilePassword",
    separator: false
  },
  {
    i18n: "inbox",
    router: "ProfileInbox",
    separator: false
  }
])

const menuList = ref([
  {
    icon: "history",
    i18n: "history",
    router: "MemberHistory",
    isLogin: true,
    separator: false
  },
  {
    icon: "order",
    i18n: "order",
    router: "MemberOrder",
    isLogin: true,
    separator: false
  },
  {
    icon: "home",
    i18n: "home",
    router: "HomePage",
    isLogin: false,
    separator: false
  },
  {
    icon: "slots",
    i18n: "slots",
    router: "ProductLobby",
    isLogin: false,
    gameType: "1",
    separator: false
  },
  {
    icon: "fishing",
    i18n: "fishing",
    router: "ProductLobby",
    isLogin: false,
    gameType: "8",
    separator: false
  },
  {
    icon: "poker",
    i18n: "poker",
    router: "ProductLobby",
    isLogin: false,
    gameType: "12",
    separator: false
  },
  {
    icon: "promotion",
    i18n: "promotion",
    router: "Promotion",
    isLogin: false,
    separator: false
  },
  // {
  //   icon: "vip",
  //   i18n: "vip",
  //   router: "Vip",
  //   isLogin: false,
  //   separator: false
  // },
  {
    icon: "logout",
    i18n: "logout",
    isLogin: true,
    separator: false
  }
])

const menuLink = (menuInfo: any) => {
  if (menuInfo.i18n === "logout") logout()
  else {
    switch (menuInfo.router) {
      case "ProductLobby":
        router.push({ name: "ProductLobby", params: { gameType: menuInfo.gameType } })
        // location.reload()
        break
      default:
        router.push({ name: menuInfo.router })
        break
    }
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "Login" })
}

// watch(
//   () => route.params.gameType,
//   () => {
//     location.reload()
//   }
// )
</script>

<style lang="sass" scoped>
@import "app/template/set33/assets/css/_variable.sass"
@import "app/template/set33/assets/css/header.sass"

section.header-menu
  width: 100%
  position: relative
  box-shadow: 2px 4px 20px #000000ba
  background: linear-gradient(to bottom, #10b7f3 0%, #0c70aa 33%, #085d8f 100%)
  +pad-width
    display: none
  .main-menu
    padding: 0 0px
.container-fluid
  padding: 0
  max-width: 1366px
  margin: 0 auto
.main-nav
  display: inline-flex
  height: 47px
  align-items: center
  justify-content: center

  li.nav-item
    width: auto
    height: 47px
    display: flex
    //justify-content: center
    align-items: center
    border-bottom: 2px solid #ffcd0000
    &.icon-menu
      width: 80px
      +pc-width
        width: 70px

    span
      width: 100%
      height: 100%
      display: flex
      justify-content: center
      align-items: center
      padding: 0 20px

    &:hover, &.active
      background: #00000030
      border-bottom: 2px solid #ffcd00
      color: #ffcd00

    .navlink
      color: #fff
      display: flex
      justify-content: center
      align-items: center
      cursor: pointer
      width: 100%
      height: 100%
      font-size: 13px
      text-transform: uppercase
      font-weight: 800


    &:hover a.navlink
      color: #ffcd00

    &.menuimg a.navlink img
      height: 25px

.img-home i
  font-size: 24px

.main-nav li.nav-item
  &:hover, &.active
    color: #ffcd00

.q-drawer-container
  :deep(.q-drawer)
    top: 0px !important

.mobile-menu-btn
  display: none
  :deep(.q-icon)
    font-size: 2rem
  +pad-width
    display: block
  +phone-width
    display: block
.language-bar
  display: inline-block
  +pad-width
    display: none
.user-info-bar
  // width: 100%
  min-height: 40px
  position: relative
  .m-language
    position: absolute
    top: 0.3rem
    right: 0.5rem
.toolbarTop
  span
    height: 2rem
    line-height: 2rem
  .user-info-bar
    display: block
    .log-group
      cursor: pointer
      position: relative
      color: #f0ce62
    +pad-width
      display: none
  .login-toolbar
    display: block
    +pad-width
      display: none
    +phone-width
      display: none
  +pc-width
    margin: 0 2vw
  +pad-width
    margin: 0 0
  +phone-width
    margin: 0 4vw
.toolbarBottom
  +pc-width
    display: none

.logo
  width: auto
  height: auto
  max-height: 80px

.q-header
  div
    +iphone-width
      height: inherit
    img
      +iphone-width
        position: absolute
        max-height: 95%
        max-width: 45%
        object-fit: contain

.join-button
  +iphone-width
    text-wrap: nowrap
</style>
