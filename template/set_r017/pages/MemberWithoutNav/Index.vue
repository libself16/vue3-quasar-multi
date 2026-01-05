<template>
  <div
    id="member-center-wrapper"
    class="w-full mx-auto flex flex-col gap-[.625rem] max-w-[77.5rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw] px-5 phone:px-4"
  >
    <div
      id="member-center-title"
      class="w-full text-xl leading-[1.6875rem] font-bold font-[NotoSans] text-[var(--text-01)] phone:hidden"
    >
      {{ $t("menu.memberCenter") }}
    </div>
    <div
      id="member-center-layout"
      class="w-full flex flex-nowrap gap-5 min-h-[39.9375rem] phone:min-h-[calc(100vh-4.9375rem-12vw)] iphone:min-h-[calc(100vh-4.9375rem-3.875rem)]"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useGlobalStore } from "src/stores/globalStore"

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.setBackRouteName("memberProfile")
})
</script>

<style scoped lang="scss"></style>
