<template>
  <div class="web-information-layout">
    <ContentWebInformation></ContentWebInformation>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import ContentWebInformation from "app/template/epicwin/layouts/content/WebInformation/Index.vue"

export default defineComponent({
  name: "HomeWebInformation",
  components: {
    ContentWebInformation
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.web-information-layout
  padding-bottom: 20vw
</style>
