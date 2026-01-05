<template>
  <div class="contact-wrap">
    <div class="text-center row contact-us-header_inner">
      <div class="contact_dotted">
        <span class="img-cont"><img :src="getCommonSvg('zalo')" /></span>
        <div>
          <a href="https://t.me/onyx2play" target="_blank">09286570888</a>
        </div>
      </div>
      <div class="contact_dotted">
        <span><i class="fab fa-telegram"></i></span>
        <div>
          <a href="https://t.me/onyx2play" target="_blank">+639278077337</a>
        </div>
      </div>
      <div class="contact_dotted">
        <span><i class="fas fa-envelope"></i></span>
        <div><a target="_blank">2375926250@qq.com</a></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
const { getCommonSvg } = useSiteImg()
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.contact-wrap
  max-width: 1366px
  padding: 0
  margin: 0 auto
  +iphone-width
    width: 100%
    padding: 0
  .contact-us-header_inner
    padding-top: 100px
    +iphone-width
      padding-top: 30px
    .contact_dotted
      border-right: 1px dotted #fff
      display: flex
      flex-direction: column
      justify-content: center
      width: 33%
      align-items: center
      font-size: 18px
      img
        height: 100px
        width: 100%
        vertical-align: middle
        +iphone-width
          height: 50px
      i
        font-size: 101px
        +iphone-width
          font-size: 55px
      a
        color: #fff
        font-size: 14px
      span
        margin-bottom: 15px
        +pad-width
          margin: 0 20px 0 0
        +iphone-width
          margin-bottom: 0
      +iphone-width
        border-right: none
        flex-direction: row
        justify-content: flex-start
        width: auto
        border-bottom: 1px dotted #fff
        margin-bottom: 10px
        padding-bottom: 10px
        padding-left: 25px
    +iphone-width
      flex-direction: column
      margin-bottom: 20px
      margin-top: 20px
</style>
