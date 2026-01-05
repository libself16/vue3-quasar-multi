<template>
  <div class="follow-content">
    <ul class="follow-box">
      <li v-for="item in followList" :key="item">
        <img :src="followImg(item)" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { defineComponent, ref, Ref, computed, watch } from "vue"

interface GameItem {
  fileName: string
  title: string
}

export default defineComponent({
  name: "FishContent",
  components: {},
  setup() {
    const { followImg } = useSiteImg()
    let isMobile = ref(false)
    const followList: Ref<string[]> = ref(["facebook", "instagram", "telegram", "twitter", "youtube"])

    return {
      followList,
      isMobile,
      // 圖片類
      followImg
    }
  },
  mounted() {
    console.log("mounted")
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

// layout style
.follow-content
  +setFlex
  // flex-direction: row
  .follow-box
    width: 60vw
    display: flex
    justify-content: flex-start
    align-items: center
    flex-wrap: wrap
    vertical-align: top
    li
      width: 30vw
      min-height: 150px
</style>
