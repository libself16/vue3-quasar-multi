<template>
  <div class="footer-wrapper" :class="route?.meta?.footerContentClass">
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
  </div>

  <!-- h5 menu -->
  <div :class="route?.meta?.footerNavClass">
    <div class="phone:h-[11.9vw] iphone:h-[3.875rem]"></div>
    <div class="m-footer-bottom">
      <section class="menu-btm">
        <div class="menu-wrapper">
          <template v-for="(cmsItem, cmsIndex) in h5BottomMenuList" :key="cmsIndex">
            <q-btn
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
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntranceHandler } from "app/template/set_r017/composables/useCms"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { MENU } from "app/template/set_r017/utils/constants"
import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { nowLang } = useLanguage()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList, h5BottomMenuList } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { setDefaultProductTabImg } = useSiteImg()

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
@import "app/template/set_r017/assets/css/_variable.scss"

.footer-wrapper
  width: 100%
  background: $neutral10
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
    padding: 1.5rem 1.375rem 30%
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
    height: 12vw
    bottom: 0
    left: 0
    right: 0
    background: $secondary02
    +iphone-width
      height: 3.875rem
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
    display: flex
    justify-content: space-around
    text-align: center
    padding: 0.28125rem 0
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
        width: 2.25rem
        height: 2.25rem
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
