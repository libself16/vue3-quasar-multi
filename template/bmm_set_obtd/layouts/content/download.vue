<template>
  <div class="download-content">
    <div class="download-show-area">
      <img :src="downloadPageImg" class="desktop-download" />
      <img :src="mDownloadPageImg" class="mobile-download" />
      <img :src="mDownloadPageImg2" class="mobile-download" />
    </div>
  </div>
</template>

<script lang="ts">
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { defineComponent } from "vue"
import "vue3-carousel/dist/carousel.css"

export default defineComponent({
  name: "HomeDownload",
  setup() {
    const { downloadPageImg, mDownloadPageImg, mDownloadPageImg2 } = useSiteImg()
    return {
      downloadPageImg,
      mDownloadPageImg,
      mDownloadPageImg2
    }
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

// layout style
.download-content
  cursor: pointer
  +setFlex
  .download-show-area
    .desktop-download
      +phone-width
        display: none
      +iphone-width
        display: none
    .mobile-download
      display: none
      +phone-width
        display: block
      +iphone-width
        display: block
</style>
