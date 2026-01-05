<template>
  <div class="t-footer">
    <section class="menu-btm">
      <div class="menu-wrapper">
        <a
          v-for="(cmsItem, cmsIndex) in h5MenuList.slice(0, 2)"
          :key="cmsIndex"
          class="menuft"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img
            class="home-title-icon"
            :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
          />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </a>
        <a>
          <div></div>
        </a>
        <a
          v-for="(cmsItem, cmsIndex) in h5MenuList.slice(3, 5)"
          :key="cmsIndex"
          class="menuft"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img class="home-title-icon" :src="cmsItem.Setting.icon_path" />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </a>
        <a
          v-for="(cmsItem, cmsIndex) in h5MenuList.slice(2, 3)"
          :key="cmsIndex"
          class="menuft aff-qr"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img class="home-title-icon" :src="cmsItem.Setting.icon_path" />
        </a>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useEntranceHandler } from "app/template/set33_BLUE/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_DISPLAY_LOGIN, CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "../../utils/constants"

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { cmsListState, handleCmsList } = useCms()
const { isLogin } = useAuth()
const route = useRoute()

const h5MenuList = computed(() => {
  if (!isLogin.value) {
    return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
      return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
    })
  } else {
    return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
      return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
    })
  }
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

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33_BLUE/assets/css/_variable.sass"
@import "app/template/set33_BLUE/assets/css/main.sass"

.t-footer
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    max-width: 991px
    margin: auto
    width: 100%
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #016E48
    width: 15%
    height: 100%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 26px
    margin: auto
    z-index: 9
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    a
      color: #fff
      font-size: 9px
      text-transform: uppercase
      font-weight: 600
      padding: 5px 0
    .menuft
      @apply flex flex-col items-center justify-center
      img
        max-width: 33%
        margin: auto
        filter: brightness(0) invert(1)
</style>
