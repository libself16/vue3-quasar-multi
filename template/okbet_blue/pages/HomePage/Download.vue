<template>
  <BannerDownload />
  <div class="download-layout">
    <ContentDownload></ContentDownload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ContentDownload from "app/template/okbet_blue/layouts/content/download.vue"
import BannerDownload from "app/template/okbet_blue/components/BannerDownload.vue"

export default defineComponent({
  name: "HomeDownload",
  components: {
    ContentDownload,
    BannerDownload
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.download-layout
  padding-bottom: 0 !important
  margin-bottom: 0 !important
</style>
