<template>
  <div class="web-information-layout">
    <ContentWebInformation></ContentWebInformation>
  </div>
  <FooterArea class="footer-area"></FooterArea>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue"
import ContentWebInformation from "app/template/bmm_set_obtd/layouts/content/WebInformation/Index.vue"
import FooterArea from "app/template/bmm_set_obtd/components/Footer/Index.vue"

export default defineComponent({
  name: "HomeWebInformation",
  components: {
    ContentWebInformation,
    FooterArea
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.footer-area {
  @include phone-width {
    display: none;
  }
}
</style>
