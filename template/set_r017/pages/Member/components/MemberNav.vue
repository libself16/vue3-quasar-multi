<template>
  <div class="nav-content">
    <div
      v-for="item in routes"
      :key="item.routeName"
      class="nav-item"
      :class="{ active: routeName.includes(item.routeName) }"
      @click="goRoute(item.routeName)"
    >
      {{ $t(`menu.${item.title}`) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const routeName = computed(() => (route.name as string) || "")
const goRoute = (routeName: string) => {
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
}

const routes = computed(() => [
  {
    title: "profile",
    routeName: "memberProfile"
  },
  {
    title: "bank",
    routeName: "memberBank"
  },
  {
    title: "password",
    routeName: "memberChangePassword"
  },
  {
    title: "inbox",
    routeName: "memberInbox"
  }
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/okbet/assets/css/_variable.sass'

.nav-content
  +setFlex(flex-start)
  gap: 1.5rem
  overflow: auto
  padding: 2vw
  +hideScrollBar
  +pad-width
    padding: 2vw 5vw
  +iphone-width
    width: 100vw
    gap: 8px
    padding: 3vw 7vw
    background: $background-midnight-gray-color
  .nav-item
    padding: .5rem .75rem
    border-radius: .5rem
    color: rgba($text-light-color, 0.70)
    font-family: "Century Gothic"
    font-size: 1rem
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    cursor: pointer
    white-space: nowrap
    &:hover
      background: rgba($background-light-color, 0.2)
    &.active
      color: rgba($text-eclipse-gray-color, 0.70)
      background-color: $yellow-active
      cursor: default
    +iphone-width
      font-size: .75rem
      padding: .25rem .75rem
</style>
