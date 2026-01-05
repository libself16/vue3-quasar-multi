<template>
  <div class="nav-content">
    <div
      v-for="item in routes"
      :key="item.routeName"
      class="nav-item"
      :class="{ active: route.name === item.routeName }"
      @click="goRoute(item.routeName)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const goRoute = (routeName: string) => {
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
}

const routes = computed(() => [
  {
    title: "DEPOSIT",
    routeName: "deposit"
  },
  {
    title: "WITHDRAWAL",
    routeName: "withdrawal"
  },
  {
    title: "HISTORY",
    routeName: "history"
  },
  {
    title: "Orders",
    routeName: "orders"
  }
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
.nav-content
  +setFlex(flex-start)
  gap: 1.25vw
  width: 100%
  +phone-width
    gap: 8px
    overflow: auto
    padding: 4.103vw 0 4.103vw 5.128vw
    background: #333
  .nav-item
    padding: 0.417vw 0.625vw
    border-radius: 0.417vw
    color: rgba(255, 255, 255, 0.70)
    font-family: "Century Gothic"
    font-size: 0.833vw
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    cursor: pointer
    white-space: nowrap
    &.active
      color: rgba(28, 30, 34, 0.70)
      background-color: $yellow-active
      cursor: default
    +phone-width
    font-size: 12px
    padding: 4px 12px
</style>
