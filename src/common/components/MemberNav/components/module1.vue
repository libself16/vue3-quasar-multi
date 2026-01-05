<template>
  <div v-if="memberNavStore.navs.length" id="member-nav" class="py-[6px] bg-[var(--bg-08)] w-[11.375rem] rounded-lg">
    <template v-for="(nav, navIndex) in memberNavStore.navs" :key="`member-nav-item-${navIndex}`">
      <div
        v-if="nav.show"
        :id="`member-nav1-item-${navIndex}`"
        class="py-3 px-5 text-[var(--btn-text-01)] text-[.875rem] leading-[1.0625rem] cursor-pointer"
        :class="{ 'bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]': nav.activeRouteName.includes(route.name as string )  }"
        @click="router.push({ name: nav.routerName })"
      >
        {{ $t(nav.i18nKey) }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useMemberNavStore } from "src/stores/memberNavStore"

const route = useRoute()
const router = useRouter()
const memberNavStore = useMemberNavStore()
</script>

<style scoped lang="scss"></style>
