<template>
  <q-toolbar class="nav-layout">
    <q-list class="nav-container">
      <div v-for="nav in navs" :key="nav.routerName" @click="router.push({ name: nav.routerName })">
        <q-item class="nav-item" :class="{ active: nav.activeRouteName.includes(route.name as string ) }">
          <img v-if="nav.img" :src="nav.img" alt="" class="w-9 h-9" />
          <q-img v-else-if="nav.icon" :src="iconSvg(nav.icon)" :alt="nav.title" spinner-color="white" class="nav-img" />
          <p class="mt-1 mb-2 text-white uppercase font-bold">{{ $t(nav.title) }}</p>
        </q-item>
      </div>
    </q-list>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set33_BLUE/hooks/useSiteImg"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { iconSvg, vipImg } = useSiteImg()

const navs = ref([
  // {
  //   title: "vip.vipRewards",
  //   img: vipImg("icon-route.png"),
  //   routerName: "MemberVip",
  //   activeRouteName: ["MemberVip"]
  // },
  {
    title: "menu.deposit",
    icon: "cashier",
    routerName: "MemberDeposit",
    activeRouteName: ["MemberDeposit"]
  },
  {
    title: "menu.withdrawal",
    icon: "cashier",
    routerName: "MemberWithdrawal",
    activeRouteName: ["MemberWithdrawal"]
  },
  {
    title: "menu.profile",
    icon: "profile",
    routerName: "ProfileDetail",
    activeRouteName: ["ProfileDetail", "ProfileBank", "ProfilePassword", "ProfileInbox"]
  },
  {
    title: "menu.history",
    icon: "history",
    routerName: "MemberHistory",
    activeRouteName: ["MemberHistory"]
  },
  {
    title: "menu.order",
    icon: "rewards",
    routerName: "MemberOrder",
    activeRouteName: ["MemberOrder"]
  }
  // {
  //   title: "refer",
  //   icon: "refer",
  //   routerName: "MemberRefer",
  //   activeRouteName: ["MemberRefer"]
  // }
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.nav-layout
  @apply pt-4 mb-4
  background: #00000096
  +pad-width
    @apply hidden
  .nav-container
    @apply mx-auto flex justify-center
    max-width: 83.5rem
    .nav-item
      @apply flex flex-col justify-center items-center text-center cursor-pointer
      width: 10.5rem
      border-bottom: 3px solid #ffcd0000
      &.active
        border-color: #ffcd00
      .nav-img
        @apply w-9 h-9
        filter: brightness(0) invert(1)
</style>
