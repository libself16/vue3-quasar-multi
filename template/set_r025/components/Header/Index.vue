<template>
  <div class="header" :class="route.name">
    <div class="header-left">
      <HamburgerBox :show="true" @click="emit('update:modelValue', true)" />
      <div class="outer_logo" :class="{ isClose: !modelValue }" @click="$router.push('/')" v-if="!isMobile">
        <img v-if="getWideLogo()" class="outer_logo_img" :src="getWideLogo()" />
      </div>
      <q-btn flat fab-mini class="h5_logo" @click="$router.push('/')">
        <img v-if="getWideLogo()" class="h5_logo" :src="getWideLogo()" />
      </q-btn>
    </div>
    <div class="header-center">
      <ul class="nav-bar" ref="navBarRef" @wheel="onWheelScroll">
        <li
          v-for="(cmsItem, cmsIndex) in navigationBarList"
          :key="cmsIndex"
          class="nav-item menuimg"
          :class="{
            active: isActive(cmsItem.Entrance[0])
          }"
        >
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            <span class="btn-title">{{
              limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
            }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="nav header-right">
      <ul>
        <li v-if="isLogin">
          <WalletDropdown />
        </li>
        <li>
          <div v-if="isLogin && isCash" @click="$router.push({ name: 'MemberDeposit' })" class="deposit-btn">
            <span>{{ $t("common.btn.deposit") }}</span>
          </div>
          <div
            v-if="!isMobile && isLogin && isCash"
            @click="$router.push({ name: 'MemberWithdrawal' })"
            class="wallet-btn"
          >
            <div class="wallet-icon"></div>
            <span>{{ $t("common.btn.wallet") }}</span>
          </div>
          <div v-if="isLogin" class="user-info">
            <div class="user-wrapper">
              <q-btn
                flat
                :ripple="false"
                class="px-1 user-name normal-case font-bold no-ripple"
                :class="route.name"
                @click="$router.push({ name: 'memberProfileDetail' })"
              >
                {{ userInfo2.account || userInfo2.nickname }}
              </q-btn>
              <div class="logout-modal">
                <div @click="logout" class="dropdown-item">{{ $t("menu.logout2") }}</div>
              </div>
            </div>
            <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'memberInbox' })">
              <q-icon name="mail" class=""></q-icon>
            </q-btn>
          </div>
          <q-btn
            v-if="!isLogin"
            class="loginBtn"
            color="primary"
            @click="showLogin($q.platform.is.mobile ? true : false)"
          >
            <template v-if="isCash">
              {{ $t("common.btn.loginAndRegister") }}
            </template>
            <template v-else>
              {{ $t("common.btn.login") }}
            </template>
          </q-btn>
          <LanguageDropdown class="language-bar" btnSize="md" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r025/composables/useCms"
import HamburgerBox from "./components/HamburgerBox.vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "../../utils/constants"
import { useWindowSize } from "@vueuse/core"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import WalletDropdown from "./components/WalletDropdown.vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"

const eventbus = injectStrict(EventBusKey)

function showLogin(forcePasswordLogin = false) {
  eventbus.emit("openLogin", true, forcePasswordLogin)
}

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { userInfo2 } = useUserInfo()
const { navigationBarList, handleCmsList } = useCms()
const router = useRouter()
const route = useRoute()
const { getWideLogo } = useLogo()
const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])
const { isLogin, handleLogout, isLoading } = useAuth()
const { isCash } = useEnv()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const { handleWheelScroll } = useCommon()

const { width } = useWindowSize()
let isMobile = ref(false)
const navBarRef = ref<HTMLElement>()

const onWheelScroll = (event: WheelEvent) => {
  if (navBarRef.value) {
    handleWheelScroll(event, navBarRef.value)
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
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

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 769) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r025/assets/css/_variable.sass"
@import "app/template/set_r025/assets/css/button.scss"

@keyframes okbetNiceMove
  0%
    left: 0px
  20%
    left: 110%
  100%
    left: 110%


// common
.menuft
  border-radius: 12px !important
  margin-left: 40px
  height: 40px
  display: flex
  -webkit-box-align: center
  align-items: center
  font-style: normal
  font-weight: 700
  font-size: 16px
  line-height: 12px
  padding: 0px 10px
  color: $neutral-01 !important
  background: $secondary-card-secondary
  backdrop-filter: blur(3px)
  min-width: 0px
  white-space: nowrap
.loginBtn
  &.q-btn
    @apply mx-5
    position: relative
    border-radius: 50px
    font-family: OpenSans
    font-weight: 510
    font-size: 16px
    line-height: 19px
    color: $text-light-color
    width: 220px
    height: 30px
    display: flex
    -webkit-box-align: center
    align-items: center
    padding: 0px
    background: $primary-color
    box-shadow: transparent 0px 4px 5px 0px
    overflow: hidden
    +iphone-width
      @apply mx-0 mr-0 whitespace-nowrap px-4
      font-size: .75rem
      width: auto
      min-width: 4rem
    &::before
      content: ""
      border-radius: 0px
      background-color: rgba($background-light-color, 0.8)
      height: 100%
      width: 3em
      display: block
      position: absolute
      top: 0px
      left: -4.5em
      transform: skewX(-45deg) translateX(0px)
      transition: none 0s ease 0s
      animation: 2s ease-out 1s infinite normal none running okbetNiceMove
.language-bar
  margin-right: .5rem
// base layout
.header
  z-index: 99
  width: 100%
  position: absolute
  top: 0
  display: flex
  align-items: center
  justify-content: space-between
  flex-direction: row
  height: 78px
  box-shadow: rgba($box-shadow-dark-color, 0.05) 2px 0px 14px, rgba($box-shadow-dark-color, 0.05) 0px 2px 14px
  background: $background-header
  backdrop-filter: blur(8px)
  transition: background 0.26s ease 0s
  +phone-width
    position: fixed
    height: 55px
  &.home
    position: absolute
    background: rgba($background-light-color, 0.05)
    +phone-width
      position: fixed
      background: $background-header
  .header-left
    display: flex
    justify-content: flex-start
    align-items: center
    +iphone-width
      height: 100%
    .outer_logo
      @apply w-auto min-w-[4.375rem] h-[4.375rem] max-w-[8.75rem] cursor-pointer z-10
      margin: 0 1vw
      transition: left 0.26s ease 0s
      display: flex
      .outer_logo_img
        @apply h-auto w-auto max-w-full max-h-full
        object-fit: contain
      :deep(.q-btn__content)
        justify-content: flex-start
      &.isClose
        left: 3.75rem
    .h5_logo
      @apply object-contain
      width: 100%
      height: auto
      max-height: 3rem
      padding: 0
      display: none
      +phone-width
        display: block
        margin-right: .25rem
      :deep(.q-btn__content)
        justify-content: flex-start
  .header-center
    height: 100%
    flex: 2
    overflow: hidden
    min-width: 0
    +phone-width
      display: none
    .nav-bar
      height: 100%
      display: flex
      justify-content: flex-start
      align-items: center
      overflow-x: auto
      li
        line-height: 100%
        height: 100%
        cursor: pointer
        position: relative
        margin: 0px 22px
        font-family: OpenSans
        font-weight: 700
        font-size: 1.125rem
        user-select: none
        color: $neutral-01
        white-space: nowrap
        display: flex
        align-items: center
        &.active
          color: $primany-02
          font-weight: 500
          text-shadow: 0px 0px 14px $primany-01
          filter: drop-shadow(0 0 10px $primany-01)
          &::before
            position: absolute
            background: $primany-02
            bottom: 0px
            content: ""
            height: 3px
            width: 100%
        .navlink
          display: flex
          align-items: center
          height: 100%
      // nav-bar滾動條樣式
      &::-webkit-scrollbar
        height: 4px

      &::-webkit-scrollbar-track
        background: transparent

      &::-webkit-scrollbar-thumb
        background: transparent
        border-radius: 2px
        &:hover
          background: transparent
  .header-right
    margin-right: 10px
    flex: 1
    display: flex
    justify-content: flex-end
    +iphone-width
      margin-right: 0px
  +pad-width
    width: 100%
  .menu-icon
    margin: 0 1vw
    width: 3vw
    cursor: pointer
  ::v-deep(.menu-icon)
    margin: 0
  .logo
    display: flex
    cursor: pointer
    img
      width: 6vw
      +iphone-width
        width: 15vw
  .nav
    color: $text-light-color
    display: flex
    justify-content: flex-end
    align-items: center
    width: 97%
    height: 100%

    ul
      width: 100%
      height: 100%
      +setFlex(flex-end)
      padding: 0
      margin: 0
      li
        font-size: 18px
        height: 100%
        cursor: pointer
        margin: 0 0.5vw
        list-style: none
        +setFlex
        .user-info
          +setFlex
          width: auto
          height: 100%
          min-width: 160px
          +phone-width
            display: none
          .user-name
            color: $neutral-01 !important
          .home
            color: $neutral-01
.wallet-btn
  @apply flex justify-center items-center p-[1.25rem] h-[2.5rem] mx-[0.5rem]
  font-family: OpenSans
  font-weight: 510
  font-size: 16px
  background: $primany-01
  color: $neutral-01
  border-radius: 3.125rem
  +phone-width
    display: none
  .wallet-icon
    @apply w-[1.5rem] h-[1.5rem] mr-[.25rem]
    background-image: url("../../assets/images/wallet.svg")
    background-size: contain
    background-repeat: no-repeat
    background-position: center
  span
    text-wrap: nowrap
.deposit-btn
  @apply flex justify-center items-center
  font-family: OpenSans
  font-weight: 510
  font-size: 16px
  height: 2.5rem
  border-radius: 1.875rem
  min-width: 3.25rem
  padding: 0px 0.75rem
  background: $primany-02
  filter: drop-shadow(0 0 10px $primany-01)
  text-shadow: 0px 0px 14px $primany-01
  color: $functional-btn-text-primany-2
  @include phone-width
    @apply text-xs
    height: 2rem
    margin-right: 0rem
    text-shadow: none
    filter: none
    background: $primany-01
    color: $functional-btn-text-primany
  span
    text-wrap: nowrap
.user-wrapper
  @apply relative h-full flex flex-col justify-center
  &:hover
    .logout-modal
      display: block
</style>

<style lang="scss">
@import "app/template/set_r025/assets/css/_variable.sass";

.logout-modal {
  display: none;
  position: absolute;
  top: 75%;
  right: 0;
  background-color: $background-light-color;
  border: 1px solid $border-steel-blue-color;
  padding: 10px 0px;
  box-shadow: rgba($box-shadow-dark-color, 0.1) 0px 2px 10px;
  z-index: 10;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  min-width: min-content;
  border-radius: 4px;
}

.logout-modal .dropdown-item {
  padding: 0px 10px;
  color: $text-steel-blue-color;
}

.logout-modal .dropdown-item:hover {
  color: $text-light-steel-blue-color;
  background: $background-pale-blue-color;
}
</style>
