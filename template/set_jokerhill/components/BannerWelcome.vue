<template>
  <div class="banner-content">
    <div class="banner-img"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.banner-content
  position: relative
  width: 100%
  aspect-ratio: 1560 / 354
  background-size: cover
  background-repeat: no-repeat
  backdrop-filter: blur(100px)
  font-family: "NotoSansTC"
  font-weight: 700
  text-transform: uppercase
  .banner-img
    width: 90%
    height: 25vw
    margin: 2vw auto
    background-image: url("app/template/set_jokerhill/assets/images/banner/welcome.png")
    background-repeat: no-repeat
    background-size: 100%
    +iphone-width
      width: 100%
      height: 100vw
      margin: 0vw auto
      background-image: url("app/template/set_jokerhill/assets/images/banner/m-welcome.png")
  .level-content
    position: absolute
    top: 5vw
    left: 5.781vw
    color: #FFF
    font-size: 1.25vw
    .level-text
      color: $yellow-active
  .account-text
    position: absolute
    top: 6.51vw
    left: 5.781vw
    font-size: 4.167vw
    background: var(--orange-yellow, linear-gradient(90deg, #FF7A00 0%, #FFC002 103.18%))
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
  .member-text
    position: absolute
    top: 9.01vw
    left: 5.781vw
    color: #fff
    font-size: 3.854vw
</style>
