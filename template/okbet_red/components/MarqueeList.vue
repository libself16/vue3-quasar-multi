<template>
  <div class="marquee-area">
    <img :src="svgIcon('sound')" alt="" />
    <marquee width="100%" direction="left" height="40px">
      welcome to {{ companyName }} bonus 100% sign up & get reward!
    </marquee>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"

const { svgIcon } = useSiteImg()
const { companyName } = useEnv()
</script>

<style scoped lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/okbet_red/assets/css/_variable.sass"

.marquee-area
  display: none
  width: 100%
  height: 2.5rem
  line-height: 2.5rem
  padding-left: 7.5rem
  background: rgba($background-denim-blue-color, 0.5)
  backdrop-filter: blur(2px)
  position: absolute
  bottom: 0
  +iphone-width
    line-height: 1.875rem
    height: 1.875rem
    padding-left: 1.5rem
  marquee
    color: rgba($text-light-color, 0.70)
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
    width: 2.5rem
    position: absolute
    left: 5rem
    top: .125rem
    +iphone-width
      width: 1.1719rem
      top: .4688rem
      left: 0
</style>
