<template>
  <div class="header">
    <div class="header-left">
      <HamburgerBox @click="emit('update:modelValue', true)"></HamburgerBox>
      <q-btn flat fab-mini class="h5_logo" @click="$router.push('/')">
        <img class="h5_logo" :src="getWideLogo()" />
      </q-btn>
    </div>
    <div class="nav header-right">
      <div v-if="isLogin" class="wallet-btn"><WalletDropdown /></div>
      <div v-else class="flex-layout">
        <div class="login-btn" @click="showLogin()">
          <p class="btn-title">{{ `${$t("common.btn.login")} / ${$t("home.signUp")}` }}</p>
        </div>
        <!-- <div class="join-btn" @click="showLogin()">
          <p class="btn-title">{{ $t("home.signUp") }}</p>
        </div> -->
      </div>
      <ul>
        <!--無功能+API 暫時隱藏
         <li v-if="!isMobile">
          <FilterInput></FilterInput>
        </li>-->
        <li v-if="isLogin">
          <q-btn flat fab-mini color="white" class="menuft">
            <img :src="commonSvgIcon('header-icon1')" />
            <q-menu v-model="menuShow">
              <q-list style="min-width: 200px" class="header-menu-list">
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'memberProfile' })">
                    {{ $t("menu.memberCenter") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'MemberDeposit' })">
                    {{ $t("menu.deposit") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'MemberWithdrawal' })">
                    {{ $t("menu.withdrawal") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'history' })">
                    {{ $t("menu.history") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'orders' })">
                    {{ $t("menu.order") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout">
                    {{ $t("menu.logout") }}
                  </q-item-section>
                </q-item>
                <q-separator class="header-menu-separator" />
              </q-list>
            </q-menu>
          </q-btn>
        </li>
        <li v-if="!isMobile && isLogin">
          <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'memberInbox' })">
            <img :src="commonSvgIcon('header-icon2')" />
          </q-btn>
        </li>
        <li v-if="!isMobile">
          <LanguageDropdown class="language-bar" btnSize="md" />
        </li>

        <!-- <li>
          <SelectBox></SelectBox>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEnvInfoStore } from "src/stores/envStore"
import HamburgerBox from "../../components/HamburgerBox.vue"

// import SelectBox from 'src/common/components/SelectBox.vue';
import { useWindowSize } from "@vueuse/core"
import { injectStrict } from "src/common/utils/injectTyped"
import { useLogo } from "src/common/composables/useLogo"
import { EventBusKey } from "src/symbols"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import LanguageDropdown from "./components/LanguageDropdown.vue"
import WalletDropdown from "./components/WalletDropdown.vue"

const { envInfo } = useEnvInfoStore()
const { commonSvgIcon } = useCommonImg()
const { svgIcon, logoImg } = useSiteImg()
const { getSquareLogo, getWideLogo } = useLogo()
const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])
const { isLogin, handleLogout, isLoading } = useAuth()

const { width } = useWindowSize()
let isMobile = ref(false)
let menuShow = ref(false)
const router = useRouter()
const eventbus = injectStrict(EventBusKey)

function showLogin() {
  eventbus.emit("openLogin", true)
}

// const getLogin = () => {
//   emit("changeLogin", true)
//   if (width.value < 992) {
//     emit("update:modelValue", false)
//   }
// }

// const getRegister = () => {
//   emit("changeRegister", true)
//   if (width.value < 992) {
//     emit("update:modelValue", false)
//   }
// }

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
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

.header-menu-list
  @apply bg-[#454E60] text-white
  @apply px-4 py-4 uppercase text-sm
  .header-menu-separator
    @apply bg-white/30

.q-btn
  &:hover
    background: rgba(0, 0, 0, 0) !important

.header
  background: linear-gradient(270deg, #38A4B1 0%, #8C82E9 100%)
  z-index: 1
  width: 100%
  position: relative
  top: 0
  display: flex
  align-items: center
  justify-content: space-between
  flex-direction: row
  height: 75px
  +iphone-width
    height: 40px !important
  .header-left
    @apply pl-[5.5vw] py-0
    height: 100%
    flex: 2
    display: flex
    align-items: center
    :deep(.menu-icon)
      width: 24px
    +iphone-width
      @apply pl-[1vw]
      justify-content: flex-start
    .h5_logo
      @apply p-0
      width: auto
      max-height: 40px
      :deep(.q-btn__content)
        justify-content: flex-start
      +iphone-width
        height: auto
        max-width: 60px
        max-height: 40px
  .header-right
    flex: 5
    display: flex
    justify-content: flex-end
    .wallet-btn
      margin: 0 10px
    .flex-layout
      width: auto
      +setFlex
      &.hover-style
        cursor: pointer
      .layout-image
        width: 90%
        // +iphone-width
        //   display: none
      div
        display: flex
        justify-content: flex-start
        align-items: center
        cursor: pointer
        background: rgba(255, 255, 255, 0.20)
        &:hover
          background: rgba(255, 255, 255, 0.50)
        &.login-btn
          +setFlex
          font-size: 1.2rem
          width: 12rem
          margin: 0 2%
          height: 40px
          line-height: 40px
          border-radius: 5px
          +iphone-width
            font-size: 0.9rem
            height: 2rem
            line-height: 2rem
            margin: 0 0.5rem
            width: 8rem
        &.join-btn
          +setFlex
          width: 8rem
          font-size: 1.2rem
          margin: 0 2%
          height: 40px
          line-height: 2.5vw
          border-radius: 5px
          +iphone-width
            height: 2.5rem
          span
            color: #fff
        .btn-title
          width: 100%
          text-align: center

  // background: rgba(225, 234, 247, 0.8)
  +pad-width
    position: relative
    height: 15vw
    max-height: 65px
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
    // padding: 0 3vw
    width: 97%
    height: 100%

    ul
      +setFlex
      padding: 0
      margin: 0
      li
        font-size: 18px
        cursor: pointer
        margin: 0 0.5vw
        list-style: none
        +setFlex
</style>
