<template>
  <q-header class="header-container">
    <!-- logo -->
    <div class="logo-container">
      <router-link
        :to="{
          name: 'HomePage'
        }"
      >
        <img class="w-full h-auto" :src="getWideLogo()" alt="logo" :class="{ invisible: !getWideLogo() }" />
      </router-link>
    </div>
    <!-- menu -->
    <q-list class="menu-list">
      <q-item
        :class="{
          active: route.name === 'PopularLobby'
        }"
      >
        <q-item-section>
          <router-link
            class="navlink"
            :to="{
              name: 'PopularLobby'
            }"
          >
            <span class="uppercase text-nowrap">{{ $t("home.popularGames") }}</span>
          </router-link>
        </q-item-section>
      </q-item>
      <q-item
        v-for="item in filteredGameList()"
        :key="item.game_type"
        :class="{
                active: route.params.gameType as any as GAME_TYPE.Enums == item.id
              }"
      >
        <q-item-section>
          <router-link
            class="navlink"
            :to="{
              name: 'ProductLobby',
              params: { gameType: item.id }
            }"
          >
            <span class="uppercase text-nowrap">{{ $t(`menu.${item.frontendKey}`) }}</span>
          </router-link>
        </q-item-section>
      </q-item>
      <q-item
        :class="{
          active: route.name === 'FavouriteLobby'
        }"
      >
        <q-item-section>
          <router-link
            class="navlink"
            :to="{
              name: 'FavouriteLobby'
            }"
          >
            <span class="uppercase text-nowrap">{{ $t("home.favourite") }}</span>
          </router-link>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- toolbar -->
    <div class="toolbar">
      <q-btn v-if="!isLogin && !isMobile" rounded color="login" :to="{ name: 'Login' }">
        {{ $t("common.btn.login") }}
      </q-btn>
      <q-list v-if="isLogin && !isMobile" class="tool-list">
        <q-item>
          <q-icon name="person_outline"></q-icon>
          <span>
            {{ userInfo.nickname || userInfo.username }}
          </span>
        </q-item>
        <q-item>
          <WalletDropdown />
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'MemberProfile' }" flat>{{ $t("common.btn.account") }}</q-btn>
        </q-item>
        <q-item class="logout">
          <q-btn class="px-0" :loading="isLoading" @click="logout" flat>{{ $t("common.btn.logout") }}</q-btn>
        </q-item>
      </q-list>
      <LanguageDropdown class="language-bar" btnSize="md" iconRight="expand_more" />
      <q-btn class="mobile-menu-btn" round @click="drawer = !drawer">
        <img :src="iconPng('menu')" alt="" />
      </q-btn>
    </div>
  </q-header>
  <!-- nav -->
  <q-drawer
    v-model="drawer"
    show-if-above
    :show-overlay="true"
    overlay-color="rgba(0, 0, 0, 0.5)"
    overlay
    side="right"
    :width="250"
    :breakpoint="1200"
  >
    <q-scroll-area class="fit">
      <div class="flex justify-end">
        <q-btn round @click="drawer = !drawer">
          <img :src="iconPng('menu-close')" alt="" />
        </q-btn>
      </div>
      <div v-if="!isLogin" class="flex justify-end mt-5">
        <q-btn rounded color="login" :to="{ name: 'Login' }">
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <q-list v-else class="tool-list">
        <q-item>
          <q-icon name="person_outline"></q-icon>
          <span> {{ userInfo.nickname || userInfo.username }}</span>
        </q-item>
        <q-item>
          <WalletDropdown />
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'MemberProfile' }">{{ $t("common.btn.account") }}</q-btn>
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'FavouriteLobby' }">{{ $t("home.favourite") }}</q-btn>
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'MemberDeposit' }">{{ $t("menu.credit") }}</q-btn>
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'MemberHistory' }">{{ $t("menu.history") }}</q-btn>
        </q-item>
        <q-item>
          <q-btn class="px-0" :to="{ name: 'MemberKyc' }">{{ $t("menu.kyc") }}</q-btn>
        </q-item>
        <q-item v-if="isCredit && userInfo.is_member_agent">
          <q-btn class="px-0 membership" :to="{ name: 'MembershipManagement' }">{{
            $t("menu.membershipManagement")
          }}</q-btn>
        </q-item>
        <q-item class="logout">
          <q-btn class="px-0" :loading="isLoading" @click="logout">{{ $t("common.btn.logout") }}</q-btn>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useLogo } from "src/common/composables/useLogo"
import { GAME_TYPE } from "src/common/utils/constants"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import WalletDropdown from "app/template/set_amuse/components/Header/components/WalletDropdown.vue"
import { useEnv } from "src/common/hooks/useEnv"

const $q = useQuasar()
const { isCredit } = useEnv()
const { iconPng } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { isLogin, handleLogout, isLoading } = useAuth()
const { userInfo } = useUserInfo()
const { gameTypeState } = useGame()
const { getWideLogo } = useLogo()

const isMobile = computed(() => $q.screen.width < 992)
const drawer = ref(false)

const filteredGameList = () => {
  return gameTypeState.list.filter((item) => item.id !== GAME_TYPE.Enums.CASINO_PREMIUM)
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "Login" })
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_amuse/assets/css/_variable.sass"

.header-container
  @apply flex flex-row justify-between items-center px-16 py-8 bg-transparent
  width: 100vw
  background: url("../../assets/images/bg.png") no-repeat
  background-size: cover
  +pc-width
    @apply p-8
  +pad-width
    @apply flex-wrap
    padding: 1rem 0
  .logo-container
    width: 7.25rem
    min-width: 7.25rem
    height: 2.8125rem
    min-height: 2.8125rem
    cursor: pointer
    order:1
    +pad-width
      margin-left:2rem
    +phone-width
      width: 4.875rem
      height: 1.5rem
  .menu-list
    &::-webkit-scrollbar
      display: none
    @apply flex order-2 gap-10 overflow-x-auto mx-5 pb-2
    +pc-width
      @apply gap-5
    +pad-width
      @apply order-3 mt-3 gap-10 mx-0
      width: 100vw
      padding: 0.7rem 2rem 0.7rem 2rem
    +phone-width
      @apply gap-5
      background: black
      padding: 0.7rem 2rem 0.7rem 2rem
      display: none
    .q-item
      padding:0
      min-height: 1.875rem
      .navlink
        padding-bottom: .125rem
    .q-item.active
      .q-item__section
        padding:0
        .navlink
          border-bottom: 1px solid $primary-color

  .toolbar
    @apply flex items-center order-3
    +pad-width
      @apply order-2
      margin-right:1rem
    +phone-width

    .tool-list
      @apply flex mb-2
      color:$gold-color
      gap: 1.125rem
      .q-item
        @apply flex items-center gap-1 px-0 text-nowrap
        &.logout
          color: $primary-color
        .q-icon
          @apply text-xl
    .language-bar
      @apply mb-2
      :deep(.q-btn__content)
        @apply flex-nowrap
    .mobile-menu-btn
      display: none
      +pad-width
        display: block
      img
        @apply w-10 h-10

.bg-login
  width: 8.125rem
  height: 1.5625rem
  border: 1px solid $primary-color
  margin-right: .25rem

:deep(.q-drawer)
  @apply bg-black text-white pt-8 pr-8
  height: 34rem !important
  .tool-list
    @apply flex flex-col items-end mt-5 pr-1
    color:$gold-color
    gap: 1.125rem
    width: 13.75rem
    .q-item
      @apply flex items-center gap-1 pr-5 py-0
      &.logout
        color: $primary-color
      .q-icon
        @apply text-xl

.membership
  :deep(.q-btn__content)
    +phone-width
      text-align: right
</style>
