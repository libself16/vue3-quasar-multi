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
          <img :src="commonSvgIcon('header-icon2')" />
        </q-btn>
        <LanguageDropdown class="language-bar" btnSize="md" />
      </div>
    </div>
    <q-btn class="logo" flat :to="{ name: 'home' }">
      <img class="h5_logo" :src="getSquareLogo()" />
    </q-btn>
    <div v-if="isLogin" class="user-area">
      <span>{{ $t("home.welcome") }}!</span>
      <span class="text-white ml-2 font-bold">{{ userInfo.username }}</span>
    </div>
    <!-- home, login, join -->
    <div class="button-area">
      <q-btn class="normal-btn btn-common" align="left" :to="{ name: 'home' }">
        <img :src="svgIcon('home')" alt="" />
        <span class="btn-title">{{ $t("menu.home") }}</span>
      </q-btn>
      <div v-if="!isLogin" class="flex-layout">
        <div class="login-btn btn-common" @click="getLogin()">
          <img :src="svgIcon('login')" alt="" />
          <span class="btn-title">{{ $t("common.btn.login") }}</span>
        </div>
        <div v-if="isCash" class="join-btn btn-common" @click="getRegister()">
          <img :src="svgIcon('join')" alt="" />
          <span class="btn-title">{{ $t("common.btn.register") }}</span>
        </div>
      </div>
    </div>
    <!-- 忘記密碼 -->
    <div v-if="!isLogin && isCash" class="flex-layout">
      <span class="btn-content">{{ $t("home.forgot") }}</span>
      &nbsp;
      <!-- TODO: 缺忘記密碼頁面 -->
      <q-btn class="btn-content yellow px-0" flat :to="{ name: 'ForgotPass' }">{{ $t("home.password") }}?</q-btn>
    </div>
    <div class="flex-layout" v-if="false">
      <img class="layout-image" :src="rectangle" alt="" />
    </div>
    <!-- Menu List -->
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
          <q-btn class="normal-btn btn-common" align="left" :class="{ 'btn-common-active': isAnyAccountItemActive }">
            <img :src="svgIcon(isAnyAccountItemActive ? 'account-active' : 'account')" />
            <span class="btn-title my-account">{{ $t("menu.myAccount") }}</span>
            <img class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
          </q-btn>
        </template>
        <template #default>
          <ul class="account-list">
            <template v-for="item in accountMenuItems" :key="item.name">
              <li
                v-if="item.show"
                class="account-item"
                :class="{ 'account-item-active': isAccountItemActive(item.name) }"
              >
                <q-btn align="left" flat :to="{ name: item.name }">
                  {{ $t(item.label) }}
                </q-btn>
              </li>
            </template>
          </ul>
        </template>
      </q-expansion-item>
      <!-- 串接 CMS Menu List -->
      <q-btn
        v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
        :key="cmsIndex"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': isActive(cmsItem.Entrance[0]) }"
        align="left"
        @click="
          handleEntranceClick({
            entrance: cmsItem.Entrance[0]
          })
        "
      >
        <img
          v-if="cmsItem.Setting.icon_path"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <span class="btn-title">
          {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
        </span>
      </q-btn>
      <q-btn v-if="isLogin" class="normal-btn btn-logout" @click="logout" :loading="isLoading">
        <img :src="svgIcon('logout')" alt="" />
        <span class="btn-title">{{ $t("common.btn.logout") }}</span>
      </q-btn>
    </div>
  </div>
  <q-dialog v-model="loginStatus">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/set49/composables/useCms"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { storeToRefs } from "pinia"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, defineEmits, defineProps, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../utils/constants"
import { useEnv } from "src/common/hooks/useEnv"

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])

const { svgIcon, rectangle } = useSiteImg()
const router = useRouter()
const { getSquareLogo } = useLogo()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const { commonSvgIcon } = useCommonImg()
const userInfoStore = useUserInfoStore()
const { userInfo } = storeToRefs(userInfoStore)
const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { nowLang } = useLanguage()
const { isCash } = useEnv()

let isMobile = ref(false)
let loginStatus = ref(false)

const accountMenuItems = [
  { name: "memberProfile", label: "menu.memberCenter", show: true },
  { name: "MemberDeposit", label: "menu.deposit", show: isCash.value },
  { name: "MemberWithdrawal", label: "menu.withdrawal", show: isCash.value },
  { name: "history", label: "menu.history", show: true },
  { name: "orders", label: "menu.order", show: isCash.value }
]

const isAccountItemActive = (routeName: string) => {
  return route.name === routeName
}

const isAnyAccountItemActive = computed(() => {
  return accountMenuItems.some((item) => isAccountItemActive(item.name))
})

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

const getLogin = () => {
  emit("changeLogin", true)
  if (width.value < 992) {
    emit("update:modelValue", false)
  }
}

const getRegister = () => {
  emit("changeRegister", true)
  if (width.value < 992) {
    emit("update:modelValue", false)
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

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
@import "app/template/set49/assets/css/_variable.scss"

::-webkit-scrollbar
  display: none
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
    +iphone-width
      width: 3vw

.btn-title
  font-family: "Century Gothic"
  font-size: 1vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  +iphone-width
    font-size: 3vw
.btn-content
  color: $menu-default-color
  font-family: "Century Gothic"
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
  flex-shrink: 0
  width: 22vw
  vertical-align: top
  display: table-cell
  padding-bottom: 5vw
  background-color: $secondary-bg
  overflow-y: auto
  .go-back-mobile
    display: none
  +pad-width
    position: fixed
    left: 0
    z-index: 98
    height: 100vh
    width: 40%
    .go-back-mobile
      display: flex
      justify-content: space-between
      align-items: center
      padding: 15px 30px
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
    color: $menu-default-color
    +iphone-width
    padding: 2vw 0
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
    +iphone-width
      padding: 2vw 0
    .normal-btn
      cursor: pointer
      display: flex
      justify-content: flex-start
      align-items: center
      width: 96%
      margin: 0.5vw 2%
      height: auto
      border-radius: 0.4vw
      padding: 1.2vw 1vw
      background: $primary-btn-bg
      margin-bottom: .625rem
      +iphone-width
        background: $primary-modal-bg
        min-height: 10vw
        padding: 1.2vw 7vw
      &:hover
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), $primary-btn-bg
        .btn-title
          color: $menu-hover-color !important
      span
        @apply text-left break-all
        margin-left: 0.7vw
        +iphone-width
          margin: 0 3vw
      .my-account
        margin-right: 0.6vw
        +iphone-width
          margin: 0 3vw
      &.btn-logout
        background: #0D0000
        color: $menu-default-color
        justify-content: center
        border: 1px solid $menu-default-color
        &:hover
          color: $menu-hover-color
      &.q-btn
        :deep(.q-btn__content)
          @apply flex flex-nowrap
          width: 100%
  .button-area-bottom
    padding-bottom:7.5vw
  .flex-layout
    width: 100%
    margin: 2% 0
    +setFlex
    &.hover-style
      cursor: pointer
    .layout-image
      width: 90%
    div
      display: flex
      justify-content: center
      align-items: center
      padding: 1.2vw 0 1.2vw 0.8vw
      cursor: pointer
      word-break: break-all
      &.login-btn
        width: 48%
        margin: 0 2%
        line-height: 4vw
        border-radius: 0.4vw
        padding: 0 .5vw
        background: #802827
        min-height: 3vw
        +iphone-width
          @apply rounded-md
          background: $primary-btn-bg
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), #802827
          color: rgba(255, 255, 255, 0.70)
        .btn-title
          font-size: 1rem
          +iphone-width
            font-size: 3vw
      &.join-btn
        width: 50%
        margin: 0 2%
        border-radius: 0.4vw
        padding: 0 .5vw
        background: #FFC002
        min-height: 3vw
        +iphone-width
          @apply rounded-md
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), $yellow-active
          color: #24262B
          .btn-title
            color: #24262B
        span
          color: #24262B
        .btn-title
          font-size: 1rem
          +iphone-width
            font-size: 3vw
      img
        margin-right: 0.5vw
</style>

<style lang="scss" scoped>
@import "app/template/set49/assets/css/_variable.scss";

.side-menu {
  .btn-common {
    .btn-title {
      color: $menu-default-color;
    }

    &:hover {
      .btn-title {
        color: $menu-hover-color;
      }
    }
  }

  .btn-common-active {
    .btn-title {
      color: $menu-active-color;
    }
    .my-account {
      color: $menu-active-color !important;
    }
  }
}

.account-list {
  .account-item {
    color: $menu-default-color;

    &.account-item-active {
      :deep(.q-btn) {
        color: $menu-active-color;
      }
    }

    &:hover {
      :deep(.q-btn) {
        color: $menu-hover-color;
      }
    }
  }
}
</style>
