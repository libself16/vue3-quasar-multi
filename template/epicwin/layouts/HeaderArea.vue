<template>
  <div class="header text-white">
    <q-toolbar v-if="!isLogin" class="nav">
      <ul>
        <li>
          <div class="flex-layout">
            <q-btn
              outline
              rounded
              color="main-btn-color"
              class="mr-4 common-btn login-btn normal-case"
              @click="getLogin()"
            >
              {{ $t("common.btn.login") }}
            </q-btn>
            <q-btn rounded class="common-btn register-btn normal-case" @click="getRegister()">
              {{ $t("common.btn.register") }}
            </q-btn>
          </div>
        </li>
      </ul>
    </q-toolbar>
    <q-toolbar v-else>
      <q-space />
      <div class="flex self-center">
        <q-icon name="account_circle" size="md" color="grey" />
        <div class="flex flex-row md:flex-col">
          <q-btn flat :ripple="false" class="normal-case text-purple font-bold no-ripple" @click="goMemberCenter()">
            {{ userInfo.nickname || userInfo.username }}
          </q-btn>
          <WalletDropdown />
        </div>
      </div>
      <LanguageDropdown btnSize="sm" />
    </q-toolbar>
    <HamburgerBox @click="emit('update:modelValue', true)"></HamburgerBox>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import HamburgerBox from "src/common/components/HamburgerBox.vue"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import WalletDropdown from "src/common/components/WalletDropdown.vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"

// import SelectBox from 'src/common/components/SelectBox.vue';
import { ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"

const router = useRouter()
const { isLogin } = useAuth()
const { userInfo } = useUserInfo()

const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin", "changeRegister"])

const { width } = useWindowSize()
let isMobile = ref(false)

const getLogin = () => {
  emit("changeLogin", true)
}

const getRegister = () => {
  emit("changeRegister", true)
}

function goMemberCenter() {
  router.push({
    name: "memberProfile"
  })
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
@import 'app/template/epicwin/css/_variable.sass'

.flex-layout
    width: 100%
    margin: 2% 0
    +setFlex
    &.hover-style
      cursor: pointer
    .layout-image
      width: 100%
      +iphone-width
        display: none
    // padding: 1.2vw 0 1.2vw 0.8vw
    .common-btn
      cursor: pointer
      width: 15.1875rem
      height: 3.25rem
      border-radius: 50em
      color: #cb00ff
      background: #000000
      border: 0.0625rem solid
      font-size: 1.25rem
      font-weight: 400
      text-transform: intial
      +iphone-width
        width: 150px
        height: 8vw
        +setFlex
      &.login-btn
        &:hover
          filter: brightness(1.2)
      &.register-btn
        background: $main-btn-linear-color
        color: #fff
      // &:hover
      //   background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), #652DCC
      //   color: rgba(255, 255, 255, 0.70)

.header
  z-index: 1
  width: 100%
  height: 20vw
  position: relative
  top: 0
  display: flex
  align-items: center
  justify-content: center
  justify-content: flex-end
  flex-direction: row
  height: 5vw
  // background: rgba(225, 234, 247, 0.8)
  +iphone-width
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
        color: #fff
        list-style: none
        +setFlex
        img
          width: 3vw
          padding: 0 0.5vw
          +iphone-width
            width: 8vw
        +pc-width
          margin: 0 0.5vw
          font-size: 1.5vw
        +iphone-width
          margin: 0 2vw
        &:hover
          color: #d43dff
</style>
