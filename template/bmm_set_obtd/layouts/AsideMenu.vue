<template>
  <!-- <div class="cover" v-show="isMobile && modelValue" @click="$emit('update:modelValue', false)"></div> -->
  <div class="side-menu" :class="{ isClose: modelValue }">
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
            class="normal-btn btn-common button-title"
            :class="{ 'btn-common-active': isAccountActive }"
            align="left"
          >
            <img :src="menuIcon('account', isAccountActive ? 'active' : 'normal')" alt="" />
            <span class="btn-title">{{ $t("menu.myAccount") }}</span>
            <img v-if="!modelValue" class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
          </q-btn>
        </template>
        <template #default>
          <ul v-if="!modelValue" class="account-list">
            <li
              class="btn-title"
              @click="setActiveItem('account', 'memberProfile')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'memberProfile' }"
            >
              <q-btn align="left" flat :to="{ name: 'memberProfile' }">{{ $t("menu.memberCenter") }}</q-btn>
            </li>
            <!-- TODO: 沒有頁面 -->
            <li
              class="btn-title"
              @click="setActiveItem('account', 'MemberDeposit')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberDeposit' }"
            >
              <q-btn align="left" flat :to="{ name: 'MemberDeposit' }"> {{ $t("menu.deposit") }}</q-btn>
            </li>
            <!-- TODO: 沒有頁面 -->
            <li
              class="btn-title"
              @click="setActiveItem('account', 'MemberWithdrawal')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberWithdrawal' }"
            >
              <q-btn align="left" flat :to="{ name: 'MemberWithdrawal' }">{{ $t("menu.withdrawal") }}</q-btn>
            </li>
            <!-- TODO: 沒有頁面 -->
            <li
              class="btn-title"
              @click="setActiveItem('account', 'history')"
              :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'history' }"
            >
              <q-btn align="left" flat :to="{ name: 'history' }">{{ $t("menu.history") }}</q-btn>
            </li>
            <!-- TODO: 沒有頁面 -->
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
        <!-- <img :src="svgIcon(item.frontendKey as string)" alt="" /> -->
        <img
          v-if="cmsItem.Setting.icon_path"
          class="home-title-icon"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <div v-else class="home-title-icon"></div>
        <span class="btn-title">{{
          limitWordLength(cmsItem.Setting?.lang?.[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
      </q-btn>
      <q-btn v-if="isLogin" class="normal-btn btn-logout button-title" @click="logout" :loading="isLoading">
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
import { useQuasar } from "quasar"
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/bmm_set_obtd/composables/useCms"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, defineEmits, defineProps, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../utils/constants"

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["update:modelValue"])

const $q = useQuasar()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { cmsListState, handleCmsList, handleEntrance, fliterDisplayDeviceAndLogin } = useCms()
const { svgIcon, menuIcon } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const { gameTypeState } = useGame()
const { commonSvgIcon } = useCommonImg()
const eventbus = injectStrict(EventBusKey)
const { getWideLogo } = useLogo()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()

let isMobile = ref(false)
let toggleClose = ref(false)
let loginStatus = ref(false)
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

  if (isTelegramMiniApp.value) closeMiniApp()

  $q.notify({
    type: "positive",
    message: t("common.alarm.logoutSuccess"),
    position: "top",
    timeout: 1000
  })
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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

::-webkit-scrollbar
  display: none

.q-btn
  padding: 4px 7px
  &:before
    box-shadow: none
  &:hover
    background-color: $background-light-color !important
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%
// common style
.home-title-icon
  min-width: 20px
  width: 20px
.btn-title
  color: $text-steel-blue-color
  font-family: OpenSans, "PingFang SC", "Microsoft YaHei", D-DIN, Arial, SimHei, Helvetica, sans-serif
  font-weight: 400
  text-overflow: ellipsis
  font-size: 13px
  font-style: normal
  line-height: normal
.btn-common-active
  background-color: $background-pale-blue-color
  span
    color: $primary-color
.btn-title-active
  color: $primary-color
.btn-content
  color: rgba($text-light-color, 0.70)
  font-family: "Century Gothic"
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
  background: rgba($background-dark-color, 0.5)
  z-index: 10
.side-menu
  flex-shrink: 0
  width: 200px
  height: 100vh
  vertical-align: top
  display: table-cell
  background-color: $background-light-color
  overflow-y: auto
  position: absolute
  left: 0
  z-index: 100
  transition: width 0.2s ease 0s
  &.isClose
    width: 60px
    .q-btn
      :deep(.q-btn__content)
        +setFlex
    .logo
      background: $background-light-color
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
    background: $background-pale-silver-color
    img
      max-height: 100%
      padding: 0 .625rem
    :deep(.q-focus-helper)
      opacity: 0 !important
  .button-account
    width: 100%
    padding: 0.5vw 0

    .arrow-btn
      width: 1.5vw
      height: 1.5vw
      transform: rotate(180deg)
      +iphone-width
        width: 3vw
        height: 3vw
    &.q-expansion-item--expanded
      .arrow-btn
        transform: rotate(0deg)
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
      cursor: pointer
      display: flex
      align-items: center
      width: 100%
      height: 2vw
      line-height: 2vw
      border-radius: 30px
      margin-bottom: .625rem
      margin-left: 0px
      text-transform: none
      img
        color: $text-steel-blue-color
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
        border: 1px solid rgba($border-light-color, 0.7)
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
    .button-title
      span
        margin-left: 0.7vw
    .cms-menu-btn
      &:hover
          span
            margin-left: 1.3vw
            transition: margin-left 0.3s ease 0s
            +pc-2xl-width
              margin-left: 1.5rem
  .button-area-bottom
    padding-top: 90px
    padding-bottom:7.5vw
    +iphone-width
      padding-top: 120px
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
      justify-content: flex-start
      align-items: center
      padding: 1.2vw 0 1.2vw 0.8vw
      cursor: pointer
      &.join-btn
        width: 50%
        margin: 0 2%
        height: 4vw
        border-radius: 0.4vw
        background: $background-bright-yellow-color
        +iphone-width
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba($background-light-color, 0.20) 0%, rgba($background-light-color, 0.20) 100%), $yellow-active
        span
          color: $text-midnight-gray-color
      img
        margin-right: 0.5vw
</style>
