<template>
  <footer class="flex footer-wrapper">
    <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
      <ul class="provider-list">
        <li class="provider-item" v-for="item in cmsFooterLogos" :key="item">
          <img :src="item" :alt="item.toString()" />
        </li>
      </ul>
    </div>
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content" v-html="cmsFooterTextContent?.content"></div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useRouter } from "vue-router"
import { useSiteImg } from "../../hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE, CMS_ENTRANCE_TYPE } from "src/common/utils/constants"

// const { setDefaultProductTabImg } = useSiteImg()
const router = useRouter()
const { getSquareLogo } = useLogo()
const { nowLang } = useLanguage()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList, cmsListState } = useCms()

const findPageByLang = (pages: { lang: string }[], lang: string) => {
  return pages.find((page: { lang: string }) => page.lang === lang)
}
onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  await handleCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
})
</script>

<style lang="scss">
.logo-list-wrapper {
  @apply my-4;
  .provider-list {
    @apply flex items-center justify-center gap-3;
    .provider-item {
    }
  }
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_ed8888/assets/css/_variable.scss"

footer.footer-wrapper
  padding: 60px calc(1rem + 15px)
  +phone-width
    padding-bottom: 80px

.footer-wrapper
  width: 100%
  background: $bg-footer
  color: $bg-footer-text

  .footer_right
    width: 55vw
    margin: 0 0 0 2vw
    font-size: 0.9vw
    .footer-top
      flex-direction: row
      flex-wrap: wrap
      display: flex
      color:#fff
      .payment-methods
        flex-direction: row
        order: 0
        display: flex
        align-items: center
        align-self: flex-start
        margin-bottom: 0.6vw
        justify-content: flex-start
        width: 90%
        padding-top:1vw
        .title
          margin-right: 16px
          margin-bottom: 0
          display: flex
          justify-content: center
          font-family: OpenSans
        .methods
          display: flex
          flex-wrap: wrap
          justify-content: space-around
          gap: 10px
          align-items: center
      .navigation-menu
        border-radius: 5px
        display: flex
        flex-wrap: wrap
        align-items: center
        justify-content: start
        line-height: 24px
        margin-bottom: 8px
        font-family: OpenSans
        .btn-area
          display: flex
          align-items: center
        .q-size
          font-size: 1vw
          padding: 0.3vw
        .link-seperator
          height: 25px
          margin: 0px 5px
    .footer-bottom
      color: #fff
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        .be-support-content
          display: flex
          color: #fff
          font-size: 1.1vw
          font-family: OpenSans
          .support_pc
            display: block
          .support_m
            display: none
          #footer-responsible-gaming
            display: none
            text-decoration: underline
            cursor: context-menu
            +phone-width
              display: block
      .terms-info
        padding-top: 2vw
        font-family: OpenSans
  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    height: auto
    flex-direction: column
    position: relative
    .footer_left
      margin: 0 0
      width: 100%

  .text-content-wrapper
    .content
      width: 100%
//footer End

// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba(255, 255, 255, 0.70)
  font-family: "Century Gothic"
  font-size: 1.2vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-family: "Century Gothic"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  position: relative
  height: 100vh
  // +iphone-width
  //   height: auto
  .hm-content
    width: calc(100% - 225px)
    height: 100%
    position: relative
    background-color: #24262B
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    margin-left: 225px
    transition: width 0.2s ease 0s
    &.isClose
      width: 100%
      margin-left: 0
    .inner-content
      width: 100%
      height: 100%
      // margin-left: 22%
      &.mobile
        width: 100%
      .page-layout
        height: 100vh
        overflow-y: auto
      +pad-width
        width: 100%
      +iphone-width
        .page-layout
          padding-bottom: 0
</style>
