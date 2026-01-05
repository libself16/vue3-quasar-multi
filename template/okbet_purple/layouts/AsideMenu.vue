<template>
  <!-- <div class="cover" v-show="isMobile && !modelValue" @click="$emit('update:modelValue', false)"></div> -->

  <div class="side-menu" :class="{ isClose: !modelValue }">
    <q-btn class="logo" flat :to="{ name: 'home' }">
      <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
    </q-btn>
    <!-- menu list -->
    <div class="button-area button-area-bottom">
      <q-expansion-item
        v-if="isLogin"
        v-model="memberMenuExpanded"
        expand-separator
        icon="perm_identity"
        label="Account settings"
        caption="John Doe"
        class="button-account"
      >
        <template #header>
          <q-btn
            class="normal-btn btn-common button-title account-btn"
            :class="{ 'btn-common-active': isAccountActive }"
            align="left"
          >
            <img :src="resultImages('my-account.png')" class="account-icon" />
            <span class="btn-title">{{ $t("menu.myAccount") }}</span>
            <img v-if="modelValue" class="arrow-btn" :src="svgIcon('arrow-down')" />
          </q-btn>
        </template>
        <template #default>
          <ul v-if="modelValue" class="account-list">
            <li
              class="btn-title"
              @click="setActiveItem('account', 'memberProfile')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'memberProfile' }"
            >
              <q-btn align="left" flat :to="{ name: 'memberProfile' }">{{ $t("menu.memberCenter") }}</q-btn>
            </li>
            <li
              class="btn-title"
              @click="setActiveItem('account', 'MemberDeposit')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberDeposit' }"
            >
              <q-btn align="left" flat :to="{ name: 'MemberDeposit' }"> {{ $t("menu.deposit") }}</q-btn>
            </li>
            <li
              class="btn-title"
              @click="setActiveItem('account', 'MemberWithdrawal')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberWithdrawal' }"
            >
              <q-btn align="left" flat :to="{ name: 'MemberWithdrawal' }">{{ $t("menu.withdrawal") }}</q-btn>
            </li>
            <li
              class="btn-title"
              @click="setActiveItem('account', 'history')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'history' }"
            >
              <q-btn align="left" flat :to="{ name: 'history' }">{{ $t("menu.history") }}</q-btn>
            </li>
            <li
              class="btn-title"
              @click="setActiveItem('account', 'orders')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'orders' }"
            >
              <q-btn align="left" flat :to="{ name: 'orders' }">{{ $t("menu.order") }}</q-btn>
            </li>
          </ul>
        </template>
      </q-expansion-item>
      <q-btn
        v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
        :key="cmsIndex"
        class="normal-btn btn-common cms-menu-btn"
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
          class="home-title-icon"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <div v-else class="home-title-icon"></div>
        <span class="btn-title">{{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums]) }}</span>
      </q-btn>
      <q-btn v-if="isLogin" class="normal-btn btn-logout button-title" @click="logout" :loading="isLoading">
        <img :src="svgIcon('logout')" alt="" />
        <span class="btn-title">{{ $t("common.btn.logout") }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, onMounted, ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/okbet_purple/composables/useCms"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../utils/constants"

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["update:modelValue"])

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { cmsListState, handleCmsList, handleEntrance, fliterDisplayDeviceAndLogin } = useCms()
const { svgIcon, menuIcon, resultImages } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const eventbus = injectStrict(EventBusKey)
const { getWideLogo } = useLogo()

let isMobile = ref(false)
let memberMenuExpanded = ref(false)

interface ActiveItem {
  type: "game" | "other" | "account"
  id: number | string
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

const activeItem = ref<ActiveItem>({ type: "game", id: 0 })

const isAccountActive = computed(() => {
  return activeItem.value.type === "account"
})

const setActiveItem = (type: "game" | "other" | "account", id: number | string) => {
  activeItem.value = { type, id }
}

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
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

watch(route, (newRoute) => {
  const newPath = newRoute.path
  // 當不在與member相關的path須重設activeItem
  // 避免持續顯示active Class
  if (!newPath.includes("member")) {
    activeItem.value = { type: "game", id: 0 }
    memberMenuExpanded.value = false
  }
})

// Listen for event bus updates when navigation happens without a refresh
eventbus.on("updateAsideMenu", ({ type, id }) => {
  setActiveItem(type, id)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/_variable.sass"

::-webkit-scrollbar
  display: none

.q-btn
  padding: .25rem .4375rem
  &:before
    box-shadow: none
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%
// common style
.home-title-icon
  min-width: 20px
  width: 20px
.btn-title
  color: $text-gray
  font-weight: 400
  text-overflow: ellipsis
  font-size: 13px
  font-style: normal
  line-height: normal
.btn-common-active
  border: 1px solid $text-light-primary
  box-shadow: $border-glow-box-shadow
  span
    color: $text-light-primary
    text-shadow: $text-light-effect-strong
.btn-title-active
  color: $text-light-primary
  text-shadow: $text-light-effect-strong
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-weight: 400
  font-size: 14px
  font-style: normal
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
  width: 200px
  height: 100vh
  vertical-align: top
  display: table-cell
  background-color: $bg-primary
  overflow-y: auto
  position: absolute
  left: 0
  z-index: 100
  transition: left 0.2s ease 0s
  &.isClose
    left: -200px
    .q-btn
      :deep(.q-btn__content)
        +setFlex
    .logo
      background: $bg-primary
      width: 60px
      z-index: 9
      position: fixed
      img
        width: 7.5rem
        opacity: 0 !important
    .button-area
      .normal-btn
        .btn-title
          display: none
  .menu-toggle
    cursor: pointer
    z-index: 9
    position: absolute
    right: 0
  .logo
    +setFlex
    width: 200px
    max-width: 100%
    transition: width 0.2s ease 0s
    position: fixed
    height: 4.875rem
    margin: 0 auto 2vw
    cursor: pointer
    z-index: 9
    box-shadow: rgba(0, 0, 0, 0.05) 2px 0px 14px, rgba(0, 0, 0, 0.05) 0px 2px 14px
    background: $bg-primary
    img
      height: 100%
    :deep(.q-focus-helper)
      opacity: 0 !important
  .button-account
    width: 100%
    padding: 0.5vw 0
    .arrow-btn
      @apply w-3 h-3 ml-2 mt-1
      transform: rotate(0deg)
    &.q-expansion-item--expanded
      .arrow-btn
        transform: rotate(180deg)
    :deep(.q-item)
      padding: 0
      min-height: 1.25rem
      .btn-common
        margin-bottom: 0px
      .q-focus-helper
        opacity: 0 !important
      .q-item__section.q-focusable
        display: none
    .account-list
      margin-left: 18%
      .btn-title
        :deep(.q-btn)
          font-size: .8125rem
          margin-left: 0.6vw
          padding: 0
          text-transform: none
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
    overflow-y: scroll
    +setFlex
    flex-direction: column
    +iphone-width
      padding: 2vw 0
    .normal-btn
      @apply flex items-center cursor-pointer w-full
      height: 2vw
      line-height: 2vw
      border-radius: .875rem
      margin-bottom: .625rem
      margin-left: 0px
      text-transform: none
      &:hover
        span
          margin-left: 20px
          transition: margin-left 0.3s ease 0s
      span
        margin-left: 1vw
        +iphone-width
          margin-left: 2vw
      &.btn-logout
        display: grid
        background: transparent
        &:hover
          border: 1px solid $text-light-primary
          box-shadow: $border-glow-box-shadow
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
    .button-title
      span
        margin-left: 0.7vw
      .account-icon
        @apply w-[1.25rem] h-[1.25rem]
    .cms-menu-btn
      &:hover
        border: 1px solid $text-light-primary
        box-shadow: $border-glow-box-shadow
        span
          color: $text-light-primary
          margin-left: 1.3vw
          transition: margin-left 0.3s ease 0s
          +pc-2xl-width
            margin-left: 1.5rem
  .button-area-bottom
    padding-top: 90px
    padding-bottom:7.5vw
    +iphone-width
      padding-top: 120px
.account-btn
  &:hover
    border: 1px solid $text-light-primary
    box-shadow: $border-glow-box-shadow
</style>
