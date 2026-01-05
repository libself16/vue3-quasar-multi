<template>
  <BannerDownload />
  <div class="download-layout">
    <ContentDownload></ContentDownload>
  </div>
</template>

<script lang="ts">
import BannerDownload from "app/template/set_jokerhill/components/BannerDownload.vue"
import ContentDownload from "app/template/set_jokerhill/layouts/content/download.vue"
import { defineComponent } from "vue"

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
