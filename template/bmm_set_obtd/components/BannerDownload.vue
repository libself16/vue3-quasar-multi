<template>
  <div class="banner-content">
    <div class="level-content">
      <span>{{ $t("home.downloadApp") }}</span>
    </div>
    <div class="account-text">{{ $t("home.welcome") }}</div>
    <div class="member-text">{{ companyName }}</div>
  </div>
</template>

<script setup lang="ts">
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

.banner-content
  position: relative
  width: 100%
  aspect-ratio: 1560 / 354
  background: linear-gradient(0deg, rgba($background-dark-color, 0.70) 0%, rgba($background-dark-color, 0.70) 100%), url("app/template/bmm_set_obtd/assets/images/banner/webInformation.jpg"), lightgray 50%
  background-size: cover
  background-repeat: no-repeat
  backdrop-filter: blur(100px)
  font-family: "Century Gothic"
  font-weight: 700
  text-transform: uppercase
  .level-content
    position: absolute
    top: 5vw
    left: 5.781vw
    color: $text-light-color
    font-size: 1.25vw
    .level-text
      color: $yellow-active
  .account-text
    position: absolute
    top: 6.51vw
    left: 5.781vw
    font-size: 4.167vw
    background: var(--orange-yellow, linear-gradient(90deg, #FF7A00 0%, $background-bright-yellow-color 103.18%))
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
  .member-text
    position: absolute
    top: 9.01vw
    left: 5.781vw
    color: $text-light-color
    font-size: 3.854vw
</style>
