<template>
  <div class="promotion-layout">
    <ContentPromotion></ContentPromotion>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import ContentPromotion from "app/template/epicwin/layouts/content/promotion.vue"

export default defineComponent({
  name: "HomePromotion",
  components: {
    ContentPromotion
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.promotion-layout
  padding-bottom: 20vw
</style>
