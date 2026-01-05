<template>
  <q-toolbar class="nav-layout">
    <q-list class="nav-container">
      <div v-for="nav in navs" :key="nav.routerName" @click="router.push({ name: nav.routerName })">
        <q-item class="nav-item" :class="{ active: nav.activeRouteName.includes(route.name as string ) }">
          <q-img :src="iconSvg(nav.img)" :alt="nav.title" spinner-color="white" class="nav-img" />
          <p class="mt-1 mb-2 text-white uppercase font-bold">{{ $t(`menu.${nav.title}`) }}</p>
        </q-item>
      </div>
    </q-list>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set33/hooks/useSiteImg";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()
const { iconSvg } = useSiteImg()

const navs = ref([
  {
    title: "deposit",
    img: "cashier",
    routerName: "MemberDeposit",
    activeRouteName: ["MemberDeposit"]
  },
  {
    title: "withdrawal",
    img: "cashier",
    routerName: "MemberWithdrawal",
    activeRouteName: ["MemberWithdrawal"]
  },
  {
    title: "profile",
    img: "profile",
    routerName: "ProfileDetail",
    activeRouteName: ["ProfileDetail", "ProfileBank", "ProfilePassword", "ProfileInbox"]
  },
  {
    title: "history",
    img: "history",
    routerName: "MemberHistory",
    activeRouteName: ["MemberHistory"]
  },
  {
    title: "order",
    img: "rewards",
    routerName: "MemberOrder",
    activeRouteName: ["MemberOrder"]
  }
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.nav-layout
  @apply pt-11 mb-4
  background: #00000096
  +pad-width
    @apply hidden
  .nav-container
    @apply mx-auto flex justify-center
    max-width: 83.5rem
    .nav-item
      @apply flex flex-col justify-center items-center text-center cursor-pointer
      width: 12.5rem
      border-bottom: 3px solid #ffcd0000
      &.active
        border-color: #ffcd00
      .nav-img
        @apply w-9 h-9
        filter: brightness(0) invert(1)
</style>
