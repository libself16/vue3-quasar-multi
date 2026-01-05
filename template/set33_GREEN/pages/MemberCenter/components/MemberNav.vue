<template>
  <q-toolbar class="nav-layout">
    <q-list class="nav-container">
      <template v-for="nav in navs" :key="nav.routerName">
        <div v-if="nav.show" @click="router.push({ name: nav.routerName })">
          <q-item class="nav-item" :class="{ active: nav.activeRouteName.includes(route.name as string ) }">
            <q-img :src="nav.icon" :alt="nav.title" spinner-color="white" class="nav-img" :class="nav.className" />
            <p class="mt-1 mb-2 text-white uppercase font-bold">{{ $t(nav.title) }}</p>
          </q-item>
        </div>
      </template>
    </q-list>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"

const route = useRoute()
const router = useRouter()
const { iconSvg, vipImg } = useSiteImg()
const { isCash } = useEnv()

const navs = ref([
  {
    title: "vip.vipRewards",
    icon: vipImg("icon-route.png"),
    routerName: "MemberVip",
    activeRouteName: ["MemberVip"],
    show: isCash.value,
    className: "!filter-none"
  },
  {
    title: "menu.deposit",
    icon: iconSvg("cashier"),
    routerName: "MemberDeposit",
    activeRouteName: ["MemberDeposit"],
    show: isCash.value,
    className: ""
  },
  {
    title: "menu.withdrawal",
    icon: iconSvg("cashier"),
    routerName: "MemberWithdrawal",
    activeRouteName: ["MemberWithdrawal"],
    show: isCash.value,
    className: ""
  },
  {
    title: "menu.profile",
    icon: iconSvg("profile"),
    routerName: "ProfileDetail",
    activeRouteName: ["ProfileDetail", "ProfileBank", "ProfilePassword", "ProfileInbox"],
    show: true,
    className: ""
  },
  {
    title: "menu.history",
    icon: iconSvg("history"),
    routerName: "MemberHistory",
    activeRouteName: ["MemberHistory"],
    show: true,
    className: ""
  },
  {
    title: "menu.order",
    icon: iconSvg("rewards"),
    routerName: "MemberOrder",
    activeRouteName: ["MemberOrder"],
    show: isCash.value,
    className: ""
  }
  // {
  //   title: "refer",
  //   icon: "refer",
  //   routerName: "Referral",
  //   activeRouteName: ["Referral"],
  //   show: true,
  //   className:''
  // }
])
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.nav-layout
  @apply pt-4 mb-4
  background: radial-gradient(circle, rgba(1, 112, 73, 1) 0%, rgba(2, 46, 29, 1) 100%)
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
