<template>
  <div class="lobby-layout">
    <ContentLobby></ContentLobby>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
import MarqueeTag from "src/common/components/MarqueeTag.vue"
import ContentLobby from "app/template/okbet_red/layouts/content/lobby.vue"

import "vue3-carousel/dist/carousel.css"

interface GameItem {
  fileName: string
  title: string
}

export default defineComponent({
  name: "AsideMenu",
  components: {
    ContentLobby
  },
  setup() {
    let gameAreaList: Ref<GameItem[]> = ref([
      {
        fileName: "new-game",
        title: "NEW GAME"
      },
      {
        fileName: "popular",
        title: "POPULAR"
      }
    ])

    return {
      gameAreaList
    }
  },
  mounted() {
    console.log("mounted")
  }
})
</script>

<style lang="sass" scoped>
.lobby-layout
  padding-bottom: 20vw
</style>
