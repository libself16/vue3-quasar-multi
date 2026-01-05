<template>
  <MemberNav />
  <div class="member-layout">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "MemberLayout"
}
</script>

<script setup lang="ts">
import MemberNav from "./components/MemberNav.vue"
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.member-layout
  @apply mx-auto pb-4
  max-width: 64rem
  +pad-width
    @apply w-full
</style>
