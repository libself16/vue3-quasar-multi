<template>
  <div class="download-layout">
    <div class="download-show-area">
      <img v-if="!isMobile" :src="downloadPageImg" />
      <img v-if="isMobile" :src="mDownloadPageImg" />
      <div class="download-content">
        <div v-if="isMobile" class="download-content-title">
          <h4>{{ $t("app.appDownloadTitle") }}</h4>
          <p>{{ $t("app.appDownloadDetail") }}</p>
        </div>
        <div class="download-app-content">
          <div class="app-download-qr" v-for="(item, key) in appList" :key="key">
            <img :src="item.title" />
            <div class="app-download-btn">
              <i class="fab" :class="item.icon"></i>
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { ref, watch } from "vue"
import "vue3-carousel/dist/carousel.css"
const { width } = useWindowSize()
const { downloadPageImg, mDownloadPageImg, downloadPageAndroidQRImg, downloadPageAppleQRImg } = useSiteImg()
const appList = ref([
  {
    title: downloadPageAndroidQRImg,
    name: "Android",
    icon: "fa-android"
  },
  {
    title: downloadPageAppleQRImg,
    name: "IOS",
    icon: "fa-apple"
  }
])
let isMobile = ref(false)
watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

// layout style
.download-layout
  padding-bottom: 0 !important
  margin-bottom: 0 !important
  cursor: pointer
  +setFlex
  +iphone-width
    padding-bottom: 100vw
  .download-show-area
    position: relative
    width: 100%
    max-width: 1200px
    margin: 0 auto
    padding: 10px
    .download-content
      max-width: 40%
      position: absolute
      right: 1%
      top: 38%
      display: flex
      gap: 5%
      +phone-width
        position: relative
        margin: 0px auto
        max-width: 100%
        left: 0
        right: 0
        justify-content: center
        padding: 15px
        flex-direction: column
        align-items: center
        background: #011422
        border: 1px solid #008ff7
        border-radius: 10px
        margin-top: 10px
        gap: 20px
      &-title
        h4
          color: #a4ff00
          font-weight: bold
          text-align: center
          font-size: 20px
        p
          color: #fff
          font-size: 18px
          line-height: 6px
          font-weight: bold
          text-align: center
      .download-content
        max-width: 40%
        position: absolute
        right: 1%
        top: 38%
        display: flex
        gap: 5%
        +phone-width
          position: relative
          margin: 0px auto
          max-width: 100%
          left: 0
          right: 0
          padding: 15px
          flex-direction: column
          +setFlex
          background: #011422
          border: 1px solid #008ff7
          border-radius: 10px
          margin-top: 10px
      .download-app-content
        +setFlex(flex-start,  center)
        gap: 10px
        +phone-width
          +setFlex(center,  center)
          gap: 20px
        .app-download-qr
          max-width: 40%
          img
            max-width: 100%
            padding-bottom: 10px
            border-radius: 0px
            padding-bottom: 10px
          +phone-width
            max-width: 30%
        .app-download-btn
          +setFlex
          color: #fff
          padding: 10px 0px
          font-size: 14px
          font-weight: bold
          text-transform: uppercase
          background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%)
          box-shadow: inset 0px 0px 5px #fff
          border: none
          border-radius: 20px
          i
            padding-right: 10px
          +phone-width
            padding: 7px
            font-size: 3vw
        img
          border-radius: 0px
</style>
