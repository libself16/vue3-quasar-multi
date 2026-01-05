<template>
  <div class="footer-wrapper">
    <!-- h5 menu -->
    <div class="m-footer-bottom">
      <section class="menu-btm">
        <div class="menu-wrapper">
          <template v-for="(cmsItem, cmsIndex) in h5BottomMenuList" :key="cmsIndex">
            <q-btn
              v-if="cmsIndex !== 2"
              flat
              fab-mini
              class="menuft"
              @click="
                handleEntranceClick({
                  entrance: cmsItem.Entrance[0],
                  opening_method: cmsItem.Setting.payload.opening_method
                })
              "
            >
              <img
                :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
              />
              <p>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
            </q-btn>
            <template v-else>
              <div />
              <div
                class="aff-qr"
                @click="
                  handleEntranceClick({
                    entrance: cmsItem.Entrance[0],
                    opening_method: cmsItem.Setting.payload.opening_method
                  })
                "
              >
                <img :src="leftHandImg" class="left-hand" />
                <img :src="rightHandImg" class="right-hand" />
                <div />
                <img
                  :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
                />
                <span class="center-text">
                  {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
                </span>
              </div>
            </template>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { MENU } from "app/template/set_r016/utils/constants"
import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { companyName, nowHost } = useEnv()
const { nowLang } = useLanguage()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList, h5BottomMenuList } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const {
  svgIcon,
  liveChatImg,
  contactImg,
  contactDetailImg,
  loginTitleImg,
  registerTitleImg,
  footerSvg,
  footerImg,
  logoImg,
  setDefaultProductTabImg,
  leftHandImg,
  rightHandImg
} = useSiteImg()

const getRouterInfo = (did?: string) => {
  if (!did) return ""
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: Response.CmsEntranceItem) => {
  if (entrance.payload.game_type) {
    const routeGameType = parseInt(route.params.gameType as string)
    return routeGameType === entrance.payload.game_type
  }
  return route.name === getRouterInfo(entrance.payload.did)
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  await handleCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
  await handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
})
</script>

<style scoped lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set49/assets/css/_variable.scss"

.footer-wrapper
  width: 100%
  padding: 0 14%
  padding-top: 1vw
  padding-bottom: 1vw
  display: none

  .logo-list-wrapper,
  .text-content-wrapper
    width: 90%
    max-width: 87.5rem

  +pad-width
    display: block
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    // padding: 5% 8% 30%
    height: auto
    flex-direction: column
    position: relative
    .logo-list-wrapper,
    .text-content-wrapper
      width:100%
  +iphone-width
    // padding: 5% 8% 20%
//H5 底下MENU BAR
.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 90
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
    border-radius: 30px 30px 0px 0px
    background: linear-gradient(180deg, #820000 0%, #540000 100%)
  .aff-qr
    background: linear-gradient(180deg, #CF0808 0%, #540000 100%)
    border-radius: 50%
    width: 3.75rem
    height: 3.75rem
    position: absolute
    left: -1px
    right: 0
    bottom: 20px
    margin: auto
    z-index: 9
    display: flex
    align-items: center
    justify-content: center
    .left-hand
      position: absolute
      width: 4.0625rem
      left: -3.625rem
      bottom: 1.5625rem
    .right-hand
      position: absolute
      width: 4.0625rem
      right: -3.625rem
      bottom: 1.5625rem
    .center-text
      position: absolute
      font-size: .75rem
      font-weight: 600
      text-transform: uppercase
      width: 3.75rem
      right: 0
      bottom: -1.125rem
      color: #fff
    div
      position: absolute
      background: #E5E5E5
      width: 3.5rem
      height: 3.5rem
      border-radius: 50%
    img
      width: 2.5rem
      z-index: 1
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    .menuft
      color: #fff
      font-size: 2.5vw
      text-transform: uppercase
      font-weight: 600
      padding: 0 0
      :deep(.q-btn__content)
        display: block
      :deep(.q-focus-helper)
        opacity: 0
      img
        max-width: 31%
        display: block
        margin: auto auto 2px

      &.active
        overflow: hidden
        img
          position: relative
          left: -100px
          filter: drop-shadow(100px 0px 0px #FFC002)
</style>
