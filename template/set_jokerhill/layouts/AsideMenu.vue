<template>
  <div class="cover" v-show="isMobile && modelValue" @click="$emit('update:modelValue', false)"></div>
  <div class="side-menu" :class="{ 'is-mobile': modelValue }">
    <!-- mobile header -->
    <div class="go-back-mobile">
      <div class="back" @click="$emit('update:modelValue', false)">
        <img :src="svgIcon('back')" alt="" />
      </div>
      <div class="aside-svg">
        <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'memberInbox' })" v-if="isLogin">
          <img :src="svgIcon('header-icon2')" />
        </q-btn>
        <LanguageDropdown class="language-bar" btnSize="md" />
      </div>
    </div>
    <q-btn class="logo" flat :to="{ name: 'home' }">
      <img class="payment-method" :src="logoImg" alt="" />
    </q-btn>
    <div v-if="isLogin" class="user-area">
      <span>{{ $t("home.welcome") }}!</span>
      <span class="text-black ml-2 font-bold">{{ userInfo.username }}</span>
    </div>
    <!-- home, login, join -->
    <div class="button-area">
      <q-btn class="normal-btn btn-common" align="left" :to="{ name: 'home' }">
        <img :src="svgIcon('home')" alt="" />
        <span class="btn-title">{{ $t("menu.home") }}</span>
      </q-btn>
    </div>
    <!-- menu list -->
    <div class="button-area button-area-bottom">
      <q-expansion-item
        v-if="isLogin"
        expand-separator
        icon="perm_identity"
        label="Account settings"
        caption="John Doe"
        class="button-account"
      >
        <template #header>
          <q-btn class="normal-btn btn-common" align="left">
            <img :src="svgIcon('account')" alt="" />
            <span class="btn-title my-account">{{ $t("menu.myAccount") }}</span>
            <img class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
          </q-btn>
        </template>
        <template #default>
          <ul class="account-list">
            <li class="account-item">
              <q-btn align="left" flat :to="{ name: 'memberProfile' }">{{ $t("menu.memberCenter") }}</q-btn>
            </li>
            <li class="account-item">
              <q-btn align="left" flat :to="{ name: 'MemberDeposit' }">{{ $t("menu.deposit") }}</q-btn>
            </li>
            <li class="account-item">
              <q-btn align="left" flat :to="{ name: 'MemberWithdrawal' }">{{ $t("menu.withdrawal") }}</q-btn>
            </li>
            <li class="account-item">
              <q-btn align="left" flat :to="{ name: 'history' }">{{ $t("menu.history") }}</q-btn>
            </li>
            <li class="account-item">
              <q-btn align="left" flat :to="{ name: 'orders' }">{{ $t("menu.order") }}</q-btn>
            </li>
          </ul>
        </template>
      </q-expansion-item>
      <q-btn
        v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
        :key="cmsIndex"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': isActive(cmsItem.Entrance[0]) }"
        align="left"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <img
          v-if="cmsItem.Setting.icon_path"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <span class="btn-title">{{
          limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
      </q-btn>
      <q-btn v-if="isLogin" class="normal-btn btn-logout" @click="logout" :loading="isLoading">
        <img :src="svgIcon('logout')" alt="" />
        <span class="btn-title">{{ $t("common.btn.logout") }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { storeToRefs } from "pinia"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { MENU } from "../utils/constants"

defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])

const { svgIcon, logoImg } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { nowLang } = useLanguage()
const userInfoStore = useUserInfoStore()
const { userInfo } = storeToRefs(userInfoStore)

let isMobile = ref(false)

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
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

const limitWordLength = (word: string) => {
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 768) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
watch(
  () => route,
  (newRoute) => {
    if (isMobile.value) {
      emit("update:modelValue", false)
    }
  },
  { deep: true }
)

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

$white-70: rgba(20, 20, 20, 0.40)
::-webkit-scrollbar
  display: none
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
    +iphone-width
      width: 4vw

.btn-title
  color: $white-70
  font-family: "NotoSansTC"
  font-size: 1vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  +iphone-width
    font-size: 3vw
.btn-content
  color: $white-70
  font-family: "NotoSansTC"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  :deep(.q-focus-helper)
    opacity: 0 !important
  +iphone-width
    font-size: 3vw
  &.yellow
    color: $yellow-active
    text-decoration: underline
// layout style
.cover
  display: none
  +iphone-width
    display: block
    width: 100%
    height: 100%
    position: fixed
    +setFlex
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background-color: rgba(0, 0, 0, 0.5)
    z-index: 10
.side-menu
  display: none
  flex-shrink: 0
  width: 22vw
  max-width: 349px
  vertical-align: top
  padding-bottom: 20vw
  background: #F0F0F0
  overflow-y: auto
  .go-back-mobile
    display: none
  +iphone-width
    display: block
    position: fixed
    left: 0
    z-index: 22
    height: 100vh
    width: 40%
    .go-back-mobile
      display: flex
      justify-content: space-between
      align-items: center
      padding: 15px 10px 15px 20px
      .back
        cursor: pointer
      .aside-svg
        +setFlex
        flex-direction: row
        img
          padding-left: 5px
          cursor: pointer
  +iphone-width
    width: 70%
  .logo
    +setFlex
    padding: 4vw 2vw
    margin: 0 auto
    cursor: pointer
    +pad-width
      display: none
    :deep(.q-focus-helper)
      opacity: 0 !important
  .rectangle
    width: 90%
    margin: 1vw auto
  .user-area
    width: 90%
    margin: 0 auto
    height: auto
    color: $white-70
    +iphone-width
      padding: 6vw 0
  .button-account
    width: 100%
    .arrow-btn
      width: 1vw
      height: 1vw
      transform: rotate(180deg)
      +iphone-width
        width: 3vw
        height: 3vw
    &.q-expansion-item--expanded
      .arrow-btn
        transform: rotate(0deg)
    :deep(.q-item)
      padding: 0
      .q-focus-helper
        opacity: 0 !important
      .q-item__section.q-focusable
        display: none
    .account-list
      margin-left: 25%
      color: $white-70
      .account-item
        list-style: disc
        :deep(.q-btn)
          padding: 0
          .q-focus-helper
            opacity: 0 !important
  .button-area
    width: 90%
    margin: 0 auto
    height: auto
    +setFlex
    flex-direction: column
    .normal-btn
      cursor: pointer
      display: flex
      justify-content: flex-start
      align-items: center
      width: 96%
      margin: 0.5vw 2%
      height: 4vw
      border-radius: 0.4vw
      padding: 1.2vw 1.1vw
      background: #F0F0F0
      margin-bottom: .625rem
      +iphone-width
        height: 10vw
        padding: 1.2vw 7vw
      span
        margin: 0 1vw
        +iphone-width
          margin: 0 3vw
      .my-account
        margin-right: 0.6vw
        +iphone-width
          margin: 0 3vw
      &.btn-logout
        justify-content: center
        background: transparent
        border: 1px solid $white-70
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
  .button-area-bottom
    padding-bottom:7.5vw
</style>
