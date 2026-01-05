<template>
  <div
    id="member-profile-content"
    class="w-full h-full rounded-lg p-5 phone:p-0 flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <!-- 標題 -->
    <div id="member-profile-header" class="flex items-center justify-between gap-[.625rem]">
      <div
        id="member-profile-header-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)] flex items-center gap-2 flex-1"
      >
        <span> {{ $t("member.profile.personalInformation") }}</span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-pointer hidden phone:!block"
        >
          <path
            d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
            class="fill-[var(--icon-02)]"
          />
        </svg>
        <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
          <MemberNav module="module2" />
        </q-menu>
      </div>
    </div>
    <!-- 資訊卡 -->
    <div id="member-profile-body" class="grid grid-cols-2 gap-5 phone:gap-[.625rem]">
      <template v-for="item in menus" :key="`member-profile-body-card-${item.routerName}`">
        <div
          v-if="item.show"
          :id="`member-profile-body-card-${item.routerName}`"
          class="flex flex-col gap-[.625rem] py-[.625rem] px-[.875rem] rounded-lg border border-[var(--card-border-01)] bg-[var(--card-bg-01)]"
        >
          <div
            class="font-[OpenSans] font-bold text-[1rem] phone:[.875rem] leading-[1.375rem] phone:leading-[1.1875rem] text-[var(--card-text-02)]"
          >
            {{ $t(item.i18nKey) }}
          </div>
          <div class="flex items-center justify-end">
            <button
              :class="`
              min-w-[3.125rem] py-2 px-[.625rem] rounded
              font-[NotoSans] font-bold text-[.75rem] leading-[1rem] text-[var(--btn-text-01)]
              bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]
              `"
              @click="router.push({ name: item.routerName })"
            >
              {{ $t("common.btn.setUp") }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import MemberNav from "src/common/components/MemberNav/Index.vue"

const router = useRouter()
const { showWithdrawalPassword } = useEnv()

const menus = computed(() => [
  {
    i18nKey: "member.profile.personalInformation",
    routerName: "MemberProfileDetail",
    show: true
  },
  {
    i18nKey: "member.profile.loginPassword",
    routerName: "MemberLoginPassword",
    show: true
  },
  {
    i18nKey: "member.changePassword.setWithdrawPassword",
    routerName: "MemberWithdrawPassword",
    show: showWithdrawalPassword.value
  }
])
</script>

<style scoped lang="scss"></style>
