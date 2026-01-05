<template>
  <BannerWebInformation />
  <div class="web-information-layout">
    <ContentWebInformation></ContentWebInformation>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import ContentWebInformation from "app/template/set49/layouts/content/WebInformation/Index.vue"

import BannerWebInformation from "app/template/set49/components/BannerWebInformation.vue"

export default defineComponent({
  name: "HomeWebInformation",
  components: {
    ContentWebInformation,
    BannerWebInformation
  }
})
</script>
<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.web-information-layout
  +iphone-width
    padding-bottom: 20vw
</style>
