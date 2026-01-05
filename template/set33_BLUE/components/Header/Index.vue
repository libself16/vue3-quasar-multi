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
          <q-btn class="mr-2 !w-auto" rounded color="login" push @click="router.push({ name: 'Login' })">
            {{ $t("common.btn.login") }}
          </q-btn>
          <q-btn class="mr-2 !w-auto" rounded color="register" push @click="router.push({ name: 'Register' })">
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
                {{ userInfo2.nickname || userInfo2.account }}
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

          <!--<Clock timeFormat="MM/DD/YYYY HH:mm:ss" appendText=" (GMT+8)" />-->
        </div>
      </div>
    </div>
    <section class="header-menu">
      <div class="container-fluid">
        <div class="col-12 position-inherit">
          <div class="main-menu">
            <ul class="nav main-nav">
              <!-- home -->
              <li class="nav-item menuimg icon-menu" :class="{ active: route.path === '/' }">
                <router-link class="navlink img-home" to="/">
                  <span><i class="fas fa-home"></i></span>
                </router-link>
              </li>
              <!-- download -->
              <!-- <li class="nav-item menuimg icon-menu" :class="{ active: route.path === '/profile/download' }">
                <router-link class="navlink" :to="{ name: 'download' }">
                  <span>
                    <img :src="menuTabImg('download')" class="img-ivo" alt="" />
                  </span>
                </router-link>
              </li> -->
              <!-- router -->
              <li
                v-for="(cmsItem, cmsIndex) in navigationBarList"
                :key="cmsIndex"
                class="nav-item menuimg"
                :class="{
                  active: isActive(cmsItem.Entrance[0])
                }"
              >
                <div class="navlink" @click="handleEntranceClick(cmsItem.Entrance[0])">
                  <span class="btn-title">{{
                    limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
                  }}</span>
                </div>
              </li>
              <!-- <li class="nav-item" :class="{ active: route.path === '/Vip' }">
                <router-link class="navlink" to="/Vip">
                  <span>VIP</span>
                </router-link>
              </li> -->
            </ul>
          </div>
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
          {{ userInfo2.nickname || userInfo2.account }}
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
              <template v-for="(menuItem, index) in profileList.slice(0, 4)" :key="index">
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
        <template v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin" :key="cmsIndex">
          <q-item clickable v-ripple @click="handleEntranceClick(cmsItem.Entrance[0])">
            <q-item-section avatar>
              <img :src="cmsItem.Setting.icon_path" alt="" />
            </q-item-section>
            <q-item-section>
              {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + cmsIndex" v-if="cmsItem" />
        </template>
        <template v-for="(menuItem, index) in profileList.slice(4)" :key="index">
          <div v-if="isLogin">
            <q-item clickable v-ripple @click="menuLink(menuItem)">
              <q-item-section avatar>
                <div class="custom-icon" :class="`logout`"></div>
              </q-item-section>
              <q-item-section>
                {{ $t(`menu.${menuItem.i18n}`) }}
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set33_BLUE/composables/useCms"
import { useSiteImg } from "app/template/set33_BLUE/hooks/useSiteImg"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../../utils/constants"
import WalletDropdown from "./components/WalletDropdown.vue"
const { getWideLogo } = useLogo()

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { navigationBarList, handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { logoImg, menuTabImg } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { isLogin, handleLogout } = useAuth()
const { userInfo2 } = useUserInfo()
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
  },
  {
    i18n: "logout",
    separator: false
  }
])

const limitWordLength = (word: string) => {
  if (!word) return ""
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

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

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  await handleCmsList(CMS_TYPE.Enums.MENU)
})

// watch(
//   () => route.params.gameType,
//   () => {
//     location.reload()
//   }
// )
</script>

<style lang="sass" scoped>
@import "app/template/set33_BLUE/assets/css/_variable.sass"
@import "app/template/set33_BLUE/assets/css/header.sass"

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
      min-width: 20px
      height: 100%
      font-size: 13px
      text-transform: uppercase
      font-weight: 800
      // .img-ivo
      //   width: 20px

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
  min-height: 50px
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
    display: flex
    align-items: center
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
    margin: 0 3vw

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
        max-height: 80%
        object-fit: contain
        max-width: 40%

.join-button
  +iphone-width
    text-wrap: nowrap
</style>
