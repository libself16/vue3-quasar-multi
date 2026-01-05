<template>
  <!-- <div class="cover" v-show="isMobile && modelValue" @click="$emit('update:modelValue', false)"></div> -->
  <div class="mobile-side-menu" :class="{ isOpen: modelValue }">
    <!-- <q-btn class="logo" flat :to="{ name: 'home' }">
      <img :src="logoImg" alt="" @click="router.push({ name: 'home' })" />
    </q-btn> -->
    <div class="logo">
      <img v-if="getWideLogo()" class="mobile-logo-image" :src="getWideLogo()" alt="mobile-logo" />
      <div class="btn-area">
        <div class="circle-btn left-btn" @click="goIndex"></div>
        <div class="circle-btn right-btn" @click="$emit('update:modelValue', false)"></div>
      </div>
    </div>
    <HomeBanner />
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
          <q-btn class="normal-btn btn-common" :class="{ 'btn-common-active': isAccountActive }" align="left">
            <img class="btn-icon" :src="resultImages('my-account.png')" alt="" />
            <span class="btn-title">{{ $t("menu.myAccount") }}</span>
            <div class="arrow-link"></div>
          </q-btn>
        </template>
        <template #default>
          <ul class="account-list">
            <q-btn
              @click="setActiveItem('account', 'memberProfile')"
              class="normal-btn account-inner-title"
              align="left"
              :to="{ name: 'memberProfile' }"
            >
              <span
                class="btn-title"
                :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'memberProfile' }"
                >{{ $t("menu.memberCenter") }}</span
              >
              <div class="arrow-link"></div>
            </q-btn>
            <q-btn
              @click="setActiveItem('account', 'MemberDeposit'), handleRedirectDeposit()"
              class="normal-btn account-inner-title"
              align="left"
            >
              <span
                class="btn-title"
                :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberDeposit' }"
                >{{ $t("menu.deposit") }}</span
              >
              <div class="arrow-link"></div>
            </q-btn>
            <q-btn
              @click="setActiveItem('account', 'MemberWithdrawal'), handleRedirectWithdrawal()"
              class="normal-btn account-inner-title"
              align="left"
            >
              <span
                class="btn-title"
                :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberWithdrawal' }"
                >{{ $t("menu.withdrawal") }}</span
              >
              <div class="arrow-link"></div>
            </q-btn>
            <q-btn
              @click="setActiveItem('account', 'history')"
              class="normal-btn account-inner-title"
              align="left"
              :to="{ name: 'history' }"
            >
              <span
                class="btn-title"
                :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'history' }"
                >{{ $t("menu.history") }}</span
              >
              <div class="arrow-link"></div>
            </q-btn>
            <q-btn
              @click="setActiveItem('account', 'orders')"
              class="normal-btn account-inner-title"
              align="left"
              :to="{ name: 'orders' }"
            >
              <span
                class="btn-title"
                :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'orders' }"
                >{{ $t("menu.order") }}</span
              >
              <div class="arrow-link"></div>
            </q-btn>
          </ul>
        </template>
      </q-expansion-item>
      <q-btn
        v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
        :key="cmsIndex"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': isActive(cmsItem.Entrance[0]) }"
        align="left"
        @click="handleAsideClick(cmsItem.Entrance[0])"
      >
        <!-- <img :src="svgIcon(item.frontendKey as string)" alt="" /> -->
        <img
          v-if="cmsItem.Setting.icon_path"
          class="home-title-icon"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <div v-else class="home-title-icon"></div>
        <span class="btn-title">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
        <div class="arrow-link"></div>
      </q-btn>
      <!-- <q-btn
        v-for="item in gameTypeState.list"
        :key="item.game_type"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': activeItem.type === 'game' && activeItem.id === item.id }"
        @click="setActiveItem('game', item.id)"
        align="left"
        :to="{ name: 'ProductLobby', params: { gameType: item.id } }"
      >
        <img
          class="btn-icon"
          :src="
            menuIcon(
              item.frontendKey || '',
              activeItem.type === 'game' && activeItem.id === item.id ? 'active' : 'normal'
            )
          "
          alt=""
        />
        <span class="btn-title">{{ $t(`menu.${item.frontendKey}`) }}</span>
        <div class="arrow-link"></div>
      </q-btn>
      <q-btn
        @click="setActiveItem('other', 'promotion')"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': activeItem.type === 'other' && activeItem.id === 'promotion' }"
        align="left"
        :to="{ name: 'promotion' }"
      >
        <img
          class="btn-icon"
          :src="
            menuIcon('promotion', activeItem.type === 'other' && activeItem.id === 'promotion' ? 'active' : 'normal')
          "
          alt=""
        />
        <span class="btn-title">{{ $t("menu.promotion") }}</span>
        <div class="arrow-link"></div>
      </q-btn>
      <q-btn
        @click="setActiveItem('other', 'News')"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': activeItem.type === 'other' && activeItem.id === 'News' }"
        align="left"
        :to="{ name: 'News' }"
      >
        <img
          class="btn-icon"
          :src="menuIcon('news', activeItem.type === 'other' && activeItem.id === 'News' ? 'active' : 'normal')"
          alt=""
        />
        <span class="btn-title">{{ $t("menu.news") }}</span>
        <div class="arrow-link"></div>
      </q-btn> -->

      <!-- <q-btn
        @click="setActiveItem('other', 'MemberKyc')"
        class="normal-btn btn-common"
        :class="{ 'btn-common-active': activeItem.type === 'other' && activeItem.id === 'MemberKyc' }"
        align="left"
        :to="{ name: 'MemberKyc' }"
        v-if="isLogin"
      >
        <img
          class="btn-icon"
          :src="
            menuIcon('icon_kyc', activeItem.type === 'other' && activeItem.id === 'MemberKyc' ? 'active' : 'normal')
          "
          alt=""
        />
        <span class="btn-title">{{ $t("menu.getVerify") }}</span>
        <div class="arrow-link"></div>
      </q-btn> -->
      <q-btn v-if="isLogin && !isMayaLogin" class="normal-btn btn-logout" @click="logout" :loading="isLoading">
        <img class="btn-icon" :src="svgIcon('logout')" alt="" />
        <span class="btn-title">{{ $t("common.btn.logout") }}</span>
        <div class="arrow-link"></div>
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
import HomeBanner from "app/template/okbet_purple/components/Banner/HomeBanner.vue"
import { useEntranceHandler } from "app/template/okbet_purple/composables/useCms"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteRedirect } from "app/template/okbet_purple/composables/useSiteRedirect"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, defineEmits, defineProps, nextTick, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../utils/constants"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["update:modelValue"])

const $q = useQuasar()
const { t } = useI18n()
const { cmsListState, handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { nowLang } = useLanguage()
const { svgIcon, menuIcon, resultImages } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, isMayaLogin, handleLogout, isLoading } = useAuth()
const { gameTypeState } = useGame()
const { commonSvgIcon } = useCommonImg()
const eventbus = injectStrict(EventBusKey)
const { getWideLogo } = useLogo()
const { handleEntranceClick } = useEntranceHandler()
const { handleRedirectDeposit, handleRedirectWithdrawal } = useSiteRedirect()

let isMobile = ref(false)
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

const goIndex = () => {
  emit("update:modelValue", false)
  setTimeout(async () => {
    await nextTick()
    router.push({ name: "home" })
  }, 100)
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  $q.notify({
    type: "positive",
    message: t("common.alarm.logoutSuccess"),
    position: "top",
    timeout: 1000
  })
}

function handleAsideClick(entrance: any) {
  emit("update:modelValue", false)
  handleEntranceClick({
    entrance: entrance
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

watch(
  route,
  (newRoute) => {
    emit("update:modelValue", false)

    const newPath = newRoute.path

    // 當不在與member相關的path須重設activeItem
    // 避免持續顯示active Class
    if (!newPath.includes("member")) {
      activeItem.value = { type: "game", id: 0 }
      memberMenuExpanded.value = false
    }
  },
  { immediate: true }
)

// Listen for event bus updates when navigation happens without a refresh
eventbus.on("updateAsideMenu", ({ type, id }) => {
  setActiveItem(type, id)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/_variable.sass"


$white-70:rgba(255, 255, 255, 0.7)
::-webkit-scrollbar
  display: none

.q-btn
  &:before
    box-shadow: none
// common style
.home-title-icon
  width: 1.25rem
.circle-btn
  display: block
  width: 35px
  height: 35px
  background-repeat: no-repeat
  background-size: 100%
  background-position: center center
  margin: 0 5px
  &.left-btn
    background-image: url('../assets/images/aside/aside-home.png')
  &.right-btn
    background-image: url('../assets/images/aside/aside-close.png')
.btn-title
  color: rgb(109, 118, 147)
  font-family: OpenSans, "PingFang SC", "Microsoft YaHei", D-DIN, Arial, SimHei, Helvetica, sans-serif
  font-weight: 400
  font-size: 16px
  font-style: normal
  line-height: normal
.btn-content
  color: rgba(255, 255, 255, 0.70)
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
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 10
.mobile-side-menu
  flex-shrink: 0
  width: 12.5rem
  height: 100vh
  vertical-align: top
  display: table-cell
  background-color: $bg-dark
  overflow-y: auto
  position: absolute
  left: 0
  z-index: 100
  transition: width 0.2s ease 0s
  +phone-width
    width: 0
  &.isOpen
    width: 100%
  .menu-toggle
    cursor: pointer
    z-index: 9
    position: absolute
    right: 0
  .logo
    +setFlex(flex-start)
    padding: 3vw
    width: 100%
    transition: width 0.2s ease 0s
    position: relative
    height: 78px
    margin: 0 auto 2vw
    cursor: pointer
    z-index: 9
    box-shadow: rgba(0, 0, 0, 0.05) 2px 0px 14px, rgba(0, 0, 0, 0.05) 0px 2px 14px
    background-image: url('../assets/images/aside/aside-header-bg.png')
    background-repeat: no-repeat
    :deep(.q-focus-helper)
      opacity: 0 !important
    .mobile-logo-image
      @apply w-auto h-[3.4375rem] max-w-full object-contain
    .btn-area
      width: auto
      +setFlex
      position: absolute
      right: 1rem
  .button-account
    width: 100%
    padding: 0.5vw 0
    :deep(.q-item)
      padding: 0
      .q-focus-helper
        opacity: 0 !important
      .q-item__section.q-focusable
        display: none
    .account-list
      margin-left: 8vw
      .account-inner-title
        color: rgb(109, 118, 147)
        font-family: OpenSans
        padding: 0 2px
        font-weight: 400
        font-style: normal
        line-height: normal
        text-transform: uppercase
        border-bottom: 1px solid rgba(255, 255, 255, 0.1)
        :deep(.q-btn__content)
          font-size: 12px
      .account-item
        list-style: disc
        font-size: 12px
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
      position: relative
      cursor: pointer
      display: flex
      justify-content: flex-start
      border-bottom: 1px solid rgba(255, 255, 255, 0.1)
      align-items: center
      width: 100%
      height: auto
      border-radius: 0
      margin-left: 0
      text-transform: none
      padding: 16px 0
      .btn-icon
        width: 20px
      .arrow-link
        position: absolute
        right: 0
        width: 20px
        height: 20px
        background-image: url('../assets/images/aside/arrow.png')
        background-repeat: no-repeat
        background-size: 100%
      +iphone-width
        // height: 10vw
        // padding: 1.2vw 7vw
      span
        margin: 0 1vw
        text-transform: none
        +iphone-width
          margin: 0 3vw
      &.btn-logout
        display: grid
        background: transparent
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
      &:last-child
        border-bottom: none
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
      // +iphone-width
      //   display: none
    div
      display: flex
      justify-content: flex-start
      align-items: center
      padding: 1.2vw 0 1.2vw 0.8vw
      cursor: pointer
      &.login-btn
        width: 48%
        margin: 0 2%
        height: 4vw
        line-height: 4vw
        border-radius: 0.4vw
        background: #652DCC
        +iphone-width
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), #652DCC
          color: rgba(255, 255, 255, 0.70)
      &.join-btn
        width: 48%
        margin: 0 2%
        height: 4vw
        border-radius: 0.4vw
        background: #FFC002
        +iphone-width
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), $yellow-active
        span
          color: #24262B
      img
        margin-right: 0.5vw

.btn-common-active
  background-color: $bg-primary !important
  span
    color: $text-light-primary
    text-shadow: $text-light-effect-strong
.btn-title-active
  color: $text-light-primary
  text-shadow: $text-light-effect-strong
</style>
