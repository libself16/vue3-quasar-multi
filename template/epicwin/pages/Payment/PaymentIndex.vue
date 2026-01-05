<template>
  <div class="member-layout">
    <div class="member-box">
      <PaymentNav />
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PaymentNav from "./components/PaymentNav.vue"
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'

.member-layout
  padding: 0 1.25rem 1.25rem
  max-width: 56.25rem
  margin: 0 auto
  +iphone-width
    padding: 0
  .member-box
    width: 100%
    @apply flex flex-col justify-center items-center mx-auto text-sm text-white font-bold
    border: 1px solid $member-border-color
    background-color: $member-bg-color
    margin-top: 2.5rem
</style>
