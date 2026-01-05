<template>
  <q-list class="profile-nav-container">
    <q-item v-for="nav in navs" :key="nav.routerName" class="p-0">
      <q-btn
        class="nav-item"
        :class="{ active: nav.routerName === route.name }"
        @click="router.push({ name: nav.routerName })"
      >
        <q-img
          v-if="nav.routerName === route.name"
          :src="iconPng(nav.img)"
          :alt="nav.title"
          spinner-color="white"
          class="nav-img"
        />
        <q-img v-else :src="iconPng(`${nav.img}-default`)" :alt="nav.title" spinner-color="white" class="nav-img" />
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
import { useSiteImg } from "app/template/set33_RED/hooks/useSiteImg"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { iconPng } = useSiteImg()

const navs = ref([
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
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.profile-nav-container
  @apply flex justify-center gap-3 p-8
  +pad-width
    @apply grid grid-cols-4 gap-1 py-1
  +phone-width
    overflow-x: auto
    width: 100%
    display: flex
    padding: 0
    gap: unset
    padding-top: 0.75rem
    margin-bottom: 0.25rem
    justify-content: flex-start
  .nav-item
    @apply text-white px-2 py-1
    background: #250101
    border-radius: 30px
    min-width: 10.625rem
    +pad-width
      @apply w-full
      min-width: auto
    +phone-width
      min-width: 12.5rem
      padding: 0.75rem 0
      border-radius: 62.4375rem
      margin-left: 0.625rem
    &.active
      @apply text-black
      background: linear-gradient(180deg, #F5E386 0%, #9C7C24 100%)
    :deep(.q-btn__content)
      @apply flex-nowrap
      +phone-width
        display: flex
        flex-direction: column
      .nav-img
        @apply w-9 h-9 mr-3
        +phone-width
          @apply mr-0 mb-1
      .nav-title
        @apply  uppercase font-bold
        +phone-width
          word-break: keep-all
</style>
