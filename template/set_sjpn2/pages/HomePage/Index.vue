<template>
  <div v-if="isReady">
    <q-layout view="hHh lpr lFf" container style="height: 100dvh">
      <HeaderComp />

      <q-page-container>
        <q-page class="mainWrapper">
          <div class="mx-auto items-center text-white">
            <router-view :key="route.params.gameType" />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
    <div class="m-footer-bottom">
      <section class="menu-btm">
        <div class="menu-wrapper">
          <q-btn
            flat
            fab-mini
            class="menuft"
            :class="{ active: isActive('HomePage') }"
            @click="$router.push({ name: 'HomePage' })"
          >
            <img :src="isActive('HomePage') ? footerImg('footer-home-active') : footerImg('footer-home')" />
            <p>{{ $t("menu.home") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <q-btn
            flat
            fab-mini
            class="menuft"
            :class="{ active: isActive('MemberHistory') }"
            @click="
              $router.push({
                name: 'MemberHistory'
              })
            "
          >
            <img :src="isActive('MemberHistory') ? footerImg('history_2') : footerImg('history')" />

            <p>{{ $t("menu.history") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <div></div>
          <q-btn flat fab-mini class="menuft" @click="logout">
            <img :src="footerImg('Sign out')" />
            <p>{{ $t("menu.logout2") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <q-btn flat fab-mini class="menuft" @click="handleOpenLineLink">
            <img :src="footerImg('footer-support')" />
            <p>{{ $t("menu.support") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <div class="aff-qr" @click="openCurrentGame" :class="{ active: isActive('GameLobby') }">
            <a>
              <img v-if="isAGLM" :src="isActive('GameLobby') ? footerImg('AG') : footerImg('AG')" />
              <img v-else :src="isActive('GameLobby') ? footerImg('Sa_2') : footerImg('Sa')" />
            </a>
          </div>
        </div>
      </section>
    </div>
    <GS1MiniGame />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useInit } from "src/common/composables/useInit"
import HeaderComp from "app/template/set_sjpn2/components/Header/Index.vue"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { useLocalCommon } from "app/template/set_sjpn2/hooks/useLocalCommon"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

import "vue3-carousel/dist/carousel.css"

const route: any = useRoute()
const router = useRouter()
const { isReady, initialize } = useInit()
const { footerImg } = useSiteImg()
const { handleLogout } = useAuth()
const { handleOpenLineLink } = useLiveChat("")
const { openCurrentGame } = useLocalCommon()
const { isAGLM } = useAgentCode()

function isActive(routeName: string) {
  return route.name === routeName
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "Login" })
}

onMounted(() => {
  initialize()
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_sjpn2/assets/css/_variable.sass"
@import "app/template/set_sjpn2/assets/css/main.sass"
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap')

.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    margin: auto
    width: 100%
    height: 18vw
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #000
    padding: 2.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    border: 1px solid rgba(255, 255, 255, 1)
    &.active
      overflow: hidden
      border: 1px solid #ED772E
      box-shadow: 0rem 0rem .5875rem 0rem #ED772E inset


    /*img
      opacity: 0.7
      filter: brightness(255) invert(1)*/
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 0
    height: 100%
    position: relative
    .menuft
      color: #fff
      font-size: 2.5vw
      text-transform: uppercase
      font-weight: 600
      padding: 0 0 .625rem 0
      position: relative
      border-radius : 0 !important
      span
        display: block !important
        padding-top: 1vw
      :deep(.q-focus-helper)
        opacity: 0 !important
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
      .menu_line
        position: absolute
        height: .1875rem
        width: 85%
        left: .4375rem
        bottom: 0rem
        background: #ED772E
        box-shadow: 0rem -0.0625rem .65rem 0rem #ED772E
        display: none
      &.active
        overflow: hidden
        p
          color: #ED772E
        .menu_line
          display: block




.mainWrapper
  font-family: Jost, sans-serif
  min-height: 100dvh !important
</style>
