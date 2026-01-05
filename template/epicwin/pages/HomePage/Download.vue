<template>
  <div class="download-layout">
    <ContentDownload></ContentDownload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ContentDownload from "app/template/epicwin/layouts/content/download.vue"

export default defineComponent({
  name: "HomeDownload",
  components: {
    ContentDownload
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.download-layout
  padding-bottom: 0 !important
  margin-bottom: 0 !important
</style>
