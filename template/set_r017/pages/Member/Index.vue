<template>
  <div
    id="member-center-wrapper"
    class="w-full mx-auto flex flex-col gap-[.625rem] max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw] px-5 phone:px-4"
  >
    <div
      id="member-center-title"
      class="w-full text-xl leading-[1.6875rem] font-bold font-[NotoSans] text-[var(--text-01)] phone:hidden"
    >
      {{ $t("menu.memberCenter") }}
    </div>
    <div id="member-center-layout" class="w-full flex flex-nowrap gap-5 min-h-[39.9375rem] phone:min-h-0">
      <MemberNav class="phone:hidden" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useMemberNavStore } from "src/stores/memberNavStore"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import { MEMBER_NAV_ICON_TYPE } from "src/common/utils/constants"
import MemberNav from "src/common/components/MemberNav/Index.vue"

const memberNavStore = useMemberNavStore()
const { isCash } = useEnv()
const { isVipRewardsOpen } = useEnvInfoStore()
const globalStore = useGlobalStore()

onMounted(() => {
  memberNavStore.setNavs([
    {
      i18nKey: "menu.summary",
      routerName: "memberSummary",
      activeRouteName: ["memberSummary"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.SUMMARY,
      show: true
    },
    {
      i18nKey: "menu.personal_information",
      routerName: "memberProfile",
      activeRouteName: ["memberProfile"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.PROFILE,
      show: true
    },
    {
      i18nKey: "menu.vip_rewards",
      routerName: "MemberVip",
      activeRouteName: ["MemberVip"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.VIP,
      show: isVipRewardsOpen && isCash.value
    },
    {
      i18nKey: "menu.deposit",
      routerName: "MemberDeposit",
      activeRouteName: ["MemberDeposit"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.DEPOSIT,
      show: true
    },
    {
      i18nKey: "menu.withdrawal",
      routerName: "MemberWithdraw",
      activeRouteName: ["MemberWithdraw"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.WITHDRAWAL,
      show: true
    },
    {
      i18nKey: "menu.history",
      routerName: "history",
      activeRouteName: ["history"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.HISTORY,
      show: true
    },
    {
      i18nKey: "menu.order",
      routerName: "MemberOrder",
      activeRouteName: ["MemberOrder"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.ORDER,
      show: true
    },
    {
      i18nKey: "menu.my_messages",
      routerName: "memberInbox",
      activeRouteName: ["memberInbox"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.INBOX,
      show: true
    }
  ])
  globalStore.setLogoutRouteName("home")
})
</script>

<style scoped lang="scss"></style>
