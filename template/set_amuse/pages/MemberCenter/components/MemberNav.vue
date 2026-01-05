<template>
  <q-toolbar class="nav-layout">
    <q-list class="nav-container">
      <template v-for="nav in navs" :key="nav.routerName">
        <div v-if="nav.isShow" @click="router.push({ name: nav.routerName })">
          <q-item class="nav-item" :class="{ active: nav.activeRouteName.includes(String(route.name)) }">
            <q-img :src="iconSvg(nav.img)" :alt="nav.title" spinner-color="white" class="nav-img" />
            <p class="mt-1 mb-2 text-white uppercase font-bold">{{ $t(`menu.${nav.title}`) }}</p>
          </q-item>
        </div>
      </template>
    </q-list>
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"

const route = useRoute()
const router = useRouter()
const { isCredit } = useEnv()
const { iconSvg } = useSiteImg()
const { userInfo } = useUserInfo()

const navs = ref([
  {
    title: "profile",
    img: "profile",
    routerName: "MemberProfile",
    activeRouteName: ["MemberProfile"],
    isShow: true
  },
  {
    title: "credit",
    img: "cashier",
    routerName: "MemberDeposit",
    activeRouteName: ["MemberDeposit"],
    isShow: true
  },
  {
    title: "history",
    img: "history",
    routerName: "MemberHistory",
    activeRouteName: ["MemberHistory"],
    isShow: true
  },
  {
    title: "kyc",
    img: "kyc",
    routerName: "MemberKyc",
    activeRouteName: ["MemberKyc"],
    isShow: true
  },
  {
    title: "membershipManagement",
    img: "membershipManagement",
    routerName: "MembershipManagement",
    activeRouteName: ["MembershipManagement"],
    isShow: isCredit.value && userInfo.value?.is_member_agent
  }
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
      width: 12.5rem
      border-bottom: 3px solid #ffcd0000
      &.active
        border-color: #ED772E
      .nav-img
        @apply w-9 h-9
</style>
