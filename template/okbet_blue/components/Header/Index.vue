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
          <div v-if="isLogin" @click="handleRedirectDeposit" class="deposit-btn btn-scale-shadow-primary">
            <span>{{ $t("common.btn.deposit") }}</span>
          </div>
          <div v-if="!isMobile && isLogin" @click="$router.push({ name: 'MemberWithdrawal' })" class="wallet-btn">
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
            <q-btn flat fab-mini class="menuft" @click="$router.push({ name: 'memberInbox' })">
              <q-icon name="mail" class=""></q-icon>
            </q-btn>
          </div>
          <q-btn v-if="!isLogin" class="loginBtn" @click="showLogin($q.platform.is.mobile ? true : false)">{{
            $t("common.btn.loginAndRegister")
          }}</q-btn>
          <LanguageDropdown class="language-bar" btnSize="md" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import { useAuth } from "src/common/hooks/useAuth"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useEntranceHandler } from "app/template/okbet_blue/composables/useCms"
import { useSiteRedirect } from "app/template/okbet_blue/composables/useSiteRedirect"
import { MENU } from "../../utils/constants"
import HamburgerBox from "./HamburgerBox.vue"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import WalletDropdown from "./components/WalletDropdown.vue"
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
const { isLogin, handleLogout } = useAuth()
const { handleRedirectDeposit } = useSiteRedirect()
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
@import "app/template/okbet_blue/assets/css/button.scss"
@import "app/template/okbet_blue/assets/css/_variable.sass"
@import "app/template/okbet_blue/assets/css/animation.scss"

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
  color: $text-light-secondary
  background: $bg-secondary
  backdrop-filter: blur(3px)
  min-width: 0px
  white-space: nowrap
.loginBtn
  &.q-btn
    @apply flex items-center mx-5 relative text-white
    border-radius: 50px
    font-family: OpenSans
    font-weight: 510
    font-size: 16px
    line-height: 19px
    width: 220px
    height: 30px
    padding: 0px
    background: $bg-light
    color: $bg-tertiary
    box-shadow: transparent 0px 4px 5px 0px
    overflow: hidden
    +iphone-width
      @apply mx-0 mr-4
      font-size: 14px
      width: 150px
    &::before
      content: ""
      border-radius: 0px
      background-color: rgba(255, 255, 255, 0.8)
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
  background-color: $bg-header-secondary
  backdrop-filter: blur(8px)
  transition: background 0.26s ease 0s
  +phone-width
    position: fixed
    height: 55px
  &.home
    // position: absolute
    background: $bg-header-primary
    .menuft
      background: transparent
    +phone-width
      position: fixed
      top: 0
      left: 0
  .header-left
    display: flex
    justify-content: flex-start
    align-items: center
    +iphone-width
      height: 100%
    .outer_logo
      @apply w-auto min-w-[4.375rem] h-[4.375rem] max-w-[8.75rem] cursor-pointer z-10
      @apply flex items-center justify-center
      margin: 0 1rem
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
      width: 100%
      height: auto
      max-height: 3rem
      padding: 0
      display: none
      +phone-width
        @apply flex items-start
        object-fit: contain
        object-position: left
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
        @apply text-white font-normal cursor-pointer text-base relative
        line-height: 100%
        height: 100%
        margin: 0px 22px
        font-family: OpenSans
        font-weight: 700
        font-size: 1.125rem
        user-select: none
        white-space: nowrap
        display: flex
        align-items: center
        &.active
          color: $text-light-primary
          text-shadow: $text-light-effect-strong
          &::before
            @apply absolute bottom-0 h-[.1875rem] w-full
            content: ""
            background: $text-light-primary
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
  .logo
    display: flex
    cursor: pointer
    img
      width: 6vw
      +iphone-width
        width: 15vw
  .nav
    color: #fff
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
            color: $text-light-secondary
.wallet-btn
  @apply flex justify-center items-center p-[1.25rem] h-[2.5rem] mx-[0.5rem]
  font-family: OpenSans
  font-weight: 510
  font-size: 16px
  background: $bg-light
  color: $bg-dark-secondary
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
  @apply flex justify-center items-center text-white
  font-weight: 510
  font-size: 16px
  height: 2.5rem
  border-radius: 1.875rem
  min-width: 3.25rem
  padding: 0px 0.75rem
  background: #EEFFC8
  color: $text-deposit
  border: 1px solid $border-light
  filter: $border-glow-effect
  @include phone-width
    @apply text-sm
    height: 2rem
    margin-right: 1rem
  span
    text-wrap: nowrap
  &::after,
  &::before
    @apply absolute top-0 left-0 w-full h-full
    content: ""
    animation: button-scale-shadow-secondary 1s ease-out infinite
    border-radius: inherit
    pointer-events: none
.user-wrapper
  @apply relative
  @apply relative h-full flex flex-col justify-center
  &:hover
    .logout-modal
      display: block
      background: $bg-secondary
</style>

<style lang="scss">
.logout-modal {
  display: none;
  position: absolute;
  top: 75%;
  right: 0;
  padding: 10px 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px;
  z-index: 10;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  min-width: min-content;
  border-radius: 4px;
}

.logout-modal .dropdown-item {
  padding: 0px 10px;
}
</style>
