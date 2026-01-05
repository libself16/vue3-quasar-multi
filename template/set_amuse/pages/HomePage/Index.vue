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
      <FooterComp />
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
            :class="{ active: isActive('ProductLobby') }"
            @click="
              $router.push({
                name: 'ProductLobby',
                params: { gameType: GAME_TYPE.Enums.LIVECASINO }
              })
            "
          >
            <img :src="isActive('ProductLobby') ? footerImg('footer-casino-active') : footerImg('footer-casino')" />

            <p>{{ $t("menu.casino") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <div></div>
          <q-btn
            flat
            fab-mini
            class="menuft"
            :class="{ active: isActive('GameLobby') }"
            @click="
              $router.push({
                name: 'GameLobby',
                params: { gameType: GAME_TYPE.Enums.SLOT }
              })
            "
          >
            <img :src="isActive('GameLobby') ? footerImg('footer-slots-active') : footerImg('footer-slots')" />
            <p>{{ $t("menu.slots") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <q-btn flat fab-mini class="menuft" @click="handleOpenLineLink">
            <img :src="footerImg('footer-support')" />
            <p>{{ $t("menu.support") }}</p>
            <div class="menu_line"></div>
          </q-btn>
          <div
            class="aff-qr"
            @click="$router.push({ name: 'PopularLobby' })"
            :class="{ active: isActive('PopularLobby') }"
          >
            <a>
              <img :src="isActive('PopularLobby') ? footerImg('footer-popular-active') : footerImg('footer-popular')" />
            </a>
          </div>
        </div>
      </section>
    </div>
    <GS1MiniGame />
    <AnnouncementDialog id="announcement-dialog-wrapper" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useInit } from "src/common/composables/useInit"
import { GAME_TYPE } from "src/common/utils/constants"

import HeaderComp from "app/template/set_amuse/components/Header/Index.vue"
import FooterComp from "app/template/set_amuse/components/Footer/Index.vue"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import AnnouncementDialog from "src/common/components/dialog/Announcement/Index.vue"
import "vue3-carousel/dist/carousel.css"

const route: any = useRoute()
const { isReady, initialize } = useInit()
const { footerImg } = useSiteImg()
const { handleOpenLineLink } = useLiveChat("https://lin.ee/z1DurpK")

function isActive(routeName: string) {
  return route.name === routeName
}
onMounted(() => {
  initialize()
})
</script>

<style lang="scss">
.select-announcement-type-popup {
  --ann-select-popup-bg: #272727;
  --ann-select-popup-shadow: 0px 0px 10px 0px #ffffff99;
  --ann-select-option-text: #ffffff;
  --ann-select-option-text-active: #ffffff;
  --ann-select-option-bg-active: #3b3b3b;
}
</style>

<style scoped lang="scss">
#announcement-dialog-wrapper {
  --ann-overlay: #00000099;
  --ann-header: #161616;
  --ann-header-text: #ffffff;
  --ann-header-close: #ffffff;
  --ann-sidebar-bg: #161616;
  --ann-sidebar-text: #ffffff;
  --ann-sidebar-active-bg: #3b3b3b;
  --ann-sidebar-active-text: #ffffff;
  --ann-sidebar-nav-arrow: #ffffff;
  --ann-detail-bg: #000000;
  --ann-detail-text: #ffffff;
  --ann-checkbox-wrapper-bg: #252525;
  --ann-checkbox-bg: #dcdfe6;
  --ann-checkbox-bg-active: #409eff;
  --ann-checkbox-icon: #ffffff;
  --ann-checkbox-text: #ffffff;
  --ann-select-bg: linear-gradient(180deg, #f7d99d 0%, #a48155 100%);
  --ann-select-text: #000000;
  --ann-select-icon: #000000;
}
</style>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_amuse/assets/css/_variable.sass"
@import "app/template/set_amuse/assets/css/main.sass"
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
    padding: 3.5%
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
</style>
