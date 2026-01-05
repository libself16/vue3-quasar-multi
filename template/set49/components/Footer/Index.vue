<template>
  <div class="footer-wrapper">
    <!-- footer logos -->
    <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
      <ul class="flex flex-row justify-center provider-list">
        <li
          class="flex justify-center flex-initial px-0 py-2 sm:px-4 provider-item"
          v-for="item in cmsFooterLogos"
          :key="item"
        >
          <img :src="item" :alt="item.toString()" @error="setDefaultProductTabImg" />
        </li>
      </ul>
    </div>
    <!-- footer editor -->
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content" v-html="cmsFooterTextContent?.content"></div>
    </div>
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
              <div></div>
              <div
                class="aff-qr"
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
              </div>
            </template>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/set49/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE, CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import { GAME_TYPE } from "src/common/utils/constants"
import { MENU } from "app/template/set49/utils/constants"
import type * as Response from "src/api/response.type"

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
  setDefaultProductTabImg
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
  background: #0F0F10
  padding: 0 14%
  padding-top: 1vw
  padding-bottom: 1vw

  .logo-list-wrapper,
  .text-content-wrapper
    width: 90%
    max-width: 87.5rem

  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    padding: 5% 8% 30%
    height: auto
    flex-direction: column
    position: relative
    .logo-list-wrapper,
    .text-content-wrapper
      width:100%

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
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #FFC002
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    img
      opacity: 0.7
      filter: brightness(255) invert(1)
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



//footer End
</style>
