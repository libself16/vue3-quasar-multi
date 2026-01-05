<template>
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="cursor-pointer"
    @click="goBack"
  >
    <rect y="0.5" width="20" height="20" rx="4" class="fill-[var(--icon-05)]" />
    <path
      d="M16 10.525C16 10.7902 15.8975 11.0446 15.715 11.2321C15.5325 11.4197 15.285 11.525 15.027 11.525L7.32046 11.525L9.87632 14.1517C10.0482 14.3413 10.1418 14.592 10.1373 14.8511C10.1329 15.1101 10.0308 15.3573 9.85248 15.5405C9.6742 15.7237 9.43368 15.8287 9.1816 15.8333C8.92951 15.8378 8.68554 15.7417 8.50109 15.565L4.28457 11.2317C4.10235 11.0442 4 10.79 4 10.525C4 10.26 4.10235 10.0059 4.28457 9.81836L8.50109 5.48503C8.59017 5.38678 8.69759 5.30797 8.81695 5.25332C8.93631 5.19866 9.06516 5.16927 9.19581 5.1669C9.32646 5.16453 9.45624 5.18923 9.5774 5.23953C9.69856 5.28982 9.80862 5.36468 9.90102 5.45964C9.99342 5.5546 10.0663 5.66771 10.1152 5.79223C10.1641 5.91675 10.1882 6.05012 10.1859 6.18439C10.1836 6.31866 10.155 6.45108 10.1018 6.57374C10.0486 6.69641 9.97192 6.80681 9.87632 6.89836L7.32046 9.52503L15.027 9.52503C15.5641 9.52503 16 9.97303 16 10.525Z"
      class="fill-[var(--icon-01)]"
    />
  </svg>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useGlobalStore } from "src/stores/globalStore"

const router = useRouter()
const globalStore = useGlobalStore()

const goBack = () => {
  if (globalStore.globalState.backRouteName) {
    router.push({ name: globalStore.globalState.backRouteName })
    return
  }
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push("/")
}
</script>

<style scoped lang="scss"></style>
