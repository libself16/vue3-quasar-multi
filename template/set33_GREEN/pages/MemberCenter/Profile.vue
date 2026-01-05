<template>
  <q-list class="profile-nav-container">
    <q-item v-for="nav in navs" :key="nav.routerName" class="p-0">
      <q-btn
        class="nav-item"
        :class="{ active: nav.routerName === route.name }"
        @click="router.push({ name: nav.routerName })"
      >
        <q-img :src="iconPng(nav.img)" :alt="nav.title" spinner-color="white" class="nav-img" />
        <div class="nav-title">{{ $t(`menu.${nav.title}`) }}</div>
      </q-btn>
    </q-item>
  </q-list>
  <router-view></router-view>
</template>

<script lang="ts">
export default {
  name: "ProfileLayout"
}
</script>

<script setup lang="ts">
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"

const route = useRoute()
const router = useRouter()
const { iconPng } = useSiteImg()
const { isCredit } = useEnv()

const navs = computed(() => {
  const navs = [
    {
      title: "profile",
      img: "profile-butt",
      routerName: "ProfileDetail"
    },
    {
      title: "bank",
      img: "bank",
      routerName: "ProfileBank"
    },
    {
      title: "password",
      img: "chgpsw",
      routerName: "ProfilePassword"
    },
    {
      title: "inbox",
      img: "inbox",
      routerName: "ProfileInbox"
    }
  ]

  if (isCredit.value) {
    return navs.filter((item) => item.routerName !== "ProfileBank")
  }

  return navs
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.profile-nav-container
  @apply flex justify-center gap-3
  +pad-width
    @apply grid grid-cols-4 gap-1 py-1
  +phone-width
    @apply grid-cols-2
  .nav-item
    @apply text-black px-2 py-1 rounded-lg
    background: linear-gradient(to bottom,rgb(255,255,248) 0%,rgb(213,213,213) 100%)
    min-width: 10.625rem
    +pad-width
      @apply w-full
      min-width: auto
    &.active
      @apply text-white
      background: linear-gradient(to bottom, rgb(169, 211, 32) 0%, rgb(56, 131, 18) 100%)
      box-shadow: inset 0 0 3px 2px #79ba18
    :deep(.q-btn__content)
      @apply flex-nowrap
      .nav-img
        @apply w-9 h-9 mr-3
        +iphone-width
          @apply mr-0
      .nav-title
        @apply  uppercase font-bold
        +iphone-width
          width: 50%
</style>
