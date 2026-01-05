<template>
  <MemberVip
    id="member-vip-wrapper"
    class="flex-1 min-w-0 phone:max-w-max"
    :class="{
      'max-w-[calc(100vw-472px)]': !globalStore.globalState.isAsideShow,
      'max-w-[calc(100vw-312px)]': globalStore.globalState.isAsideShow
    }"
  />
</template>

<script setup lang="ts">
import MemberVip from "src/common/components/MemberVip/Index.vue"
import { useGlobalStore } from "src/stores/globalStore"

const globalStore = useGlobalStore()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
#member-vip-wrapper {
  :deep(.vip-card) {
    background-image: url("app/template/set_r017/assets/images/vip/bg-card-pc.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    @include phone-width {
      background-image: url("app/template/set_r017/assets/images/vip/bg-card-h5.png");
    }
  }
}
</style>
