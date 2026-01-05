<template>
  <div class="banner-content">
    <div class="level-content">
      <span>{{ $t("member.profile.yourVIP") }}</span>
      <span class="level-text">{{ $t("member.profile.level") }} bronze</span>
    </div>
    <div class="account-text">{{ $t("member.profile.account") }}</div>
    <div class="member-text">{{ $t("member.profile.member") }}</div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.banner-content
  position: relative
  width: 100%
  aspect-ratio: 1560 / 354
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), url("app/template/okbet_blue/assets/images/banner/member.png"), lightgray 50%
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
