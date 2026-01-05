<template>
  <div class="marquee-area">
    <img :src="svgIcon('marquee')" alt="marquee-icon" />
    <marquee width="100%" direction="left" height="40px">
      welcome to {{ companyName }} bonus 100% sign up & get reward!
    </marquee>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"

const { svgIcon } = useSiteImg()
const { companyName } = useEnv()
</script>

<style scoped lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

.marquee-area
  display: block
  width: 100%
  border-radius: 999px
  height: 2.5rem
  line-height: 2.5rem
  padding-left: 3.5rem
  background: $secondary06
  backdrop-filter: blur(2px)
  +iphone-width
    line-height: 1.875rem
    height: 1.875rem
    padding-left: 1.5rem
    margin: 0.75rem 0
  marquee
    color: $neutral02
    line-height: 2.5rem
    height: 2.5rem
    font-size: 1.1rem
    +pad-width
      font-size: 1rem
    +iphone-width
      line-height: 1.875rem
      height: 1.875rem
      font-size: .75rem
  img
    width: 2rem
    position: absolute
    left: 1rem
    top: .2rem
    +iphone-width
      width: 1.1719rem
      top: .4688rem
      left: 0
</style>
